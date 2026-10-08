import { Prisma } from "@prisma/client";
import { ZodError } from "zod";

/**
 * Translates database and validation errors into friendly, actionable error messages.
 */
export function formatActionError(error: unknown, fallbackMessage = "Operation failed"): string {
  if (error instanceof ZodError) {
    return error.errors[0]?.message || "Invalid input data.";
  }

  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    // P2002: Unique constraint failed
    if (error.code === "P2002") {
      const target = error.meta?.target as string[] | string | undefined;
      const targetStr = Array.isArray(target) ? target.join(", ") : String(target || "");

      if (targetStr.includes("slug")) {
        return "An item with this URL slug already exists. Please choose a slightly different name or customize the slug.";
      }
      if (targetStr.includes("email")) {
        return "An account with this email address already exists.";
      }
      if (targetStr.includes("doi")) {
        return "A publication with this DOI already exists in the catalog.";
      }
      return `A duplicate entry already exists (${targetStr || "unique field conflict"}). Please ensure uniqueness.`;
    }

    // P2025: Record not found
    if (error.code === "P2025") {
      return "The requested record could not be found or has already been deleted.";
    }

    // P2003: Foreign key constraint violation
    if (error.code === "P2003") {
      return "Cannot delete or update this item because it is referenced by other active records.";
    }
  }

  if (error instanceof Error) {
    return error.message;
  }

  return fallbackMessage;
}
