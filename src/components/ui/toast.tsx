"use client";

import * as React from "react";
import { CheckCircle2, AlertCircle, Info, X } from "lucide-react";
import { cn } from "@/lib/utils";

export type ToastType = "success" | "error" | "info";

export interface ToastMessage {
  id: string;
  type: ToastType;
  message: string;
}

interface ToastContextType {
  toast: (message: string, type?: ToastType) => void;
}

const ToastContext = React.createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = React.useState<ToastMessage[]>([]);

  const toast = React.useCallback(
    (message: string, type: ToastType = "success") => {
      const id = Math.random().toString(36).substring(2, 9);
      setToasts((prev) => [...prev, { id, type, message }]);

      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, 4000);
    },
    []
  );

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      {/* Toast container */}
      <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-sm pointer-events-none">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={cn(
              "pointer-events-auto flex items-center gap-3 p-3 rounded border text-xs shadow-lg transition-all animate-in slide-in-from-bottom-2",
              t.type === "success" &&
                "bg-[var(--surface)] text-[var(--text-primary)] border-[var(--success)]",
              t.type === "error" &&
                "bg-[var(--surface)] text-[var(--text-primary)] border-[var(--danger)]",
              t.type === "info" &&
                "bg-[var(--surface)] text-[var(--text-primary)] border-[var(--bio-teal)]"
            )}
          >
            {t.type === "success" && (
              <CheckCircle2 className="w-4 h-4 text-[var(--success)] shrink-0" />
            )}
            {t.type === "error" && (
              <AlertCircle className="w-4 h-4 text-[var(--danger)] shrink-0" />
            )}
            {t.type === "info" && (
              <Info className="w-4 h-4 text-[var(--bio-teal)] shrink-0" />
            )}
            <span className="flex-1 leading-normal">{t.message}</span>
            <button
              onClick={() => removeToast(t.id)}
              className="text-[var(--text-muted)] hover:text-[var(--text-primary)] p-0.5"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = React.useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
}
