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
  createPublication,
  updatePublication,
  deletePublication,
} from "@/server/actions/publications";
import { fetchPublicationMetadataByDoi } from "@/server/actions/doi";
import { PublicationType } from "@prisma/client";
import { Edit2, Trash2, ExternalLink, Sparkles, Loader2 } from "lucide-react";

export interface PublicationItem {
  id: string;
  title: string;
  authors: string[];
  venue: string;
  year: number;
  type: PublicationType;
  doi: string | null;
  url: string | null;
  pdfUrl: string | null;
  abstract: string | null;
  bibtex: string | null;
  featured: boolean;
  needsReview: boolean;
  published: boolean;
}

export function PublicationsClient({ initialData }: { initialData: PublicationItem[] }) {
  const router = useRouter();
  const { toast } = useToast();
  const [data, setData] = React.useState<PublicationItem[]>(initialData);
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [editingItem, setEditingItem] = React.useState<PublicationItem | null>(null);

  React.useEffect(() => {
    setData(initialData);
  }, [initialData]);

  // DOI Auto-fetch State
  const [doiQuery, setDoiQuery] = React.useState("");
  const [fetchingDoi, setFetchingDoi] = React.useState(false);

  // Form State
  const [title, setTitle] = React.useState("");
  const [authorsText, setAuthorsText] = React.useState("");
  const [venue, setVenue] = React.useState("");
  const [year, setYear] = React.useState(new Date().getFullYear());
  const [type, setType] = React.useState<PublicationType>(PublicationType.JOURNAL);
  const [doi, setDoi] = React.useState("");
  const [url, setUrl] = React.useState("");
  const [abstract, setAbstract] = React.useState("");
  const [bibtex, setBibtex] = React.useState("");
  const [featured, setFeatured] = React.useState(false);
  const [needsReview, setNeedsReview] = React.useState(false);
  const [published, setPublished] = React.useState(true);
  const [submitting, setSubmitting] = React.useState(false);

  const handleOpenCreate = () => {
    setEditingItem(null);
    setDoiQuery("");
    setTitle("");
    setAuthorsText("Mohammad Shahedur Rahman");
    setVenue("");
    setYear(new Date().getFullYear());
    setType(PublicationType.JOURNAL);
    setDoi("");
    setUrl("");
    setAbstract("");
    setBibtex("");
    setFeatured(false);
    setNeedsReview(false);
    setPublished(true);
    setDialogOpen(true);
  };

  const handleOpenEdit = (item: PublicationItem) => {
    setEditingItem(item);
    setDoiQuery(item.doi || "");
    setTitle(item.title);
    setAuthorsText(item.authors.join(", "));
    setVenue(item.venue);
    setYear(item.year);
    setType(item.type);
    setDoi(item.doi || "");
    setUrl(item.url || "");
    setAbstract(item.abstract || "");
    setBibtex(item.bibtex || "");
    setFeatured(item.featured);
    setNeedsReview(item.needsReview);
    setPublished(item.published);
    setDialogOpen(true);
  };

  const handleAutoFetchDoi = async () => {
    if (!doiQuery.trim()) {
      toast("Please enter a DOI or DOI link first", "error");
      return;
    }

    setFetchingDoi(true);
    try {
      const res = await fetchPublicationMetadataByDoi(doiQuery);
      if (res.success && res.data) {
        const meta = res.data;
        if (meta.title) setTitle(meta.title);
        if (meta.authors) setAuthorsText(meta.authors);
        if (meta.venue) setVenue(meta.venue);
        if (meta.year) setYear(meta.year);
        if (meta.type) setType(meta.type);
        if (meta.doi) setDoi(meta.doi);
        if (meta.url) setUrl(meta.url);
        if (meta.abstract) setAbstract(meta.abstract);
        toast(`Auto-filled: "${meta.title.slice(0, 40)}..."`, "success");
      } else {
        toast(res.error || "DOI not found. You can enter details manually.", "error");
      }
    } catch {
      toast("Failed to fetch DOI metadata. Please enter details manually.", "error");
    } finally {
      setFetchingDoi(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    const authors = authorsText
      .split(",")
      .map((a) => a.trim())
      .filter(Boolean);

    try {
      if (editingItem) {
        await updatePublication(editingItem.id, {
          title,
          authors,
          venue,
          year,
          type,
          doi: doi || null,
          url: url || null,
          abstract: abstract || null,
          bibtex: bibtex || null,
          featured,
          needsReview,
          published,
          areaIds: [],
          teamMemberIds: [],
        });
        toast("Publication updated", "success");
      } else {
        await createPublication({
          title,
          authors,
          venue,
          year,
          type,
          doi: doi || null,
          url: url || null,
          abstract: abstract || null,
          bibtex: bibtex || null,
          featured,
          needsReview,
          published,
          areaIds: [],
          teamMemberIds: [],
        });
        toast("New publication saved", "success");
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
    if (!window.confirm(`Delete publication "${name}"?`)) return;

    const previousData = data;
    setData((prev) => prev.filter((p) => p.id !== id));

    try {
      await deletePublication(id);
      toast("Publication deleted", "success");
      React.startTransition(() => {
        router.refresh();
      });
    } catch (err: unknown) {
      setData(previousData);
      toast(err instanceof Error ? err.message : "Delete failed", "error");
    }
  };

  const columns: Column<PublicationItem>[] = [
    {
      key: "title",
      header: "Title & Venue",
      render: (item) => (
        <div className="space-y-1 max-w-lg">
          <div className="font-medium text-[var(--text-primary)] line-clamp-2">
            {item.title}
          </div>
          <div className="text-[11px] text-[var(--text-muted)] flex items-center gap-2">
            <span>{item.venue}</span>
            <span className="font-mono">({item.year})</span>
          </div>
        </div>
      ),
    },
    {
      key: "doi",
      header: "DOI Reference",
      render: (item) =>
        item.doi ? (
          <a
            href={`https://doi.org/${item.doi}`}
            target="_blank"
            rel="noopener noreferrer"
            className="font-mono text-xs text-[var(--bio-teal)] hover:underline inline-flex items-center gap-1"
          >
            <span>{item.doi}</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        ) : (
          <span className="text-[var(--text-muted)] text-xs font-mono">—</span>
        ),
    },
    {
      key: "status",
      header: "Review Flag",
      render: (item) => (
        <div className="flex items-center gap-1.5">
          {item.needsReview ? (
            <Badge variant="warning">Needs Review</Badge>
          ) : (
            <Badge variant="teal">Verified</Badge>
          )}
          {item.featured && <Badge variant="cyan">Featured</Badge>}
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <DataTable
        title="Scholarly Publications"
        description="Peer-reviewed journal papers, conference proceedings, and book chapters."
        columns={columns}
        data={data}
        searchKey="title"
        onAdd={handleOpenCreate}
        addLabel="Add Publication"
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
        title={editingItem ? "Edit Publication" : "Add Publication"}
        description="Verify author order, DOI, and publication year."
      >
        <form onSubmit={handleSubmit} className="space-y-4 max-h-[75vh] overflow-y-auto px-1">
          {/* DOI Magic Auto-Fill Helper Bar */}
          <div className="p-3.5 rounded-xl border border-[var(--brand-primary)]/30 bg-[var(--brand-primary-subtle)] space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-mono font-bold text-[var(--brand-primary)] flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                <span>AUTO-FETCH METADATA VIA DOI</span>
              </label>
              <span className="text-[10px] font-mono text-[var(--text-muted)]">
                Instant fill via CrossRef / DOI.org
              </span>
            </div>

            <div className="flex gap-2">
              <Input
                value={doiQuery}
                onChange={(e) => setDoiQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAutoFetchDoi();
                  }
                }}
                placeholder="Paste DOI (e.g. 10.1016/j.biortech.2023.129400 or https://doi.org/...)"
                className="text-xs bg-[var(--surface)] border-[var(--border)]"
              />
              <Button
                type="button"
                onClick={handleAutoFetchDoi}
                disabled={fetchingDoi}
                className="shrink-0 text-xs gap-1.5 bg-[var(--brand-primary)] text-white hover:bg-[var(--brand-primary-hover)]"
              >
                {fetchingDoi ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Fetching...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Auto-Fill</span>
                  </>
                )}
              </Button>
            </div>
            <p className="text-[11px] text-[var(--text-secondary)] font-light">
              Tip: You can auto-fill via DOI, or type/adjust any field manually below if DOI is missing.
            </p>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-mono text-[var(--text-secondary)]">TITLE *</label>
            <Input
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Paper or chapter title..."
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-mono text-[var(--text-secondary)]">
              AUTHORS (COMMA-SEPARATED IN ORDER)
            </label>
            <Input
              required
              value={authorsText}
              onChange={(e) => setAuthorsText(e.target.value)}
              placeholder="Khan AW, Rahman MS, Zohora US"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-mono text-[var(--text-secondary)]">VENUE / JOURNAL</label>
              <Input
                required
                value={venue}
                onChange={(e) => setVenue(e.target.value)}
                placeholder="e.g. PLOS ONE / J Ethnopharmacol"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-mono text-[var(--text-secondary)]">YEAR</label>
              <Input
                type="number"
                required
                value={year}
                onChange={(e) => setYear(Number(e.target.value))}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-mono text-[var(--text-secondary)]">DOI</label>
              <Input
                value={doi}
                onChange={(e) => setDoi(e.target.value)}
                placeholder="10.1371/journal.pone..."
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-mono text-[var(--text-secondary)]">URL (OPTIONAL)</label>
              <Input
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://..."
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-mono text-[var(--text-secondary)]">ABSTRACT</label>
            <Textarea
              value={abstract}
              onChange={(e) => setAbstract(e.target.value)}
              placeholder="Abstract text..."
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-mono text-[var(--text-secondary)]">BIBTEX ENTRY</label>
            <Textarea
              value={bibtex}
              onChange={(e) => setBibtex(e.target.value)}
              placeholder="@article{...}"
              className="font-mono text-xs"
            />
          </div>

          <div className="flex items-center gap-6 pt-1">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="pub-featured"
                checked={featured}
                onChange={(e) => setFeatured(e.target.checked)}
                className="rounded border-[var(--border)] text-[var(--bio-teal)]"
              />
              <label htmlFor="pub-featured" className="text-xs font-mono text-[var(--text-secondary)]">
                Featured publication
              </label>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="pub-review"
                checked={needsReview}
                onChange={(e) => setNeedsReview(e.target.checked)}
                className="rounded border-[var(--border)] text-[var(--warning)]"
              />
              <label htmlFor="pub-review" className="text-xs font-mono text-[var(--text-secondary)]">
                Mark as &ldquo;Needs Review&rdquo;
              </label>
            </div>
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
              {editingItem ? "Update Publication" : "Save Publication"}
            </Button>
          </div>
        </form>
      </Dialog>
    </div>
  );
}
