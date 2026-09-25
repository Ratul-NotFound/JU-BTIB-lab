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
import { RichTextEditor } from "@/components/admin/rich-text-editor";
import { createBlogPost, updateBlogPost, deleteBlogPost } from "@/server/actions/blog";
import { PostStatus } from "@prisma/client";
import { Edit2, Trash2 } from "lucide-react";

export interface BlogPostItem {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  bodyHtml: string;
  authorName: string;
  status: PostStatus;
  publishedAt: Date | null;
  readingTime: number;
}

export function BlogClient({ initialData }: { initialData: BlogPostItem[] }) {
  const router = useRouter();
  const { toast } = useToast();
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [editingItem, setEditingItem] = React.useState<BlogPostItem | null>(null);

  // Form State
  const [title, setTitle] = React.useState("");
  const [slug, setSlug] = React.useState("");
  const [excerpt, setExcerpt] = React.useState("");
  const [bodyHtml, setBodyHtml] = React.useState("<p></p>");
  const [authorName, setAuthorName] = React.useState("BTIB Editorial");
  const [status, setStatus] = React.useState<PostStatus>(PostStatus.DRAFT);
  const [readingTime, setReadingTime] = React.useState(3);
  const [submitting, setSubmitting] = React.useState(false);

  const handleOpenCreate = () => {
    setEditingItem(null);
    setTitle("");
    setSlug("");
    setExcerpt("");
    setBodyHtml("<p>Write article content here...</p>");
    setAuthorName("BTIB Editorial");
    setStatus(PostStatus.DRAFT);
    setReadingTime(3);
    setDialogOpen(true);
  };

  const handleOpenEdit = (item: BlogPostItem) => {
    setEditingItem(item);
    setTitle(item.title);
    setSlug(item.slug);
    setExcerpt(item.excerpt);
    setBodyHtml(item.bodyHtml);
    setAuthorName(item.authorName);
    setStatus(item.status);
    setReadingTime(item.readingTime);
    setDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      if (editingItem) {
        await updateBlogPost(editingItem.id, {
          title,
          slug,
          excerpt,
          bodyHtml,
          authorName,
          status,
          readingTime,
          tagIds: [],
        });
        toast("Article updated", "success");
      } else {
        await createBlogPost({
          title,
          slug,
          excerpt,
          bodyHtml,
          authorName,
          status,
          readingTime,
          tagIds: [],
        });
        toast("Article created", "success");
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
    if (!window.confirm(`Delete article "${name}"?`)) return;

    try {
      await deleteBlogPost(id);
      toast("Article deleted", "success");
      router.refresh();
    } catch (err: unknown) {
      toast(err instanceof Error ? err.message : "Delete failed", "error");
    }
  };

  const columns: Column<BlogPostItem>[] = [
    {
      key: "title",
      header: "Title & Excerpt",
      render: (item) => (
        <div className="space-y-0.5 max-w-md">
          <div className="font-medium text-[var(--text-primary)]">{item.title}</div>
          <div className="text-[11px] text-[var(--text-muted)] truncate">{item.excerpt}</div>
        </div>
      ),
    },
    {
      key: "status",
      header: "Status",
      render: (item) => (
        <Badge
          variant={
            item.status === "PUBLISHED"
              ? "success"
              : item.status === "SCHEDULED"
              ? "cyan"
              : "outline"
          }
        >
          {item.status}
        </Badge>
      ),
    },
    {
      key: "author",
      header: "Author",
      render: (item) => (
        <span className="font-mono text-xs text-[var(--text-muted)]">
          {item.authorName}
        </span>
      ),
    },
    {
      key: "readingTime",
      header: "Read Time",
      render: (item) => (
        <span className="font-mono text-xs text-[var(--text-muted)]">
          {item.readingTime} min
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <DataTable
        title="Articles & Lab News"
        description="Scientific breakthroughs, academic announcements, and departmental circulars."
        columns={columns}
        data={initialData}
        searchKey="title"
        onAdd={handleOpenCreate}
        addLabel="Compose Article"
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
        title={editingItem ? "Edit Article" : "Compose Article"}
        description="Rich-text editorial composition with automatic HTML sanitization."
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
              placeholder="Article headline..."
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-mono text-[var(--text-secondary)]">SLUG</label>
            <Input
              required
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              placeholder="article-headline-slug"
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-mono text-[var(--text-secondary)]">STATUS</label>
              <select
                className="w-full rounded border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-sm text-[var(--text-primary)] focus:outline-none"
                value={status}
                onChange={(e) => setStatus(e.target.value as PostStatus)}
              >
                <option value={PostStatus.DRAFT}>Draft</option>
                <option value={PostStatus.PUBLISHED}>Published</option>
                <option value={PostStatus.SCHEDULED}>Scheduled</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-mono text-[var(--text-secondary)]">AUTHOR NAME</label>
              <Input
                value={authorName}
                onChange={(e) => setAuthorName(e.target.value)}
                placeholder="BTIB Editorial"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-mono text-[var(--text-secondary)]">READ TIME (MIN)</label>
              <Input
                type="number"
                value={readingTime}
                onChange={(e) => setReadingTime(Number(e.target.value))}
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-mono text-[var(--text-secondary)]">EXCERPT / TEASER</label>
            <Textarea
              required
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              placeholder="One-to-two sentence abstract for listing cards..."
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-mono text-[var(--text-secondary)]">
              ARTICLE BODY (TIPTAP RICH TEXT)
            </label>
            <RichTextEditor
              value={bodyHtml}
              onChange={setBodyHtml}
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
              {editingItem ? "Update Post" : "Publish / Save Post"}
            </Button>
          </div>
        </form>
      </Dialog>
    </div>
  );
}
