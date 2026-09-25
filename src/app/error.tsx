"use client";

import * as React from "react";
import Link from "next/link";
import { AlertTriangle, ArrowLeft, RefreshCw } from "lucide-react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  React.useEffect(() => {
    console.error("Runtime exception captured by error boundary:", error);
  }, [error]);

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-16">
      <div className="max-w-md w-full p-8 rounded-3xl border border-[var(--danger)]/30 bg-[var(--surface)] text-center space-y-6 shadow-xs">
        <div className="w-16 h-16 mx-auto rounded-2xl border border-[var(--danger)]/30 bg-[var(--danger-surface)] flex items-center justify-center text-[var(--danger)]">
          <AlertTriangle className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-center gap-2">
            <span className="specimen-tag text-[10px] text-[var(--danger)] border-[var(--danger)]/40">
              FAULT / ERR-500
            </span>
            <span className="text-xs font-mono text-[var(--danger)] font-medium">
              SYSTEM INTERRUPTION
            </span>
          </div>

          <h1 className="text-2xl font-bold tracking-tight text-[var(--text-primary)]">
            Analytical Sequence Interrupted
          </h1>

          <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed">
            An unexpected runtime error occurred while processing this scientific dataset. Our error
            telemetry has recorded the event.
          </p>
        </div>

        <div className="scale-bar" />

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <button
            type="button"
            onClick={() => reset()}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg text-xs font-mono font-semibold bg-[var(--bio-teal)] hover:bg-[var(--bio-teal-hover)] text-white shadow-xs transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Re-evaluate Sequence</span>
          </button>

          <Link
            href="/"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg text-xs font-mono border border-[var(--border)] bg-[var(--surface-raised)] text-[var(--text-primary)] hover:border-[var(--bio-teal)] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return Home</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
