import { db } from "@/lib/db";
import { PostStatus, Prisma } from "@prisma/client";
import { unstable_cache } from "next/cache";
import { CACHE_TAGS } from "@/lib/cache-tags";

function getCachedBlogPosts(
  categorySlug?: string,
  tagSlug?: string,
  limit?: number
) {
  const cacheKey = [
    "blog-posts-list",
    categorySlug ?? "any",
    tagSlug ?? "any",
    limit?.toString() ?? "unlimited",
  ];
  return unstable_cache(
    async () => {
      const where: Prisma.BlogPostWhereInput = {
        status: PostStatus.PUBLISHED,
        publishedAt: { lte: new Date() },
      };

      if (categorySlug) {
        where.category = { slug: categorySlug };
      }

      if (tagSlug) {
        where.tags = {
          some: {
            tag: { slug: tagSlug },
          },
        };
      }

      return await db.blogPost.findMany({
        where,
        orderBy: { publishedAt: "desc" },
        take: limit,
        include: {
          category: true,
          tags: {
            include: { tag: true },
          },
        },
      });
    },
    cacheKey,
    {
      tags: [CACHE_TAGS.BLOG],
      revalidate: 3600,
    }
  )();
}

export async function getBlogPosts(options?: {
  status?: PostStatus;
  categorySlug?: string;
  tagSlug?: string;
  limit?: number;
  includeUnpublished?: boolean;
}) {
  try {
    if (
      options?.includeUnpublished ||
      (options?.status && options.status !== PostStatus.PUBLISHED)
    ) {
      const where: Prisma.BlogPostWhereInput = {};

      if (options?.status) {
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
    }

    return await getCachedBlogPosts(
      options?.categorySlug,
      options?.tagSlug,
      options?.limit
    );
  } catch (error) {
    console.error("Error fetching blog posts:", error);
    return [];
  }
}

function getCachedBlogPostBySlug(slug: string) {
  const cacheKey = ["blog-post-by-slug", slug];
  return unstable_cache(
    async () => {
      return await db.blogPost.findUnique({
        where: { slug },
        include: {
          category: true,
          tags: {
            include: { tag: true },
          },
        },
      });
    },
    cacheKey,
    {
      tags: [CACHE_TAGS.BLOG],
      revalidate: 3600,
    }
  )();
}

export async function getBlogPostBySlug(slug: string) {
  try {
    return await getCachedBlogPostBySlug(slug);
  } catch (error) {
    console.error(`Error fetching blog post by slug ${slug}:`, error);
    return null;
  }
}
