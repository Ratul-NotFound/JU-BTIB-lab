"use server";

import { db } from "@/lib/db";
import { requireRole } from "@/lib/auth-guard";
import { blogPostSchema, type BlogPostInput } from "@/server/validators/schemas";
import { invalidateCache, CACHE_TAGS } from "@/lib/cache-tags";
import { Role, PostStatus } from "@prisma/client";
import sanitizeHtml from "sanitize-html";

export async function createBlogPost(input: BlogPostInput) {
  const user = await requireRole([Role.SUPER_ADMIN, Role.EDITOR]);
  const validated = blogPostSchema.parse(input);

  // Sanitize HTML body to prevent XSS attacks before storage
  const cleanBody = sanitizeHtml(validated.bodyHtml, {
    allowedTags: sanitizeHtml.defaults.allowedTags.concat([
      "h1", "h2", "h3", "img", "figure", "figcaption", "table", "tbody", "thead", "tr", "td", "th",
    ]),
    allowedAttributes: {
      ...sanitizeHtml.defaults.allowedAttributes,
      img: ["src", "alt", "title", "width", "height", "class"],
      a: ["href", "name", "target", "rel"],
    },
  });

  const { tagIds, ...data } = validated;

  const post = await db.blogPost.create({
    data: {
      ...data,
      bodyHtml: cleanBody,
      publishedAt:
        validated.status === PostStatus.PUBLISHED && !validated.publishedAt
          ? new Date()
          : validated.publishedAt,
      tags: {
        create: tagIds.map((tagId) => ({
          tagId,
        })),
      },
    },
  });

  await db.auditLog.create({
    data: {
      userId: user.id,
      userName: user.name,
      userEmail: user.email,
      action: "CREATE",
      entity: "BlogPost",
      entityId: post.id,
      details: { title: post.title, slug: post.slug },
    },
  });

  invalidateCache(CACHE_TAGS.BLOG);
  return { success: true, data: post };
}

export async function updateBlogPost(id: string, input: Partial<BlogPostInput>) {
  const user = await requireRole([Role.SUPER_ADMIN, Role.EDITOR]);
  const validated = blogPostSchema.partial().parse(input);

  const cleanBody = validated.bodyHtml
    ? sanitizeHtml(validated.bodyHtml, {
        allowedTags: sanitizeHtml.defaults.allowedTags.concat([
          "h1", "h2", "h3", "img", "figure", "figcaption", "table", "tbody", "thead", "tr", "td", "th",
        ]),
        allowedAttributes: {
          ...sanitizeHtml.defaults.allowedAttributes,
          img: ["src", "alt", "title", "width", "height", "class"],
          a: ["href", "name", "target", "rel"],
        },
      })
    : undefined;

  const { tagIds, ...data } = validated;

  const updated = await db.blogPost.update({
    where: { id },
    data: {
      ...data,
      ...(cleanBody !== undefined && { bodyHtml: cleanBody }),
      ...(data.status === PostStatus.PUBLISHED && !data.publishedAt
        ? { publishedAt: new Date() }
        : {}),
      ...(tagIds !== undefined && {
        tags: {
          deleteMany: {},
          create: tagIds.map((tagId) => ({
            tagId,
          })),
        },
      }),
    },
  });

  await db.auditLog.create({
    data: {
      userId: user.id,
      userName: user.name,
      userEmail: user.email,
      action: "UPDATE",
      entity: "BlogPost",
      entityId: id,
      details: { title: updated.title },
    },
  });

  invalidateCache(CACHE_TAGS.BLOG);
  return { success: true, data: updated };
}

export async function deleteBlogPost(id: string) {
  const user = await requireRole([Role.SUPER_ADMIN, Role.EDITOR]);

  const deleted = await db.blogPost.delete({
    where: { id },
  });

  await db.auditLog.create({
    data: {
      userId: user.id,
      userName: user.name,
      userEmail: user.email,
      action: "DELETE",
      entity: "BlogPost",
      entityId: id,
      details: { title: deleted.title },
    },
  });

  invalidateCache(CACHE_TAGS.BLOG);
  return { success: true };
}
