"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { DataTable, Column } from "@/components/admin/data-table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/toast";
import {
  createResearchArea,
  updateResearchArea,
  deleteResearchArea,
} from "@/server/actions/research-areas";
import { MediaPicker } from "@/components/admin/media-picker";
import { Edit2, Trash2, Image as ImageIcon } from "lucide-react";

export interface AreaItem {
  id: string;
  title: string;
  slug: string;
  summary: string;
  glyphKey: string;
  coverImage?: string | null;
  order: number;
  published: boolean;
}

const GLYPH_OPTIONS = [
  { label: "Microbe", value: "microbe" },
  { label: "Fermenter", value: "fermenter" },
  { label: "Biomaterial", value: "biomaterial" },
  { label: "Sequence", value: "sequence" },
  { label: "Protein", value: "protein" },
  { label: "Algae", value: "algae" },
  { label: "Plasmid", value: "plasmid" },
  { label: "Nanoparticle", value: "nanoparticle" },
];

export function ResearchAreasClient({ initialData }: { initialData: AreaItem[] }) {
  const router = useRouter();
  const { toast } = useToast();
  const [data, setData] = React.useState<AreaItem[]>(initialData);
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [editingItem, setEditingItem] = React.useState<AreaItem | null>(null);

  React.useEffect(() => {
    setData(initialData);
  }, [initialData]);

  // Form State
  const [title, setTitle] = React.useState("");
  const [slug, setSlug] = React.useState("");
  const [summary, setSummary] = React.useState("");
  const [glyphKey, setGlyphKey] = React.useState("microbe");
  const [coverImage, setCoverImage] = React.useState("");
  const [order, setOrder] = React.useState(0);
  const [published, setPublished] = React.useState(true);
  const [submitting, setSubmitting] = React.useState(false);

  const handleOpenCreate = () => {
    setEditingItem(null);
    setTitle("");
    setSlug("");
    setSummary("");
    setGlyphKey("microbe");
    setCoverImage("");
    setOrder(initialData.length + 1);
    setPublished(true);
    setDialogOpen(true);
  };

  const handleOpenEdit = (item: AreaItem) => {
    setEditingItem(item);
    setTitle(item.title);
    setSlug(item.slug);
    setSummary(item.summary);
    setGlyphKey(item.glyphKey);
    setCoverImage(item.coverImage || "");
    setOrder(item.order);
    setPublished(item.published);
    setDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      if (editingItem) {
        await updateResearchArea(editingItem.id, {
          title,
          slug,
          summary,
          glyphKey,
          coverImage: coverImage || null,
          order,
          published,
        });
        toast("Research area updated successfully", "success");
      } else {
        await createResearchArea({
          title,
          slug,
          summary,
          glyphKey,
          coverImage: coverImage || null,
          order,
          published,
        });
        toast("New research area created", "success");
      }
      setDialogOpen(false);
      setSubmitting(false);
      React.startTransition(() => {
        router.refresh();
      });
    } catch (err: unknown) {
      toast(err instanceof Error ? err.message : "Operation failed", "error");
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!window.confirm(`Are you sure you want to delete "${name}"?`)) return;

    const previousData = data;
    setData((prev) => prev.filter((a) => a.id !== id));

    try {
      await deleteResearchArea(id);
      toast("Research area deleted", "success");
      React.startTransition(() => {
        router.refresh();
      });
    } catch (err: unknown) {
      setData(previousData);
      toast(err instanceof Error ? err.message : "Delete failed", "error");
    }
  };

  const columns: Column<AreaItem>[] = [
    {
      key: "title",
      header: "Title & Image",
      render: (item) => (
        <div className="flex items-center gap-3">
          {item.coverImage ? (
            <div className="w-10 h-10 rounded-lg border border-[var(--border)] overflow-hidden shrink-0 bg-[var(--surface-raised)] relative">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={item.coverImage}
                alt={item.title}
                className="w-full h-full object-cover"
              />
            </div>
          ) : (
            <div className="w-10 h-10 rounded-lg border border-[var(--border)] bg-[var(--surface-raised)] flex items-center justify-center text-[var(--text-muted)] shrink-0">
              <ImageIcon className="w-4 h-4" />
            </div>
          )}
          <div>
            <div className="font-medium text-[var(--text-primary)]">{item.title}</div>
            <div className="font-mono text-[10px] text-[var(--text-muted)]">/{item.slug}</div>
          </div>
        </div>
      ),
    },
    {
      key: "glyphKey",
      header: "Glyph",
      render: (item) => (
        <span className="specimen-tag text-[10px] uppercase font-mono">{item.glyphKey}</span>
      ),
    },
    {
      key: "order",
      header: "Order",
      render: (item) => <span className="font-mono">{item.order}</span>,
    },
    {
      key: "published",
      header: "Status",
      render: (item) =>
        item.published ? (
          <Badge variant="success">Published</Badge>
        ) : (
          <Badge variant="outline">Draft</Badge>
        ),
    },
  ];

  return (
    <div className="space-y-6">
      <DataTable
        title="Research Areas"
        description="Core multidisciplinary scientific divisions of the BTIB Laboratory."
        columns={columns}
        data={data}
        searchKey="title"
        onAdd={handleOpenCreate}
        addLabel="New Research Area"
        actions={(item) => (
          <>
            <button
              onClick={() => handleOpenEdit(item)}
              className="p-1 rounded text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-raised)]"
              title="Edit"
            >
              <Edit2 className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => handleDelete(item.id, item.title)}
              className="p-1 rounded text-[var(--danger)] hover:bg-[var(--danger-surface)]"
              title="Delete"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </>
        )}
      />

      <Dialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        size="3xl"
        title={editingItem ? "Edit Research Area" : "New Research Area"}
        description="Configure titles, summary abstract, cover photo, and laboratory glyph."
      >
        <form onSubmit={handleSubmit} className="space-y-4 max-h-[75vh] overflow-y-auto px-1">
          <div className="space-y-1">
            <label className="text-xs font-mono text-[var(--text-secondary)]">TITLE *</label>
            <Input
              required
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                if (!editingItem) {
                  setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""));
                }
              }}
              placeholder="e.g. Microbial Biotechnology"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-mono text-[var(--text-secondary)]">SLUG *</label>
            <Input
              required
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              placeholder="microbial-biotechnology"
            />
          </div>

          {/* Cover Image / Photo Picker */}
          <MediaPicker
            label="COVER IMAGE / SCIENTIFIC PHOTO"
            folder="research-areas"
            value={coverImage}
            onChange={(url) => setCoverImage(url)}
          />

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-mono text-[var(--text-secondary)]">GLYPH</label>
              <select
                className="w-full rounded border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-sm text-[var(--text-primary)] focus:outline-none"
                value={glyphKey}
                onChange={(e) => setGlyphKey(e.target.value)}
              >
                {GLYPH_OPTIONS.map((g) => (
                  <option key={g.value} value={g.value}>
                    {g.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-mono text-[var(--text-secondary)]">ORDER INDEX</label>
              <Input
                type="number"
                value={order}
                onChange={(e) => setOrder(Number(e.target.value))}
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-mono text-[var(--text-secondary)]">SUMMARY ABSTRACT *</label>
            <Textarea
              required
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              placeholder="Concise overview of research objectives and experimental focus..."
            />
          </div>

          <div className="flex items-center gap-2 pt-1">
            <input
              type="checkbox"
              id="published"
              checked={published}
              onChange={(e) => setPublished(e.target.checked)}
              className="rounded border-[var(--border)] text-[var(--bio-teal)] focus:ring-[var(--focus-ring)]"
            />
            <label htmlFor="published" className="text-xs font-mono text-[var(--text-secondary)]">
              Publish on public website
            </label>
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
              {editingItem ? "Update Area" : "Save Area"}
            </Button>
          </div>
        </form>
      </Dialog>
    </div>
  );
}
