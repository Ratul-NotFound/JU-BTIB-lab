"use client";

import * as React from "react";
import Image from "next/image";
import { loginAction } from "@/server/actions/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SpecimenLabel } from "@/components/ui/specimen-label";
import { Lock, AlertCircle } from "lucide-react";

export default function AdminLoginPage() {
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
        setError(res.error || "Invalid administrative credentials or account locked.");
      } else {
        window.location.href = "/admin";
      }
    } catch {
      setError("An unexpected error occurred during authentication.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 min-h-[calc(100vh-3.5rem)] flex items-center justify-center p-4 bg-[var(--background)]">
      <div className="w-full max-w-sm rounded border border-[var(--border)] bg-[var(--surface)] p-6 sm:p-8 shadow-md space-y-6">
        <div className="text-center space-y-2">
          <div className="w-14 h-14 mx-auto relative flex items-center justify-center mb-1">
            <Image
              src="/images/btib-logo.png"
              alt="BTIB Laboratory Logo"
              width={56}
              height={56}
              priority
              className="w-full h-full object-contain theme-invert-dark"
            />
          </div>
          <div className="flex justify-center">
            <SpecimenLabel code="AUTH / GATE" subtext="PORTAL" />
          </div>
          <h1 className="text-xl font-bold tracking-tight text-[var(--text-primary)]">
            Laboratory Admin Login
          </h1>
          <p className="text-xs text-[var(--text-muted)]">
            Authorized personnel access for BTIB Laboratory content repository.
          </p>
        </div>

        {error && (
          <div className="p-3 rounded border border-[var(--danger)] bg-[var(--danger-surface)]/40 text-xs text-[var(--danger)] flex items-start gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-mono uppercase tracking-wider text-[var(--text-secondary)]">
              Authorized Email
            </label>
            <Input
              type="email"
              required
              placeholder="admin@btiblab.ju.edu.bd"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-mono uppercase tracking-wider text-[var(--text-secondary)]">
              Password
            </label>
            <Input
              type="password"
              required
              placeholder="••••••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
            />
          </div>

          <Button
            type="submit"
            className="w-full gap-2"
            isLoading={loading}
          >
            <Lock className="w-3.5 h-3.5" />
            <span>Authenticate Session</span>
          </Button>
        </form>

        <div className="pt-4 border-t border-[var(--border)] text-center">
          <p className="text-[11px] font-mono text-[var(--text-muted)]">
            Jahangirnagar University · Dept. of BGE
          </p>
        </div>
      </div>
    </div>
  );
}
