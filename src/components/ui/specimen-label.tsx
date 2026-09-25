import * as React from "react";
import { cn } from "@/lib/utils";

export interface SpecimenLabelProps
  extends React.HTMLAttributes<HTMLSpanElement> {
  code: string;
  subtext?: string;
}

export function SpecimenLabel({
  code,
  subtext,
  className,
  ...props
}: SpecimenLabelProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-wider px-2 py-0.5 rounded-xs border border-[var(--border)] bg-[var(--surface-raised)] text-[var(--text-secondary)] select-none",
        className
      )}
      {...props}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-[var(--bio-teal)] shrink-0" />
      <span className="font-semibold text-[var(--text-primary)]">{code}</span>
      {subtext && (
        <>
          <span className="text-[var(--border-strong)]">/</span>
          <span className="text-[var(--text-muted)] text-[10px]">{subtext}</span>
        </>
      )}
    </span>
  );
}
