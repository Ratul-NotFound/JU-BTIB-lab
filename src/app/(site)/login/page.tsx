"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { loginAction } from "@/server/actions/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Lock, AlertCircle, ArrowRight, GraduationCap, ShieldCheck } from "lucide-react";

export default function UnifiedLoginPage() {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [error, setError] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await loginAction({
        email,
        password,
      });

      if (!res.success) {
        setError(res.error || "Invalid credentials or account suspended.");
      } else {
        // Next.js middleware and auth.config.ts will redirect based on role
        window.location.href = "/portal";
      }
    } catch {
      setError("An unexpected error occurred during authentication.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8 p-6 sm:p-10 rounded-3xl border border-[var(--border)] bg-[var(--surface)] shadow-xl relative overflow-hidden">
        {/* Subtle decorative glow */}
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-44 h-44 rounded-full bg-[var(--brand-primary)]/10 blur-3xl pointer-events-none" />

        <div className="text-center space-y-3 relative z-10">
          <div className="w-16 h-16 mx-auto relative flex items-center justify-center p-2 rounded-2xl bg-[var(--surface-raised)] border border-[var(--border)] shadow-xs">
            <Image
              src="/images/btib-logo.png"
              alt="BTIB Laboratory"
              width={48}
              height={48}
              priority
              className="w-full h-full object-contain theme-invert-dark"
            />
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-mono font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>BTIB Lab Authentication Gate</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-black font-sans tracking-tight text-[var(--text-primary)]">
            Laboratory Portal Login
          </h1>
          <p className="text-xs sm:text-sm text-[var(--text-secondary)] font-light max-w-xs mx-auto">
            Unified access for Faculty, Research Scholars, Thesis Students & Lab Administrators.
          </p>
        </div>

        {error && (
          <div className="p-4 rounded-xl border border-red-500/30 bg-red-500/10 text-xs text-red-600 dark:text-red-400 flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span className="leading-relaxed">{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 relative z-10">
          <div className="space-y-1.5">
            <label className="text-xs font-mono uppercase tracking-wider text-[var(--text-muted)]">
              Institutional / User Email
            </label>
            <Input
              type="email"
              required
              placeholder="username@bgeju.edu.bd"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
              className="h-11 rounded-xl bg-[var(--surface-raised)] border-[var(--border)]"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-mono uppercase tracking-wider text-[var(--text-muted)]">
              Password
            </label>
            <Input
              type="password"
              required
              placeholder="••••••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
              className="h-11 rounded-xl bg-[var(--surface-raised)] border-[var(--border)]"
            />
          </div>

          <Button
            type="submit"
            className="w-full h-11 rounded-xl bg-[var(--brand-primary)] hover:bg-[var(--brand-primary-hover)] text-white font-semibold transition-all shadow-sm hover:shadow-md"
            isLoading={loading}
          >
            <Lock className="w-4 h-4 mr-2" />
            <span>Sign In to Portal</span>
          </Button>
        </form>

        <div className="pt-6 border-t border-[var(--border)] space-y-4 text-center relative z-10">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
            <span className="text-[var(--text-muted)]">New thesis student or research scholar?</span>
            <Link
              href="/register"
              className="font-bold text-[var(--brand-primary)] hover:underline inline-flex items-center gap-1"
            >
              <GraduationCap className="w-3.5 h-3.5" />
              <span>Register Profile</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          <p className="text-[11px] font-mono text-[var(--text-muted)]">
            Department of Biotechnology & Genetic Engineering · Jahangirnagar University
          </p>
        </div>
      </div>
    </div>
  );
}
