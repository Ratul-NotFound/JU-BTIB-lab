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
import { MediaPicker } from "@/components/admin/media-picker";
import { Edit2, Trash2, Microscope, FlaskConical, Filter } from "lucide-react";

export interface EquipmentItem {
  id: string;
  name: string;
  category: string;
  description: string | null;
  imageUrl?: string | null;
  order: number;
  published: boolean;
}

export const EQUIPMENT_DIVISIONS = [
  "Bioprocess & Fermentation",
  "Analytical Instrumentation",
  "Microscopy & Cell Imaging",
  "Molecular Biology & Electrophoresis",
  "Centrifugation & Incubation",
  "Sterilization & Cleanroom",
  "Photobioreactors & Pilot Systems",
];

export const CHEMICAL_DIVISIONS = [
  "Culture Media & Broths",
  "Buffers & Analytical Salts",
  "Fine Chemicals & Solvents",
  "Enzymes & Biochemical Substrates",
  "Antibiotics & Selective Agents",
  "Stains, Dyes & Indicators",
  "Molecular Biology Reagents",
];

export function isChemicalItem(category: string): boolean {
  const lower = category.toLowerCase();
  return (
    lower.includes("chemical") ||
    lower.includes("reagent") ||
    lower.includes("media") ||
    lower.includes("broth") ||
    lower.includes("buffer") ||
    lower.includes("solvent") ||
    lower.includes("enzyme") ||
    lower.includes("antibiotic") ||
    lower.includes("stain") ||
    lower.includes("dye") ||
    lower.includes("salt") ||
    CHEMICAL_DIVISIONS.some((d) => d.toLowerCase() === lower)
  );
}

export function EquipmentClient({ initialData }: { initialData: EquipmentItem[] }) {
  const router = useRouter();
  const { toast } = useToast();
  const [data, setData] = React.useState<EquipmentItem[]>(initialData);
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [editingItem, setEditingItem] = React.useState<EquipmentItem | null>(null);

  React.useEffect(() => {
    setData(initialData);
  }, [initialData]);

  // Active Filter Tab: "ALL" | "EQUIPMENT" | "CHEMICALS"
  const [activeTab, setActiveTab] = React.useState<"ALL" | "EQUIPMENT" | "CHEMICALS">("ALL");

  // Form State
  const [itemType, setItemType] = React.useState<"EQUIPMENT" | "CHEMICALS">("EQUIPMENT");
  const [name, setName] = React.useState("");
  const [category, setCategory] = React.useState("Bioprocess & Fermentation");
  const [customCategory, setCustomCategory] = React.useState("");
  const [isCustomCategory, setIsCustomCategory] = React.useState(false);
  const [description, setDescription] = React.useState("");
  const [imageUrl, setImageUrl] = React.useState("");
  const [order, setOrder] = React.useState(0);
  const [published, setPublished] = React.useState(true);
  const [submitting, setSubmitting] = React.useState(false);

  const equipmentCount = data.filter((i) => !isChemicalItem(i.category)).length;
  const chemicalCount = data.filter((i) => isChemicalItem(i.category)).length;

  const filteredData = React.useMemo(() => {
    if (activeTab === "EQUIPMENT") {
      return data.filter((i) => !isChemicalItem(i.category));
    }
    if (activeTab === "CHEMICALS") {
      return data.filter((i) => isChemicalItem(i.category));
    }
    return data;
  }, [data, activeTab]);

  const handleOpenCreate = (preselectedType?: "EQUIPMENT" | "CHEMICALS") => {
    const chosenType = preselectedType || (activeTab === "CHEMICALS" ? "CHEMICALS" : "EQUIPMENT");
    setEditingItem(null);
    setItemType(chosenType);
    setName("");
    setCategory(chosenType === "EQUIPMENT" ? EQUIPMENT_DIVISIONS[0] : CHEMICAL_DIVISIONS[0]);
    setIsCustomCategory(false);
    setCustomCategory("");
    setDescription("");
    setImageUrl("");
    setOrder(initialData.length + 1);
    setPublished(true);
    setDialogOpen(true);
  };

  const handleOpenEdit = (item: EquipmentItem) => {
    const isChem = isChemicalItem(item.category);
    const chosenType = isChem ? "CHEMICALS" : "EQUIPMENT";
    setEditingItem(item);
    setItemType(chosenType);
    setName(item.name);
    
    const divisions = chosenType === "EQUIPMENT" ? EQUIPMENT_DIVISIONS : CHEMICAL_DIVISIONS;
    if (divisions.includes(item.category)) {
      setCategory(item.category);
      setIsCustomCategory(false);
      setCustomCategory("");
    } else {
      setCategory("CUSTOM");
      setIsCustomCategory(true);
      setCustomCategory(item.category);
    }

    setDescription(item.description || "");
    setImageUrl(item.imageUrl || "");
    setOrder(item.order);
    setPublished(item.published);
    setDialogOpen(true);
  };

  const handleTypeChange = (type: "EQUIPMENT" | "CHEMICALS") => {
    setItemType(type);
    setIsCustomCategory(false);
    setCategory(type === "EQUIPMENT" ? EQUIPMENT_DIVISIONS[0] : CHEMICAL_DIVISIONS[0]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    const finalCategory = isCustomCategory && customCategory.trim() 
      ? customCategory.trim() 
      : category;

    try {
      if (editingItem) {
        await updateEquipment(editingItem.id, {
          name,
          category: finalCategory,
          description: description || null,
          imageUrl: imageUrl || null,
          order,
          published,
        });
        toast("Record updated successfully", "success");
      } else {
        await createEquipment({
          name,
          category: finalCategory,
          description: description || null,
          imageUrl: imageUrl || null,
          order,
          published,
        });
        toast(`${itemType === "EQUIPMENT" ? "Equipment" : "Chemical"} catalogued successfully`, "success");
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

  const handleDelete = async (id: string, itemName: string) => {
    if (!window.confirm(`Delete item "${itemName}"?`)) return;

    const previousData = data;
    setData((prev) => prev.filter((i) => i.id !== id));

    try {
      await deleteEquipment(id);
      toast("Record deleted", "success");
      React.startTransition(() => {
        router.refresh();
      });
    } catch (err: unknown) {
      setData(previousData);
      toast(err instanceof Error ? err.message : "Delete failed", "error");
    }
  };

  const columns: Column<EquipmentItem>[] = [
    {
      key: "name",
      header: "Item Name & Preview",
      render: (item) => {
        const isChem = isChemicalItem(item.category);
        return (
          <div className="flex items-center gap-3">
            {item.imageUrl ? (
              <div className="w-10 h-10 rounded border border-[var(--border)] overflow-hidden shrink-0 bg-[var(--surface-raised)] relative">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={item.imageUrl}
                  alt={item.name}
                  className="w-full h-full object-cover"
                />
              </div>
            ) : (
              <div className="w-10 h-10 rounded border border-[var(--border)] bg-[var(--surface-raised)] flex items-center justify-center text-[var(--text-muted)] shrink-0">
                {isChem ? <FlaskConical className="w-4 h-4 text-amber-500" /> : <Microscope className="w-4 h-4 text-emerald-500" />}
              </div>
            )}
            <div>
              <div className="font-medium text-[var(--text-primary)]">{item.name}</div>
              <div className="text-[11px] text-[var(--text-muted)] truncate max-w-xs sm:max-w-sm">
                {item.description || "No specifications noted"}
              </div>
            </div>
          </div>
        );
      },
    },
    {
      key: "type",
      header: "Section",
      render: (item) => {
        const isChem = isChemicalItem(item.category);
        return isChem ? (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-semibold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
            <FlaskConical className="w-3 h-3" />
            Chemical / Reagent
          </span>
        ) : (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
            <Microscope className="w-3 h-3" />
            Equipment & Instrument
          </span>
        );
      },
    },
    {
      key: "category",
      header: "Division / Subcategory",
      render: (item) => (
        <span className="specimen-tag text-[10px]">{item.category}</span>
      ),
    },
    {
      key: "order",
      header: "Order",
      render: (item) => <span className="font-mono text-xs">{item.order}</span>,
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
      {/* Top Banner & Filter Segment Switcher */}
      <div className="p-4 sm:p-6 rounded-md border border-[var(--border)] bg-[var(--surface)] shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold font-sans text-[var(--text-primary)] flex items-center gap-2.5">
              <Microscope className="w-6 h-6 text-[var(--brand-primary)]" />
              <span>Equipment & Chemicals Directory</span>
            </h1>
            <p className="text-xs sm:text-sm text-[var(--text-secondary)] mt-0.5">
              Manage laboratory equipment, analytical instrumentation, pilot bioreactors, fine chemicals, and reagents.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => handleOpenCreate("EQUIPMENT")}
              className="border-emerald-500/30 hover:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-semibold gap-1.5"
            >
              <Microscope className="w-3.5 h-3.5" />
              + Add Equipment
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => handleOpenCreate("CHEMICALS")}
              className="border-amber-500/30 hover:bg-amber-500/10 text-amber-600 dark:text-amber-400 text-xs font-semibold gap-1.5"
            >
              <FlaskConical className="w-3.5 h-3.5" />
              + Add Chemical
            </Button>
          </div>
        </div>

        {/* Segmented Filter Pills */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-[var(--border)]">
          <span className="text-[11px] font-mono text-[var(--text-muted)] flex items-center gap-1 mr-1">
            <Filter className="w-3 h-3" /> Filter View:
          </span>
          <button
            type="button"
            onClick={() => setActiveTab("ALL")}
            className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
              activeTab === "ALL"
                ? "bg-[var(--brand-primary)] text-white shadow-xs"
                : "bg-[var(--surface-raised)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
            }`}
          >
            All Items ({initialData.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("EQUIPMENT")}
            className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all flex items-center gap-1.5 ${
              activeTab === "EQUIPMENT"
                ? "bg-emerald-600 text-white shadow-xs"
                : "bg-[var(--surface-raised)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
            }`}
          >
            <Microscope className="w-3.5 h-3.5" />
            1. Laboratory Equipment & Instrumentation ({equipmentCount})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("CHEMICALS")}
            className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all flex items-center gap-1.5 ${
              activeTab === "CHEMICALS"
                ? "bg-amber-600 text-white shadow-xs"
                : "bg-[var(--surface-raised)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
            }`}
          >
            <FlaskConical className="w-3.5 h-3.5" />
            2. Chemicals & Reagents ({chemicalCount})
          </button>
        </div>
      </div>

      <DataTable
        title={
          activeTab === "EQUIPMENT"
            ? "1. Laboratory Equipment & Instrumentation"
            : activeTab === "CHEMICALS"
            ? "2. Chemicals & Reagents Inventory"
            : "All Equipment & Chemical Records"
        }
        description={`Showing ${filteredData.length} active inventory items`}
        columns={columns}
        data={filteredData}
        searchKey="name"
        onAdd={() => handleOpenCreate()}
        addLabel="Add Record"
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
        size="3xl"
        title={
          editingItem
            ? `Edit ${itemType === "EQUIPMENT" ? "Equipment" : "Chemical"}`
            : `Catalogue New ${itemType === "EQUIPMENT" ? "Equipment & Instrumentation" : "Chemical & Reagent"}`
        }
        description="Specifications, division category, photo, and laboratory availability."
      >
        <form onSubmit={handleSubmit} className="space-y-4 max-h-[75vh] overflow-y-auto px-1">
          {/* Section Switcher */}
          <div className="space-y-1.5">
            <label className="text-xs font-mono text-[var(--text-secondary)] uppercase tracking-wider block">
              PRIMARY DIRECTORY SECTION *
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleTypeChange("EQUIPMENT")}
                className={`flex items-center justify-center gap-2 p-3 rounded-md border text-xs font-bold transition-all ${
                  itemType === "EQUIPMENT"
                    ? "border-emerald-500 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 shadow-xs"
                    : "border-[var(--border)] bg-[var(--surface-raised)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                }`}
              >
                <Microscope className="w-4 h-4" />
                <span>1. Laboratory Equipment</span>
              </button>
              <button
                type="button"
                onClick={() => handleTypeChange("CHEMICALS")}
                className={`flex items-center justify-center gap-2 p-3 rounded-md border text-xs font-bold transition-all ${
                  itemType === "CHEMICALS"
                    ? "border-amber-500 bg-amber-500/10 text-amber-600 dark:text-amber-400 shadow-xs"
                    : "border-[var(--border)] bg-[var(--surface-raised)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                }`}
              >
                <FlaskConical className="w-4 h-4" />
                <span>2. Chemicals & Reagents</span>
              </button>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-mono text-[var(--text-secondary)]">
              {itemType === "EQUIPMENT" ? "INSTRUMENT / EQUIPMENT NAME *" : "CHEMICAL / REAGENT NAME *"}
            </label>
            <Input
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={
                itemType === "EQUIPMENT"
                  ? "e.g. 5L Sartorius Stirred-Tank Bioreactor"
                  : "e.g. BG-11 Microalgae Growth Medium Formulation"
              }
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-mono text-[var(--text-secondary)]">
                DIVISION / CATEGORY *
              </label>
              <select
                value={isCustomCategory ? "CUSTOM" : category}
                onChange={(e) => {
                  if (e.target.value === "CUSTOM") {
                    setIsCustomCategory(true);
                  } else {
                    setIsCustomCategory(false);
                    setCategory(e.target.value);
                  }
                }}
                className="w-full px-3 py-2 rounded-md border border-[var(--border)] bg-[var(--surface)] text-xs text-[var(--text-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--brand-primary)]"
              >
                {(itemType === "EQUIPMENT" ? EQUIPMENT_DIVISIONS : CHEMICAL_DIVISIONS).map((div) => (
                  <option key={div} value={div}>
                    {div}
                  </option>
                ))}
                <option value="CUSTOM">+ Custom Division / Subcategory...</option>
              </select>

              {isCustomCategory && (
                <div className="pt-1.5">
                  <Input
                    required
                    value={customCategory}
                    onChange={(e) => setCustomCategory(e.target.value)}
                    placeholder="Type custom division..."
                    className="text-xs"
                  />
                </div>
              )}
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

          {/* Photograph Picker */}
          <MediaPicker
            label={itemType === "EQUIPMENT" ? "INSTRUMENT PHOTOGRAPH" : "CHEMICAL / CONTAINER PHOTOGRAPH"}
            folder="instruments"
            value={imageUrl}
            onChange={(url) => setImageUrl(url)}
          />

          <div className="space-y-1">
            <label className="text-xs font-mono text-[var(--text-secondary)]">
              DESCRIPTION & TECHNICAL SPECIFICATIONS
            </label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder={
                itemType === "EQUIPMENT"
                  ? "Operational capacity, temperature control range, agitation speed, sensor loops, manufacturer..."
                  : "Purity grade (e.g. AR / HPLC Grade), CAS number, storage conditions (e.g. 4°C / -20°C), batch protocol..."
              }
              rows={3}
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
              Display on public Equipment & Chemicals page
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
              {editingItem ? "Update Record" : "Save Record"}
            </Button>
          </div>
        </form>
      </Dialog>
    </div>
  );
}
