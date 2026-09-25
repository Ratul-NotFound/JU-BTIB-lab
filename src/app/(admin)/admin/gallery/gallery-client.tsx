"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/toast";
import {
  createGalleryAlbum,
  updateGalleryAlbum,
  deleteGalleryAlbum,
  addGalleryImage,
  deleteGalleryImage,
} from "@/server/actions/gallery";
import { MediaPicker } from "@/components/admin/media-picker";
import { Edit2, Plus, Trash2 } from "lucide-react";

export interface GalleryImageRecord {
  id: string;
  url: string;
  alt: string;
  caption: string | null;
  order: number;
}

export interface GalleryAlbumRecord {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  coverImage: string | null;
  order: number;
  published: boolean;
  images: GalleryImageRecord[];
}

export function GalleryAdminClient({ initialAlbums }: { initialAlbums: GalleryAlbumRecord[] }) {
  const router = useRouter();
  const { toast } = useToast();

  const [albums, setAlbums] = React.useState<GalleryAlbumRecord[]>(initialAlbums);
  const [selectedAlbum, setSelectedAlbum] = React.useState<GalleryAlbumRecord | null>(
    initialAlbums[0] || null
  );

  // Album Modal
  const [albumModalOpen, setAlbumModalOpen] = React.useState(false);
  const [editingAlbum, setEditingAlbum] = React.useState<GalleryAlbumRecord | null>(null);
  const [albumTitle, setAlbumTitle] = React.useState("");
  const [albumSlug, setAlbumSlug] = React.useState("");
  const [albumDesc, setAlbumDesc] = React.useState("");
  const [albumCover, setAlbumCover] = React.useState("");
  const [albumPublished, setAlbumPublished] = React.useState(true);
  const [albumSubmitting, setAlbumSubmitting] = React.useState(false);

  // Image Modal
  const [imageModalOpen, setImageModalOpen] = React.useState(false);
  const [imageUrl, setImageUrl] = React.useState("");
  const [imageAlt, setImageAlt] = React.useState("");
  const [imageCaption, setImageCaption] = React.useState("");
  const [imageSubmitting, setImageSubmitting] = React.useState(false);

  const handleOpenCreateAlbum = () => {
    setEditingAlbum(null);
    setAlbumTitle("");
    setAlbumSlug("");
    setAlbumDesc("");
    setAlbumCover("");
    setAlbumPublished(true);
    setAlbumModalOpen(true);
  };

  const handleOpenEditAlbum = (album: GalleryAlbumRecord) => {
    setEditingAlbum(album);
    setAlbumTitle(album.title);
    setAlbumSlug(album.slug);
    setAlbumDesc(album.description || "");
    setAlbumCover(album.coverImage || "");
    setAlbumPublished(album.published);
    setAlbumModalOpen(true);
  };

  const handleSaveAlbum = async (e: React.FormEvent) => {
    e.preventDefault();
    setAlbumSubmitting(true);

    try {
      if (editingAlbum) {
        await updateGalleryAlbum(editingAlbum.id, {
          title: albumTitle,
          slug: albumSlug,
          description: albumDesc,
          coverImage: albumCover,
          published: albumPublished,
        });
        toast("Album updated successfully", "success");
      } else {
        await createGalleryAlbum({
          title: albumTitle,
          slug: albumSlug,
          description: albumDesc,
          coverImage: albumCover,
          published: albumPublished,
          order: albums.length + 1,
        });
        toast("Album created successfully", "success");
      }

      setAlbumModalOpen(false);
      router.refresh();
    } catch (err: unknown) {
      toast(err instanceof Error ? err.message : "Failed to save album", "error");
    } finally {
      setAlbumSubmitting(false);
    }
  };

  const handleDeleteAlbum = async (id: string) => {
    if (!confirm("Are you sure you want to delete this album and all its images?")) return;

    try {
      await deleteGalleryAlbum(id);
      toast("Album deleted", "success");
      setAlbums((prev) => prev.filter((a) => a.id !== id));
      if (selectedAlbum?.id === id) {
        setSelectedAlbum(null);
      }
      router.refresh();
    } catch (err: unknown) {
      toast(err instanceof Error ? err.message : "Failed to delete album", "error");
    }
  };

  const handleAddImage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAlbum) return;

    setImageSubmitting(true);
    try {
      await addGalleryImage({
        albumId: selectedAlbum.id,
        url: imageUrl,
        alt: imageAlt,
        caption: imageCaption || null,
        order: selectedAlbum.images.length + 1,
      });

      toast("Image added to album", "success");
      setImageModalOpen(false);
      setImageUrl("");
      setImageAlt("");
      setImageCaption("");
      router.refresh();
    } catch (err: unknown) {
      toast(err instanceof Error ? err.message : "Failed to add image", "error");
    } finally {
      setImageSubmitting(false);
    }
  };

  const handleDeleteImage = async (imageId: string) => {
    if (!confirm("Delete this image?")) return;

    try {
      await deleteGalleryImage(imageId);
      toast("Image deleted", "success");
      router.refresh();
    } catch (err: unknown) {
      toast(err instanceof Error ? err.message : "Failed to delete image", "error");
    }
  };

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[var(--border)] pb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="specimen-tag text-[10px]">REPOSITORY / MEDIA</span>
            <span className="text-xs font-mono text-[var(--bio-teal)]">GALLERY ALBUMS</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-[var(--text-primary)] mt-1">
            Photo Gallery Manager
          </h1>
          <p className="text-xs text-[var(--text-muted)] mt-1">
            Organize laboratory photography, trial albums, and documentation specimens.
          </p>
        </div>

        <Button onClick={handleOpenCreateAlbum} className="gap-2">
          <Plus className="w-4 h-4" />
          <span>New Photo Album</span>
        </Button>
      </div>

      {/* Main Grid: Albums List on Left, Active Album Images on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Albums */}
        <div className="lg:col-span-4 space-y-4">
          <h2 className="text-sm font-mono text-[var(--text-muted)] uppercase tracking-wider">
            Albums ({albums.length})
          </h2>

          <div className="space-y-2">
            {albums.map((album) => {
              const isSelected = selectedAlbum?.id === album.id;
              return (
                <div
                  key={album.id}
                  onClick={() => setSelectedAlbum(album)}
                  className={`p-4 rounded-xl border transition-all cursor-pointer flex flex-col justify-between ${
                    isSelected
                      ? "border-[var(--bio-teal)] bg-[var(--surface-raised)] shadow-xs"
                      : "border-[var(--border)] bg-[var(--surface)] hover:border-[var(--bio-teal)]/60"
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="font-semibold text-sm text-[var(--text-primary)]">
                        {album.title}
                      </h3>
                      <p className="text-xs text-[var(--text-muted)] font-mono">
                        /{album.slug} • {album.images.length} photos
                      </p>
                    </div>
                    <Badge variant={album.published ? "default" : "secondary"}>
                      {album.published ? "Live" : "Draft"}
                    </Badge>
                  </div>

                  <div className="flex items-center gap-2 pt-3 mt-3 border-t border-[var(--border)]">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleOpenEditAlbum(album);
                      }}
                      className="h-7 text-xs px-2"
                    >
                      <Edit2 className="w-3 h-3 mr-1" />
                      Edit
                    </Button>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteAlbum(album.id);
                      }}
                      className="h-7 text-xs px-2"
                    >
                      <Trash2 className="w-3 h-3 mr-1" />
                      Delete
                    </Button>
                  </div>
                </div>
              );
            })}

            {albums.length === 0 && (
              <div className="p-6 text-center rounded-xl border border-[var(--border)] bg-[var(--surface)] text-xs font-mono text-[var(--text-muted)]">
                No albums created yet. Click &quot;New Photo Album&quot; to begin.
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Photos in Selected Album */}
        <div className="lg:col-span-8 space-y-4">
          {selectedAlbum ? (
            <div className="p-6 rounded-2xl border border-[var(--border)] bg-[var(--surface)] space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[var(--border)] pb-4">
                <div>
                  <h2 className="text-lg font-bold text-[var(--text-primary)]">
                    {selectedAlbum.title}
                  </h2>
                  <p className="text-xs text-[var(--text-muted)]">
                    {selectedAlbum.description || "No description provided."}
                  </p>
                </div>

                <Button
                  onClick={() => setImageModalOpen(true)}
                  size="sm"
                  className="gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Photo to Album</span>
                </Button>
              </div>

              {/* Photos Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {selectedAlbum.images.map((img) => (
                  <div
                    key={img.id}
                    className="relative group rounded-xl border border-[var(--border)] bg-[var(--surface-raised)] overflow-hidden"
                  >
                    <div className="aspect-4/3 overflow-hidden bg-black/5 flex items-center justify-center">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={img.url}
                        alt={img.alt}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    {img.caption && (
                      <p className="p-2 text-[11px] text-[var(--text-secondary)] truncate">
                        {img.caption}
                      </p>
                    )}
                    <button
                      type="button"
                      onClick={() => handleDeleteImage(img.id)}
                      className="absolute top-2 right-2 p-1 rounded-md bg-black/60 text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                      title="Delete photo"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>

              {selectedAlbum.images.length === 0 && (
                <div className="p-12 text-center text-xs font-mono text-[var(--text-muted)] border border-dashed border-[var(--border)] rounded-xl">
                  This album has no photos yet. Click &quot;Add Photo to Album&quot; to upload or attach images.
                </div>
              )}
            </div>
          ) : (
            <div className="p-12 text-center rounded-2xl border border-[var(--border)] bg-[var(--surface)] text-xs font-mono text-[var(--text-muted)]">
              Select an album from the left to view and manage its photos.
            </div>
          )}
        </div>
      </div>

      {/* Album Create/Edit Dialog */}
      <Dialog
        open={albumModalOpen}
        onOpenChange={setAlbumModalOpen}
        title={editingAlbum ? "Edit Photo Album" : "Create New Photo Album"}
      >
        <form onSubmit={handleSaveAlbum} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-mono uppercase text-[var(--text-secondary)]">
              Album Title *
            </label>
            <Input
              required
              placeholder="e.g. Liquid-Tree Photobioreactor Deployment"
              value={albumTitle}
              onChange={(e) => {
                setAlbumTitle(e.target.value);
                if (!editingAlbum) {
                  setAlbumSlug(
                    e.target.value
                      .toLowerCase()
                      .replace(/[^a-z0-9]+/g, "-")
                      .replace(/^-|-$/g, "")
                  );
                }
              }}
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-mono uppercase text-[var(--text-secondary)]">
              URL Slug *
            </label>
            <Input
              required
              placeholder="e.g. liquid-tree-deployment"
              value={albumSlug}
              onChange={(e) => setAlbumSlug(e.target.value)}
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-mono uppercase text-[var(--text-secondary)]">
              Description
            </label>
            <Textarea
              rows={3}
              placeholder="Context regarding these documentation photos..."
              value={albumDesc}
              onChange={(e) => setAlbumDesc(e.target.value)}
            />
          </div>

          <div className="space-y-1">
            <MediaPicker
              label="Album Cover Picture (Auto-compressed)"
              value={albumCover}
              onChange={setAlbumCover}
              folder="gallery"
            />
          </div>

          <div className="flex items-center gap-2 pt-2">
            <input
              type="checkbox"
              id="albumPublished"
              checked={albumPublished}
              onChange={(e) => setAlbumPublished(e.target.checked)}
              className="rounded border-[var(--border)]"
            />
            <label htmlFor="albumPublished" className="text-xs text-[var(--text-primary)]">
              Publish Album to Public Website
            </label>
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t border-[var(--border)]">
            <Button
              type="button"
              variant="outline"
              onClick={() => setAlbumModalOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" isLoading={albumSubmitting}>
              {editingAlbum ? "Save Album Changes" : "Create Album"}
            </Button>
          </div>
        </form>
      </Dialog>

      {/* Add Image Dialog */}
      <Dialog
        open={imageModalOpen}
        onOpenChange={setImageModalOpen}
        title="Add Photo to Album"
      >
        <form onSubmit={handleAddImage} className="space-y-4">
          <div className="space-y-1">
            <MediaPicker
              label="Photo Upload (Auto-compressed to KB)"
              value={imageUrl}
              onChange={setImageUrl}
              folder="gallery"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-mono uppercase text-[var(--text-secondary)]">
              Alt Text / Title *
            </label>
            <Input
              required
              placeholder="e.g. Microalgae culture column under PAR illumination"
              value={imageAlt}
              onChange={(e) => setImageAlt(e.target.value)}
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-mono uppercase text-[var(--text-secondary)]">
              Caption (Optional)
            </label>
            <Input
              placeholder="e.g. Day 14 pneumatic kinetic observation"
              value={imageCaption}
              onChange={(e) => setImageCaption(e.target.value)}
            />
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t border-[var(--border)]">
            <Button
              type="button"
              variant="outline"
              onClick={() => setImageModalOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" isLoading={imageSubmitting}>
              Add Photo
            </Button>
          </div>
        </form>
      </Dialog>
    </div>
  );
}
