"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { requireRole, requireFacultyOrAdmin } from "@/lib/auth-guard";
import { Role, AccountStatus, MemberCategory } from "@prisma/client";
import { invalidateCache, CACHE_TAGS } from "@/lib/cache-tags";
import bcrypt from "bcryptjs";
import { z } from "zod";

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .trim()
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

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
 * Automatically synchronizes with Public Team Roster so the professor appears on /team.
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

    // Auto-sync with Public Team Roster (TeamMember)
    try {
      const existingTeamMember = await db.teamMember.findFirst({
        where: { email: { equals: email, mode: "insensitive" } },
      });

      if (!existingTeamMember) {
        let baseSlug = slugify(validated.name);
        if (!baseSlug) baseSlug = `faculty-${Date.now()}`;
        let uniqueSlug = baseSlug;
        let counter = 1;
        while (await db.teamMember.findUnique({ where: { slug: uniqueSlug } })) {
          uniqueSlug = `${baseSlug}-${counter++}`;
        }

        const bioText =
          validated.researchFocus?.trim() ||
          `${validated.designation} at the ${validated.department}, ${validated.institution}.`;
        const interestsList = validated.researchFocus
          ? validated.researchFocus.split(",").map((s) => s.trim()).filter(Boolean)
          : ["Biotechnology", "Genetic Engineering"];

        await db.teamMember.create({
          data: {
            slug: uniqueSlug,
            name: validated.name.trim(),
            category: MemberCategory.PI_FACULTY,
            title: validated.designation,
            email,
            bio: bioText,
            interests: interestsList,
            joinYear: new Date().getFullYear(),
            published: true,
            order: 0,
          },
        });
      } else {
        // Ensure category is PI_FACULTY
        await db.teamMember.update({
          where: { id: existingTeamMember.id },
          data: {
            category: MemberCategory.PI_FACULTY,
            title: existingTeamMember.title || validated.designation,
          },
        });
      }
    } catch (syncError) {
      console.warn("Auto-sync to TeamMember warning:", syncError);
    }

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
          syncedToTeam: true,
        },
      },
    });

    invalidateCache(CACHE_TAGS.TEAM);
    revalidatePath("/admin/faculty");
    revalidatePath("/admin/team");
    revalidatePath("/admin");
    revalidatePath("/register");
    revalidatePath("/team");
    revalidatePath("/faculty");
    revalidatePath("/faculty/students");

    return {
      success: true,
      message: `Faculty account for ${faculty.name} provisioned successfully and synchronized with Public Team Roster.`,
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
 * Super Admin Action: One-click bi-directional synchronization between FacultyProfile and TeamMember.
 * Ensures every active faculty supervisor has a matching Public Team profile (PI_FACULTY).
 */
export async function syncAllFacultyWithTeamAction() {
  try {
    await requireRole([Role.SUPER_ADMIN]);
    const activeFaculty = await db.facultyProfile.findMany({
      where: { status: AccountStatus.ACTIVE },
      include: { user: true },
    });

    const allTeamMembers = await db.teamMember.findMany();
    let syncedCount = 0;
    let createdCount = 0;

    for (const fp of activeFaculty) {
      const facEmail = fp.user.email.toLowerCase().trim();
      const facName = fp.user.name.trim();

      // Find matching member by email or name
      const match = allTeamMembers.find(
        (tm) =>
          (tm.email && tm.email.toLowerCase().trim() === facEmail) ||
          tm.name.toLowerCase().trim() === facName.toLowerCase()
      );

      if (match) {
        // Ensure category is PI_FACULTY and email is current
        const needsUpdate =
          match.category !== MemberCategory.PI_FACULTY ||
          match.email?.toLowerCase().trim() !== facEmail;

        if (needsUpdate) {
          await db.teamMember.update({
            where: { id: match.id },
            data: {
              category: MemberCategory.PI_FACULTY,
              email: facEmail,
              title: match.title || fp.designation,
            },
          });
          syncedCount++;
        }
      } else {
        // Create matching public TeamMember record
        let baseSlug = slugify(facName);
        if (!baseSlug) baseSlug = `faculty-${Date.now()}`;
        let uniqueSlug = baseSlug;
        let counter = 1;
        while (await db.teamMember.findUnique({ where: { slug: uniqueSlug } })) {
          uniqueSlug = `${baseSlug}-${counter++}`;
        }

        await db.teamMember.create({
          data: {
            slug: uniqueSlug,
            name: facName,
            category: MemberCategory.PI_FACULTY,
            title: fp.designation,
            email: facEmail,
            bio:
              fp.researchFocus?.trim() ||
              `${fp.designation} at the ${fp.department}, ${fp.institution}.`,
            interests: fp.researchFocus
              ? fp.researchFocus.split(",").map((s) => s.trim()).filter(Boolean)
              : ["Biotechnology", "Genetic Engineering"],
            joinYear: new Date().getFullYear(),
            published: true,
            order: 0,
          },
        });
        createdCount++;
      }
    }

    invalidateCache(CACHE_TAGS.TEAM);
    revalidatePath("/admin/faculty");
    revalidatePath("/admin/team");
    revalidatePath("/team");

    return {
      success: true,
      message: `Sync successful! ${createdCount} public profile(s) created, ${syncedCount} profile(s) updated, and all active faculty supervisors verified.`,
    };
  } catch (error: unknown) {
    console.error("Sync faculty with team error:", error);
    const msg = error instanceof Error ? error.message : "Failed to sync faculty with team.";
    return { success: false, error: msg };
  }
}

/**
 * Super Admin Action: Provision a Faculty Supervisor Portal account from an existing TeamMember.
 */
export async function provisionFacultyFromTeamMemberAction(teamMemberId: string) {
  try {
    await requireRole([Role.SUPER_ADMIN]);
    const member = await db.teamMember.findUnique({
      where: { id: teamMemberId },
    });
    if (!member) {
      return { success: false, error: "Team member not found." };
    }
    if (!member.email) {
      return { success: false, error: "Team member does not have an email address specified." };
    }

    const email = member.email.toLowerCase().trim();
    const existingUser = await db.user.findUnique({
      where: { email },
      include: { facultyProfile: true },
    });

    if (existingUser?.facultyProfile) {
      return { success: false, error: "A faculty supervisor account already exists for this email." };
    }

    const defaultPassword = "BtibFaculty@2026";
    const passwordHash = await bcrypt.hash(defaultPassword, 12);

    if (existingUser) {
      await db.facultyProfile.create({
        data: {
          userId: existingUser.id,
          designation: member.title || "Professor",
          department: "Department of Biotechnology & Genetic Engineering",
          institution: "Jahangirnagar University",
          researchFocus: member.bio || (member.interests && member.interests.join(", ")) || null,
          status: AccountStatus.ACTIVE,
        },
      });
      if (existingUser.role !== Role.SUPER_ADMIN) {
        await db.user.update({
          where: { id: existingUser.id },
          data: { role: Role.FACULTY },
        });
      }
    } else {
      await db.user.create({
        data: {
          email,
          name: member.name,
          passwordHash,
          role: Role.FACULTY,
          facultyProfile: {
            create: {
              designation: member.title || "Professor",
              department: "Department of Biotechnology & Genetic Engineering",
              institution: "Jahangirnagar University",
              researchFocus: member.bio || (member.interests && member.interests.join(", ")) || null,
              status: AccountStatus.ACTIVE,
            },
          },
        },
      });
    }

    invalidateCache(CACHE_TAGS.TEAM);
    revalidatePath("/admin/faculty");
    revalidatePath("/admin/team");
    revalidatePath("/register");

    return {
      success: true,
      message: `Supervisor portal account provisioned for ${member.name}. Login: ${email} | Initial Password: ${defaultPassword}`,
    };
  } catch (error: unknown) {
    console.error("Provision faculty from team error:", error);
    const msg = error instanceof Error ? error.message : "Failed to provision faculty account.";
    return { success: false, error: msg };
  }
}

/**
 * Get active faculty list for Student registration supervisor selector & admin display,
 * enriched with linked public TeamMember details (photoUrl, slug, published status).
 */
export async function getActiveFacultyList() {
  try {
    const [faculty, teamMembers] = await Promise.all([
      db.facultyProfile.findMany({
        where: { status: AccountStatus.ACTIVE },
        include: {
          user: { select: { id: true, name: true, email: true } },
          _count: { select: { supervisedStudents: true } },
        },
        orderBy: [{ designation: "asc" }, { user: { name: "asc" } }],
      }),
      db.teamMember.findMany({
        select: {
          id: true,
          name: true,
          email: true,
          slug: true,
          photoUrl: true,
          published: true,
          category: true,
        },
      }),
    ]);

    return faculty.map((f) => {
      const facEmail = f.user.email.toLowerCase().trim();
      const facName = f.user.name.toLowerCase().trim();
      const matched = teamMembers.find(
        (tm) =>
          (tm.email && tm.email.toLowerCase().trim() === facEmail) ||
          tm.name.toLowerCase().trim() === facName
      );

      return {
        id: f.id,
        name: f.user.name,
        email: f.user.email,
        designation: f.designation,
        department: f.department,
        officeRoom: f.officeRoom,
        phone: f.phone,
        studentCount: f._count.supervisedStudents,
        teamMember: matched
          ? {
              id: matched.id,
              slug: matched.slug,
              photoUrl: matched.photoUrl,
              published: matched.published,
              category: matched.category,
            }
          : null,
      };
    });
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
