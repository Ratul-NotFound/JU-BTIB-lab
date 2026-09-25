import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { ArrowLeft, Calendar, Image as ImageIcon, MapPin } from "lucide-react";
import { getActivityBySlug } from "@/server/queries/activities";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const activity = await getActivityBySlug(slug);

  if (!activity) {
    return { title: "Activity Not Found | BTIB Lab" };
  }

  return {
    title: `${activity.title} | BTIB Lab - Jahangirnagar University`,
    description: `Academic event: ${activity.title} at ${activity.location || "BTIB Lab, Jahangirnagar University"}`,
  };
}

export const revalidate = 60;

export default async function ActivityDetailPage({ params }: Props) {
  const { slug } = await params;
  const activity = await getActivityBySlug(slug);

  if (!activity) {
    notFound();
  }

  const coverPhoto = activity.coverImage || "/images/hero-lab.jpg";
  const allImages = activity.albums.flatMap((a) => a.images);

  return (
    <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-12 sm:py-16 space-y-12">
      {/* Back button */}
      <div>
        <Link
          href="/activities"
          className="inline-flex items-center gap-2 text-xs font-semibold text-[var(--text-secondary)] hover:text-[var(--brand-primary)] transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
          <span>Back to All Activities & Milestones</span>
        </Link>
      </div>

      {/* Hero Visual Card */}
      <section className="relative rounded-3xl overflow-hidden border border-[var(--border)] bg-[var(--surface)] shadow-md">
        {/* Cover Photo */}
        <div className="relative w-full h-72 sm:h-96 lg:h-[480px] bg-[var(--surface-raised)]">
          <Image
            src={coverPhoto}
            alt={activity.title}
            fill
            priority
            className="object-cover"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent" />

          {/* Overlay Content */}
          <div className="absolute bottom-0 inset-x-0 p-6 sm:p-10 lg:p-12 space-y-4 max-w-4xl text-white">
            {/* Meta Tags */}
            <div className="flex flex-wrap items-center gap-3">
              <span className="px-3.5 py-1 rounded-full text-xs font-bold bg-[var(--brand-primary)] text-white shadow-sm">
                {activity.type}
              </span>

              <span className="flex items-center gap-1.5 text-xs text-white/90 font-medium bg-black/40 backdrop-blur-md px-3 py-1 rounded-full border border-white/10">
                <Calendar className="w-3.5 h-3.5 text-[var(--brand-primary)]" />
                <span>
                  {new Date(activity.date).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </span>
              </span>

              {activity.location && (
                <span className="flex items-center gap-1.5 text-xs text-white/90 font-medium bg-black/40 backdrop-blur-md px-3 py-1 rounded-full border border-white/10">
                  <MapPin className="w-3.5 h-3.5 text-rose-400" />
                  <span>{activity.location}</span>
                </span>
              )}
            </div>

            {/* Title */}
            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black font-sans tracking-tight text-white leading-tight">
              {activity.title}
            </h1>
          </div>
        </div>
      </section>

      {/* Main Body Article */}
      <section className="p-8 sm:p-12 rounded-3xl border border-[var(--border)] bg-[var(--surface)] shadow-xs space-y-6">
        <h2 className="text-xl sm:text-2xl font-bold font-sans text-[var(--text-primary)]">
          Activity Summary & Event Briefing
        </h2>

        {activity.bodyHtml ? (
          <div
            className="prose dark:prose-invert max-w-none text-base text-[var(--text-secondary)] leading-relaxed font-light"
            dangerouslySetInnerHTML={{ __html: activity.bodyHtml }}
          />
        ) : (
          <p className="text-sm text-[var(--text-muted)] italic">
            No extended briefing provided for this event.
          </p>
        )}
      </section>

      {/* Photo Documentation Album Gallery */}
      {activity.albums.length > 0 && allImages.length > 0 && (
        <section className="space-y-6">
          <div className="flex items-center gap-2">
            <ImageIcon className="w-5 h-5 text-[var(--brand-primary)]" />
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-[var(--text-primary)]">
              Event Documentation <span className="text-[var(--brand-primary)]">Photos</span>
            </h2>
          </div>

          <div className="space-y-8">
            {activity.albums.map((album) => (
              <div key={album.id} className="space-y-4">
                {album.title && (
                  <div>
                    <h3 className="text-base font-bold text-[var(--text-primary)]">
                      {album.title}
                    </h3>
                    {album.description && (
                      <p className="text-xs text-[var(--text-secondary)] mt-0.5">
                        {album.description}
                      </p>
                    )}
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {album.images.map((img) => (
                    <div
                      key={img.id}
                      className="group rounded-2xl border border-[var(--border)] bg-[var(--surface)] overflow-hidden shadow-xs hover:shadow-lg transition-all duration-300 p-2.5 space-y-2.5"
                    >
                      <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-[var(--surface-raised)]">
                        <Image
                          src={img.url}
                          alt={img.alt || album.title}
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        />
                      </div>
                      {img.caption && (
                        <p className="text-xs text-[var(--text-muted)] px-1 leading-snug line-clamp-2">
                          {img.caption}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
