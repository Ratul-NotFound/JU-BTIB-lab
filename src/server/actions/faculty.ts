"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { requireRole, requireFacultyOrAdmin } from "@/lib/auth-guard";
import { Role, AccountStatus } from "@prisma/client";
import bcrypt from "bcryptjs";
import { z } from "zod";

const createFacultySchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Valid institutional email required"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  designation: z.string().default("Professor"),
  department: z.string().default("Department of Biotechnology & Genetic Engineering"),
  institution: z.string().default("Jahangirnagar University"),
  employeeId: z.string().optional(),
  phone: z.string().optional(),
  officeRoom: z.string().optional(),
  researchFocus: z.string().optional(),
});

export type CreateFacultyInput = z.input<typeof createFacultySchema>;

/**
 * Super Admin Generator: Directly provision a Faculty account for busy professors.
 */
export async function createFacultyAccountAction(input: CreateFacultyInput) {
  try {
    const adminUser = await requireRole([Role.SUPER_ADMIN]);
    const validated = createFacultySchema.parse(input);
    const email = validated.email.toLowerCase().trim();

    // Check if user exists
    const existing = await db.user.findUnique({ where: { email } });
    if (existing) {
      return { success: false, error: "An account with this email address already exists." };
    }

    const passwordHash = await bcrypt.hash(validated.password, 12);

    const faculty = await db.user.create({
      data: {
        email,
        name: validated.name.trim(),
        passwordHash,
        role: Role.FACULTY,
        facultyProfile: {
          create: {
            designation: validated.designation,
            department: validated.department,
            institution: validated.institution,
            employeeId: validated.employeeId?.trim() || null,
            phone: validated.phone?.trim() || null,
            officeRoom: validated.officeRoom?.trim() || null,
            researchFocus: validated.researchFocus?.trim() || null,
            status: AccountStatus.ACTIVE,
          },
        },
      },
      include: {
        facultyProfile: true,
      },
    });

    await db.auditLog.create({
      data: {
        userId: adminUser.id,
        userName: adminUser.name,
        userEmail: adminUser.email,
        action: "CREATE",
        entity: "FacultyProfile",
        entityId: faculty.facultyProfile?.id,
        details: {
          createdFor: faculty.name,
          email: faculty.email,
          designation: validated.designation,
        },
      },
    });

    revalidatePath("/admin/faculty");
    revalidatePath("/admin");
    revalidatePath("/register");
    revalidatePath("/faculty");
    revalidatePath("/faculty/students");

    return {
      success: true,
      message: `Faculty account for ${faculty.name} has been provisioned successfully.`,
      faculty,
    };
  } catch (error: unknown) {
    console.error("Create faculty account error:", error);
    if (error instanceof z.ZodError) {
      return { success: false, error: error.errors[0]?.message || "Validation failed." };
    }
    const msg = error instanceof Error ? error.message : "Failed to create faculty account.";
    return { success: false, error: msg };
  }
}

/**
 * Get active faculty list for Student registration supervisor selector & public display.
 */
export async function getActiveFacultyList() {
  try {
    const faculty = await db.facultyProfile.findMany({
      where: { status: AccountStatus.ACTIVE },
      include: {
        user: { select: { id: true, name: true, email: true } },
        _count: { select: { supervisedStudents: true } },
      },
      orderBy: [{ designation: "asc" }, { user: { name: "asc" } }],
    });

    return faculty.map((f) => ({
      id: f.id,
      name: f.user.name,
      email: f.user.email,
      designation: f.designation,
      department: f.department,
      officeRoom: f.officeRoom,
      phone: f.phone,
      studentCount: f._count.supervisedStudents,
    }));
  } catch (error) {
    console.error("Error fetching faculty list:", error);
    return [];
  }
}

/**
 * Get Faculty Portal Dashboard statistics.
 */
export async function getFacultyDashboardDataAction() {
  try {
    const { user, facultyProfile } = await requireFacultyOrAdmin();

    const facultyId = facultyProfile?.id;
    if (!facultyId && user.role !== Role.SUPER_ADMIN) {
      return { success: false, error: "Faculty profile not found." };
    }

    const [supervisedStudents, pendingStudents, recentBookings, pendingLogs] = await Promise.all([
      // 1. My Supervised Students
      db.studentProfile.findMany({
        where: facultyId ? { supervisorId: facultyId } : {},
        include: { user: { select: { name: true, email: true } } },
        orderBy: { createdAt: "desc" },
      }),
      // 2. Pending student verification count
      db.studentProfile.count({
        where: {
          status: AccountStatus.PENDING_APPROVAL,
          ...(facultyId ? { supervisorId: facultyId } : {}),
        },
      }),
      // 3. Recent equipment bookings by my scholars
      db.equipmentBooking.findMany({
        where: facultyId ? { studentProfile: { supervisorId: facultyId } } : {},
        include: {
          equipment: { select: { name: true, category: true } },
          studentProfile: { include: { user: { select: { name: true, email: true } } } },
        },
        orderBy: { startTime: "desc" },
        take: 10,
      }),
      // 4. Experiment logs needing verification
      db.experimentLog.findMany({
        where: {
          verifiedAt: null,
          ...(facultyId ? { studentProfile: { supervisorId: facultyId } } : {}),
        },
        include: {
          studentProfile: { include: { user: { select: { name: true, email: true } } } },
          equipment: { select: { name: true } },
        },
        orderBy: { dateConducted: "desc" },
        take: 10,
      }),
    ]);

    return {
      success: true,
      data: {
        supervisedStudents,
        pendingStudentsCount: pendingStudents,
        recentBookings,
        pendingLogs,
      },
    };
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Failed to load faculty dashboard.";
    return { success: false, error: msg };
  }
}
