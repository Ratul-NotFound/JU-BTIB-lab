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
import { createProject, updateProject, deleteProject } from "@/server/actions/projects";
import { ProjectStatus } from "@prisma/client";
import { Edit2, Trash2 } from "lucide-react";

export interface ProjectItem {
  id: string;
  title: string;
  slug: string;
  summary: string;
  status: ProjectStatus;
  funder: string | null;
  startYear: number;
  endYear: number | null;
  featured: boolean;
  published: boolean;
  areas?: { researchArea: { id: string; title: string } }[];
}

export function ProjectsClient({
  initialData,
  areas,
}: {
  initialData: ProjectItem[];
  areas: { id: string; title: string }[];
}) {
  const router = useRouter();
  const { toast } = useToast();
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [editingItem, setEditingItem] = React.useState<ProjectItem | null>(null);

  // Form State
  const [title, setTitle] = React.useState("");
  const [slug, setSlug] = React.useState("");
  const [summary, setSummary] = React.useState("");
  const [status, setStatus] = React.useState<ProjectStatus>(ProjectStatus.ACTIVE);
  const [funder, setFunder] = React.useState("");
  const [startYear, setStartYear] = React.useState(new Date().getFullYear());
  const [endYear, setEndYear] = React.useState<number | "">("");
  const [featured, setFeatured] = React.useState(false);
  const [published, setPublished] = React.useState(true);
  const [selectedAreaIds, setSelectedAreaIds] = React.useState<string[]>([]);
  const [submitting, setSubmitting] = React.useState(false);

  const handleOpenCreate = () => {
    setEditingItem(null);
    setTitle("");
    setSlug("");
    setSummary("");
    setStatus(ProjectStatus.ACTIVE);
    setFunder("");
    setStartYear(new Date().getFullYear());
    setEndYear("");
    setFeatured(false);
    setPublished(true);
    setSelectedAreaIds([]);
    setDialogOpen(true);
  };

  const handleOpenEdit = (item: ProjectItem) => {
    setEditingItem(item);
    setTitle(item.title);
    setSlug(item.slug);
    setSummary(item.summary);
    setStatus(item.status);
    setFunder(item.funder || "");
    setStartYear(item.startYear);
    setEndYear(item.endYear ?? "");
    setFeatured(item.featured);
    setPublished(item.published);
    setSelectedAreaIds(item.areas?.map((a) => a.researchArea.id) || []);
    setDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      if (editingItem) {
        await updateProject(editingItem.id, {
          title,
          slug,
          summary,
          status,
          funder: funder || null,
          startYear,
          endYear: endYear === "" ? null : Number(endYear),
          featured,
          published,
          areaIds: selectedAreaIds,
          teamMemberIds: [],
          order: 0,
        });
        toast("Project updated successfully", "success");
      } else {
        await createProject({
          title,
          slug,
          summary,
          status,
          funder: funder || null,
          startYear,
          endYear: endYear === "" ? null : Number(endYear),
          featured,
          published,
          areaIds: selectedAreaIds,
          teamMemberIds: [],
          order: 0,
        });
        toast("New project created successfully", "success");
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
    if (!window.confirm(`Delete project "${name}"?`)) return;

    try {
      await deleteProject(id);
      toast("Project deleted", "success");
      router.refresh();
    } catch (err: unknown) {
      toast(err instanceof Error ? err.message : "Delete failed", "error");
    }
  };

  const columns: Column<ProjectItem>[] = [
    {
      key: "title",
      header: "Project Title",
      render: (item) => (
        <div className="space-y-0.5 max-w-md">
          <div className="font-medium text-[var(--text-primary)]">{item.title}</div>
          <div className="text-[11px] text-[var(--text-muted)] truncate">{item.summary}</div>
        </div>
      ),
    },
    {
      key: "status",
      header: "Status",
      render: (item) => (
        <Badge
          variant={
            item.status === "ACTIVE"
              ? "teal"
              : item.status === "COMPLETED"
              ? "success"
              : "warning"
          }
        >
          {item.status}
        </Badge>
      ),
    },
    {
      key: "timeline",
      header: "Timeline",
      render: (item) => (
        <span className="font-mono text-xs text-[var(--text-muted)]">
          {item.startYear} — {item.endYear || "Present"}
        </span>
      ),
    },
    {
      key: "featured",
      header: "Featured",
      render: (item) =>
        item.featured ? <Badge variant="cyan">Featured</Badge> : null,
    },
  ];

  return (
    <div className="space-y-6">
      <DataTable
        title="Laboratory Projects"
        description="Active, completed, and upcoming scientific investigations and technology prototypes."
        columns={columns}
        data={initialData}
        searchKey="title"
        onAdd={handleOpenCreate}
        addLabel="New Project"
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
        title={editingItem ? "Edit Project" : "New Project"}
        description="Configure project title, timeline, funding agency, and linked research area."
      >
        <form onSubmit={handleSubmit} className="space-y-4 max-h-[75vh] overflow-y-auto px-1">
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
              placeholder="e.g. Liquid-Tree Photobioreactor"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-mono text-[var(--text-secondary)]">SLUG</label>
            <Input
              required
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              placeholder="liquid-tree-photobioreactor"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-mono text-[var(--text-secondary)]">STATUS</label>
              <select
                className="w-full rounded border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-sm text-[var(--text-primary)] focus:outline-none"
                value={status}
                onChange={(e) => setStatus(e.target.value as ProjectStatus)}
              >
                <option value={ProjectStatus.ACTIVE}>Active</option>
                <option value={ProjectStatus.COMPLETED}>Completed</option>
                <option value={ProjectStatus.UPCOMING}>Upcoming</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-mono text-[var(--text-secondary)]">FUNDER / SPONSOR</label>
              <Input
                value={funder}
                onChange={(e) => setFunder(e.target.value)}
                placeholder="e.g. MoST / EDGE / RIC JU"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-mono text-[var(--text-secondary)]">START YEAR</label>
              <Input
                type="number"
                required
                value={startYear}
                onChange={(e) => setStartYear(Number(e.target.value))}
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-mono text-[var(--text-secondary)]">END YEAR (OPTIONAL)</label>
              <Input
                type="number"
                value={endYear}
                onChange={(e) => setEndYear(e.target.value === "" ? "" : Number(e.target.value))}
                placeholder="Leave blank if active"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-mono text-[var(--text-secondary)]">RESEARCH AREA</label>
            <div className="flex flex-wrap gap-2 pt-1">
              {areas.map((a) => {
                const isSelected = selectedAreaIds.includes(a.id);
                return (
                  <button
                    key={a.id}
                    type="button"
                    onClick={() => {
                      setSelectedAreaIds(
                        isSelected
                          ? selectedAreaIds.filter((id) => id !== a.id)
                          : [...selectedAreaIds, a.id]
                      );
                    }}
                    className={`px-2 py-1 rounded text-xs border font-mono transition-colors ${
                      isSelected
                        ? "bg-[var(--bio-teal)] text-white border-[var(--bio-teal)]"
                        : "bg-[var(--surface)] text-[var(--text-secondary)] border-[var(--border)]"
                    }`}
                  >
                    {a.title}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-mono text-[var(--text-secondary)]">SUMMARY</label>
            <Textarea
              required
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              placeholder="Abstract and technological achievements..."
            />
          </div>

          <div className="flex items-center gap-6 pt-1">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="proj-featured"
                checked={featured}
                onChange={(e) => setFeatured(e.target.checked)}
                className="rounded border-[var(--border)] text-[var(--bio-teal)]"
              />
              <label htmlFor="proj-featured" className="text-xs font-mono text-[var(--text-secondary)]">
                Featured highlight
              </label>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="proj-published"
                checked={published}
                onChange={(e) => setPublished(e.target.checked)}
                className="rounded border-[var(--border)] text-[var(--bio-teal)]"
              />
              <label htmlFor="proj-published" className="text-xs font-mono text-[var(--text-secondary)]">
                Publish on site
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
              {editingItem ? "Update Project" : "Save Project"}
            </Button>
          </div>
        </form>
      </Dialog>
    </div>
  );
}
