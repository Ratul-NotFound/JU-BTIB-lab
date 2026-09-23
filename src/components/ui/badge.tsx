import * as React from "react";
import { cn } from "@/lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?:
    | "default"
    | "secondary"
    | "outline"
    | "teal"
    | "cyan"
    | "success"
    | "warning"
    | "danger";
}

export function Badge({
  className,
  variant = "default",
  children,
  ...props
}: BadgeProps) {
  const variantStyles = {
    default: "bg-[var(--surface-raised)] text-[var(--text-primary)] border-[var(--border)]",
    secondary: "bg-[var(--surface-muted)] text-[var(--text-secondary)] border-transparent",
    outline: "border-[var(--border)] text-[var(--text-secondary)] bg-transparent",
    teal: "bg-[var(--bio-teal-muted)]/40 text-[var(--bio-teal)] border-[var(--bio-teal)]/30",
    cyan: "bg-[var(--bio-cyan)]/15 text-[var(--bio-cyan)] border-[var(--bio-cyan)]/30",
    success: "bg-[var(--success-surface)] text-[var(--success)] border-[var(--success)]/30",
    warning: "bg-[var(--warning-surface)] text-[var(--warning)] border-[var(--warning)]/30",
    danger: "bg-[var(--danger-surface)] text-[var(--danger)] border-[var(--danger)]/30",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium border transition-colors",
        variantStyles[variant],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}
