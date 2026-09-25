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
  createEquipment,
  updateEquipment,
  deleteEquipment,
} from "@/server/actions/equipment";
import { Edit2, Trash2 } from "lucide-react";

export interface EquipmentItem {
  id: string;
  name: string;
  category: string;
  description: string | null;
  order: number;
  published: boolean;
}

export function EquipmentClient({ initialData }: { initialData: EquipmentItem[] }) {
  const router = useRouter();
  const { toast } = useToast();
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [editingItem, setEditingItem] = React.useState<EquipmentItem | null>(null);

  // Form State
  const [name, setName] = React.useState("");
  const [category, setCategory] = React.useState("Bioprocess & Fermentation");
  const [description, setDescription] = React.useState("");
  const [order, setOrder] = React.useState(0);
  const [published, setPublished] = React.useState(true);
  const [submitting, setSubmitting] = React.useState(false);

  const handleOpenCreate = () => {
    setEditingItem(null);
    setName("");
    setCategory("Bioprocess & Fermentation");
    setDescription("");
    setOrder(initialData.length + 1);
    setPublished(true);
    setDialogOpen(true);
  };

  const handleOpenEdit = (item: EquipmentItem) => {
    setEditingItem(item);
    setName(item.name);
    setCategory(item.category);
    setDescription(item.description || "");
    setOrder(item.order);
    setPublished(item.published);
    setDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      if (editingItem) {
        await updateEquipment(editingItem.id, {
          name,
          category,
          description: description || null,
          order,
          published,
        });
        toast("Equipment updated", "success");
      } else {
        await createEquipment({
          name,
          category,
          description: description || null,
          order,
          published,
        });
        toast("Equipment catalogued", "success");
      }
      setDialogOpen(false);
      router.refresh();
    } catch (err: unknown) {
      toast(err instanceof Error ? err.message : "Operation failed", "error");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string, itemName: string) => {
    if (!window.confirm(`Delete instrument "${itemName}"?`)) return;

    try {
      await deleteEquipment(id);
      toast("Equipment deleted", "success");
      router.refresh();
    } catch (err: unknown) {
      toast(err instanceof Error ? err.message : "Delete failed", "error");
    }
  };

  const columns: Column<EquipmentItem>[] = [
    {
      key: "name",
      header: "Instrument Name",
      render: (item) => (
        <div>
          <div className="font-medium text-[var(--text-primary)]">{item.name}</div>
          <div className="text-[11px] text-[var(--text-muted)] truncate max-w-sm">
            {item.description || "No specifications noted"}
          </div>
        </div>
      ),
    },
    {
      key: "category",
      header: "Division",
      render: (item) => (
        <span className="specimen-tag text-[10px]">{item.category}</span>
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
        title="Laboratory Equipment & Instrumentation"
        description="Bioreactors, analytical instruments, and molecular biology facilities."
        columns={columns}
        data={initialData}
        searchKey="name"
        onAdd={handleOpenCreate}
        addLabel="Add Equipment"
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
        title={editingItem ? "Edit Equipment" : "Catalogue New Equipment"}
        description="Instrument specifications, technical capacity, and category."
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-mono text-[var(--text-secondary)]">INSTRUMENT NAME</label>
            <Input
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. 5L Stirred Tank Bioreactor"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-mono text-[var(--text-secondary)]">CATEGORY</label>
              <Input
                required
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                placeholder="Bioprocess & Fermentation"
              />
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
            <label className="text-xs font-mono text-[var(--text-secondary)]">DESCRIPTION & SPECS</label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Operational capacity, temperature range, monitoring sensors..."
            />
          </div>

          <div className="flex items-center gap-2 pt-1">
            <input
              type="checkbox"
              id="equip-published"
              checked={published}
              onChange={(e) => setPublished(e.target.checked)}
              className="rounded border-[var(--border)] text-[var(--bio-teal)]"
            />
            <label htmlFor="equip-published" className="text-xs font-mono text-[var(--text-secondary)]">
              Display on facilities page
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
              {editingItem ? "Update Instrument" : "Save Instrument"}
            </Button>
          </div>
        </form>
      </Dialog>
    </div>
  );
}
