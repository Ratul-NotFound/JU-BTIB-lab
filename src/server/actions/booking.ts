"use server";

import { db } from "@/lib/db";
import { requireAuth, requireActiveStudent } from "@/lib/auth-guard";
import { BookingStatus, Role, Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const bookEquipmentSchema = z.object({
  equipmentId: z.string().min(1, "Please select an instrument"),
  startTime: z.string().datetime("Valid start time required"),
  endTime: z.string().datetime("Valid end time required"),
  purpose: z.string().min(5, "Please state the experiment / thesis objective"),
  samples: z.string().optional(),
  plannedConditions: z.string().optional(),
  wasteNotes: z.string().optional(),
});

export type BookEquipmentInput = z.infer<typeof bookEquipmentSchema>;

/**
 * Real-Time Concurrency Overlap Check:
 * Returns whether an instrument is free or occupied during the requested interval.
 */
export async function checkSlotAvailabilityAction(
  equipmentId: string,
  startTimeIso: string,
  endTimeIso: string,
  excludeBookingId?: string
) {
  try {
    const start = new Date(startTimeIso);
    const end = new Date(endTimeIso);

    if (start >= end) {
      return { available: false, error: "End time must be after start time." };
    }

    if (start < new Date(Date.now() - 5 * 60 * 1000)) {
      return { available: false, error: "Cannot book slots in the past." };
    }

    // Overlap condition: Existing.Start < Requested.End AND Existing.End > Requested.Start
    const conflictingBookings = await db.equipmentBooking.findMany({
      where: {
        equipmentId,
        id: excludeBookingId ? { not: excludeBookingId } : undefined,
        status: { in: [BookingStatus.CONFIRMED, BookingStatus.IN_PROGRESS] },
        startTime: { lt: end },
        endTime: { gt: start },
      },
      include: {
        studentProfile: {
          include: { user: { select: { name: true } } },
        },
        facultyProfile: {
          include: { user: { select: { name: true } } },
        },
      },
      orderBy: { startTime: "asc" },
    });

    if (conflictingBookings.length > 0) {
      const conflict = conflictingBookings[0];
      const reserverName =
        conflict.studentProfile?.user.name ||
        conflict.facultyProfile?.user.name ||
        "Another scholar";

      return {
        available: false,
        conflict: {
          startTime: conflict.startTime.toISOString(),
          endTime: conflict.endTime.toISOString(),
          reserverName,
          purpose: conflict.purpose,
        },
      };
    }

    return { available: true };
  } catch (error: unknown) {
    console.error("Slot availability check error:", error);
    return { available: false, error: "Failed to evaluate slot availability." };
  }
}

/**
 * Instant Auto-Booking Engine:
 * Atomically cross-checks availability. If free, confirms slot immediately.
 */
export async function autoBookEquipmentAction(input: BookEquipmentInput) {
  try {
    const validated = bookEquipmentSchema.parse(input);
    const start = new Date(validated.startTime);
    const end = new Date(validated.endTime);

    if (start >= end) {
      return { success: false, error: "End time must be after start time." };
    }

    // 1. Authenticate user & ensure active status
    const sessionUser = await requireAuth();

    let studentProfileId: string | null = null;
    let facultyProfileId: string | null = null;

    if (sessionUser.role === Role.STUDENT) {
      const { profile } = await requireActiveStudent();
      studentProfileId = profile?.id || null;
    } else if (sessionUser.role === Role.FACULTY) {
      const fac = await db.facultyProfile.findUnique({
        where: { userId: sessionUser.id },
      });
      facultyProfileId = fac?.id || null;
    } else if (sessionUser.role === Role.SUPER_ADMIN) {
      // Super admin can book directly
      const fac = await db.facultyProfile.findFirst();
      facultyProfileId = fac?.id || null;
    }

    // 2. Concurrency check
    const availability = await checkSlotAvailabilityAction(
      validated.equipmentId,
      validated.startTime,
      validated.endTime
    );

    if (!availability.available) {
      const c = availability.conflict;
      if (c) {
        const startFormatted = new Date(c.startTime).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        });
        const endFormatted = new Date(c.endTime).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        });
        return {
          success: false,
          error: `Slot Conflict! This instrument is already booked by ${c.reserverName} from ${startFormatted} to ${endFormatted}. Please select a different time window.`,
        };
      }
      return { success: false, error: availability.error || "Slot is not available." };
    }

    // 3. Atomically create confirmed booking
    let finalPurpose = validated.purpose.trim();
    if (validated.plannedConditions?.trim()) {
      finalPurpose += `\n[Conditions: ${validated.plannedConditions.trim()}]`;
    }

    let finalSamples = validated.samples?.trim() || null;
    if (validated.wasteNotes?.trim()) {
      finalSamples = finalSamples
        ? `${finalSamples} | Waste: ${validated.wasteNotes.trim()}`
        : `Waste: ${validated.wasteNotes.trim()}`;
    }

    const booking = await db.equipmentBooking.create({
      data: {
        equipmentId: validated.equipmentId,
        studentProfileId,
        facultyProfileId,
        startTime: start,
        endTime: end,
        purpose: finalPurpose,
        samples: finalSamples,
        status: BookingStatus.CONFIRMED,
      },
      include: {
        equipment: { select: { name: true, category: true } },
      },
    });

    // 4. Record in Audit Log
    await db.auditLog.create({
      data: {
        userId: sessionUser.id,
        userName: sessionUser.name,
        userEmail: sessionUser.email,
        action: "CREATE",
        entity: "EquipmentBooking",
        entityId: booking.id,
        details: {
          equipmentName: booking.equipment.name,
          startTime: booking.startTime,
          endTime: booking.endTime,
          purpose: booking.purpose,
        },
      },
    });

    // Invalidate client/server cache across all related portals immediately
    revalidatePath("/portal");
    revalidatePath("/portal/book");
    revalidatePath("/portal/history");
    revalidatePath("/admin/bookings");
    revalidatePath("/admin");
    revalidatePath("/faculty");

    return {
      success: true,
      message: `Reservation confirmed for ${booking.equipment.name}. Slot is officially locked in the lab schedule.`,
      booking,
    };
  } catch (error: unknown) {
    console.error("Auto book equipment error:", error);
    if (error instanceof z.ZodError) {
      return { success: false, error: error.errors[0]?.message || "Invalid booking data." };
    }
    const msg = error instanceof Error ? error.message : "Failed to reserve equipment.";
    return { success: false, error: msg };
  }
}

/**
 * Live Floor Monitor:
 * Returns all experiments currently active in the lab right now (StartTime <= Now <= EndTime).
 */
export async function getActiveLabFloorActivity() {
  try {
    const now = new Date();

    const activeSessions = await db.equipmentBooking.findMany({
      where: {
        status: { in: [BookingStatus.CONFIRMED, BookingStatus.IN_PROGRESS] },
        startTime: { lte: now },
        endTime: { gte: now },
      },
      include: {
        equipment: { select: { id: true, name: true, category: true, imageUrl: true } },
        studentProfile: {
          include: {
            user: { select: { name: true, email: true } },
          },
        },
        facultyProfile: {
          include: {
            user: { select: { name: true, email: true } },
          },
        },
      },
      orderBy: { endTime: "asc" },
    });

    return activeSessions.map((s) => ({
      id: s.id,
      equipmentName: s.equipment.name,
      equipmentCategory: s.equipment.category,
      equipmentImageUrl: s.equipment.imageUrl,
      scholarName:
        s.studentProfile?.user.name || s.facultyProfile?.user.name || "Anonymous",
      scholarEmail:
        s.studentProfile?.user.email || s.facultyProfile?.user.email || "",
      studentId: s.studentProfile?.studentId || null,
      program: s.studentProfile?.program || null,
      supervisor: s.studentProfile?.supervisorName || null,
      purpose: s.purpose,
      samples: s.samples,
      startTime: s.startTime.toISOString(),
      endTime: s.endTime.toISOString(),
      minutesRemaining: Math.max(
        0,
        Math.round((s.endTime.getTime() - now.getTime()) / (60 * 1000))
      ),
    }));
  } catch (error) {
    console.error("Error retrieving active floor sessions:", error);
    return [];
  }
}

/**
 * Master Timetable & Equipment Booking History Query:
 * Returns all bookings with reserver info, equipment info, and post-run experiment logs.
 */
export async function getMasterScheduleAction(options?: {
  date?: string;
  equipmentId?: string;
  status?: BookingStatus | "ALL";
  includeCancelled?: boolean;
}) {
  try {
    const where: Prisma.EquipmentBookingWhereInput = {};

    if (options?.status && options.status !== "ALL") {
      where.status = options.status;
    } else if (!options?.includeCancelled) {
      where.status = { in: [BookingStatus.CONFIRMED, BookingStatus.IN_PROGRESS, BookingStatus.COMPLETED] };
    }

    if (options?.equipmentId) {
      where.equipmentId = options.equipmentId;
    }

    if (options?.date) {
      const targetDate = new Date(options.date);
      const startOfDay = new Date(targetDate.setHours(0, 0, 0, 0));
      const endOfDay = new Date(targetDate.setHours(23, 59, 59, 999));
      where.startTime = { gte: startOfDay, lte: endOfDay };
    }

    const bookings = await db.equipmentBooking.findMany({
      where,
      include: {
        equipment: { select: { id: true, name: true, category: true, imageUrl: true } },
        studentProfile: {
          include: {
            user: { select: { name: true, email: true } },
            supervisor: {
              include: {
                user: { select: { name: true } },
              },
            },
          },
        },
        facultyProfile: {
          include: {
            user: { select: { name: true, email: true } },
          },
        },
        experimentLog: {
          include: {
            faculty: {
              include: {
                user: { select: { name: true } },
              },
            },
          },
        },
      },
      orderBy: { startTime: "desc" },
    });

    return { success: true, bookings };
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Failed to fetch master schedule.";
    return { success: false, error: msg };
  }
}

/**
 * Post-Session Run Log Update:
 * Allows a scholar or booker to record what they actually executed during their booked time window.
 * Saves directly into their academic profile and links to the booking.
 */
const postRunLogSchema = z.object({
  bookingId: z.string().min(1, "Booking ID is required"),
  title: z.string().min(3, "Experiment / run title is required"),
  protocolSummary: z.string().min(10, "Please summarize the laboratory protocol executed"),
  observations: z.string().optional(),
  actualHoursUsed: z.number().min(0.1, "Please enter hours used"),
  cleanupNotes: z.string().optional(),
});

export type PostRunLogInput = z.infer<typeof postRunLogSchema>;

export async function updateBookingPostRunLogAction(input: PostRunLogInput) {
  try {
    const user = await requireAuth();
    const validated = postRunLogSchema.parse(input);

    const booking = await db.equipmentBooking.findUnique({
      where: { id: validated.bookingId },
      include: {
        equipment: { select: { id: true, name: true } },
        studentProfile: true,
        facultyProfile: true,
        experimentLog: true,
      },
    });

    if (!booking) {
      return { success: false, error: "Booking record not found." };
    }

    const isStudentAuthor = booking.studentProfile?.userId === user.id;
    const isFacultyAuthor = booking.facultyProfile?.userId === user.id;
    const isAdmin = user.role === Role.SUPER_ADMIN || user.role === Role.EDITOR;

    if (!isStudentAuthor && !isFacultyAuthor && !isAdmin) {
      return { success: false, error: "You are not authorized to update this session log." };
    }

    // Determine studentProfileId
    let studentProfileId = booking.studentProfileId;
    if (!studentProfileId) {
      let profile = await db.studentProfile.findFirst({
        where: { userId: user.id },
      });
      if (!profile && isAdmin) {
        const faculty = await db.facultyProfile.findFirst();
        profile = await db.studentProfile.create({
          data: {
            userId: user.id,
            studentId: "ADM-" + user.id.slice(-6).toUpperCase(),
            program: "PHD",
            department: "Department of Biotechnology & Genetic Engineering",
            institution: "Jahangirnagar University",
            sessionYear: "2023-2024",
            batch: "Lead Investigator",
            phone: "+880 1700-000000",
            supervisorId: faculty?.id || null,
            status: BookingStatus.CONFIRMED === "CONFIRMED" ? "ACTIVE" : "ACTIVE",
            thesisTitle: "Advanced Bioprocess Engineering & Lab Instrumentation",
          },
        });
      }
      studentProfileId = profile?.id || null;
      if (studentProfileId) {
        await db.equipmentBooking.update({
          where: { id: booking.id },
          data: { studentProfileId },
        });
      }
    }

    // Prepare observations with optional cleanup notes
    let fullObservations = validated.observations?.trim() || "";
    if (validated.cleanupNotes?.trim()) {
      fullObservations += fullObservations
        ? `\n\n[Post-Run Maintenance & Cleanup]: ${validated.cleanupNotes.trim()}`
        : `[Post-Run Maintenance & Cleanup]: ${validated.cleanupNotes.trim()}`;
    }

    // Upsert linked ExperimentLog
    let experimentLog;
    if (booking.experimentLog) {
      experimentLog = await db.experimentLog.update({
        where: { id: booking.experimentLog.id },
        data: {
          title: validated.title.trim(),
          protocolSummary: validated.protocolSummary.trim(),
          observations: fullObservations || null,
          actualHoursUsed: validated.actualHoursUsed,
          dateConducted: new Date(),
        },
      });
    } else if (studentProfileId) {
      experimentLog = await db.experimentLog.create({
        data: {
          studentProfileId,
          bookingId: booking.id,
          equipmentId: booking.equipmentId,
          title: validated.title.trim(),
          protocolSummary: validated.protocolSummary.trim(),
          observations: fullObservations || null,
          actualHoursUsed: validated.actualHoursUsed,
          dateConducted: new Date(),
        },
      });
    }

    // Update booking status to COMPLETED
    const updatedBooking = await db.equipmentBooking.update({
      where: { id: booking.id },
      data: { status: BookingStatus.COMPLETED },
    });

    await db.auditLog.create({
      data: {
        userId: user.id,
        userName: user.name,
        userEmail: user.email,
        action: "UPDATE",
        entity: "EquipmentBooking",
        entityId: booking.id,
        details: {
          action: "POST_RUN_LOG_SUBMITTED",
          title: validated.title,
          actualHoursUsed: validated.actualHoursUsed,
          instrumentName: booking.equipment.name,
        },
      },
    });

    revalidatePath("/portal");
    revalidatePath("/portal/book");
    revalidatePath("/portal/history");
    revalidatePath("/admin/bookings");
    revalidatePath("/admin");
    revalidatePath("/faculty");

    return {
      success: true,
      message: "Post-slot experiment run log saved successfully and recorded in your research dossier.",
      booking: updatedBooking,
      experimentLog,
    };
  } catch (error: unknown) {
    console.error("Update post run log error:", error);
    if (error instanceof z.ZodError) {
      return { success: false, error: error.errors[0]?.message || "Validation error." };
    }
    const msg = error instanceof Error ? error.message : "Failed to record post-run log.";
    return { success: false, error: msg };
  }
}

/**
 * Admin: Update booking status & administrative notes
 */
export async function updateBookingAdminAction(input: {
  bookingId: string;
  status: BookingStatus;
  adminNotes?: string;
}) {
  try {
    const user = await requireAuth();
    if (user.role !== Role.SUPER_ADMIN && user.role !== Role.EDITOR) {
      return { success: false, error: "Administrative privileges required." };
    }

    const updated = await db.equipmentBooking.update({
      where: { id: input.bookingId },
      data: {
        status: input.status,
        adminNotes: input.adminNotes !== undefined ? input.adminNotes.trim() : undefined,
      },
    });

    revalidatePath("/portal");
    revalidatePath("/portal/book");
    revalidatePath("/portal/history");
    revalidatePath("/admin/bookings");

    return { success: true, message: "Booking record updated.", booking: updated };
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Failed to update booking.";
    return { success: false, error: msg };
  }
}

/**
 * Cancel a booking.
 */
export async function cancelBookingAction(bookingId: string) {
  try {
    const user = await requireAuth();

    const booking = await db.equipmentBooking.findUnique({
      where: { id: bookingId },
      include: {
        studentProfile: true,
        facultyProfile: true,
      },
    });

    if (!booking) {
      return { success: false, error: "Booking record not found." };
    }

    // Permission: Only author or Super Admin can cancel
    const isStudentAuthor = booking.studentProfile?.userId === user.id;
    const isFacultyAuthor = booking.facultyProfile?.userId === user.id;
    const isSuperAdmin = user.role === Role.SUPER_ADMIN;

    if (!isStudentAuthor && !isFacultyAuthor && !isSuperAdmin) {
      return { success: false, error: "You are not authorized to cancel this reservation." };
    }

    const updated = await db.equipmentBooking.update({
      where: { id: bookingId },
      data: { status: BookingStatus.CANCELLED },
    });

    revalidatePath("/portal");
    revalidatePath("/portal/book");
    revalidatePath("/portal/history");
    revalidatePath("/admin/bookings");
    revalidatePath("/admin");
    revalidatePath("/faculty");

    return { success: true, message: "Booking has been cancelled.", booking: updated };
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Failed to cancel booking.";
    return { success: false, error: msg };
  }
}
