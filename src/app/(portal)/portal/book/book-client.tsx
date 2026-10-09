"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import {
  checkSlotAvailabilityAction,
  autoBookEquipmentAction,
} from "@/server/actions/booking";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Microscope,
  Calendar,
  Clock,
  CheckCircle2,
  AlertCircle,
  AlertTriangle,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

interface EquipmentOption {
  id: string;
  name: string;
  category: string;
  description: string | null;
  imageUrl?: string | null;
}

export function BookEquipmentClient({ equipmentList }: { equipmentList: EquipmentOption[] }) {

  const [selectedEquipmentId, setSelectedEquipmentId] = React.useState(equipmentList[0]?.id || "");
  const [bookingDate, setBookingDate] = React.useState(() => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  });
  const [startTimeStr, setStartTimeStr] = React.useState("10:00");
  const [endTimeStr, setEndTimeStr] = React.useState("13:00");
  const [purpose, setPurpose] = React.useState("");
  const [samples, setSamples] = React.useState("");
  const [plannedConditions, setPlannedConditions] = React.useState("");
  const [wasteNotes, setWasteNotes] = React.useState("");

  // Concurrency check state
  const [checking, setChecking] = React.useState(false);
  const [availabilityState, setAvailabilityState] = React.useState<{
    checked: boolean;
    available: boolean;
    conflictMsg?: string;
  }>({ checked: false, available: true });

  const [submitting, setSubmitting] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [confirmedBooking, setConfirmedBooking] = React.useState(false);

  const selectedEquipment = equipmentList.find((e) => e.id === selectedEquipmentId);

  // Calculate duration in hours
  const plannedDurationHours = React.useMemo(() => {
    try {
      const s = new Date(`${bookingDate}T${startTimeStr}:00`).getTime();
      const e = new Date(`${bookingDate}T${endTimeStr}:00`).getTime();
      if (isNaN(s) || isNaN(e) || e <= s) return null;
      return Math.round(((e - s) / (1000 * 60 * 60)) * 10) / 10;
    } catch {
      return null;
    }
  }, [bookingDate, startTimeStr, endTimeStr]);

  // Debounced real-time cross-check
  React.useEffect(() => {
    if (!selectedEquipmentId || !bookingDate || !startTimeStr || !endTimeStr) return;

    let isMounted = true;
    const timer = setTimeout(async () => {
      setChecking(true);
      try {
        const startIso = `${bookingDate}T${startTimeStr}:00`;
        const endIso = `${bookingDate}T${endTimeStr}:00`;

        const res = await checkSlotAvailabilityAction(selectedEquipmentId, startIso, endIso);

        if (!isMounted) return;

        if (res.available) {
          setAvailabilityState({ checked: true, available: true });
        } else {
          const c = res.conflict;
          const msg = c
            ? `Slot occupied by ${c.reserverName} (${new Date(c.startTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })} - ${new Date(c.endTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}).`
            : res.error || "Slot unavailable.";
          setAvailabilityState({ checked: true, available: false, conflictMsg: msg });
        }
      } catch {
        if (isMounted) {
          setAvailabilityState({ checked: true, available: false, conflictMsg: "Could not verify slot availability." });
        }
      } finally {
        if (isMounted) setChecking(false);
      }
    }, 400);

    return () => {
      isMounted = false;
      clearTimeout(timer);
    };
  }, [selectedEquipmentId, bookingDate, startTimeStr, endTimeStr]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      const res = await autoBookEquipmentAction({
        equipmentId: selectedEquipmentId,
        startTime: new Date(`${bookingDate}T${startTimeStr}:00`).toISOString(),
        endTime: new Date(`${bookingDate}T${endTimeStr}:00`).toISOString(),
        purpose,
        samples,
        plannedConditions,
        wasteNotes,
      });

      if (!res.success) {
        setError(res.error || "Failed to reserve slot.");
      } else {
        setConfirmedBooking(true);
      }
    } catch {
      setError("An unexpected error occurred while locking your reservation.");
    } finally {
      setSubmitting(false);
    }
  };

  if (confirmedBooking) {
    return (
      <div className="p-8 sm:p-12 rounded-md border border-emerald-500/30 bg-emerald-500/5 text-center space-y-6 max-w-xl mx-auto shadow-lg">
        <div className="w-16 h-16 rounded bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 mx-auto flex items-center justify-center">
          <CheckCircle2 className="w-10 h-10" />
        </div>

        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded text-xs font-mono font-bold bg-emerald-500/20 text-emerald-700 dark:text-emerald-300">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Instant Auto-Confirmation</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black font-sans text-[var(--text-primary)]">
            Slot Successfully Reserved!
          </h2>
          <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed font-light">
            No scheduling conflicts were found. Your machine slot has been locked into the master BTIB laboratory calendar.
          </p>
        </div>

        <div className="p-5 rounded-md border border-[var(--border)] bg-[var(--surface)] text-left text-xs space-y-2 font-mono">
          <div className="flex justify-between">
            <span className="text-[var(--text-muted)]">Instrument:</span>
            <span className="font-bold text-[var(--text-primary)]">{selectedEquipment?.name}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[var(--text-muted)]">Date:</span>
            <span className="text-[var(--text-primary)]">{bookingDate}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[var(--text-muted)]">Time:</span>
            <span className="text-emerald-600 dark:text-emerald-400 font-bold">
              {startTimeStr} - {endTimeStr} {plannedDurationHours ? `(${plannedDurationHours} hrs)` : ""}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-[var(--text-muted)]">Purpose:</span>
            <span className="text-[var(--text-secondary)] truncate max-w-[240px]">{purpose}</span>
          </div>
          {plannedConditions && (
            <div className="flex justify-between">
              <span className="text-[var(--text-muted)]">Conditions:</span>
              <span className="text-[var(--text-secondary)] truncate max-w-[240px]">{plannedConditions}</span>
            </div>
          )}
          <div className="flex justify-between">
            <span className="text-[var(--text-muted)]">Booking Status:</span>
            <span className="text-emerald-600 dark:text-emerald-400 font-bold">CONFIRMED (LOCKED)</span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <Link
            href="/portal"
            className="w-full sm:w-auto px-6 py-3 rounded-md bg-[var(--brand-primary)] hover:bg-[var(--brand-primary-hover)] text-white text-xs font-bold transition-all shadow-sm"
          >
            Go to My Dashboard
          </Link>
          <button
            type="button"
            onClick={() => {
              setConfirmedBooking(false);
              setPurpose("");
              setSamples("");
              setPlannedConditions("");
              setWasteNotes("");
            }}
            className="w-full sm:w-auto px-5 py-3 rounded-md bg-[var(--surface-raised)] hover:bg-[var(--surface)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] text-xs font-semibold border border-[var(--border)] transition-all"
          >
            Book Another Slot
          </button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {error && (
        <div className="p-4 rounded-md border border-red-500/30 bg-red-500/10 text-xs text-red-600 dark:text-red-400 flex items-start gap-2.5">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <span className="leading-relaxed">{error}</span>
        </div>
      )}

      {/* 1. Instrument Selector */}
      <div className="space-y-3">
        <label className="text-xs font-mono uppercase tracking-wider text-[var(--text-muted)] flex items-center gap-2">
          <Microscope className="w-4 h-4 text-emerald-500" />
          <span>1. Select Laboratory Instrument *</span>
        </label>

        <select
          value={selectedEquipmentId}
          onChange={(e) => setSelectedEquipmentId(e.target.value)}
          className="w-full h-11 px-4 rounded-md border border-[var(--border)] bg-[var(--surface-raised)] text-xs sm:text-sm font-semibold text-[var(--text-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--brand-primary)]"
        >
          {equipmentList.map((eq) => (
            <option key={eq.id} value={eq.id}>
              {eq.name} ({eq.category})
            </option>
          ))}
        </select>

        {selectedEquipment && (
          <div className="p-4 rounded-md border border-[var(--border)] bg-[var(--surface-raised)]/50 flex items-center gap-4 text-xs">
            <div className="w-14 h-14 rounded border border-[var(--border)] bg-[var(--surface)] relative overflow-hidden shrink-0 flex items-center justify-center">
              {selectedEquipment.imageUrl ? (
                <Image
                  src={selectedEquipment.imageUrl}
                  alt={selectedEquipment.name}
                  fill
                  className="object-cover"
                  sizes="56px"
                />
              ) : (
                <Microscope className="w-6 h-6 text-emerald-500/50" />
              )}
            </div>
            <div className="space-y-0.5 min-w-0">
              <span className="font-bold text-[var(--text-primary)] block truncate">{selectedEquipment.name}</span>
              <p className="text-[11px] text-[var(--text-secondary)] font-light line-clamp-1">
                {selectedEquipment.description || "Calibrated scientific instrument."}
              </p>
              <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 font-semibold block">
                ● Status: Calibrated & Ready for Booking
              </span>
            </div>
          </div>
        )}
      </div>

      {/* 2. Date & Time Window Selector with Real-time Conflict Cross-Check */}
      <div className="space-y-3 pt-4 border-t border-[var(--border)]">
        <div className="flex items-center justify-between">
          <label className="text-xs font-mono uppercase tracking-wider text-[var(--text-muted)] flex items-center gap-2">
            <Calendar className="w-4 h-4 text-sky-500" />
            <span>2. Schedule Date & Time Slot *</span>
          </label>

          {/* Real-time Indicator */}
          <div className="text-[11px] font-mono">
            {checking ? (
              <span className="text-[var(--text-muted)] flex items-center gap-1">Checking slot...</span>
            ) : availabilityState.checked && availabilityState.available ? (
              <span className="text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Free for Auto-Booking
              </span>
            ) : availabilityState.checked && !availabilityState.available ? (
              <span className="text-red-500 font-semibold flex items-center gap-1">
                <AlertTriangle className="w-3.5 h-3.5" /> Conflict Detected
              </span>
            ) : null}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="space-y-1">
            <label className="text-xs font-mono text-[var(--text-secondary)]">Reservation Date</label>
            <Input
              type="date"
              required
              min={new Date().toISOString().split("T")[0]}
              value={bookingDate}
              onChange={(e) => setBookingDate(e.target.value)}
              disabled={submitting}
              className="h-10 rounded-md"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-mono text-[var(--text-secondary)]">Start Time</label>
            <Input
              type="time"
              required
              value={startTimeStr}
              onChange={(e) => setStartTimeStr(e.target.value)}
              disabled={submitting}
              className="h-10 rounded-md"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-mono text-[var(--text-secondary)]">End Time</label>
            <Input
              type="time"
              required
              value={endTimeStr}
              onChange={(e) => setEndTimeStr(e.target.value)}
              disabled={submitting}
              className="h-10 rounded-md"
            />
          </div>
        </div>

        {/* Planned Duration indicator */}
        {plannedDurationHours && plannedDurationHours > 0 ? (
          <div className="flex items-center gap-2 text-xs font-mono text-[var(--text-secondary)] bg-[var(--surface-raised)]/70 px-3 py-2 rounded-md border border-[var(--border)]">
            <Clock className="w-3.5 h-3.5 text-sky-500 shrink-0" />
            <span>
              Planned Instrument Runtime: <strong className="text-[var(--text-primary)]">{plannedDurationHours} hours</strong>
            </span>
          </div>
        ) : null}

        {/* Conflict Warning Box */}
        {availabilityState.checked && !availabilityState.available && (
          <div className="p-4 rounded-md border border-red-500/30 bg-red-500/10 text-xs text-red-600 dark:text-red-400 flex items-start gap-2.5">
            <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
            <div className="space-y-0.5">
              <span className="font-bold block">Scheduling Conflict Detected</span>
              <p className="font-light">{availabilityState.conflictMsg}</p>
            </div>
          </div>
        )}
      </div>

      {/* 3. Experiment Objective & Samples */}
      <div className="space-y-4 pt-4 border-t border-[var(--border)]">
        <label className="text-xs font-mono uppercase tracking-wider text-[var(--text-muted)] flex items-center gap-2">
          <Clock className="w-4 h-4 text-amber-500" />
          <span>3. Research Protocol & Sample Declaration *</span>
        </label>

        <div className="space-y-1.5">
          <label className="text-xs font-mono text-[var(--text-secondary)]">Experiment Title / Research Purpose *</label>
          <Input
            required
            placeholder="e.g. Kinetic analysis of microbial cellulase activity across varying pH substrates"
            value={purpose}
            onChange={(e) => setPurpose(e.target.value)}
            disabled={submitting}
            className="h-10 rounded-md"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-mono text-[var(--text-secondary)]">
            Biological Samples, Chemicals & Reagents to be Used
          </label>
          <Textarea
            placeholder="e.g. 12x Chlorella vulgaris broth samples, BG-11 growth medium, spectrophotometric cuvettes..."
            value={samples}
            onChange={(e) => setSamples(e.target.value)}
            disabled={submitting}
            className="min-h-[70px] rounded-md text-xs"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-mono text-[var(--text-secondary)]">
              Planned Operating Parameters (Optional)
            </label>
            <Input
              placeholder="e.g. 37°C incubation, 12,000 RPM, UV 600nm scan"
              value={plannedConditions}
              onChange={(e) => setPlannedConditions(e.target.value)}
              disabled={submitting}
              className="h-10 rounded-md text-xs"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-mono text-[var(--text-secondary)]">
              Hazard / Bio-Waste Disposal Plan (Optional)
            </label>
            <Input
              placeholder="e.g. Autoclaved before disposal, neutralized in bio-bin"
              value={wasteNotes}
              onChange={(e) => setWasteNotes(e.target.value)}
              disabled={submitting}
              className="h-10 rounded-md text-xs"
            />
          </div>
        </div>
      </div>

      <div className="p-4 rounded-md border border-emerald-500/20 bg-emerald-500/5 text-xs text-[var(--text-secondary)] flex items-start gap-2.5">
        <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
        <span className="leading-relaxed font-light">
          <strong>Instant Auto-Booking Policy:</strong> If the slot is conflict-free, your booking is confirmed automatically. After your session, update what work was accomplished so your supervisor can verify your machine hours.
        </span>
      </div>

      <Button
        type="submit"
        disabled={submitting || (availabilityState.checked && !availabilityState.available)}
        className="w-full h-11 rounded-md bg-[var(--brand-primary)] hover:bg-[var(--brand-primary-hover)] text-white font-bold transition-all shadow-md disabled:opacity-50"
        isLoading={submitting}
      >
        <Sparkles className="w-4 h-4 mr-2" />
        <span>Confirm & Lock Instrument Slot</span>
      </Button>
    </form>
  );
}
