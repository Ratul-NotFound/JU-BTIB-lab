"use client";

import * as React from "react";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Plus } from "lucide-react";

export interface Column<T> {
  key: string;
  header: string;
  render?: (item: T) => React.ReactNode;
}

export interface DataTableProps<T> {
  title: string;
  description?: string;
  columns: Column<T>[];
  data: T[];
  searchKey?: keyof T;
  onAdd?: () => void;
  addLabel?: string;
  actions?: (item: T) => React.ReactNode;
}

export function DataTable<T extends { id: string }>({
  title,
  description,
  columns,
  data,
  searchKey,
  onAdd,
  addLabel = "Add Item",
  actions,
}: DataTableProps<T>) {
  const [search, setSearch] = React.useState("");

  const filteredData = React.useMemo(() => {
    if (!search || !searchKey) return data;
    return data.filter((item) => {
      const val = item[searchKey];
      if (typeof val === "string") {
        return val.toLowerCase().includes(search.toLowerCase());
      }
      return false;
    });
  }, [data, search, searchKey]);

  return (
    <div className="space-y-4">
      {/* Header controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-[var(--text-primary)]">
            {title}
          </h2>
          {description && (
            <p className="text-xs text-[var(--text-muted)] mt-0.5">
              {description}
            </p>
          )}
        </div>

        <div className="flex items-center gap-2">
          {searchKey && (
            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 absolute left-2.5 top-2.5 text-[var(--text-muted)]" />
              <Input
                placeholder="Search..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-8 text-xs h-9"
              />
            </div>
          )}
          {onAdd && (
            <Button onClick={onAdd} size="sm" className="shrink-0 gap-1.5">
              <Plus className="w-3.5 h-3.5" />
              <span>{addLabel}</span>
            </Button>
          )}
        </div>
      </div>

      {/* Table */}
      <Table>
        <TableHeader>
          <TableRow>
            {columns.map((col) => (
              <TableHead key={col.key}>{col.header}</TableHead>
            ))}
            {actions && <TableHead className="text-right">Actions</TableHead>}
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredData.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={columns.length + (actions ? 1 : 0)}
                className="text-center py-8 text-[var(--text-muted)] font-mono text-xs"
              >
                No records found in repository.
              </TableCell>
            </TableRow>
          ) : (
            filteredData.map((item) => (
              <TableRow key={item.id}>
                {columns.map((col) => (
                  <TableCell key={col.key}>
                    {col.render
                      ? col.render(item)
                      : String((item as Record<string, unknown>)[col.key] ?? "—")}
                  </TableCell>
                ))}
                {actions && (
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      {actions(item)}
                    </div>
                  </TableCell>
                )}
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
