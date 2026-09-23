import { auth } from "@/lib/auth";
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
 * Requires a specific minimum role (e.g. SUPER_ADMIN).
 * SUPER_ADMIN has access to all resources.
 */
export async function requireRole(allowedRoles: Role[] = [Role.SUPER_ADMIN, Role.EDITOR]) {
  const user = await requireAuth();

  if (!allowedRoles.includes(user.role)) {
    throw new AuthError("Insufficient permissions to perform this operation.", 403);
  }

  return user;
}
