"use client";

import * as React from "react";
import { X } from "lucide-react";
import { clsx } from "clsx";

export interface DialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  children: React.ReactNode;
  size?: "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "4xl" | "5xl" | "6xl" | "full";
  className?: string;
  contentClassName?: string;
}

const SIZE_CLASSES: Record<NonNullable<DialogProps["size"]>, string> = {
  sm: "max-w-sm",
  md: "max-w-md",
  lg: "max-w-lg",
  xl: "max-w-xl",
  "2xl": "max-w-2xl",
  "3xl": "max-w-3xl",
  "4xl": "max-w-4xl",
  "5xl": "max-w-5xl",
  "6xl": "max-w-6xl",
  full: "max-w-[96vw] sm:max-w-7xl",
};

export function Dialog({
  open,
  onOpenChange,
  title,
  description,
  children,
  size = "lg",
  className,
  contentClassName,
}: DialogProps) {
  React.useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape" && open) {
        onOpenChange(false);
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, onOpenChange]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6"
      role="dialog"
      aria-modal="true"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
        onClick={() => onOpenChange(false)}
      />

      {/* Dialog Window */}
      <div
        className={clsx(
          "relative z-10 w-full rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4 sm:p-6 shadow-2xl animate-in fade-in-0 zoom-in-95 max-h-[90vh] flex flex-col overflow-hidden",
          SIZE_CLASSES[size || "lg"],
          className
        )}
      >
        <div className="flex items-center justify-between pb-3 sm:pb-4 border-b border-[var(--border)] shrink-0">
          <div>
            <h2 className="text-base sm:text-lg font-bold font-sans text-[var(--text-primary)]">
              {title}
            </h2>
            {description && (
              <p className="text-xs text-[var(--text-muted)] mt-0.5 sm:mt-1 font-light">
                {description}
              </p>
            )}
          </div>
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            className="rounded-lg p-1.5 text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-raised)] transition-colors"
            aria-label="Close dialog"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className={clsx("py-3 sm:py-4 overflow-y-auto flex-1 pr-1", contentClassName)}>
          {children}
        </div>
      </div>
    </div>
  );
}
