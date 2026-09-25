import * as React from "react";
import { cn } from "@/lib/utils";

export interface ScaleBarProps extends React.HTMLAttributes<HTMLDivElement> {
  scale?: string; // e.g. "0 — 10 µm"
  align?: "left" | "center" | "right";
}

export function ScaleBar({
  scale = "0 — 10 µm",
  align = "right",
  className,
  ...props
}: ScaleBarProps) {
  return (
    <div
      className={cn("relative w-full py-6 select-none", className)}
      role="separator"
      aria-label={`Scale ${scale}`}
      {...props}
    >
      {/* Horizontal hairline rule */}
      <div className="relative w-full h-px bg-[var(--border)]">
        {/* Left endpoint micrometer tick */}
        <div className="absolute left-0 top-[-4px] w-px h-[9px] bg-[var(--border-strong)]" />
        {/* Midpoint tick */}
        <div className="absolute left-1/2 top-[-2px] w-px h-[5px] bg-[var(--border)]" />
        {/* Right endpoint micrometer tick */}
        <div className="absolute right-0 top-[-4px] w-px h-[9px] bg-[var(--border-strong)]" />
      </div>

      {/* Micrometer label tag */}
      {scale && (
        <div
          className={cn(
            "flex pt-1.5 font-mono text-[10px] text-[var(--text-muted)] tracking-wider uppercase",
            align === "left" && "justify-start",
            align === "center" && "justify-center",
            align === "right" && "justify-end"
          )}
        >
          <span className="flex items-center gap-1">
            <span className="w-1 h-1 rounded-full bg-[var(--bio-teal)]" />
            <span>MICROMETER: {scale}</span>
          </span>
        </div>
      )}
    </div>
  );
}
