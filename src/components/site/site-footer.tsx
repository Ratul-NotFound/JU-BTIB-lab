import Link from "next/link";
import Image from "next/image";
import { ExternalLink } from "lucide-react";

export function SiteFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative border-t border-slate-800/80 bg-[#060D17] text-slate-300 text-sm overflow-hidden">
      {/* Refined gradient accent hairline at top of footer */}
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-[var(--brand-primary)]/40 to-transparent" />

      <div className="w-full px-4 sm:px-12 lg:px-20 py-8 sm:py-16 lg:py-20">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-10 lg:gap-14">
          {/* Column 1: Lab identity */}
          <div className="space-y-3 sm:space-y-4 col-span-2 md:col-span-1">
            <div className="flex items-center gap-2.5 sm:gap-3">
              <div className="relative w-8 h-8 sm:w-10 sm:h-10 shrink-0 flex items-center justify-center">
                <Image
                  src="/images/btib-logo-white.png"
                  alt="BTIB Laboratory Logo"
                  width={40}
                  height={40}
                  className="w-full h-full object-contain"
                />
              </div>
              <span className="font-black text-base sm:text-lg text-white tracking-tight">
                BTIB Laboratory
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed font-light">
              Bioresources Technology & Industrial Biotechnology Laboratory.
              Translating indigenous microbial resources and microalgal bioprocesses into
              sustainable industrial applications and urban clean-air technologies.
            </p>
            <div className="pt-0.5 text-xs space-y-1">
              <div className="text-slate-300 font-medium">
                Dept. of Biotechnology & Genetic Engineering
              </div>
              <div className="text-[var(--brand-primary)] font-semibold flex items-center gap-1.5">
                <span>Jahangirnagar University</span>
                <span className="text-slate-600">•</span>
                <span className="text-slate-400 font-normal">Savar, Dhaka</span>
              </div>
            </div>
          </div>

          {/* Column 2: Research Areas */}
          <div className="space-y-2.5 sm:space-y-3.5 col-span-1">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-100 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--brand-primary)]" />
              Core Branches
            </h4>
            <ul className="space-y-2 sm:space-y-2.5 text-xs">
              <li>
                <Link
                  href="/research/microbial-biotechnology"
                  className="text-slate-400 hover:text-[var(--brand-primary)] hover:translate-x-0.5 transition-all inline-block"
                >
                  Microbial Biotechnology
                </Link>
              </li>
              <li>
                <Link
                  href="/research/bioprocess-engineering"
                  className="text-slate-400 hover:text-[var(--brand-primary)] hover:translate-x-0.5 transition-all inline-block"
                >
                  Bioprocess Engineering
                </Link>
              </li>
              <li>
                <Link
                  href="/research/algae-biotechnology"
                  className="text-slate-400 hover:text-[var(--brand-primary)] hover:translate-x-0.5 transition-all inline-block"
                >
                  Algae Biotechnology & Photobioreactors
                </Link>
              </li>
              <li>
                <Link
                  href="/research/computational-biology"
                  className="text-slate-400 hover:text-[var(--brand-primary)] hover:translate-x-0.5 transition-all inline-block"
                >
                  Computational Biology
                </Link>
              </li>
              <li>
                <Link
                  href="/research/protein-engineering"
                  className="text-slate-400 hover:text-[var(--brand-primary)] hover:translate-x-0.5 transition-all inline-block"
                >
                  Protein Structure & Engineering
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Institutional Links & University Logo */}
          <div className="space-y-2.5 sm:space-y-3.5 col-span-1">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-100 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--brand-primary)]" />
              Affiliations
            </h4>

            {/* University Crest Affiliation Card */}
            <a
              href="https://juniv.edu"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-2.5 sm:gap-3 p-2 sm:p-3 rounded-xl border border-slate-800/90 bg-white/[0.03] hover:bg-white/[0.07] hover:border-[var(--brand-primary)]/50 transition-all shadow-xs"
            >
              <div className="relative w-6 h-6 sm:w-8 sm:h-8 shrink-0 flex items-center justify-center">
                <Image
                  src="/images/ju-logo-white.png"
                  alt="Jahangirnagar University Crest"
                  width={32}
                  height={32}
                  className="w-full h-full object-contain transition-transform group-hover:scale-105"
                />
              </div>
              <div className="text-xs min-w-0">
                <span className="font-bold text-white group-hover:text-[var(--brand-primary)] transition-colors block leading-tight truncate">
                  JU
                </span>
                <span className="text-[10px] sm:text-[11px] text-slate-400 font-sans hidden sm:block">
                  Savar, Dhaka-1342
                </span>
              </div>
              <ExternalLink className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-slate-500 group-hover:text-[var(--brand-primary)] ml-auto transition-colors shrink-0" />
            </a>

            <ul className="space-y-2 sm:space-y-2.5 text-xs pt-0.5 sm:pt-1">
              <li>
                <a
                  href="https://www.bgeju.edu.bd"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-slate-400 hover:text-[var(--brand-primary)] transition-colors group"
                >
                  <span className="line-clamp-1">Dept. of BGE</span>
                  <ExternalLink className="w-3 h-3 text-slate-500 group-hover:text-[var(--brand-primary)] transition-colors shrink-0" />
                </a>
              </li>
              <li>
                <a
                  href="https://www.bgeju.edu.bd/degree-programs/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-slate-400 hover:text-[var(--brand-primary)] transition-colors group"
                >
                  <span className="line-clamp-1">Graduate Programs</span>
                  <ExternalLink className="w-3 h-3 text-slate-500 group-hover:text-[var(--brand-primary)] transition-colors shrink-0" />
                </a>
              </li>
              <li>
                <Link
                  href="/about#facilities"
                  className="inline-flex items-center gap-1.5 text-slate-400 hover:text-[var(--brand-primary)] transition-colors"
                >
                  <span className="line-clamp-1">Facilities</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Contact & Coordinates */}
          <div className="space-y-2.5 sm:space-y-3.5 col-span-2 md:col-span-1">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-100 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--brand-primary)]" />
              Location & Contact
            </h4>
            <div className="space-y-2 sm:space-y-3 text-xs text-slate-400 leading-relaxed font-light">
              <p>
                Department of Biotechnology & Genetic Engineering,
                <br />
                Faculty of Biological Sciences,
                <br />
                Jahangirnagar University, Savar, Dhaka-1342, Bangladesh.
              </p>
              <div className="pt-0.5">
                <span className="text-slate-500 block text-[10px] uppercase tracking-wider font-semibold mb-0.5">
                  Official Inquiries
                </span>
                <a
                  href="mailto:rahmanms@bgeju.edu.bd"
                  className="inline-flex items-center gap-1.5 text-[var(--brand-primary)] hover:text-white font-medium transition-colors"
                >
                  rahmanms@bgeju.edu.bd
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-8 sm:mt-14 pt-4 sm:pt-6 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4 text-xs text-slate-400">
          <div className="flex items-center gap-2.5 sm:gap-3 text-[11px] sm:text-xs text-center sm:text-left">
            <div className="relative w-4 h-4 sm:w-5 sm:h-5 shrink-0 opacity-80 hover:opacity-100 transition-opacity">
              <Image
                src="/images/btib-logo-white.png"
                alt="BTIB Logo"
                width={20}
                height={20}
                className="w-full h-full object-contain"
              />
            </div>
            <div className="relative w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0 opacity-80 hover:opacity-100 transition-opacity">
              <Image
                src="/images/ju-logo-white.png"
                alt="JU Logo"
                width={16}
                height={16}
                className="w-full h-full object-contain"
              />
            </div>
            <span>© {currentYear} BTIB Laboratory · Jahangirnagar University.</span>
          </div>
          <div className="flex items-center gap-3.5 sm:gap-5 text-[11px] sm:text-xs font-sans">
            <Link href="/about" className="text-slate-400 hover:text-white transition-colors">
              About
            </Link>
            <Link href="/publications" className="text-slate-400 hover:text-white transition-colors">
              Publications
            </Link>
            <Link href="/contact" className="text-slate-400 hover:text-white transition-colors">
              Contact
            </Link>
            <Link
              href="/admin"
              className="px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-md bg-white/[0.05] border border-white/10 text-[var(--brand-primary)] hover:text-white hover:border-[var(--brand-primary)]/50 transition-all font-medium text-[10px] sm:text-[11px]"
            >
              Admin Portal
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
