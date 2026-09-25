import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { Metadata } from "next";
import { ArrowRight, Calendar, Clock, BookOpen } from "lucide-react";
import { getBlogPosts } from "@/server/queries/blog";

export const metadata: Metadata = {
  title: "Blogs & Research Insights | BTIB Lab - Jahangirnagar University",
  description:
    "Scientific blogs, experimental updates, field notes, and biotechnology insights authored by researchers at BTIB Lab, Jahangirnagar University.",
};

export const revalidate = 60;

export default async function BlogPage() {
  const posts = await getBlogPosts();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 py-6 sm:py-16 space-y-6 sm:space-y-12">
      {/* Header */}
      <section className="space-y-2 sm:space-y-4 max-w-4xl">
        <h1 className="text-2xl sm:text-4xl lg:text-6xl font-black font-sans tracking-tight text-[var(--text-primary)] leading-[1.12] sm:leading-[1.08]">
          Blogs & <span className="text-[var(--brand-primary)]">Research Insights</span>
        </h1>

        <p className="text-xs sm:text-base lg:text-lg text-[var(--text-secondary)] leading-relaxed font-light">
          In-depth scientific articles, translational biotechnology reviews, and project milestones authored by
          researchers and students at Jahangirnagar University.
        </p>
      </section>

      {/* Blog Posts Grid - Balanced 3-Column */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
        {posts.map((post) => {
          const coverImage = post.coverImage || "/images/domains/microbial-biotech.jpg";

          return (
            <Link
              key={post.id}
              href={`/blog/${post.slug}`}
              className="rounded-xl sm:rounded-2xl border border-[var(--border)] bg-[var(--surface)] hover:border-[var(--brand-primary)] hover:shadow-[0_8px_24px_rgba(0,146,184,0.14)] transition-all flex flex-col justify-between overflow-hidden group shadow-xs hover:shadow-lg"
            >
              {/* Cover Photo */}
              <div className="relative aspect-[2.1/1] sm:aspect-[16/10] w-full overflow-hidden bg-[var(--surface-raised)]">
                <Image
                  src={coverImage}
                  alt={post.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                {post.category && (
                  <div className="absolute top-2.5 sm:top-3.5 left-2.5 sm:left-3.5">
                    <span className="px-2 py-0.5 sm:px-2.5 sm:py-1 rounded text-[10px] sm:text-[11px] font-mono font-medium border border-white/20 bg-black/60 backdrop-blur-md text-white">
                      {post.category.name}
                    </span>
                  </div>
                )}
              </div>

              {/* Body */}
              <div className="p-3.5 sm:p-6 flex-1 flex flex-col justify-between space-y-3 sm:space-y-4">
                <div className="space-y-2 sm:space-y-3">
                  <div className="flex items-center gap-2 sm:gap-3 text-[11px] sm:text-xs font-mono text-[var(--text-muted)]">
                    <div className="flex items-center gap-1 sm:gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-[var(--brand-primary)]" />
                      <span>
                        {post.publishedAt
                          ? new Date(post.publishedAt).toLocaleDateString("en-US", {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            })
                          : "Recent"}
                      </span>
                    </div>
                    <span>•</span>
                    <div className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{post.readingTime} min</span>
                    </div>
                  </div>

                  <h2 className="text-base sm:text-xl font-bold text-[var(--text-primary)] group-hover:text-[var(--brand-primary)] transition-colors leading-snug line-clamp-2">
                    {post.title}
                  </h2>

                  <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed line-clamp-2 sm:line-clamp-3 font-light">
                    {post.excerpt}
                  </p>
                </div>

                <div className="pt-2.5 sm:pt-4 border-t border-[var(--border)] flex items-center justify-between text-[11px] sm:text-xs font-mono text-[var(--text-muted)]">
                  <span>By {post.authorName}</span>
                  <span className="text-[var(--brand-primary)] font-medium flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                    Read Post <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {posts.length === 0 && (
        <div className="p-12 text-center rounded-2xl border border-[var(--border)] bg-[var(--surface)] text-sm font-mono text-[var(--text-muted)]">
          <BookOpen className="w-8 h-8 text-[var(--text-muted)] mx-auto mb-3 opacity-60" />
          No blog posts published yet. Articles will appear here once published from the admin panel.
        </div>
      )}
    </div>
  );
}
