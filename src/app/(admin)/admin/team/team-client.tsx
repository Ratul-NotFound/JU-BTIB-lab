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
import { createTeamMember, updateTeamMember, deleteTeamMember } from "@/server/actions/team";
import { MediaPicker } from "@/components/admin/media-picker";
import { MemberCategory } from "@prisma/client";
import { Edit2, Trash2 } from "lucide-react";

export interface TeamItem {
  id: string;
  name: string;
  slug: string;
  category: MemberCategory;
  title: string | null;
  bio: string | null;
  email: string | null;
  photoUrl: string | null;
  joinYear: number;
  leaveYear: number | null;
  interests: string[];
  order: number;
  published: boolean;
}

const CATEGORY_LABELS: Record<MemberCategory, string> = {
  PI_FACULTY: "Principal Investigator / Faculty",
  POSTDOC: "Postdoctoral Researcher",
  PHD: "Ph.D. Researcher",
  MPHIL: "M.Phil. Researcher",
  MSC: "M.Sc. Student",
  BSC_THESIS: "B.Sc. Thesis Student",
  RESEARCH_ASSISTANT: "Research Assistant",
  ALUMNI: "Lab Alumni",
};

export function TeamClient({ initialData }: { initialData: TeamItem[] }) {
  const router = useRouter();
  const { toast } = useToast();
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [editingItem, setEditingItem] = React.useState<TeamItem | null>(null);

  // Form State
  const [name, setName] = React.useState("");
  const [slug, setSlug] = React.useState("");
  const [category, setCategory] = React.useState<MemberCategory>(MemberCategory.BSC_THESIS);
  const [title, setTitle] = React.useState("");
  const [bio, setBio] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [photoUrl, setPhotoUrl] = React.useState("");
  const [interestsText, setInterestsText] = React.useState("");
  const [joinYear, setJoinYear] = React.useState(new Date().getFullYear());
  const [leaveYear, setLeaveYear] = React.useState<number | "">("");
  const [order, setOrder] = React.useState(0);
  const [published, setPublished] = React.useState(true);
  const [submitting, setSubmitting] = React.useState(false);

  const handleOpenCreate = () => {
    setEditingItem(null);
    setName("");
    setSlug("");
    setCategory(MemberCategory.BSC_THESIS);
    setTitle("");
    setBio("");
    setEmail("");
    setPhotoUrl("");
    setInterestsText("");
    setJoinYear(new Date().getFullYear());
    setLeaveYear("");
    setOrder(initialData.length + 1);
    setPublished(true);
    setDialogOpen(true);
  };

  const handleOpenEdit = (item: TeamItem) => {
    setEditingItem(item);
    setName(item.name);
    setSlug(item.slug);
    setCategory(item.category);
    setTitle(item.title || "");
    setBio(item.bio || "");
    setEmail(item.email || "");
    setPhotoUrl(item.photoUrl || "");
    setInterestsText(item.interests.join(", "));
    setJoinYear(item.joinYear);
    setLeaveYear(item.leaveYear ?? "");
    setOrder(item.order);
    setPublished(item.published);
    setDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    const interests = interestsText
      .split(",")
      .map((i) => i.trim())
      .filter(Boolean);

    try {
      if (editingItem) {
        await updateTeamMember(editingItem.id, {
          name,
          slug,
          category,
          title: title || null,
          bio: bio || null,
          email: email || null,
          photoUrl: photoUrl || null,
          interests,
          joinYear,
          leaveYear: leaveYear === "" ? null : Number(leaveYear),
          order,
          published,
        });
        toast("Team member updated", "success");
      } else {
        await createTeamMember({
          name,
          slug,
          category,
          title: title || null,
          bio: bio || null,
          email: email || null,
          photoUrl: photoUrl || null,
          interests,
          joinYear,
          leaveYear: leaveYear === "" ? null : Number(leaveYear),
          order,
          published,
        });
        toast("New team member added", "success");
      }
      setDialogOpen(false);
      router.refresh();
    } catch (err: unknown) {
      toast(err instanceof Error ? err.message : "Operation failed", "error");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string, memberName: string) => {
    if (!window.confirm(`Delete "${memberName}" from team roster?`)) return;

    try {
      await deleteTeamMember(id);
      toast("Member removed", "success");
      router.refresh();
    } catch (err: unknown) {
      toast(err instanceof Error ? err.message : "Delete failed", "error");
    }
  };

  const columns: Column<TeamItem>[] = [
    {
      key: "name",
      header: "Member Name & Title",
      render: (item) => (
        <div>
          <div className="font-medium text-[var(--text-primary)]">{item.name}</div>
          <div className="text-[11px] text-[var(--text-muted)]">{item.title || "—"}</div>
        </div>
      ),
    },
    {
      key: "category",
      header: "Category",
      render: (item) => (
        <Badge variant={item.category === "PI_FACULTY" ? "teal" : "default"}>
          {CATEGORY_LABELS[item.category] || item.category}
        </Badge>
      ),
    },
    {
      key: "email",
      header: "Email",
      render: (item) => (
        <span className="font-mono text-xs text-[var(--text-muted)]">
          {item.email || "—"}
        </span>
      ),
    },
    {
      key: "status",
      header: "Status",
      render: (item) =>
        item.published ? (
          <Badge variant="success">Active</Badge>
        ) : (
          <Badge variant="outline">Hidden</Badge>
        ),
    },
  ];

  return (
    <div className="space-y-6">
      <DataTable
        title="Team Roster"
        description="Faculty, doctoral researchers, graduate students, and alumni."
        columns={columns}
        data={initialData}
        searchKey="name"
        onAdd={handleOpenCreate}
        addLabel="Add Member"
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
              onClick={() => handleDelete(item.id, item.name)}
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
        title={editingItem ? "Edit Team Member" : "Add Team Member"}
        description="Academic position, research interests, and institutional credentials."
      >
        <form onSubmit={handleSubmit} className="space-y-4 max-h-[75vh] overflow-y-auto px-1">
          <div className="space-y-1">
            <label className="text-xs font-mono text-[var(--text-secondary)]">FULL NAME</label>
            <Input
              required
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (!editingItem) {
                  setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""));
                }
              }}
              placeholder="e.g. Dr. Mohammad Shahedur Rahman"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-mono text-[var(--text-secondary)]">SLUG</label>
            <Input
              required
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              placeholder="mohammad-shahedur-rahman"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-mono text-[var(--text-secondary)]">ROLE CATEGORY</label>
              <select
                className="w-full rounded border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-sm text-[var(--text-primary)] focus:outline-none"
                value={category}
                onChange={(e) => setCategory(e.target.value as MemberCategory)}
              >
                {Object.entries(CATEGORY_LABELS).map(([val, label]) => (
                  <option key={val} value={val}>
                    {label}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-mono text-[var(--text-secondary)]">ACADEMIC TITLE</label>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Professor / Doctoral Fellow"
              />
            </div>
          </div>

          <div className="space-y-1">
            <MediaPicker
              label="Portrait Photo (Auto-compressed to KB)"
              value={photoUrl}
              onChange={setPhotoUrl}
              folder="team"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-mono text-[var(--text-secondary)]">EMAIL</label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@bgeju.edu.bd"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-mono text-[var(--text-secondary)]">JOIN YEAR</label>
              <Input
                type="number"
                required
                value={joinYear}
                onChange={(e) => setJoinYear(Number(e.target.value))}
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-mono text-[var(--text-secondary)]">
              RESEARCH TOPICS / INTERESTS (COMMA-SEPARATED)
            </label>
            <Input
              value={interestsText}
              onChange={(e) => setInterestsText(e.target.value)}
              placeholder="Microbial Enzymes, Photobioreactors, Bioinformatics"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-mono text-[var(--text-secondary)]">BIOGRAPHY / BACKGROUND</label>
            <Textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Academic qualifications, research contributions, and background..."
            />
          </div>

          <div className="flex items-center gap-2 pt-1">
            <input
              type="checkbox"
              id="member-published"
              checked={published}
              onChange={(e) => setPublished(e.target.checked)}
              className="rounded border-[var(--border)] text-[var(--bio-teal)]"
            />
            <label htmlFor="member-published" className="text-xs font-mono text-[var(--text-secondary)]">
              Display on public team page
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
              {editingItem ? "Update Member" : "Save Member"}
            </Button>
          </div>
        </form>
      </Dialog>
    </div>
  );
}
