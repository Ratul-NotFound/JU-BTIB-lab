import { db } from "@/lib/db";
import { PostStatus, Prisma } from "@prisma/client";

export async function getBlogPosts(options?: {
  status?: PostStatus;
  categorySlug?: string;
  tagSlug?: string;
  limit?: number;
  includeUnpublished?: boolean;
}) {
  try {
    const where: Prisma.BlogPostWhereInput = {};

    if (!options?.includeUnpublished) {
      where.status = PostStatus.PUBLISHED;
      where.publishedAt = { lte: new Date() };
    } else if (options?.status) {
      where.status = options.status;
    }

    if (options?.categorySlug) {
      where.category = { slug: options.categorySlug };
    }

    if (options?.tagSlug) {
      where.tags = {
        some: {
          tag: { slug: options.tagSlug },
        },
      };
    }

    return await db.blogPost.findMany({
      where,
      orderBy: { publishedAt: "desc" },
      take: options?.limit,
      include: {
        category: true,
        tags: {
          include: { tag: true },
        },
      },
    });
  } catch (error) {
    console.error("Error fetching blog posts:", error);
    return [];
  }
}

export async function getBlogPostBySlug(slug: string) {
  try {
    return await db.blogPost.findUnique({
      where: { slug },
      include: {
        category: true,
        tags: {
          include: { tag: true },
        },
      },
    });
  } catch (error) {
    console.error(`Error fetching blog post by slug ${slug}:`, error);
    return null;
  }
}
