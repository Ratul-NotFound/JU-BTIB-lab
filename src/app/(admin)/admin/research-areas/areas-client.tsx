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
import { Edit2, Trash2 } from "lucide-react";

export interface AreaItem {
  id: string;
  title: string;
  slug: string;
  summary: string;
  glyphKey: string;
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
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [editingItem, setEditingItem] = React.useState<AreaItem | null>(null);

  // Form State
  const [title, setTitle] = React.useState("");
  const [slug, setSlug] = React.useState("");
  const [summary, setSummary] = React.useState("");
  const [glyphKey, setGlyphKey] = React.useState("microbe");
  const [order, setOrder] = React.useState(0);
  const [published, setPublished] = React.useState(true);
  const [submitting, setSubmitting] = React.useState(false);

  const handleOpenCreate = () => {
    setEditingItem(null);
    setTitle("");
    setSlug("");
    setSummary("");
    setGlyphKey("microbe");
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
          order,
          published,
        });
        toast("New research area created", "success");
      }
      setDialogOpen(false);
      router.refresh();
    } catch (err: unknown) {
      toast(err instanceof Error ? err.message : "Operation failed", "error");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!window.confirm(`Are you sure you want to delete "${name}"?`)) return;

    try {
      await deleteResearchArea(id);
      toast("Research area deleted", "success");
      router.refresh();
    } catch (err: unknown) {
      toast(err instanceof Error ? err.message : "Delete failed", "error");
    }
  };

  const columns: Column<AreaItem>[] = [
    {
      key: "title",
      header: "Title & Slug",
      render: (item) => (
        <div>
          <div className="font-medium text-[var(--text-primary)]">{item.title}</div>
          <div className="font-mono text-[10px] text-[var(--text-muted)]">/{item.slug}</div>
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
        data={initialData}
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
        title={editingItem ? "Edit Research Area" : "New Research Area"}
        description="Configure titles, summary abstract, and bespoke laboratory glyph."
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-mono text-[var(--text-secondary)]">TITLE</label>
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
            <label className="text-xs font-mono text-[var(--text-secondary)]">SLUG</label>
            <Input
              required
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              placeholder="microbial-biotechnology"
            />
          </div>

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
            <label className="text-xs font-mono text-[var(--text-secondary)]">SUMMARY ABSTRACT</label>
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
