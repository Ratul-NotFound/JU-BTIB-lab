"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { requireFacultyOrAdmin } from "@/lib/auth-guard";
import { Role, AccountStatus, AcademicProgram, Prisma } from "@prisma/client";
import bcrypt from "bcryptjs";
import { z } from "zod";

const studentRegisterSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid institutional or student email"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  studentId: z.string().min(3, "Student / Registration ID is required"),
  program: z.nativeEnum(AcademicProgram),
  department: z.string().default("Department of Biotechnology & Genetic Engineering"),
  institution: z.string().default("Jahangirnagar University"),
  sessionYear: z.string().min(4, "Session is required (e.g. 2020-2021)"),
  batch: z.string().optional(),
  supervisorId: z.string().optional(),
  supervisorName: z.string().optional(),
  thesisTitle: z.string().optional(),
  phone: z.string().min(7, "Valid phone number is required"),
  idCardPhotoUrl: z.string().optional(),
});

export type StudentRegisterInput = z.input<typeof studentRegisterSchema>;

/**
 * Public Student Registration Action:
 * Registers a student user and creates their academic StudentProfile in PENDING_APPROVAL state.
 */
export async function registerStudentAction(input: StudentRegisterInput) {
  try {
    const validated = studentRegisterSchema.parse(input);
    const email = validated.email.toLowerCase().trim();

    // 1. Check if email already in use
    const existingUser = await db.user.findUnique({
      where: { email },
    });
    if (existingUser) {
      return { success: false, error: "An account with this email address already exists." };
    }

    // 2. Check if Student ID already registered
    const existingStudentId = await db.studentProfile.findUnique({
      where: { studentId: validated.studentId.trim() },
    });
    if (existingStudentId) {
      return { success: false, error: "This Student ID is already registered in the BTIB database." };
    }

    // 3. Hash password
    const passwordHash = await bcrypt.hash(validated.password, 12);

    // 4. Resolve supervisor name if supervisorId was provided
    let supervisorName = validated.supervisorName || "";
    if (validated.supervisorId) {
      const faculty = await db.facultyProfile.findUnique({
        where: { id: validated.supervisorId },
        include: { user: true },
      });
      if (faculty) {
        supervisorName = `${faculty.designation} ${faculty.user.name}`;
      }
    }

    // 5. Create User & StudentProfile atomically
    const newUser = await db.user.create({
      data: {
        email,
        name: validated.name.trim(),
        passwordHash,
        role: Role.STUDENT,
        studentProfile: {
          create: {
            studentId: validated.studentId.trim(),
            program: validated.program,
            department: validated.department,
            institution: validated.institution,
            sessionYear: validated.sessionYear.trim(),
            batch: validated.batch?.trim() || null,
            supervisorId: validated.supervisorId || null,
            supervisorName: supervisorName || null,
            thesisTitle: validated.thesisTitle?.trim() || null,
            phone: validated.phone.trim(),
            idCardPhotoUrl: validated.idCardPhotoUrl || null,
            status: AccountStatus.PENDING_APPROVAL,
          },
        },
      },
      include: {
        studentProfile: true,
      },
    });

    // 6. Record in Audit Log
    await db.auditLog.create({
      data: {
        userId: newUser.id,
        userName: newUser.name,
        userEmail: newUser.email,
        action: "CREATE",
        entity: "StudentProfile",
        entityId: newUser.studentProfile?.id,
        details: {
          studentId: validated.studentId,
          program: validated.program,
          supervisor: supervisorName,
        },
      },
    });

    revalidatePath("/admin/students");
    revalidatePath("/admin");
    revalidatePath("/faculty");
    revalidatePath("/faculty/students");

    return {
      success: true,
      message:
        "Registration submitted successfully. Your profile is pending faculty/administrator verification. You can log in to view your approval status.",
    };
  } catch (error: unknown) {
    console.error("Student registration error:", error);
    if (error instanceof z.ZodError) {
      return { success: false, error: error.errors[0]?.message || "Invalid registration data." };
    }
    const msg = error instanceof Error ? error.message : "Failed to register student.";
    return { success: false, error: msg };
  }
}

/**
 * Approve a student profile (callable by assigned Faculty or Super Admin).
 */
export async function approveStudentAction(studentProfileId: string) {
  try {
    const { user } = await requireFacultyOrAdmin();

    const student = await db.studentProfile.findUnique({
      where: { id: studentProfileId },
      include: { user: true },
    });

    if (!student) {
      return { success: false, error: "Student profile not found." };
    }

    const updated = await db.studentProfile.update({
      where: { id: studentProfileId },
      data: {
        status: AccountStatus.ACTIVE,
        approvedAt: new Date(),
        approvedBy: `${user.name} (${user.email})`,
        rejectionReason: null,
      },
    });

    await db.auditLog.create({
      data: {
        userId: user.id,
        userName: user.name,
        userEmail: user.email,
        action: "UPDATE",
        entity: "StudentProfile",
        entityId: studentProfileId,
        details: { action: "APPROVE_STUDENT", studentEmail: student.user.email },
      },
    });

    revalidatePath("/admin/students");
    revalidatePath("/admin");
    revalidatePath("/faculty");
    revalidatePath("/faculty/students");
    revalidatePath("/portal");
    revalidatePath("/portal/book");
    revalidatePath("/portal/history");

    return { success: true, student: updated };
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Failed to approve student.";
    return { success: false, error: msg };
  }
}

/**
 * Reject or request correction on a student profile.
 */
export async function rejectStudentAction(studentProfileId: string, reason: string) {
  try {
    const { user } = await requireFacultyOrAdmin();

    const student = await db.studentProfile.findUnique({
      where: { id: studentProfileId },
      include: { user: true },
    });

    if (!student) {
      return { success: false, error: "Student profile not found." };
    }

    const updated = await db.studentProfile.update({
      where: { id: studentProfileId },
      data: {
        status: AccountStatus.REJECTED,
        rejectionReason: reason || "Credentials or student ID could not be verified.",
        approvedAt: null,
        approvedBy: `${user.name} (${user.email})`,
      },
    });

    await db.auditLog.create({
      data: {
        userId: user.id,
        userName: user.name,
        userEmail: user.email,
        action: "UPDATE",
        entity: "StudentProfile",
        entityId: studentProfileId,
        details: { action: "REJECT_STUDENT", reason, studentEmail: student.user.email },
      },
    });

    revalidatePath("/admin/students");
    revalidatePath("/admin");
    revalidatePath("/faculty");
    revalidatePath("/faculty/students");
    revalidatePath("/portal");

    return { success: true, student: updated };
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Failed to reject student profile.";
    return { success: false, error: msg };
  }
}

/**
 * Get all students for Admin or Faculty dashboard.
 */
export async function getStudentsListAction(options?: {
  facultyId?: string;
  status?: AccountStatus;
}) {
  try {
    await requireFacultyOrAdmin();

    const where: Prisma.StudentProfileWhereInput = {};
    if (options?.facultyId) {
      where.supervisorId = options.facultyId;
    }
    if (options?.status) {
      where.status = options.status;
    }

    const students = await db.studentProfile.findMany({
      where,
      include: {
        user: { select: { id: true, name: true, email: true, createdAt: true } },
        supervisor: {
          include: {
            user: { select: { name: true, email: true } },
          },
        },
        _count: {
          select: {
            bookings: true,
            workLogs: true,
          },
        },
      },
      orderBy: [{ status: "asc" }, { createdAt: "desc" }],
    });

    return { success: true, students };
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Failed to retrieve student directory.";
    return { success: false, error: msg };
  }
}
