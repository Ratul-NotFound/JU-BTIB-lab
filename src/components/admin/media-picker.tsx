"use client";

import * as React from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog } from "@/components/ui/dialog";
import {
  CheckCircle2,
  FileCheck,
  Link as LinkIcon,
  Loader2,
  Sparkles,
  UploadCloud,
  X,
} from "lucide-react";

export interface MediaPickerProps {
  value?: string | null;
  onChange: (url: string) => void;
  label?: string;
  folder?: string;
}

const LAB_PRESETS = [
  { label: "Liquid Tree (Photobioreactor)", url: "/images/liquid-tree.jpg" },
  { label: "Fermentation & HPLC Lab", url: "/images/fermentation.jpg" },
  { label: "Cleanroom Pilot Facility", url: "/images/facilities/cleanroom-pilot.jpg" },
  { label: "Field Sampling Expedition", url: "/images/hero-lab.jpg" },
  { label: "Tubular Photobioreactor", url: "/images/photobioreactor-tubular.jpg" },
  { label: "JU Campus Lake", url: "/images/ju-lake.jpg" },
  { label: "Bioplastics Station", url: "/images/bioplastics.jpg" },
  { label: "HPLC Analytics Unit", url: "/images/instruments/hplc.jpg" },
];

/**
 * Client-side Canvas Image Compression:
 * Scales large photos (from mobile/DSLR) to max 1600x1200 and converts to WebP.
 * Typically reduces a 5-15MB photo to 80-160 KB before transmitting.
 */
async function compressImageOnClient(
  file: File,
  maxWidth = 1600,
  maxHeight = 1200,
  quality = 0.82
): Promise<{ blob: Blob; width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = document.createElement("img");
      img.onload = () => {
        let { width, height } = img;

        if (width > maxWidth || height > maxHeight) {
          if (width / height > maxWidth / maxHeight) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          } else {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");

        if (!ctx) {
          resolve({ blob: file, width: img.width, height: img.height });
          return;
        }

        // High quality rendering
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = "high";
        ctx.drawImage(img, 0, 0, width, height);

        canvas.toBlob(
          (blob) => {
            if (blob) {
              resolve({ blob, width, height });
            } else {
              resolve({ blob: file, width: img.width, height: img.height });
            }
          },
          "image/webp",
          quality
        );
      };
      img.onerror = () => reject(new Error("Failed to load image file for compression"));
      img.src = event.target?.result as string;
    };
    reader.onerror = () => reject(new Error("Failed to read image file"));
    reader.readAsDataURL(file);
  });
}

export function MediaPicker({
  value,
  onChange,
  label = "Select or Upload Image",
  folder = "activities",
}: MediaPickerProps) {
  const [open, setOpen] = React.useState(false);
  const [activeTab, setActiveTab] = React.useState<"upload" | "presets" | "link">("upload");

  // Direct Upload State
  const [dragActive, setDragActive] = React.useState(false);
  const [uploading, setUploading] = React.useState(false);
  const [uploadProgress, setUploadProgress] = React.useState<string | null>(null);
  const [compressionMetrics, setCompressionMetrics] = React.useState<{
    originalKb: number;
    compressedKb: number;
    savedPercent: number;
  } | null>(null);
  const [uploadError, setUploadError] = React.useState<string | null>(null);

  // Link & Alt State
  const [urlInput, setUrlInput] = React.useState(value || "");
  const [altInput, setAltInput] = React.useState("");

  const fileInputRef = React.useRef<HTMLInputElement | null>(null);

  const handleClear = () => {
    setUrlInput("");
    setCompressionMetrics(null);
    onChange("");
  };

  const processAndUploadFile = async (rawFile: File) => {
    if (!rawFile.type.startsWith("image/")) {
      setUploadError("Please select a valid image file (JPEG, PNG, WebP, etc.).");
      return;
    }

    setUploading(true);
    setUploadError(null);
    setUploadProgress("Compressing image to optimal KB size...");

    try {
      const originalKb = Math.round(rawFile.size / 1024);

      // 1. Client-Side Pre-Compression via Canvas
      const { blob: compressedBlob } = await compressImageOnClient(rawFile);
      const preCompressedKb = Math.round(compressedBlob.size / 1024);

      setUploadProgress(
        `Pre-compressed: ${originalKb} KB → ${preCompressedKb} KB. Uploading to server...`
      );

      // 2. Transmit to server upload endpoint for final Sharp WebP optimization & disk persistence
      const formData = new FormData();
      formData.append(
        "file",
        new File([compressedBlob], rawFile.name.replace(/\.[^/.]+$/, ".webp"), {
          type: "image/webp",
        })
      );
      formData.append("folder", folder);
      formData.append("alt", altInput || rawFile.name.replace(/\.[^/.]+$/, ""));

      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const errJson = await res.json().catch(() => ({}));
        throw new Error(errJson.message || `Upload failed with status ${res.status}`);
      }

      const data = await res.json();

      setCompressionMetrics({
        originalKb,
        compressedKb: data.sizeKb,
        savedPercent: data.savedPercent || Math.round((1 - data.sizeKb / originalKb) * 100),
      });

      onChange(data.url);
      setUrlInput(data.url);
      setOpen(false);
    } catch (err: unknown) {
      console.error("Direct upload failed:", err);
      setUploadError(err instanceof Error ? err.message : "Failed to compress and upload image.");
    } finally {
      setUploading(false);
      setUploadProgress(null);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processAndUploadFile(e.dataTransfer.files[0]);
    }
  };

  const handleApplyLink = () => {
    if (urlInput) {
      onChange(urlInput);
      setOpen(false);
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)]">
          {label}
        </label>
        {value && (
          <button
            type="button"
            onClick={handleClear}
            className="text-[11px] font-semibold text-[var(--danger)] hover:underline flex items-center gap-1"
          >
            <X className="w-3 h-3" />
            <span>Remove</span>
          </button>
        )}
      </div>

      {/* Current Preview or Upload Button */}
      {value ? (
        <div className="relative w-full h-44 rounded-2xl border border-[var(--border)] overflow-hidden bg-[var(--surface-raised)] group shadow-xs">
          <Image
            src={value}
            alt="Selected preview"
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />

          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2 p-4">
            <Button
              type="button"
              size="sm"
              variant="secondary"
              onClick={() => setOpen(true)}
              className="gap-1.5 bg-white text-black hover:bg-neutral-100 shadow-md font-semibold"
            >
              <UploadCloud className="w-3.5 h-3.5" />
              <span>Change Image / Upload New</span>
            </Button>
            <span className="text-[11px] text-white/90 truncate max-w-xs font-mono">{value}</span>
          </div>

          {compressionMetrics && (
            <div className="absolute bottom-2 left-2 bg-emerald-600/90 backdrop-blur-md text-white text-[10px] font-semibold px-2 py-0.5 rounded-full flex items-center gap-1 shadow-sm">
              <CheckCircle2 className="w-3 h-3" />
              <span>Compressed: {compressionMetrics.compressedKb} KB ({compressionMetrics.savedPercent}% reduced)</span>
            </div>
          )}
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="w-full h-32 rounded-2xl border-2 border-dashed border-[var(--border)] hover:border-[var(--brand-primary)] bg-[var(--surface)] hover:bg-[var(--surface-raised)] transition-all flex flex-col items-center justify-center gap-2 text-[var(--text-muted)] hover:text-[var(--brand-primary)] group focus:outline-none"
        >
          <div className="w-10 h-10 rounded-full bg-[var(--surface-raised)] group-hover:bg-[var(--brand-primary)]/10 flex items-center justify-center transition-colors">
            <UploadCloud className="w-5 h-5 text-[var(--brand-primary)]" />
          </div>
          <div className="text-center">
            <p className="text-xs font-semibold text-[var(--text-primary)]">
              Direct Upload Photo (Auto-compressed to KB)
            </p>
            <p className="text-[11px] text-[var(--text-muted)]">
              Drag and drop or click to browse
            </p>
          </div>
        </button>
      )}

      {/* Main Upload / Media Dialog */}
      <Dialog
        open={open}
        onOpenChange={setOpen}
        title="Upload & Compress Laboratory Image"
        description="Directly upload local photos with automatic WebP compression to KB, or pick from existing presets."
      >
        <div className="space-y-4">
          {/* Navigation Tabs */}
          <div className="flex items-center gap-1 p-1 rounded-xl bg-[var(--surface-raised)] border border-[var(--border)]">
            <button
              type="button"
              onClick={() => setActiveTab("upload")}
              className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === "upload"
                  ? "bg-[var(--brand-primary)] text-white shadow-xs"
                  : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
              }`}
            >
              <UploadCloud className="w-3.5 h-3.5" />
              <span>Direct File Upload</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("presets")}
              className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === "presets"
                  ? "bg-[var(--brand-primary)] text-white shadow-xs"
                  : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Lab Library Presets</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("link")}
              className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === "link"
                  ? "bg-[var(--brand-primary)] text-white shadow-xs"
                  : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
              }`}
            >
              <LinkIcon className="w-3.5 h-3.5" />
              <span>Paste URL Link</span>
            </button>
          </div>

          {/* TAB 1: DIRECT FILE UPLOAD WITH COMPRESSION */}
          {activeTab === "upload" && (
            <div className="space-y-3">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    processAndUploadFile(e.target.files[0]);
                  }
                }}
              />

              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setDragActive(true);
                }}
                onDragLeave={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setDragActive(false);
                }}
                onDrop={handleDrop}
                onClick={() => !uploading && fileInputRef.current?.click()}
                className={`relative w-full h-44 rounded-2xl border-2 border-dashed transition-all flex flex-col items-center justify-center p-6 text-center cursor-pointer ${
                  dragActive
                    ? "border-[var(--brand-primary)] bg-[var(--brand-primary)]/10 scale-[1.01]"
                    : "border-[var(--border)] bg-[var(--surface-raised)]/40 hover:border-[var(--brand-primary)] hover:bg-[var(--surface-raised)]"
                }`}
              >
                {uploading ? (
                  <div className="space-y-2 flex flex-col items-center">
                    <Loader2 className="w-8 h-8 text-[var(--brand-primary)] animate-spin" />
                    <p className="text-xs font-semibold text-[var(--brand-primary)]">
                      {uploadProgress || "Compressing image to KB..."}
                    </p>
                    <p className="text-[11px] text-[var(--text-muted)]">
                      Optimizing dimensions & encoding WebP...
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2 flex flex-col items-center">
                    <div className="w-12 h-12 rounded-full bg-[var(--brand-primary)]/10 flex items-center justify-center text-[var(--brand-primary)]">
                      <UploadCloud className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-[var(--text-primary)]">
                        Click to select or drag & drop photo
                      </p>
                      <p className="text-xs text-[var(--text-secondary)] font-light mt-0.5">
                        High-res JPEG, PNG, or WebP (Auto-compressed to 70–180 KB)
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {uploadError && (
                <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 text-xs">
                  {uploadError}
                </div>
              )}

              <div className="space-y-1">
                <label className="text-xs font-semibold text-[var(--text-secondary)]">
                  OPTIONAL ACCESSIBILITY ALT TEXT
                </label>
                <Input
                  placeholder="Brief description of the photo..."
                  value={altInput}
                  onChange={(e) => setAltInput(e.target.value)}
                />
              </div>

              <div className="p-3 rounded-xl border border-[var(--border)] bg-[var(--surface)] text-[11px] text-[var(--text-secondary)] space-y-1">
                <div className="font-semibold text-[var(--text-primary)] flex items-center gap-1.5">
                  <FileCheck className="w-3.5 h-3.5 text-[var(--brand-primary)]" />
                  <span>Integrated KB Compression Engine</span>
                </div>
                <p className="text-[var(--text-muted)] font-light leading-relaxed">
                  Images are automatically scaled to a max 1600px width/height and compressed to clean WebP format before storage, preventing database overflow and disk exhaustion.
                </p>
              </div>
            </div>
          )}

          {/* TAB 2: LAB LIBRARY PRESETS */}
          {activeTab === "presets" && (
            <div className="space-y-3">
              <p className="text-xs text-[var(--text-muted)]">
                Select an existing high-definition photo from the BTIB laboratory archive:
              </p>
              <div className="grid grid-cols-2 gap-2 max-h-64 overflow-y-auto pr-1">
                {LAB_PRESETS.map((p) => {
                  const isSelected = urlInput === p.url || value === p.url;
                  return (
                    <button
                      key={p.url}
                      type="button"
                      onClick={() => {
                        onChange(p.url);
                        setUrlInput(p.url);
                        setOpen(false);
                      }}
                      className={`relative flex items-center gap-2 p-2 rounded-xl border text-left transition-all group ${
                        isSelected
                          ? "border-[var(--brand-primary)] bg-[var(--brand-primary)]/10 ring-1 ring-[var(--brand-primary)]"
                          : "border-[var(--border)] bg-[var(--surface)] hover:border-[var(--brand-primary)] hover:bg-[var(--surface-raised)]"
                      }`}
                    >
                      <div className="relative w-12 h-12 rounded-lg overflow-hidden shrink-0 bg-[var(--surface-raised)]">
                        <Image src={p.url} alt={p.label} fill className="object-cover" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-semibold text-[var(--text-primary)] truncate">
                          {p.label}
                        </p>
                        <p className="text-[10px] text-[var(--brand-primary)] font-medium">
                          Select preset →
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 3: PASTE LINK */}
          {activeTab === "link" && (
            <div className="space-y-3">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-[var(--text-secondary)]">
                  IMAGE URL OR LOCAL PATH
                </label>
                <Input
                  placeholder="/images/... or https://..."
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                />
              </div>

              {urlInput && (
                <div className="relative w-full h-36 rounded-xl border border-[var(--border)] overflow-hidden bg-[var(--surface-raised)]">
                  <Image
                    src={urlInput}
                    alt="Preview"
                    fill
                    className="object-contain"
                    onError={() => console.warn("Image load preview failed")}
                  />
                </div>
              )}

              <div className="flex justify-end pt-2">
                <Button
                  type="button"
                  size="sm"
                  disabled={!urlInput}
                  onClick={handleApplyLink}
                  className="gap-1.5"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Apply Image Link</span>
                </Button>
              </div>
            </div>
          )}

          <div className="flex justify-end pt-3 border-t border-[var(--border)]">
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={() => setOpen(false)}
            >
              Close
            </Button>
          </div>
        </div>
      </Dialog>
    </div>
  );
}
