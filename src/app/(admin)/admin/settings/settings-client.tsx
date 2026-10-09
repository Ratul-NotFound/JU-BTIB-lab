"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Tabs } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/toast";
import { updateSiteSettings, updateContentBlock } from "@/server/actions/settings";
import { changePasswordAction } from "@/server/actions/auth";
import { MediaPicker } from "@/components/admin/media-picker";
import Image from "next/image";
import {
  Save,
  Image as ImageIcon,
  Sparkles,
  Building2,
  KeyRound,
  Eye,
  EyeOff,
  ShieldCheck,
  Lock,
  Plus,
  Trash2,
  ArrowUp,
  ArrowDown,
  RotateCcw,
  X,
} from "lucide-react";

export interface HeroSlideItem {
  id: string;
  src: string;
  alt: string;
}

export const DEFAULT_HERO_SLIDES: HeroSlideItem[] = [
  {
    id: "default-slide-1",
    src: "/images/hero-lab.jpg",
    alt: "Bioresources Technology and Industrial Biotechnology Laboratory Analytical Station",
  },
  {
    id: "default-slide-2",
    src: "/images/liquid-tree.jpg",
    alt: "250L Urban Liquid-Tree Photobioreactor Column at Jahangirnagar University",
  },
  {
    id: "default-slide-3",
    src: "/images/facilities/cleanroom-pilot.jpg",
    alt: "Cleanroom Pilot Fermentation Facility with Bioreactor Trains",
  },
  {
    id: "default-slide-4",
    src: "/images/fermentation.jpg",
    alt: "Automated Stirred-Tank Fermenters with Digital Bioprocess Controls",
  },
  {
    id: "default-slide-5",
    src: "/images/bioplastics.jpg",
    alt: "Biodegradable Composite Biomaterial Matrices & Biopolymer Packaging",
  },
];

interface SiteSettingsData {
  id: string;
  labName: string;
  labShortName: string;
  departmentName: string;
  institutionName: string;
  address: string;
  contactEmail: string;
  tagline: string;
  heroHeading: string;
  heroSubheading: string;
  heroBgImage?: string | null;
  heroBgImageAlt?: string | null;
  aboutHeroImage?: string | null;
  liquidTreeImage?: string | null;
  heritageCampusImage?: string | null;
  labIntroImage?: string | null;
  labLogoUrl?: string | null;
  labLogoWhiteUrl?: string | null;
  universityLogoUrl?: string | null;
  universityLogoWhiteUrl?: string | null;
  bannerImages?: unknown;
}

interface ContentBlockData {
  id: string;
  key: string;
  title: string;
  content: unknown;
}

export function SettingsClient({
  initialSettings,
  initialBlocks,
}: {
  initialSettings: SiteSettingsData | null;
  initialBlocks: ContentBlockData[];
}) {
  const router = useRouter();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = React.useState("identity");

  // Settings State - Identity & Copy
  const [labName, setLabName] = React.useState(initialSettings?.labName || "");
  const [labShortName, setLabShortName] = React.useState(initialSettings?.labShortName || "BTIB Lab");
  const [departmentName, setDepartmentName] = React.useState(initialSettings?.departmentName || "");
  const [institutionName, setInstitutionName] = React.useState(initialSettings?.institutionName || "");
  const [address, setAddress] = React.useState(initialSettings?.address || "");
  const [contactEmail, setContactEmail] = React.useState(initialSettings?.contactEmail || "");
  const [tagline, setTagline] = React.useState(initialSettings?.tagline || "");
  const [heroHeading, setHeroHeading] = React.useState(initialSettings?.heroHeading || "");
  const [heroSubheading, setHeroSubheading] = React.useState(initialSettings?.heroSubheading || "");

  // Settings State - Section Images & Banners
  const [heroSlides, setHeroSlides] = React.useState<HeroSlideItem[]>(() => {
    if (Array.isArray(initialSettings?.bannerImages) && initialSettings.bannerImages.length > 0) {
      const valid = (initialSettings.bannerImages as { src?: string; alt?: string }[])
        .filter((s) => s && typeof s.src === "string" && s.src.trim() !== "")
        .map((s, idx) => ({
          id: `slide-${idx}-${Date.now()}`,
          src: s.src || "",
          alt: s.alt || "",
        }));
      if (valid.length > 0) return valid;
    }
    return DEFAULT_HERO_SLIDES;
  });

  const [aboutHeroImage, setAboutHeroImage] = React.useState(initialSettings?.aboutHeroImage || "");
  const [liquidTreeImage, setLiquidTreeImage] = React.useState(initialSettings?.liquidTreeImage || "");
  const [heritageCampusImage, setHeritageCampusImage] = React.useState(initialSettings?.heritageCampusImage || "");
  const [labIntroImage, setLabIntroImage] = React.useState(initialSettings?.labIntroImage || "");
  const [labLogoUrl, setLabLogoUrl] = React.useState(initialSettings?.labLogoUrl || "");
  const [labLogoWhiteUrl, setLabLogoWhiteUrl] = React.useState(initialSettings?.labLogoWhiteUrl || "");
  const [universityLogoUrl, setUniversityLogoUrl] = React.useState(initialSettings?.universityLogoUrl || "");
  const [universityLogoWhiteUrl, setUniversityLogoWhiteUrl] = React.useState(initialSettings?.universityLogoWhiteUrl || "");

  const [savingSettings, setSavingSettings] = React.useState(false);

  // Content Blocks State
  const blocks = initialBlocks;
  const [savingBlockKey, setSavingBlockKey] = React.useState<string | null>(null);

  const handleUpdateSlide = (idx: number, field: "src" | "alt", val: string) => {
    setHeroSlides((prev) => {
      const next = [...prev];
      next[idx] = { ...next[idx], [field]: val };
      return next;
    });
  };

  const handleDeleteSlide = (idx: number) => {
    if (heroSlides.length <= 1) {
      toast("The hero section should have at least one background slide.", "error");
      return;
    }
    setHeroSlides((prev) => prev.filter((_, i) => i !== idx));
    toast("Slide removed. Click 'Save Section Images' to apply changes.", "info");
  };

  const handleMoveSlide = (idx: number, direction: "up" | "down") => {
    setHeroSlides((prev) => {
      const next = [...prev];
      const targetIdx = direction === "up" ? idx - 1 : idx + 1;
      if (targetIdx < 0 || targetIdx >= next.length) return prev;
      const temp = next[idx];
      next[idx] = next[targetIdx];
      next[targetIdx] = temp;
      return next;
    });
  };

  const handleAddSlide = () => {
    setHeroSlides((prev) => [
      ...prev,
      {
        id: `slide-new-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        src: "",
        alt: "BTIB Laboratory Research Facility",
      },
    ]);
  };

  const handleResetDefaultSlides = () => {
    if (window.confirm("Reset hero background slideshow to the 5 default authentic laboratory photos?")) {
      setHeroSlides(DEFAULT_HERO_SLIDES);
      toast("Reset to 5 default laboratory slides. Click Save to persist.", "info");
    }
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingSettings(true);

    try {
      const cleanedSlides = heroSlides
        .filter((s) => Boolean(s.src && s.src.trim() !== ""))
        .map((s) => ({ src: s.src.trim(), alt: s.alt.trim() }));

      await updateSiteSettings({
        labName,
        labShortName,
        departmentName,
        institutionName,
        address,
        contactEmail,
        tagline,
        heroHeading,
        heroSubheading,
        heroBgImage: cleanedSlides[0]?.src || null,
        heroBgImageAlt: cleanedSlides[0]?.alt || null,
        bannerImages: cleanedSlides,
        aboutHeroImage: aboutHeroImage || null,
        liquidTreeImage: liquidTreeImage || null,
        heritageCampusImage: heritageCampusImage || null,
        labIntroImage: labIntroImage || null,
        labLogoUrl: labLogoUrl || null,
        labLogoWhiteUrl: labLogoWhiteUrl || null,
        universityLogoUrl: universityLogoUrl || null,
        universityLogoWhiteUrl: universityLogoWhiteUrl || null,
      });
      toast("Laboratory settings & section images saved successfully", "success");
      setSavingSettings(false);
      React.startTransition(() => {
        router.refresh();
      });
    } catch (err: unknown) {
      toast(err instanceof Error ? err.message : "Save failed", "error");
      setSavingSettings(false);
    }
  };

  const handleSaveBlock = async (key: string, title: string, text: string) => {
    setSavingBlockKey(key);

    try {
      await updateContentBlock({
        key,
        title,
        content: { text },
      });
      toast(`Block "${title}" updated`, "success");
      setSavingBlockKey(null);
      React.startTransition(() => {
        router.refresh();
      });
    } catch (err: unknown) {
      toast(err instanceof Error ? err.message : "Save failed", "error");
      setSavingBlockKey(null);
    }
  };

  // Password Change State
  const [currentPassword, setCurrentPassword] = React.useState("");
  const [newPassword, setNewPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [showCurrentPassword, setShowCurrentPassword] = React.useState(false);
  const [showNewPassword, setShowNewPassword] = React.useState(false);
  const [changingPassword, setChangingPassword] = React.useState(false);

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast("New password and confirmation do not match", "error");
      return;
    }
    if (newPassword.length < 8) {
      toast("New password must be at least 8 characters long", "error");
      return;
    }

    setChangingPassword(true);
    try {
      const res = await changePasswordAction({
        currentPassword,
        newPassword,
        confirmPassword,
      });

      if (!res.success) {
        toast(res.error || "Failed to change password", "error");
      } else {
        toast("Password updated successfully! Please keep your new credentials safe.", "success");
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      }
    } catch (err: unknown) {
      toast(err instanceof Error ? err.message : "Failed to change password", "error");
    } finally {
      setChangingPassword(false);
    }
  };

  const tabs = [
    { id: "identity", label: "Institutional Identity" },
    { id: "imagery", label: "Section Imagery & Banners" },
    { id: "copy", label: "Static Editorial Copy" },
    { id: "security", label: "Security & Credentials" },
  ];

  return (
    <div className="space-y-6">
      <div className="border-b border-[var(--border)] pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[var(--text-primary)]">
            Laboratory Configuration & Settings
          </h1>
          <p className="text-xs text-[var(--text-muted)] mt-1">
            Institutional identity lockups, coordinates, hero banner photos, and section imagery control.
          </p>
        </div>
      </div>

      <Tabs tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />

      {/* 1. Identity Tab */}
      {activeTab === "identity" && (
        <form onSubmit={handleSaveSettings} className="space-y-6 max-w-4xl">
          <Card>
            <CardHeader>
              <CardTitle>Institutional Details</CardTitle>
              <CardDescription>
                Official university department names and canonical laboratory coordinates.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-mono text-[var(--text-secondary)]">LABORATORY FULL NAME</label>
                <Input
                  required
                  value={labName}
                  onChange={(e) => setLabName(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-mono text-[var(--text-secondary)]">SHORT NAME / CODE</label>
                  <Input
                    required
                    value={labShortName}
                    onChange={(e) => setLabShortName(e.target.value)}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-mono text-[var(--text-secondary)]">CONTACT EMAIL</label>
                  <Input
                    type="email"
                    required
                    value={contactEmail}
                    onChange={(e) => setContactEmail(e.target.value)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-mono text-[var(--text-secondary)]">DEPARTMENT</label>
                  <Input
                    required
                    value={departmentName}
                    onChange={(e) => setDepartmentName(e.target.value)}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-mono text-[var(--text-secondary)]">UNIVERSITY</label>
                  <Input
                    required
                    value={institutionName}
                    onChange={(e) => setInstitutionName(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-mono text-[var(--text-secondary)]">PHYSICAL POSTAL ADDRESS</label>
                <Input
                  required
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Home Page Hero Copy</CardTitle>
              <CardDescription>
                Primary editorial headline and mission positioning shown on the home hero.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-mono text-[var(--text-secondary)]">LAB TAGLINE</label>
                <Input
                  required
                  value={tagline}
                  onChange={(e) => setTagline(e.target.value)}
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-mono text-[var(--text-secondary)]">HERO HEADLINE</label>
                <Input
                  required
                  value={heroHeading}
                  onChange={(e) => setHeroHeading(e.target.value)}
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-mono text-[var(--text-secondary)]">HERO SUBHEADING</label>
                <Textarea
                  required
                  value={heroSubheading}
                  onChange={(e) => setHeroSubheading(e.target.value)}
                />
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end">
            <Button type="submit" isLoading={savingSettings} className="gap-2">
              <Save className="w-4 h-4" />
              <span>Save Institutional Settings</span>
            </Button>
          </div>
        </form>
      )}

      {/* 2. Section Imagery & Banners Tab */}
      {activeTab === "imagery" && (
        <form onSubmit={handleSaveSettings} className="space-y-6 max-w-4xl">
          {/* 1. Homepage Hero Section Background Slideshow */}
          <Card>
            <CardHeader>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <div className="p-2.5 rounded-md bg-[var(--brand-primary)]/10 text-[var(--brand-primary)] border border-[var(--brand-primary)]/20">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <div>
                    <CardTitle>Homepage Hero Background Slideshow</CardTitle>
                    <CardDescription>
                      These high-resolution pictures crossfade automatically in the hero background. View, change, reorder, or delete any of them.
                    </CardDescription>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span className="px-2.5 py-1 rounded-md text-xs font-mono font-semibold bg-[var(--surface-raised)] border border-[var(--border)] text-[var(--bio-teal)]">
                    {heroSlides.length} {heroSlides.length === 1 ? "Slide" : "Slides"}
                  </span>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleResetDefaultSlides}
                    className="gap-1.5 text-xs text-[var(--text-muted)] hover:text-[var(--text-primary)]"
                    title="Restore original 5 lab facility photos"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Reset Defaults</span>
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    onClick={handleAddSlide}
                    className="gap-1.5 text-xs bg-[var(--brand-primary)] hover:bg-[var(--brand-primary-hover)] text-white"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Slide</span>
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                {heroSlides.map((slide, idx) => (
                  <div
                    key={slide.id}
                    className="p-4 rounded-md border border-[var(--border)] bg-[var(--surface-raised)] space-y-4 transition-all hover:border-[var(--brand-primary)]/40 shadow-xs"
                  >
                    {/* Slide Header Toolbar */}
                    <div className="flex items-center justify-between pb-2 border-b border-[var(--border)]">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-[var(--surface)] text-[var(--brand-primary)] border border-[var(--border)]">
                          SLIDE 0{idx + 1}
                        </span>
                        {idx === 0 && (
                          <span className="px-2 py-0.5 rounded text-[10px] font-mono text-[var(--bio-teal)] bg-[var(--bio-teal)]/10 border border-[var(--bio-teal)]/20">
                            Primary Poster
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-1.5">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          disabled={idx === 0}
                          onClick={() => handleMoveSlide(idx, "up")}
                          className="h-7 w-7 p-0"
                          title="Move slide up"
                        >
                          <ArrowUp className="w-3.5 h-3.5" />
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          disabled={idx === heroSlides.length - 1}
                          onClick={() => handleMoveSlide(idx, "down")}
                          className="h-7 w-7 p-0"
                          title="Move slide down"
                        >
                          <ArrowDown className="w-3.5 h-3.5" />
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteSlide(idx)}
                          className="h-7 w-7 p-0 text-red-500 hover:text-red-600 hover:bg-red-500/10 border-red-500/30"
                          title="Delete this slide"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    </div>

                    {/* Slide Body: Thumbnail Preview + Controls */}
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-start">
                      {/* Thumbnail Preview */}
                      <div className="md:col-span-4">
                        <div className="relative aspect-[16/10] w-full rounded-md overflow-hidden border border-[var(--border)] bg-black/20 group">
                          {slide.src ? (
                            <>
                              <Image
                                src={slide.src}
                                alt={slide.alt || `Hero slide ${idx + 1}`}
                                fill
                                sizes="(max-width: 768px) 100vw, 300px"
                                className="object-cover"
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-2">
                                <span className="text-[10px] font-mono text-white truncate">
                                  {slide.src}
                                </span>
                              </div>
                            </>
                          ) : (
                            <div className="flex flex-col items-center justify-center h-full text-[var(--text-muted)] text-xs p-4 text-center">
                              <ImageIcon className="w-8 h-8 mb-1 opacity-40" />
                              <span>No image chosen yet</span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Inputs & MediaPicker */}
                      <div className="md:col-span-8 space-y-3">
                        <MediaPicker
                          label="Background Photo (Upload or Select from Media Library)"
                          value={slide.src}
                          onChange={(newUrl) => handleUpdateSlide(idx, "src", newUrl)}
                          folder="banners"
                        />

                        <div className="space-y-1">
                          <label className="text-xs font-mono text-[var(--text-secondary)]">
                            ALT TEXT / DESCRIPTION (FOR ACCESSIBILITY &amp; SEO)
                          </label>
                          <Input
                            value={slide.alt}
                            onChange={(e) => handleUpdateSlide(idx, "alt", e.target.value)}
                            placeholder="e.g. Bioresources Technology and Industrial Biotechnology Laboratory Cleanroom Suite"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-2 flex justify-center">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleAddSlide}
                  className="gap-2 border-dashed border-[var(--border)] hover:border-[var(--brand-primary)]"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Another Slide to Hero Slideshow</span>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Key Feature Banners */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <ImageIcon className="w-4 h-4 text-[var(--brand-primary)]" />
                <CardTitle>Page Banners &amp; Feature Pictures</CardTitle>
              </div>
              <CardDescription>
                Control individual section photos across the About page, Liquid-Tree feature, and Campus heritage sections.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* About Page Facility Banner */}
                <div className="space-y-3 p-4 rounded-md border border-[var(--border)] bg-[var(--surface-raised)]">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold font-sans uppercase tracking-wide text-[var(--text-primary)]">
                      About Page Facility Banner
                    </h4>
                    {aboutHeroImage && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => setAboutHeroImage("")}
                        className="h-6 px-2 text-[10px] text-red-500 hover:text-red-600 hover:bg-red-500/10"
                      >
                        <X className="w-3 h-3 mr-1" />
                        Clear
                      </Button>
                    )}
                  </div>
                  {aboutHeroImage && (
                    <div className="relative aspect-[21/9] w-full rounded-md overflow-hidden border border-[var(--border)] bg-black/20">
                      <Image src={aboutHeroImage} alt="About facility banner preview" fill className="object-cover" />
                    </div>
                  )}
                  <p className="text-[11px] text-[var(--text-muted)]">
                    Displayed on the About page overview header and history section.
                  </p>
                  <MediaPicker
                    label="Facility / Cleanroom Picture"
                    value={aboutHeroImage}
                    onChange={setAboutHeroImage}
                    folder="facilities"
                  />
                </div>

                {/* Liquid-Tree Photobioreactor Banner */}
                <div className="space-y-3 p-4 rounded-md border border-[var(--border)] bg-[var(--surface-raised)]">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold font-sans uppercase tracking-wide text-[var(--text-primary)]">
                      Liquid-Tree Photobioreactor Banner
                    </h4>
                    {liquidTreeImage && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => setLiquidTreeImage("")}
                        className="h-6 px-2 text-[10px] text-red-500 hover:text-red-600 hover:bg-red-500/10"
                      >
                        <X className="w-3 h-3 mr-1" />
                        Clear
                      </Button>
                    )}
                  </div>
                  {liquidTreeImage && (
                    <div className="relative aspect-[21/9] w-full rounded-md overflow-hidden border border-[var(--border)] bg-black/20">
                      <Image src={liquidTreeImage} alt="Liquid-Tree banner preview" fill className="object-cover" />
                    </div>
                  )}
                  <p className="text-[11px] text-[var(--text-muted)]">
                    Displayed on the flagship 250L urban microalgae innovation banners.
                  </p>
                  <MediaPicker
                    label="Liquid-Tree Column Picture"
                    value={liquidTreeImage}
                    onChange={setLiquidTreeImage}
                    folder="innovations"
                  />
                </div>

                {/* Campus Heritage Picture */}
                <div className="space-y-3 p-4 rounded-md border border-[var(--border)] bg-[var(--surface-raised)]">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold font-sans uppercase tracking-wide text-[var(--text-primary)]">
                      Campus Heritage Picture
                    </h4>
                    {heritageCampusImage && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => setHeritageCampusImage("")}
                        className="h-6 px-2 text-[10px] text-red-500 hover:text-red-600 hover:bg-red-500/10"
                      >
                        <X className="w-3 h-3 mr-1" />
                        Clear
                      </Button>
                    )}
                  </div>
                  {heritageCampusImage && (
                    <div className="relative aspect-[21/9] w-full rounded-md overflow-hidden border border-[var(--border)] bg-black/20">
                      <Image src={heritageCampusImage} alt="Campus heritage picture preview" fill className="object-cover" />
                    </div>
                  )}
                  <p className="text-[11px] text-[var(--text-muted)]">
                    Displayed on university heritage &amp; institutional context sections.
                  </p>
                  <MediaPicker
                    label="Jahangirnagar Campus Picture"
                    value={heritageCampusImage}
                    onChange={setHeritageCampusImage}
                    folder="campus"
                  />
                </div>

                {/* Lab Intro / Mission Banner */}
                <div className="space-y-3 p-4 rounded-md border border-[var(--border)] bg-[var(--surface-raised)]">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold font-sans uppercase tracking-wide text-[var(--text-primary)]">
                      Lab Intro / Mission Banner
                    </h4>
                    {labIntroImage && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => setLabIntroImage("")}
                        className="h-6 px-2 text-[10px] text-red-500 hover:text-red-600 hover:bg-red-500/10"
                      >
                        <X className="w-3 h-3 mr-1" />
                        Clear
                      </Button>
                    )}
                  </div>
                  {labIntroImage && (
                    <div className="relative aspect-[21/9] w-full rounded-md overflow-hidden border border-[var(--border)] bg-black/20">
                      <Image src={labIntroImage} alt="Lab intro picture preview" fill className="object-cover" />
                    </div>
                  )}
                  <p className="text-[11px] text-[var(--text-muted)]">
                    Displayed on the &ldquo;From Bioresource to Bioproduct&rdquo; overview cards.
                  </p>
                  <MediaPicker
                    label="Lab Overview Picture"
                    value={labIntroImage}
                    onChange={setLabIntroImage}
                    folder="lab"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Institutional Logos Control */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Building2 className="w-4 h-4 text-[var(--brand-primary)]" />
                <CardTitle>Institutional Brand Logos</CardTitle>
              </div>
              <CardDescription>
                Customize laboratory and university brand logos used in navigation header, footer, and hero.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3 p-4 rounded-md border border-[var(--border)] bg-[var(--surface-raised)]">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold font-sans uppercase tracking-wide text-[var(--text-primary)]">
                      BTIB Laboratory Logo
                    </h4>
                    {(labLogoUrl || labLogoWhiteUrl) && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setLabLogoUrl("");
                          setLabLogoWhiteUrl("");
                        }}
                        className="h-6 px-2 text-[10px] text-red-500 hover:text-red-600 hover:bg-red-500/10"
                      >
                        <X className="w-3 h-3 mr-1" />
                        Clear Both
                      </Button>
                    )}
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 rounded-md border border-[var(--border)] bg-[var(--surface)] flex flex-col items-center justify-center min-h-[70px]">
                      {labLogoUrl ? (
                        <div className="relative h-10 w-full">
                          <Image src={labLogoUrl} alt="Lab logo standard preview" fill className="object-contain" />
                        </div>
                      ) : (
                        <span className="text-[10px] text-[var(--text-muted)]">No Standard Logo</span>
                      )}
                    </div>
                    <div className="p-3 rounded-md border border-slate-700 bg-slate-900 flex flex-col items-center justify-center min-h-[70px]">
                      {labLogoWhiteUrl ? (
                        <div className="relative h-10 w-full">
                          <Image src={labLogoWhiteUrl} alt="Lab logo white preview" fill className="object-contain" />
                        </div>
                      ) : (
                        <span className="text-[10px] text-slate-400">No White Logo</span>
                      )}
                    </div>
                  </div>
                  <MediaPicker
                    label="Dark Theme / Standard Logo"
                    value={labLogoUrl}
                    onChange={setLabLogoUrl}
                    folder="branding"
                  />
                  <MediaPicker
                    label="Light Theme / White Logo (Hero &amp; Dark Footer)"
                    value={labLogoWhiteUrl}
                    onChange={setLabLogoWhiteUrl}
                    folder="branding"
                  />
                </div>

                <div className="space-y-3 p-4 rounded-md border border-[var(--border)] bg-[var(--surface-raised)]">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold font-sans uppercase tracking-wide text-[var(--text-primary)]">
                      Jahangirnagar University Logo
                    </h4>
                    {(universityLogoUrl || universityLogoWhiteUrl) && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setUniversityLogoUrl("");
                          setUniversityLogoWhiteUrl("");
                        }}
                        className="h-6 px-2 text-[10px] text-red-500 hover:text-red-600 hover:bg-red-500/10"
                      >
                        <X className="w-3 h-3 mr-1" />
                        Clear Both
                      </Button>
                    )}
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 rounded-md border border-[var(--border)] bg-[var(--surface)] flex flex-col items-center justify-center min-h-[70px]">
                      {universityLogoUrl ? (
                        <div className="relative h-10 w-full">
                          <Image src={universityLogoUrl} alt="University logo standard preview" fill className="object-contain" />
                        </div>
                      ) : (
                        <span className="text-[10px] text-[var(--text-muted)]">No Standard Logo</span>
                      )}
                    </div>
                    <div className="p-3 rounded-md border border-slate-700 bg-slate-900 flex flex-col items-center justify-center min-h-[70px]">
                      {universityLogoWhiteUrl ? (
                        <div className="relative h-10 w-full">
                          <Image src={universityLogoWhiteUrl} alt="University logo white preview" fill className="object-contain" />
                        </div>
                      ) : (
                        <span className="text-[10px] text-slate-400">No White Logo</span>
                      )}
                    </div>
                  </div>
                  <MediaPicker
                    label="Dark Theme / Standard Logo"
                    value={universityLogoUrl}
                    onChange={setUniversityLogoUrl}
                    folder="branding"
                  />
                  <MediaPicker
                    label="Light Theme / White Logo (Hero &amp; Dark Footer)"
                    value={universityLogoWhiteUrl}
                    onChange={setUniversityLogoWhiteUrl}
                    folder="branding"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end">
            <Button type="submit" isLoading={savingSettings} className="gap-2">
              <Save className="w-4 h-4" />
              <span>Save Section Images &amp; Banners</span>
            </Button>
          </div>
        </form>
      )}

      {/* 3. Static Copy Tab */}
      {activeTab === "copy" && (
        <div className="space-y-6 max-w-4xl">
          {blocks.map((b) => {
            const currentText =
              typeof b.content === "object" && b.content !== null && "text" in b.content
                ? String((b.content as { text: string }).text)
                : "";

            return (
              <Card key={b.key}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>{b.title}</CardTitle>
                    <span className="specimen-tag text-[10px]">{b.key}</span>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Textarea
                    defaultValue={currentText}
                    id={`text-${b.key}`}
                    className="min-h-[120px]"
                  />
                  <div className="flex justify-end">
                    <Button
                      size="sm"
                      isLoading={savingBlockKey === b.key}
                      onClick={() => {
                        const inputEl = document.getElementById(
                          `text-${b.key}`
                        ) as HTMLTextAreaElement;
                        if (inputEl) {
                          handleSaveBlock(b.key, b.title, inputEl.value);
                        }
                      }}
                      className="gap-1.5"
                    >
                      <Save className="w-3.5 h-3.5" />
                      <span>Update Copy</span>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* 4. Security & Credentials Tab */}
      {activeTab === "security" && (
        <form onSubmit={handleChangePassword} className="space-y-6 max-w-2xl">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-md bg-[var(--brand-primary)]/10 text-[var(--brand-primary)] border border-[var(--brand-primary)]/20">
                  <KeyRound className="w-5 h-5" />
                </div>
                <div>
                  <CardTitle>Change Administrator Password</CardTitle>
                  <CardDescription>
                    Update your account credentials. Requires entering your current password for security verification.
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-mono text-[var(--text-secondary)] font-medium">
                  CURRENT PASSWORD
                </label>
                <div className="relative">
                  <Input
                    required
                    type={showCurrentPassword ? "text" : "password"}
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="Enter current password"
                    className="pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors p-1"
                  >
                    {showCurrentPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-mono text-[var(--text-secondary)] font-medium">
                  NEW PASSWORD (MIN. 8 CHARACTERS)
                </label>
                <div className="relative">
                  <Input
                    required
                    type={showNewPassword ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter new strong password"
                    minLength={8}
                    className="pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors p-1"
                  >
                    {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-mono text-[var(--text-secondary)] font-medium">
                  CONFIRM NEW PASSWORD
                </label>
                <Input
                  required
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter new password"
                  minLength={8}
                />
              </div>

              <div className="pt-2">
                <div className="p-3.5 rounded-md bg-[var(--surface-raised)] border border-[var(--border)] text-xs text-[var(--text-muted)] space-y-1">
                  <div className="flex items-center gap-1.5 font-medium text-[var(--text-secondary)]">
                    <ShieldCheck className="w-4 h-4 text-[var(--bio-teal)]" />
                    <span>Password Security Guidelines</span>
                  </div>
                  <p className="leading-relaxed">
                    Use a strong passphrase containing uppercase, lowercase, numbers, and special symbols. When changed, your new password takes effect immediately for all subsequent logins.
                  </p>
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <Button
                  type="submit"
                  isLoading={changingPassword}
                  className="gap-2"
                >
                  <Lock className="w-4 h-4" />
                  <span>Update Password</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </form>
      )}
    </div>
  );
}
