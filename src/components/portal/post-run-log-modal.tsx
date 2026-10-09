"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Dialog } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { updateBookingPostRunLogAction } from "@/server/actions/booking";
import {
  FileCheck2,
  Clock,
  AlertCircle,
  Microscope,
  Calendar,
  Check,
} from "lucide-react";

export interface BookingToLog {
  id: string;
  equipmentName: string;
  equipmentCategory?: string;
  startTime: string | Date;
  endTime: string | Date;
  purpose: string;
  samples?: string | null;
  existingLog?: {
    id: string;
    title: string;
    actualHoursUsed: number;
    protocolSummary: string;
    observations?: string | null;
  } | null;
}

interface PostRunLogModalProps {
  booking: BookingToLog | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export function PostRunLogModal({
  booking,
  open,
  onOpenChange,
  onSuccess,
}: PostRunLogModalProps) {
  const router = useRouter();

  const [title, setTitle] = React.useState("");
  const [actualHoursUsed, setActualHoursUsed] = React.useState<number>(2);
  const [protocolSummary, setProtocolSummary] = React.useState("");
  const [observations, setObservations] = React.useState("");
  const [cleanupNotes, setCleanupNotes] = React.useState("Workstation cleaned, sanitized with 70% ethanol, and equipment powered down safely.");
  const [submitting, setSubmitting] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [successMsg, setSuccessMsg] = React.useState<string | null>(null);

  // Initialize or reset form when booking changes
  React.useEffect(() => {
    if (booking) {
      if (booking.existingLog) {
        setTitle(booking.existingLog.title || "");
        setActualHoursUsed(booking.existingLog.actualHoursUsed || 2);
        setProtocolSummary(booking.existingLog.protocolSummary || "");
        setObservations(booking.existingLog.observations || "");
      } else {
        // Derive default title and hours from scheduled duration
        const start = new Date(booking.startTime);
        const end = new Date(booking.endTime);
        const diffHours = Math.max(0.5, Math.round(((end.getTime() - start.getTime()) / (1000 * 60 * 60)) * 10) / 10);

        setTitle(`Experimental Run: ${booking.equipmentName}`);
        setActualHoursUsed(diffHours);
        setProtocolSummary(booking.purpose ? `Protocol executed for: ${booking.purpose}` : "");
        setObservations("");
      }
      setError(null);
      setSuccessMsg(null);
    }
  }, [booking]);

  if (!booking) return null;

  const startFormatted = new Date(booking.startTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  const endFormatted = new Date(booking.endTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  const dateFormatted = new Date(booking.startTime).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);
    setSubmitting(true);

    try {
      const res = await updateBookingPostRunLogAction({
        bookingId: booking.id,
        title,
        protocolSummary,
        observations,
        actualHoursUsed: Number(actualHoursUsed),
        cleanupNotes,
      });

      if (res.success) {
        setSuccessMsg(res.message || "Post-run log recorded successfully!");
        setTimeout(() => {
          onOpenChange(false);
          router.refresh();
          if (onSuccess) onSuccess();
        }, 1200);
      } else {
        setError(res.error || "Failed to save post-run log.");
      }
    } catch {
      setError("An unexpected error occurred while saving work details.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
      title="Record Post-Slot Work Log & Results"
      description="Document what you actually accomplished during this machine session for thesis supervision and permanent records."
      size="2xl"
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        {error && (
          <div className="p-3.5 rounded-md border border-red-500/30 bg-red-500/10 text-xs text-red-600 dark:text-red-400 flex items-start gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {successMsg && (
          <div className="p-3.5 rounded-md border border-emerald-500/30 bg-emerald-500/10 text-xs text-emerald-600 dark:text-emerald-400 flex items-center gap-2">
            <Check className="w-4 h-4 shrink-0" />
            <span className="font-semibold">{successMsg}</span>
          </div>
        )}

        {/* Booking Summary Box */}
        <div className="p-4 rounded-md border border-[var(--border)] bg-[var(--surface-raised)]/60 text-xs space-y-2">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[var(--border)] pb-2">
            <div className="flex items-center gap-2">
              <Microscope className="w-4 h-4 text-emerald-500" />
              <span className="font-bold text-sm text-[var(--text-primary)]">
                {booking.equipmentName}
              </span>
            </div>
            <div className="flex items-center gap-2 text-slate-500 font-mono text-[11px]">
              <Calendar className="w-3.5 h-3.5" />
              <span>{dateFormatted}</span>
              <span>•</span>
              <Clock className="w-3.5 h-3.5" />
              <span>{startFormatted} – {endFormatted}</span>
            </div>
          </div>

          <div className="text-[11px] text-[var(--text-secondary)]">
            <span className="font-mono text-[var(--text-muted)] uppercase mr-1">Initial Purpose:</span>
            <span>{booking.purpose}</span>
          </div>

          {booking.samples && (
            <div className="text-[11px] text-[var(--text-secondary)]">
              <span className="font-mono text-[var(--text-muted)] uppercase mr-1">Samples / Strains:</span>
              <span className="font-mono">{booking.samples}</span>
            </div>
          )}
        </div>

        {/* Form Fields */}
        <div className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-[var(--text-primary)] flex items-center justify-between">
              <span>Experiment Run Title *</span>
              <span className="text-[10px] font-mono text-[var(--text-muted)]">Official Logbook Name</span>
            </label>
            <Input
              type="text"
              required
              placeholder="e.g. Batch Fermentation Kinetic Sampling (OD600 & Metabolites)"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="text-xs h-9 bg-[var(--surface)]"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[var(--text-primary)] flex items-center justify-between">
                <span>Actual Machine Runtime *</span>
                <span className="text-[10px] font-mono text-[var(--text-muted)]">In Hours</span>
              </label>
              <Input
                type="number"
                step="0.1"
                min="0.1"
                required
                placeholder="e.g. 2.5"
                value={actualHoursUsed}
                onChange={(e) => setActualHoursUsed(parseFloat(e.target.value) || 0)}
                className="text-xs h-9 font-mono bg-[var(--surface)]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[var(--text-primary)]">
                Equipment Post-Use &amp; Cleanup State
              </label>
              <Input
                type="text"
                placeholder="e.g. Autoclaved, sanitized, rinsed with DI water"
                value={cleanupNotes}
                onChange={(e) => setCleanupNotes(e.target.value)}
                className="text-xs h-9 bg-[var(--surface)]"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-[var(--text-primary)] flex items-center justify-between">
              <span>Detailed Protocol &amp; What You Accomplished *</span>
              <span className="text-[10px] font-mono text-[var(--text-muted)]">Step-by-step summary</span>
            </label>
            <Textarea
              rows={3}
              required
              placeholder="Describe the exact procedures, parameter adjustments, sampling intervals, or chemical assay steps executed during this slot..."
              value={protocolSummary}
              onChange={(e) => setProtocolSummary(e.target.value)}
              className="text-xs bg-[var(--surface)]"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-[var(--text-primary)] flex items-center justify-between">
              <span>Observations, Results &amp; Analytical Findings</span>
              <span className="text-[10px] font-mono text-[var(--text-muted)]">Optional</span>
            </label>
            <Textarea
              rows={3}
              placeholder="Record quantitative values (OD600, pH, dissolved oxygen, yield percentages) or unexpected biological phenomena observed..."
              value={observations}
              onChange={(e) => setObservations(e.target.value)}
              className="text-xs bg-[var(--surface)]"
            />
          </div>
        </div>

        {/* Footer Actions */}
        <div className="pt-3 border-t border-[var(--border)] flex items-center justify-end gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="text-xs h-9 px-4 rounded-md"
            disabled={submitting}
          >
            Cancel
          </Button>

          <Button
            type="submit"
            disabled={submitting}
            className="text-xs h-9 px-5 rounded-md bg-[var(--brand-primary)] hover:bg-[var(--brand-primary-hover)] text-white shadow-xs"
          >
            {submitting ? (
              <span>Saving Work Log...</span>
            ) : (
              <span className="flex items-center gap-1.5">
                <FileCheck2 className="w-3.5 h-3.5" />
                <span>Save to Profile &amp; Complete Slot</span>
              </span>
            )}
          </Button>
        </div>
      </form>
    </Dialog>
  );
}
