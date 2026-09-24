import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { ArrowLeft, Calendar, Clock, User } from "lucide-react";
import { getBlogPostBySlug, getBlogPosts } from "@/server/queries/blog";
import { getBlogPostingJsonLd } from "@/lib/seo";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);

  if (!post) {
    return { title: "Dispatch Not Found | BTIB Lab" };
  }

  return {
    title: `${post.metaTitle || post.title} | BTIB Lab - Jahangirnagar University`,
    description: post.metaDescription || post.excerpt,
  };
}

export const revalidate = 60;

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const otherPosts = await getBlogPosts({ limit: 3 });
  const relatedPosts = otherPosts.filter((p) => p.id !== post.id).slice(0, 2);

  const jsonLd = getBlogPostingJsonLd({
    title: post.title,
    excerpt: post.excerpt,
    slug: post.slug,
    publishedAt: post.publishedAt,
    authorName: post.authorName,
  });

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <article className="max-w-4xl mx-auto px-6 sm:px-8 lg:px-12 py-12 sm:py-16 space-y-12">
        {/* Back Link */}
        <div>
          <Link
            href="/blog"
            className="inline-flex items-center gap-1.5 text-xs font-mono text-[var(--text-muted)] hover:text-[var(--bio-teal)] transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to All Blogs</span>
          </Link>
        </div>

        {/* Article Header */}
        <header className="space-y-6">
          <div className="flex flex-wrap items-center gap-3">
            {post.category && (
              <span className="px-2.5 py-0.5 rounded text-xs font-mono font-medium border border-[var(--border)] bg-[var(--surface-raised)] text-[var(--bio-teal)]">
                {post.category.name}
              </span>
            )}
            <span className="flex items-center gap-1.5 text-xs font-mono text-[var(--text-muted)]">
              <Calendar className="w-3.5 h-3.5 text-[var(--bio-teal)]" />
              <span>
                {post.publishedAt
                  ? new Date(post.publishedAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })
                  : "Draft"}
              </span>
            </span>
            <span className="flex items-center gap-1 text-xs font-mono text-[var(--text-muted)]">
              <Clock className="w-3.5 h-3.5" />
              <span>{post.readingTime} min read</span>
            </span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black font-sans tracking-tight text-[var(--text-primary)] leading-[1.08]">
            {post.title}
          </h1>

          <p className="text-lg sm:text-xl text-[var(--text-secondary)] leading-relaxed font-light border-l-2 border-[var(--bio-teal)] pl-4">
            {post.excerpt}
          </p>

          <div className="flex items-center justify-between pt-4 border-t border-[var(--border)] text-xs font-mono text-[var(--text-muted)]">
            <div className="flex items-center gap-2">
              <User className="w-4 h-4 text-[var(--bio-teal)]" />
              <span>By {post.authorName}</span>
            </div>
            <span>BTIB Lab Editorial · JU</span>
          </div>
        </header>

        {/* Editorial Cover Image */}
        {post.coverImage && (
          <div className="relative aspect-[16/9] w-full rounded-2xl overflow-hidden border border-[var(--border)] shadow-md">
            <Image
              src={post.coverImage}
              alt={post.title}
              fill
              priority
              className="object-cover"
              sizes="(max-width: 896px) 100vw, 896px"
            />
          </div>
        )}

        {/* Main Article Body */}
        <div
          className="prose dark:prose-invert max-w-none text-base sm:text-lg leading-relaxed text-[var(--text-secondary)] font-light"
          dangerouslySetInnerHTML={{ __html: post.bodyHtml }}
        />

        {/* Article Tags */}
        {post.tags.length > 0 && (
          <div className="pt-8 border-t border-[var(--border)] space-y-3">
            <span className="text-xs font-mono text-[var(--text-muted)] uppercase tracking-wider block">
              Indexed Topics
            </span>
            <div className="flex flex-wrap gap-2">
              {post.tags.map(({ tag }) => (
                <span
                  key={tag.id}
                  className="px-3 py-1 rounded-lg text-xs font-mono border border-[var(--border)] bg-[var(--surface-raised)] text-[var(--text-secondary)]"
                >
                  #{tag.name}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Related Posts */}
        {relatedPosts.length > 0 && (
          <section className="pt-12 border-t border-[var(--border)] space-y-6">
            <h2 className="text-xl font-bold text-[var(--text-primary)]">
              More From BTIB Blogs
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {relatedPosts.map((r) => (
                <Link
                  key={r.id}
                  href={`/blog/${r.slug}`}
                  className="p-6 rounded-2xl border border-[var(--border)] bg-[var(--surface)] hover:border-[var(--bio-teal)] transition-all flex flex-col justify-between group shadow-xs hover:shadow-md"
                >
                  <div className="space-y-2">
                    <span className="text-xs font-mono text-[var(--text-muted)]">
                      {r.readingTime} min read
                    </span>
                    <h3 className="font-semibold text-base text-[var(--text-primary)] group-hover:text-[var(--bio-teal)] transition-colors line-clamp-2">
                      {r.title}
                    </h3>
                  </div>
                  <span className="text-xs font-mono text-[var(--bio-teal)] pt-3 mt-3 border-t border-[var(--border)] block">
                    Read article →
                  </span>
                </Link>
              ))}
            </div>
          </section>
        )}
      </article>
    </>
  );
}
