"use server";

import { db } from "@/lib/db";
import { requireAuth, requireFacultyOrAdmin, requireActiveStudent } from "@/lib/auth-guard";
import { BookingStatus, Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const createLogSchema = z.object({
  bookingId: z.string().optional(),
  equipmentId: z.string().min(1, "Please select the instrument used"),
  title: z.string().min(5, "Experiment title is required"),
  protocolSummary: z.string().min(10, "Summary of laboratory protocol is required"),
  observations: z.string().optional(),
  actualHoursUsed: z.number().min(0.1, "Please enter hours used (e.g. 2.5)"),
  dateConducted: z.string().optional(),
});

export type CreateLogInput = z.infer<typeof createLogSchema>;

/**
 * Submit Experiment Log (Work History Entry):
 * Student records their experimental protocol, observations, and machine runtime hours.
 */
export async function createExperimentLogAction(input: CreateLogInput) {
  try {
    const { user, profile } = await requireActiveStudent();
    if (!profile) {
      return { success: false, error: "Student profile required to log lab work." };
    }

    const validated = createLogSchema.parse(input);

    const log = await db.experimentLog.create({
      data: {
        studentProfileId: profile.id,
        bookingId: validated.bookingId || null,
        equipmentId: validated.equipmentId,
        title: validated.title.trim(),
        protocolSummary: validated.protocolSummary.trim(),
        observations: validated.observations?.trim() || null,
        actualHoursUsed: validated.actualHoursUsed,
        dateConducted: validated.dateConducted
          ? new Date(validated.dateConducted)
          : new Date(),
      },
      include: {
        equipment: { select: { name: true } },
      },
    });

    // Mark associated booking as COMPLETED if present
    if (validated.bookingId) {
      await db.equipmentBooking.update({
        where: { id: validated.bookingId },
        data: { status: BookingStatus.COMPLETED },
      });
    }

    await db.auditLog.create({
      data: {
        userId: user.id,
        userName: user.name,
        userEmail: user.email,
        action: "CREATE",
        entity: "ExperimentLog",
        entityId: log.id,
        details: {
          title: log.title,
          instrument: log.equipment.name,
          hours: log.actualHoursUsed,
        },
      },
    });

    revalidatePath("/portal/history");
    revalidatePath("/portal");
    revalidatePath("/faculty/activity");
    revalidatePath("/faculty");
    revalidatePath("/admin");

    return {
      success: true,
      message: "Experiment log recorded successfully in your permanent research logbook.",
      log,
    };
  } catch (error: unknown) {
    console.error("Create experiment log error:", error);
    if (error instanceof z.ZodError) {
      return { success: false, error: error.errors[0]?.message || "Validation failed." };
    }
    const msg = error instanceof Error ? error.message : "Failed to log experiment.";
    return { success: false, error: msg };
  }
}

/**
 * Faculty Sign-Off & Verification:
 * Allows thesis supervisor or Super Admin to formally verify student experiment logs.
 */
export async function verifyExperimentLogAction(logId: string) {
  try {
    const { user, facultyProfile } = await requireFacultyOrAdmin();

    const log = await db.experimentLog.findUnique({
      where: { id: logId },
      include: {
        studentProfile: {
          include: { user: { select: { name: true, email: true } } },
        },
      },
    });

    if (!log) {
      return { success: false, error: "Experiment log not found." };
    }

    const updated = await db.experimentLog.update({
      where: { id: logId },
      data: {
        verifiedBy: `${user.name} (${user.email})`,
        verifiedAt: new Date(),
        facultyId: facultyProfile?.id || null,
      },
    });

    await db.auditLog.create({
      data: {
        userId: user.id,
        userName: user.name,
        userEmail: user.email,
        action: "UPDATE",
        entity: "ExperimentLog",
        entityId: logId,
        details: {
          action: "SIGN_OFF_LOG",
          studentName: log.studentProfile.user.name,
          experimentTitle: log.title,
        },
      },
    });

    revalidatePath("/faculty/activity");
    revalidatePath("/faculty");
    revalidatePath("/portal/history");
    revalidatePath("/portal");
    revalidatePath("/admin");

    return {
      success: true,
      message: "Experiment log verified and signed off successfully.",
      log: updated,
    };
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Failed to sign off on experiment log.";
    return { success: false, error: msg };
  }
}

/**
 * Get Student Work History:
 * Returns the complete chronological experiment logbook, cumulative hours, and machine breakdown.
 */
export async function getStudentWorkHistoryAction(studentProfileId?: string) {
  try {
    const user = await requireAuth();

    let targetStudentId = studentProfileId;

    // If student queries without ID, resolve their own profile
    if (!targetStudentId) {
      const studentProfile = await db.studentProfile.findUnique({
        where: { userId: user.id },
      });
      if (!studentProfile) {
        return { success: false, error: "Student profile not found." };
      }
      targetStudentId = studentProfile.id;
    }

    const [logs, bookings, student] = await Promise.all([
      db.experimentLog.findMany({
        where: { studentProfileId: targetStudentId },
        include: {
          equipment: { select: { name: true, category: true } },
          faculty: { include: { user: { select: { name: true } } } },
        },
        orderBy: { dateConducted: "desc" },
      }),
      db.equipmentBooking.findMany({
        where: { studentProfileId: targetStudentId },
        include: {
          equipment: { select: { name: true, category: true } },
        },
        orderBy: { startTime: "desc" },
      }),
      db.studentProfile.findUnique({
        where: { id: targetStudentId },
        include: {
          user: { select: { name: true, email: true, createdAt: true } },
          supervisor: { include: { user: { select: { name: true } } } },
        },
      }),
    ]);

    const totalHours = logs.reduce((sum, log) => sum + log.actualHoursUsed, 0);

    return {
      success: true,
      data: {
        student,
        totalHoursLogged: Math.round(totalHours * 10) / 10,
        logsCount: logs.length,
        bookingsCount: bookings.length,
        logs,
        bookings,
      },
    };
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Failed to fetch student work history.";
    return { success: false, error: msg };
  }
}

/**
 * Tracing Query for Faculty & Admins:
 * Query all student logs across the department with filters.
 */
export async function traceDepartmentExperimentLogsAction(options?: {
  studentProfileId?: string;
  equipmentId?: string;
  facultyId?: string;
}) {
  try {
    await requireFacultyOrAdmin();

    const where: Prisma.ExperimentLogWhereInput = {};
    if (options?.studentProfileId) {
      where.studentProfileId = options.studentProfileId;
    }
    if (options?.equipmentId) {
      where.equipmentId = options.equipmentId;
    }
    if (options?.facultyId) {
      where.studentProfile = { supervisorId: options.facultyId };
    }

    const logs = await db.experimentLog.findMany({
      where,
      include: {
        studentProfile: {
          include: {
            user: { select: { name: true, email: true } },
            supervisor: { include: { user: { select: { name: true } } } },
          },
        },
        equipment: { select: { name: true, category: true } },
      },
      orderBy: { dateConducted: "desc" },
    });

    return { success: true, logs };
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Failed to trace experiment logs.";
    return { success: false, error: msg };
  }
}
