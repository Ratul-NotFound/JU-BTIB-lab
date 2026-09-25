"use client";

import * as React from "react";
import { submitContactMessage } from "@/server/actions/contact";
import { CheckCircle2, Loader2, Send } from "lucide-react";

export function ContactForm() {
  const [formData, setFormData] = React.useState({
    name: "",
    email: "",
    subject: "",
    message: "",
    honeypot: "",
  });
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [submitted, setSubmitted] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await submitContactMessage({
        name: formData.name,
        email: formData.email,
        subject: formData.subject,
        message: formData.message,
        honeypot: formData.honeypot || undefined,
      });

      setSubmitted(true);
      setFormData({
        name: "",
        email: "",
        subject: "",
        message: "",
        honeypot: "",
      });
    } catch (err: unknown) {
      console.error(err);
      setError(
        err instanceof Error
          ? err.message
          : "Failed to dispatch message. Please check the fields and try again."
      );
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="p-8 rounded-2xl border border-emerald-500/30 bg-emerald-500/5 space-y-4">
        <div className="flex items-center gap-3 text-emerald-500">
          <CheckCircle2 className="w-6 h-6" />
          <h3 className="text-lg font-bold">Inquiry Dispatched Successfully</h3>
        </div>
        <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
          Thank you for contacting the Bioresources Technology and Industrial Biotechnology Laboratory.
          Your inquiry has been logged into our laboratory portal and forwarded to the research team.
        </p>
        <button
          type="button"
          onClick={() => setSubmitted(false)}
          className="px-4 py-2 rounded-lg text-xs font-mono border border-[var(--border)] bg-[var(--surface)] text-[var(--text-primary)] hover:border-[var(--bio-teal)] transition-colors"
        >
          Send another inquiry
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
      {error && (
        <div className="p-3 rounded-lg border border-[var(--danger)]/30 bg-[var(--danger-surface)] text-xs text-[var(--danger)]">
          {error}
        </div>
      )}

      {/* Honeypot field (hidden from real users) */}
      <div className="hidden" aria-hidden="true">
        <label htmlFor="company">Company</label>
        <input
          id="company"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          value={formData.honeypot}
          onChange={(e) => setFormData({ ...formData, honeypot: e.target.value })}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
        <div className="space-y-1 sm:space-y-1.5">
          <label className="text-[11px] sm:text-xs font-mono text-[var(--text-muted)] uppercase tracking-wider block">
            Your Full Name *
          </label>
          <input
            type="text"
            required
            placeholder="e.g. Dr. Jane Doe / Research Fellow"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full px-3 py-1.5 sm:px-3.5 sm:py-2 text-xs sm:text-sm rounded-lg border border-[var(--border)] bg-[var(--surface-raised)] text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:border-[var(--bio-teal)] font-sans"
          />
        </div>

        <div className="space-y-1 sm:space-y-1.5">
          <label className="text-[11px] sm:text-xs font-mono text-[var(--text-muted)] uppercase tracking-wider block">
            Institutional Email *
          </label>
          <input
            type="email"
            required
            placeholder="e.g. name@university.edu"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="w-full px-3 py-1.5 sm:px-3.5 sm:py-2 text-xs sm:text-sm rounded-lg border border-[var(--border)] bg-[var(--surface-raised)] text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:border-[var(--bio-teal)] font-sans"
          />
        </div>
      </div>

      <div className="space-y-1 sm:space-y-1.5">
        <label className="text-[11px] sm:text-xs font-mono text-[var(--text-muted)] uppercase tracking-wider block">
          Subject / Inquiry Area *
        </label>
        <input
          type="text"
          required
          placeholder="e.g. Inquiry regarding thesis placement / Industrial collaboration"
          value={formData.subject}
          onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
          className="w-full px-3 py-1.5 sm:px-3.5 sm:py-2 text-xs sm:text-sm rounded-lg border border-[var(--border)] bg-[var(--surface-raised)] text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:border-[var(--bio-teal)] font-sans"
        />
      </div>

      <div className="space-y-1 sm:space-y-1.5">
        <label className="text-[11px] sm:text-xs font-mono text-[var(--text-muted)] uppercase tracking-wider block">
          Message *
        </label>
        <textarea
          required
          rows={4}
          placeholder="Please describe your background, thesis interest, or proposed research scope..."
          value={formData.message}
          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
          className="w-full px-3 py-1.5 sm:px-3.5 sm:py-2 text-xs sm:text-sm rounded-lg border border-[var(--border)] bg-[var(--surface-raised)] text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:border-[var(--bio-teal)] resize-y font-sans"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 sm:px-6 sm:py-3 rounded-xl text-xs sm:text-sm font-semibold bg-[var(--brand-primary)] hover:bg-[var(--brand-primary-hover)] text-white shadow-[0_4px_16px_rgba(0,146,184,0.4)] transition-all active:scale-[0.98] disabled:opacity-50"
      >
        {loading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Transmitting Inquiry...</span>
          </>
        ) : (
          <>
            <Send className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            <span>Transmit Message</span>
          </>
        )}
      </button>
    </form>
  );
}
