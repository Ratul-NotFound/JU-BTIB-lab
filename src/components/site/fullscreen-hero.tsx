"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, BookOpen } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";

interface FullscreenHeroProps {
  heroSubheading?: string;
  totalDivisions?: number;
  totalPublications?: number;
  heroBgImage?: string | null;
  heroBgImageAlt?: string | null;
  bannerImages?: unknown;
  labLogoWhiteUrl?: string | null;
  universityLogoWhiteUrl?: string | null;
}

const DEFAULT_HERO_IMAGES = [
  {
    src: "/images/hero-lab.jpg",
    alt: "Bioresources Technology and Industrial Biotechnology Laboratory Analytical Station",
  },
  {
    src: "/images/liquid-tree.jpg",
    alt: "250L Urban Liquid-Tree Photobioreactor Column at Jahangirnagar University",
  },
  {
    src: "/images/facilities/cleanroom-pilot.jpg",
    alt: "Cleanroom Pilot Fermentation Facility with Bioreactor Trains",
  },
  {
    src: "/images/fermentation.jpg",
    alt: "Automated Stirred-Tank Fermenters with Digital Bioprocess Controls",
  },
  {
    src: "/images/bioplastics.jpg",
    alt: "Biodegradable Composite Biomaterial Matrices & Biopolymer Packaging",
  },
];

export function FullscreenHero({
  heroSubheading,
  totalDivisions = 8,
  totalPublications = 15,
  heroBgImage,
  heroBgImageAlt,
  bannerImages,
  labLogoWhiteUrl,
  universityLogoWhiteUrl,
}: FullscreenHeroProps) {
  const [currentIndex, setCurrentIndex] = React.useState(0);
  const shouldReduceMotion = useReducedMotion();

  const heroSlides = React.useMemo(() => {
    // 1. If custom structured bannerImages are configured in Admin Settings
    if (Array.isArray(bannerImages) && bannerImages.length > 0) {
      const customSlides = bannerImages
        .filter((b): b is { src: string; alt?: string } => typeof b === "object" && b !== null && Boolean(b.src))
        .map((b) => ({
          src: b.src,
          alt: b.alt || "BTIB Laboratory Main Research Facility",
        }));
      if (customSlides.length > 0) return customSlides;
    }

    // 2. Fallback to single heroBgImage if configured
    if (heroBgImage) {
      return [
        {
          src: heroBgImage,
          alt: heroBgImageAlt || "BTIB Laboratory Main Research Complex",
        },
      ];
    }

    // 3. Fallback to default verified lab photography
    return DEFAULT_HERO_IMAGES;
  }, [bannerImages, heroBgImage, heroBgImageAlt]);

  React.useEffect(() => {
    if (heroSlides.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % heroSlides.length);
    }, 6000);

    return () => clearInterval(timer);
  }, [heroSlides.length]);

  const easeCurve = [0.21, 0.47, 0.32, 0.98] as const;

  return (
    <section className="relative w-full min-h-[calc(100svh-3.5rem)] sm:min-h-[calc(100vh-4.5rem)] flex items-center justify-center overflow-hidden border-b border-[var(--border)]">
      {/* 1. Full-Bleed Multi-Image Crossfade Background */}
      <div className="absolute inset-0 z-0">
        {heroSlides.map((img, idx) => (
          <div
            key={img.src}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              idx === currentIndex || heroSlides.length === 1
                ? "opacity-100 z-10"
                : "opacity-0 pointer-events-none z-0"
            }`}
            aria-hidden={idx !== currentIndex && heroSlides.length > 1}
          >
            <Image
              src={img.src}
              alt={img.alt}
              fill
              priority
              sizes="100vw"
              className="object-cover object-center scale-[1.02]"
            />
          </div>
        ))}

        {/* Multi-layer contrast overlay ensuring 100% text readability */}
        <div className="absolute inset-0 z-20 bg-[#070D18]/80 pointer-events-none" />
        <div className="absolute inset-0 z-20 bg-gradient-to-t from-[#070D18] via-transparent to-[#070D18]/80 pointer-events-none" />
        <div className="absolute inset-0 z-20 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-transparent via-[#070D18]/40 to-[#070D18]/90 pointer-events-none" />
      </div>

      {/* 2. Hero Content: Clean, Centered Academic Typography */}
      <div className="relative z-30 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-5 sm:py-8 lg:py-12 flex flex-col items-center text-center">
        
        {/* Institutional Dual Logos */}
        <motion.div
          initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: easeCurve }}
          className="flex items-center justify-center gap-3 sm:gap-5 mb-2.5 sm:mb-4"
        >
          <div className="relative w-10 h-10 sm:w-14 sm:h-14 shrink-0 flex items-center justify-center">
            <Image
              src={labLogoWhiteUrl || "/images/btib-logo-white.png"}
              alt="BTIB Laboratory Logo"
              width={56}
              height={56}
              priority
              className="w-full h-full object-contain drop-shadow-md"
            />
          </div>

          {/* Vertical Divider Line */}
          <div className="w-px h-6 sm:h-9 bg-white/30 shrink-0" aria-hidden="true" />

          <div className="relative w-9 h-9 sm:w-13 sm:h-13 shrink-0 flex items-center justify-center">
            <Image
              src={universityLogoWhiteUrl || "/images/ju-logo-white.png"}
              alt="Jahangirnagar University Logo"
              width={52}
              height={52}
              priority
              className="w-full h-full object-contain drop-shadow-md"
            />
          </div>
        </motion.div>

        {/* Full Name of the Laboratory - Responsive Monumental Heading */}
        <motion.h1
          initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.08, ease: easeCurve }}
          className="text-xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-sans font-extrabold tracking-tight text-white leading-[1.12] max-w-4xl"
        >
          Bioresources Technology &amp; Industrial Biotechnology Laboratory
        </motion.h1>

        {/* Concise Description */}
        <motion.p
          initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, delay: 0.18, ease: easeCurve }}
          className="mt-2.5 sm:mt-4 text-xs sm:text-base lg:text-lg text-slate-200 font-light leading-relaxed max-w-3xl line-clamp-3 sm:line-clamp-none"
        >
          {heroSubheading ||
            "Pioneering microbial bioprocess kinetics, urban microalgae photobioreactors, and circular bioproducts from Bangladesh's rich ecological bioresources."}
        </motion.p>

        {/* Actions - Touch-Friendly Responsive Buttons */}
        <motion.div
          initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.28, ease: easeCurve }}
          className="flex flex-wrap items-center justify-center gap-2 sm:gap-3.5 mt-3.5 sm:mt-6"
        >
          <motion.div
            whileHover={shouldReduceMotion ? {} : { y: -2, scale: 1.02 }}
            whileTap={shouldReduceMotion ? {} : { scale: 0.98 }}
            transition={{ duration: 0.2 }}
          >
            <Link
              href="/research"
              className="inline-flex items-center gap-2 px-4 py-2.5 sm:px-6 sm:py-3 rounded-md text-xs sm:text-sm font-semibold bg-[var(--brand-primary)] hover:bg-[var(--brand-primary-hover)] text-white shadow-sm hover:shadow-md transition-shadow"
            >
              <span>Explore Research</span>
              <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </Link>
          </motion.div>
          <motion.div
            whileHover={shouldReduceMotion ? {} : { y: -2, scale: 1.02 }}
            whileTap={shouldReduceMotion ? {} : { scale: 0.98 }}
            transition={{ duration: 0.2 }}
          >
            <Link
              href="/publications"
              className="inline-flex items-center gap-2 px-4 py-2.5 sm:px-6 sm:py-3 rounded-md text-xs sm:text-sm font-semibold border border-white/20 bg-white/10 hover:bg-white/15 text-white backdrop-blur-md transition-colors"
            >
              <BookOpen className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-300" />
              <span>Publications</span>
            </Link>
          </motion.div>
        </motion.div>

        {/* Key Indicators Grid */}
        <motion.div
          initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.38, ease: easeCurve }}
          className="mt-4 sm:mt-7 pt-3 sm:pt-5 border-t border-white/15 grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-6 w-full max-w-2xl text-center"
        >
          <div className="py-0.5 sm:py-1">
            <div className="text-lg sm:text-2xl lg:text-3xl font-extrabold text-[var(--brand-primary)] font-sans">
              {totalDivisions}
            </div>
            <div className="text-[10px] sm:text-xs font-sans text-slate-300 mt-0.5 font-medium">
              Research Divisions
            </div>
          </div>
          <div className="py-0.5 sm:py-1">
            <div className="text-lg sm:text-2xl lg:text-3xl font-extrabold text-white font-sans">
              250 <span className="text-[var(--brand-primary)] text-xs sm:text-base">L</span>
            </div>
            <div className="text-[10px] sm:text-xs font-sans text-slate-300 mt-0.5 font-medium">
              Photobioreactor
            </div>
          </div>
          <div className="py-0.5 sm:py-1">
            <div className="text-lg sm:text-2xl lg:text-3xl font-extrabold text-[var(--brand-primary)] font-sans">
              2012
            </div>
            <div className="text-[10px] sm:text-xs font-sans text-slate-300 mt-0.5 font-medium">
              Established
            </div>
          </div>
          <div className="py-0.5 sm:py-1">
            <div className="text-lg sm:text-2xl lg:text-3xl font-extrabold text-white font-sans">
              {totalPublications}+
            </div>
            <div className="text-[10px] sm:text-xs font-sans text-slate-300 mt-0.5 font-medium">
              Indexed Papers
            </div>
          </div>
        </motion.div>

      </div>
    </section>
  );
}
