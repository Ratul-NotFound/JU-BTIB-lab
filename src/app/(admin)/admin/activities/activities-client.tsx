"use client";

import * as React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { DataTable, Column } from "@/components/admin/data-table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/toast";
import { MediaPicker } from "@/components/admin/media-picker";
import {
  createActivity,
  updateActivity,
  deleteActivity,
} from "@/server/actions/activities";
import { ActivityType } from "@prisma/client";
import { Edit2, ImageIcon, Trash2 } from "lucide-react";

export interface ActivityItem {
  id: string;
  slug: string;
  type: ActivityType;
  title: string;
  date: Date;
  location: string | null;
  bodyHtml: string | null;
  coverImage: string | null;
  published: boolean;
}

const PRESET_IMAGES = [
  { label: "Liquid Tree (Photobioreactor)", url: "/images/liquid-tree.jpg" },
  { label: "Fermentation & HPLC Lab", url: "/images/fermentation.jpg" },
  { label: "Cleanroom Pilot Facility", url: "/images/facilities/cleanroom-pilot.jpg" },
  { label: "Field Sampling Expedition", url: "/images/hero-lab.jpg" },
  { label: "Tubular Photobioreactor", url: "/images/photobioreactor-tubular.jpg" },
  { label: "JU Campus Lake", url: "/images/ju-lake.jpg" },
];

export function ActivitiesClient({ initialData }: { initialData: ActivityItem[] }) {
  const router = useRouter();
  const { toast } = useToast();
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [editingItem, setEditingItem] = React.useState<ActivityItem | null>(null);

  // Form State
  const [title, setTitle] = React.useState("");
  const [slug, setSlug] = React.useState("");
  const [type, setType] = React.useState<ActivityType>(ActivityType.SEMINAR);
  const [dateStr, setDateStr] = React.useState(new Date().toISOString().split("T")[0]);
  const [location, setLocation] = React.useState("");
  const [bodyHtml, setBodyHtml] = React.useState("");
  const [coverImage, setCoverImage] = React.useState("");
  const [published, setPublished] = React.useState(true);
  const [submitting, setSubmitting] = React.useState(false);

  const handleOpenCreate = () => {
    setEditingItem(null);
    setTitle("");
    setSlug("");
    setType(ActivityType.SEMINAR);
    setDateStr(new Date().toISOString().split("T")[0]);
    setLocation("JU Department of BGE");
    setBodyHtml("");
    setCoverImage("/images/liquid-tree.jpg");
    setPublished(true);
    setDialogOpen(true);
  };

  const handleOpenEdit = (item: ActivityItem) => {
    setEditingItem(item);
    setTitle(item.title);
    setSlug(item.slug);
    setType(item.type);
    setDateStr(new Date(item.date).toISOString().split("T")[0]);
    setLocation(item.location || "");
    setBodyHtml(item.bodyHtml || "");
    setCoverImage(item.coverImage || "");
    setPublished(item.published);
    setDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      if (editingItem) {
        await updateActivity(editingItem.id, {
          title,
          slug,
          type,
          date: new Date(dateStr),
          location: location || null,
          bodyHtml: bodyHtml || null,
          coverImage: coverImage || null,
          published,
        });
        toast("Activity updated successfully", "success");
      } else {
        await createActivity({
          title,
          slug,
          type,
          date: new Date(dateStr),
          location: location || null,
          bodyHtml: bodyHtml || null,
          coverImage: coverImage || null,
          published,
        });
        toast("New activity catalogued successfully", "success");
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
    if (!window.confirm(`Delete activity "${name}"?`)) return;

    try {
      await deleteActivity(id);
      toast("Activity deleted", "success");
      router.refresh();
    } catch (err: unknown) {
      toast(err instanceof Error ? err.message : "Delete failed", "error");
    }
  };

  const columns: Column<ActivityItem>[] = [
    {
      key: "coverImage",
      header: "Picture",
      render: (item) => (
        <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-[var(--surface-raised)] border border-[var(--border)] shrink-0">
          {item.coverImage ? (
            <Image
              src={item.coverImage}
              alt={item.title}
              fill
              className="object-cover"
              sizes="48px"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-[var(--text-muted)]">
              <ImageIcon className="w-4 h-4 opacity-40" />
            </div>
          )}
        </div>
      ),
    },
    {
      key: "title",
      header: "Title & Venue",
      render: (item) => (
        <div>
          <div className="font-semibold text-sm text-[var(--text-primary)]">{item.title}</div>
          <div className="text-xs text-[var(--text-muted)]">{item.location || "On-Campus"}</div>
        </div>
      ),
    },
    {
      key: "type",
      header: "Type",
      render: (item) => <Badge variant="teal">{item.type}</Badge>,
    },
    {
      key: "date",
      header: "Date",
      render: (item) => (
        <span className="text-xs text-[var(--text-muted)] font-medium">
          {new Date(item.date).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
          })}
        </span>
      ),
    },
    {
      key: "status",
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
        title="Laboratory Activities & Events"
        description="Seminars, workshops, national conferences, academic visits, and honors."
        columns={columns}
        data={initialData}
        searchKey="title"
        onAdd={handleOpenCreate}
        addLabel="Add Activity"
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
        title={editingItem ? "Edit Activity" : "Catalogue Activity"}
        description="Event type, cover picture, schedule date, location, and briefing."
      >
        <form onSubmit={handleSubmit} className="space-y-5 max-h-[80vh] overflow-y-auto pr-1">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-[var(--text-secondary)]">EVENT TITLE</label>
            <Input
              required
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                if (!editingItem) {
                  setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""));
                }
              }}
              placeholder="e.g. Workshop on Bioprocess Fermentation & Kinetics"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-[var(--text-secondary)]">SLUG</label>
            <Input
              required
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              placeholder="workshop-bioprocess-kinetics"
            />
          </div>

          {/* Picture / Cover Image Feature */}
          <div className="space-y-2 p-3.5 rounded-xl border border-[var(--border)] bg-[var(--surface-raised)]/50">
            <MediaPicker
              label="Activity Cover Picture"
              value={coverImage}
              onChange={setCoverImage}
            />

            {/* Quick Presets for Lab Images */}
            <div className="pt-2">
              <p className="text-[11px] text-[var(--text-muted)] font-medium mb-1.5">
                Or select from lab photo library:
              </p>
              <div className="flex flex-wrap gap-1.5">
                {PRESET_IMAGES.map((p) => (
                  <button
                    key={p.url}
                    type="button"
                    onClick={() => setCoverImage(p.url)}
                    className={`px-2.5 py-1 rounded-md text-[11px] font-medium border transition-colors ${
                      coverImage === p.url
                        ? "border-[var(--brand-primary)] bg-[var(--brand-primary)] text-white"
                        : "border-[var(--border)] bg-[var(--surface)] text-[var(--text-secondary)] hover:border-[var(--brand-primary)]"
                    }`}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[var(--text-secondary)]">TYPE</label>
              <select
                className="w-full rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-sm text-[var(--text-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--brand-primary)]"
                value={type}
                onChange={(e) => setType(e.target.value as ActivityType)}
              >
                <option value={ActivityType.SEMINAR}>Seminar</option>
                <option value={ActivityType.WORKSHOP}>Workshop</option>
                <option value={ActivityType.CONFERENCE}>Conference</option>
                <option value={ActivityType.TRAINING}>Training</option>
                <option value={ActivityType.VISIT}>Visit</option>
                <option value={ActivityType.ACHIEVEMENT}>Achievement</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[var(--text-secondary)]">EVENT DATE</label>
              <Input
                type="date"
                required
                value={dateStr}
                onChange={(e) => setDateStr(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-[var(--text-secondary)]">LOCATION / VENUE</label>
            <Input
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Department of Biotechnology & Genetic Engineering, JU"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-[var(--text-secondary)]">BRIEF DESCRIPTION</label>
            <Textarea
              value={bodyHtml}
              onChange={(e) => setBodyHtml(e.target.value)}
              rows={4}
              placeholder="Summary of presentations, keynote speakers, outcomes..."
            />
          </div>

          <div className="flex items-center gap-2 pt-1">
            <input
              type="checkbox"
              id="act-published"
              checked={published}
              onChange={(e) => setPublished(e.target.checked)}
              className="rounded border-[var(--border)] text-[var(--brand-primary)] focus:ring-[var(--brand-primary)]"
            />
            <label htmlFor="act-published" className="text-xs text-[var(--text-secondary)] font-medium">
              Publish on public activities timeline
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
              {editingItem ? "Update Activity" : "Save Activity"}
            </Button>
          </div>
        </form>
      </Dialog>
    </div>
  );
}
