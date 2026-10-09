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
 * Requires an authenticated user session.
 */
export async function requireAuth() {
  const session = await auth();
  if (!session?.user?.id) {
    throw new AuthError("Authentication required to perform this action.", 401);
  }
  return session.user;
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
    user.role !== Role.SUPER_ADMIN
  ) {
    throw new AuthError("Student access required.", 403);
  }

  // Super admins bypass student verification check
  if (user.role === Role.SUPER_ADMIN) {
    const profile = await db.studentProfile.findFirst({
      where: { userId: user.id },
    });
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
