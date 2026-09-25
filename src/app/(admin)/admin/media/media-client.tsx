"use client";

import * as React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog } from "@/components/ui/dialog";
import { useToast } from "@/components/ui/toast";
import { Upload, Plus, Trash2 } from "lucide-react";

export interface MediaItem {
  id: string;
  cloudinaryId: string;
  url: string;
  width: number;
  height: number;
  format: string;
  bytes: number;
  alt: string;
  folder: string | null;
  createdAt: Date;
}

export function MediaClient({ initialData }: { initialData: MediaItem[] }) {
  const router = useRouter();
  const { toast } = useToast();
  const [dialogOpen, setDialogOpen] = React.useState(false);

  // Form State
  const [url, setUrl] = React.useState("");
  const [alt, setAlt] = React.useState("");
  const [submitting, setSubmitting] = React.useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!alt.trim()) {
      toast("Alt text is strictly required for accessibility", "error");
      return;
    }
    setSubmitting(true);

    try {
      const res = await fetch("/api/admin/media", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url, alt }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "Failed to register media");
      }

      toast("Media asset catalogued successfully", "success");
      setDialogOpen(false);
      setUrl("");
      setAlt("");
      router.refresh();
    } catch (err: unknown) {
      toast(err instanceof Error ? err.message : "Registration failed", "error");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Delete this media asset?")) return;

    try {
      const res = await fetch(`/api/admin/media?id=${id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "Deletion guarded or blocked");
      }

      toast("Media asset removed", "success");
      router.refresh();
    } catch (err: unknown) {
      toast(err instanceof Error ? err.message : "Delete failed", "error");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[var(--border)] pb-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[var(--text-primary)]">
            Media Asset Library
          </h1>
          <p className="text-xs text-[var(--text-muted)] mt-1">
            Cloudinary-backed photographs of equipment, cultures, and laboratory personnel.
          </p>
        </div>

        <Button onClick={() => setDialogOpen(true)} size="sm" className="gap-1.5 shrink-0">
          <Plus className="w-3.5 h-3.5" />
          <span>Register Media Asset</span>
        </Button>
      </div>

      {initialData.length === 0 ? (
        <div className="p-12 text-center rounded border-2 border-dashed border-[var(--border)] bg-[var(--surface)] space-y-3">
          <Upload className="w-8 h-8 mx-auto text-[var(--text-muted)]" />
          <div className="text-sm font-medium text-[var(--text-primary)]">
            No media assets registered yet
          </div>
          <p className="text-xs text-[var(--text-muted)] max-w-sm mx-auto">
            Upload laboratory photographs to Cloudinary and register their URLs here with WCAG AA alt text.
          </p>
          <Button onClick={() => setDialogOpen(true)} size="sm" variant="outline">
            Catalogue First Photo
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {initialData.map((item) => (
            <div
              key={item.id}
              className="rounded border border-[var(--border)] bg-[var(--surface)] overflow-hidden group flex flex-col justify-between"
            >
              <div className="relative w-full aspect-square bg-[var(--surface-raised)]">
                <Image
                  src={item.url}
                  alt={item.alt}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-3 space-y-2">
                <p className="text-xs text-[var(--text-secondary)] font-medium line-clamp-2">
                  {item.alt}
                </p>
                <div className="flex items-center justify-between pt-2 border-t border-[var(--border)]">
                  <span className="font-mono text-[10px] text-[var(--text-muted)]">
                    {item.format.toUpperCase()}
                  </span>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="p-1 rounded text-[var(--danger)] hover:bg-[var(--danger-surface)]"
                    title="Delete"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Register Media Dialog */}
      <Dialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        title="Catalogue Media Asset"
        description="Every laboratory photograph requires verified alt text for accessibility."
      >
        <form onSubmit={handleRegister} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-mono text-[var(--text-secondary)]">CLOUDINARY IMAGE URL</label>
            <Input
              required
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://res.cloudinary.com/..."
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-mono text-[var(--text-secondary)]">REQUIRED ALT TEXT</label>
            <Input
              required
              value={alt}
              onChange={(e) => setAlt(e.target.value)}
              placeholder="Describe instrument, person, or experiment in photo..."
            />
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t border-[var(--border)]">
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={() => setDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" size="sm" isLoading={submitting}>
              Save to Library
            </Button>
          </div>
        </form>
      </Dialog>
    </div>
  );
}
