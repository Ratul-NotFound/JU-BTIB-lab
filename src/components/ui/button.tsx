import * as React from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "secondary" | "outline" | "ghost" | "danger" | "link";
  size?: "sm" | "md" | "lg" | "icon";
  isLoading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "default",
      size = "md",
      isLoading = false,
      disabled,
      children,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      "inline-flex items-center justify-center font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)] focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none select-none";

    const variantStyles = {
      default:
        "bg-[var(--bio-teal)] text-white hover:bg-[var(--bio-teal-hover)] shadow-xs",
      secondary:
        "bg-[var(--surface-raised)] text-[var(--text-primary)] hover:bg-[var(--surface-muted)] border border-[var(--border)]",
      outline:
        "border border-[var(--border)] bg-transparent hover:bg-[var(--surface-raised)] text-[var(--text-primary)]",
      ghost:
        "bg-transparent hover:bg-[var(--surface-raised)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]",
      danger:
        "bg-[var(--danger)] text-white hover:opacity-90 shadow-xs",
      link: "text-[var(--bio-teal)] hover:underline p-0 h-auto font-normal",
    };

    const sizeStyles = {
      sm: "text-xs px-2.5 py-1.5 rounded-sm gap-1.5",
      md: "text-sm px-4 py-2 rounded gap-2",
      lg: "text-base px-6 py-2.5 rounded gap-2.5",
      icon: "w-9 h-9 rounded p-0",
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(
          baseStyles,
          variantStyles[variant],
          sizeStyles[size],
          className
        )}
        {...props}
      >
        {isLoading && (
          <svg
            className="animate-spin -ml-1 mr-2 h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        )}
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";
