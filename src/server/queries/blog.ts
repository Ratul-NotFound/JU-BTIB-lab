import { db } from "@/lib/db";
import { PostStatus, Prisma } from "@prisma/client";
import { unstable_cache } from "next/cache";
import { CACHE_TAGS } from "@/lib/cache-tags";

const getCachedBlogPosts = unstable_cache(
  async (categorySlug?: string, tagSlug?: string, limit?: number) => {
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
  ["blog-posts-list"],
  {
    tags: [CACHE_TAGS.BLOG],
    revalidate: 3600,
  }
);

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

const getCachedBlogPostBySlug = unstable_cache(
  async (slug: string) => {
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
  ["blog-post-by-slug"],
  {
    tags: [CACHE_TAGS.BLOG],
    revalidate: 3600,
  }
);

export async function getBlogPostBySlug(slug: string) {
  try {
    return await getCachedBlogPostBySlug(slug);
  } catch (error) {
    console.error(`Error fetching blog post by slug ${slug}:`, error);
    return null;
  }
}
