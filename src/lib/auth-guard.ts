import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { Role } from "@prisma/client";

export class AuthError extends Error {
  constructor(message: string, public statusCode = 401) {
    super(message);
    this.name = "AuthError";
  }
}

/**
 * Requires an authenticated user session and resolves verified database user.
 */
export async function requireAuth() {
  const session = await auth();
  if (!session?.user?.id && !session?.user?.email) {
    throw new AuthError("Authentication required to perform this action.", 401);
  }

  const dbUser = await db.user.findFirst({
    where: {
      OR: [
        ...(session.user?.id ? [{ id: session.user.id }] : []),
        ...(session.user?.email ? [{ email: session.user.email.toLowerCase().trim() }] : []),
      ],
    },
  });

  if (!dbUser) {
    throw new AuthError("User account not found. Please log in again.", 401);
  }

  return {
    ...session.user,
    id: dbUser.id,
    name: dbUser.name,
    email: dbUser.email,
    role: dbUser.role,
  };
}

/**
 * Requires a specific role.
 */
export async function requireRole(allowedRoles: Role[] = [Role.SUPER_ADMIN, Role.EDITOR]) {
  const user = await requireAuth();

  if (!allowedRoles.includes(user.role)) {
    throw new AuthError("Insufficient permissions to perform this operation.", 403);
  }

  return user;
}

/**
 * Requires an active, verified student profile.
 */
export async function requireActiveStudent() {
  const user = await requireAuth();
  if (
    user.role !== Role.STUDENT &&
    user.role !== Role.SUPER_ADMIN &&
    user.role !== Role.EDITOR
  ) {
    throw new AuthError("Student access required.", 403);
  }

  // Super admins and editors bypass student verification check and auto-provision profile if needed
  if (user.role === Role.SUPER_ADMIN || user.role === Role.EDITOR) {
    let profile = await db.studentProfile.findFirst({
      where: { userId: user.id },
    });
    if (!profile) {
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
          status: "ACTIVE",
          thesisTitle: "Advanced Bioprocess Engineering & Lab Instrumentation",
        },
      });
    }
    return { user, profile };
  }

  const profile = await db.studentProfile.findUnique({
    where: { userId: user.id },
  });

  if (!profile) {
    throw new AuthError("Student profile record not found.", 404);
  }

  if (profile.status !== "ACTIVE") {
    throw new AuthError(
      "Your student account is pending faculty or administrator approval. Once verified, equipment booking and logging will be unlocked.",
      403
    );
  }

  return { user, profile };
}

/**
 * Requires a Faculty or Super Admin account.
 */
export async function requireFacultyOrAdmin() {
  const user = await requireAuth();
  if (user.role !== Role.FACULTY && user.role !== Role.SUPER_ADMIN) {
    throw new AuthError("Faculty or administrator access required.", 403);
  }

  const facultyProfile = await db.facultyProfile.findUnique({
    where: { userId: user.id },
  });

  return { user, facultyProfile };
}
