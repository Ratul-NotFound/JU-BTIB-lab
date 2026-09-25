import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-16">
      <div className="max-w-md w-full p-8 rounded-3xl border border-[var(--border)] bg-[var(--surface)] text-center space-y-6 shadow-xs">
        <div className="w-16 h-16 mx-auto relative flex items-center justify-center">
          <Image
            src="/images/btib-logo.png"
            alt="BTIB Laboratory"
            width={64}
            height={64}
            className="w-full h-full object-contain theme-invert-dark"
          />
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-center gap-2">
            <span className="specimen-tag text-[10px]">CATALOGUE / 404</span>
            <span className="text-xs font-mono text-[var(--bio-teal)] font-medium">
              TAXON NOT FOUND
            </span>
          </div>

          <h1 className="text-2xl font-bold tracking-tight text-[var(--text-primary)]">
            Specimen Missing from Archive
          </h1>

          <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed">
            The requested accession ID, research record, or laboratory page could not be located in
            our active database index.
          </p>
        </div>

        <div className="scale-bar" />

        <div className="pt-2">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-xs font-mono font-semibold bg-[var(--bio-teal)] hover:bg-[var(--bio-teal-hover)] text-white shadow-xs transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Laboratory Home</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
