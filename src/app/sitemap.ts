import { MetadataRoute } from "next";
import { db } from "@/lib/db";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.AUTH_URL || "https://btiblab.ju.edu.bd";

  const staticRoutes: MetadataRoute.Sitemap = [
    "",
    "/about",
    "/research",
    "/projects",
    "/publications",
    "/team",
    "/activities",
    "/gallery",
    "/blog",
    "/contact",
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: route === "" ? 1.0 : 0.8,
  }));

  try {
    const [areas, projects, team, posts] = await Promise.all([
      db.researchArea.findMany({ where: { published: true }, select: { slug: true, updatedAt: true } }),
      db.project.findMany({ where: { published: true }, select: { slug: true, updatedAt: true } }),
      db.teamMember.findMany({ where: { published: true }, select: { slug: true, updatedAt: true } }),
      db.blogPost.findMany({ where: { status: "PUBLISHED" }, select: { slug: true, updatedAt: true } }),
    ]);

    const dynamicRoutes: MetadataRoute.Sitemap = [
      ...areas.map((a) => ({
        url: `${baseUrl}/research/${a.slug}`,
        lastModified: a.updatedAt,
        changeFrequency: "monthly" as const,
        priority: 0.7,
      })),
      ...projects.map((p) => ({
        url: `${baseUrl}/projects/${p.slug}`,
        lastModified: p.updatedAt,
        changeFrequency: "monthly" as const,
        priority: 0.7,
      })),
      ...team.map((t) => ({
        url: `${baseUrl}/team/${t.slug}`,
        lastModified: t.updatedAt,
        changeFrequency: "monthly" as const,
        priority: 0.6,
      })),
      ...posts.map((post) => ({
        url: `${baseUrl}/blog/${post.slug}`,
        lastModified: post.updatedAt,
        changeFrequency: "weekly" as const,
        priority: 0.7,
      })),
    ];

    return [...staticRoutes, ...dynamicRoutes];
  } catch {
    return staticRoutes;
  }
}
