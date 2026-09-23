import * as React from "react";

interface GlyphProps extends React.SVGProps<SVGSVGElement> {
  className?: string;
  size?: number;
}

export function MicrobialGlyph({ className = "w-6 h-6", size = 24, ...props }: GlyphProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...props}
    >
      {/* Bacillus capsule shape */}
      <rect x="12" y="14" width="24" height="20" rx="10" />
      {/* Internal nucleoid / plasmid loop */}
      <path d="M18 24C18 21 21 21 24 24C27 27 30 27 30 24" strokeDasharray="2 2" />
      {/* Outer flagella */}
      <path d="M12 24C8 22 7 18 4 19" />
      <path d="M14 18C10 15 11 11 8 10" />
      <path d="M14 30C9 32 10 37 6 38" />
      <path d="M36 24C40 22 41 18 44 19" />
      <path d="M34 18C38 15 37 11 40 10" />
      <path d="M34 30C39 32 38 37 42 38" />
    </svg>
  );
}

export function BioprocessGlyph({ className = "w-6 h-6", size = 24, ...props }: GlyphProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...props}
    >
      {/* Bioreactor Vessel Body */}
      <path d="M12 10H36V34C36 40.6274 30.6274 44 24 44C17.3726 44 12 40.6274 12 34V10Z" />
      {/* Top flange / motor head */}
      <rect x="18" y="4" width="12" height="6" rx="1" />
      {/* Central Impeller Shaft */}
      <line x1="24" y1="10" x2="24" y2="38" />
      {/* Rushton turbine impellers */}
      <line x1="16" y1="22" x2="32" y2="22" strokeWidth="2.5" />
      <line x1="18" y1="32" x2="30" y2="32" strokeWidth="2.5" />
      {/* Sparger bubbles */}
      <circle cx="20" cy="38" r="1.5" fill="currentColor" />
      <circle cx="28" cy="38" r="1.5" fill="currentColor" />
      <circle cx="22" cy="16" r="1" />
      <circle cx="26" cy="18" r="1" />
      {/* Ports */}
      <path d="M12 16H8" />
      <path d="M36 20H40" />
    </svg>
  );
}

export function BiomaterialGlyph({ className = "w-6 h-6", size = 24, ...props }: GlyphProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...props}
    >
      {/* Hexagonal monomer ring 1 */}
      <polygon points="16,10 24,6 32,10 32,20 24,24 16,20" />
      {/* Hexagonal monomer ring 2 (linked) */}
      <polygon points="24,24 32,20 40,24 40,34 32,38 24,34" />
      {/* Beta-1,4 glycosidic link oxygen */}
      <circle cx="24" cy="24" r="2.5" fill="currentColor" />
      {/* Functional hydroxyl and carboxyl branching */}
      <line x1="16" y1="10" x2="10" y2="7" />
      <line x1="16" y1="20" x2="10" y2="23" />
      <line x1="32" y1="38" x2="32" y2="44" />
      <line x1="40" y1="34" x2="44" y2="37" />
    </svg>
  );
}

export function ComputationalGlyph({ className = "w-6 h-6", size = 24, ...props }: GlyphProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...props}
    >
      {/* Terminal Screen / Matrix frame */}
      <rect x="6" y="8" width="36" height="28" rx="3" />
      {/* Screen header */}
      <line x1="6" y1="14" x2="42" y2="14" />
      <circle cx="10" cy="11" r="1" fill="currentColor" />
      <circle cx="14" cy="11" r="1" fill="currentColor" />
      {/* In-silico DNA wave inside screen */}
      <path d="M12 24C16 18 20 30 24 24C28 18 32 30 36 24" />
      <path d="M12 24C16 30 20 18 24 24C28 30 32 18 36 24" strokeDasharray="2 2" />
      {/* Pedestal base */}
      <line x1="24" y1="36" x2="24" y2="42" />
      <line x1="16" y1="42" x2="32" y2="42" />
    </svg>
  );
}

export function ProteinGlyph({ className = "w-6 h-6", size = 24, ...props }: GlyphProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...props}
    >
      {/* Alpha-helix Ribbon Ribbon coil */}
      <path d="M14 8C20 8 26 12 26 16C26 20 16 20 16 24C16 28 26 28 26 32C26 36 20 40 14 40" strokeWidth="2.5" />
      <path d="M22 8C28 8 34 12 34 16C34 20 24 20 24 24C24 28 34 28 34 32C34 36 28 40 22 40" strokeWidth="1.5" strokeDasharray="2 2" />
      {/* Active site cleft with catalytic triad dots */}
      <circle cx="36" cy="20" r="2" fill="currentColor" />
      <circle cx="38" cy="26" r="1.5" fill="currentColor" />
      <circle cx="34" cy="29" r="1.5" fill="currentColor" />
    </svg>
  );
}

export function AlgaeGlyph({ className = "w-6 h-6", size = 24, ...props }: GlyphProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...props}
    >
      {/* Photobioreactor Column Tube */}
      <rect x="14" y="6" width="20" height="36" rx="4" />
      {/* Liquid level */}
      <path d="M14 14C18 13 22 15 26 14C30 13 32 14 34 14" />
      {/* Rising O2 bubbles / Algae cells */}
      <circle cx="20" cy="34" r="2" fill="currentColor" />
      <circle cx="28" cy="30" r="2.5" />
      <circle cx="22" cy="24" r="1.5" fill="currentColor" />
      <circle cx="27" cy="18" r="2" />
      {/* Light ray / Solar radiation arrows */}
      <line x1="6" y1="12" x2="10" y2="15" />
      <line x1="5" y1="24" x2="10" y2="24" />
      <line x1="6" y1="36" x2="10" y2="33" />
      {/* CO2 feed sparger tube */}
      <path d="M24 42V46" />
      <path d="M20 46H28" />
    </svg>
  );
}

export function MolecularGlyph({ className = "w-6 h-6", size = 24, ...props }: GlyphProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...props}
    >
      {/* Circular Plasmid Vector */}
      <circle cx="24" cy="24" r="16" />
      {/* Recombinant Insert region (thicker) */}
      <path
        d="M24 8 A16 16 0 0 1 40 24"
        stroke="var(--bio-teal)"
        strokeWidth="4"
      />
      {/* Restriction enzyme cleavage sites */}
      <line x1="24" y1="4" x2="24" y2="10" strokeWidth="2.5" />
      <line x1="40" y1="24" x2="46" y2="24" strokeWidth="2.5" />
      {/* Origin of replication mark */}
      <rect x="12" y="28" width="6" height="4" rx="1" fill="currentColor" />
    </svg>
  );
}

export function NanoGlyph({ className = "w-6 h-6", size = 24, ...props }: GlyphProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...props}
    >
      {/* Nanoparticle core */}
      <circle cx="24" cy="24" r="9" />
      {/* Conjugated functional ligands surrounding the core */}
      <line x1="24" y1="15" x2="24" y2="7" />
      <circle cx="24" cy="6" r="2" fill="currentColor" />

      <line x1="24" y1="33" x2="24" y2="41" />
      <circle cx="24" cy="42" r="2" fill="currentColor" />

      <line x1="15" y1="24" x2="7" y2="24" />
      <circle cx="6" cy="24" r="2" fill="currentColor" />

      <line x1="33" y1="24" x2="41" y2="24" />
      <circle cx="42" cy="24" r="2" fill="currentColor" />

      <line x1="17.6" y1="17.6" x2="12" y2="12" />
      <circle cx="11" cy="11" r="1.5" fill="currentColor" />

      <line x1="30.4" y1="30.4" x2="36" y2="36" />
      <circle cx="37" cy="37" r="1.5" fill="currentColor" />

      <line x1="30.4" y1="17.6" x2="36" y2="12" />
      <circle cx="37" cy="11" r="1.5" fill="currentColor" />

      <line x1="17.6" y1="30.4" x2="12" y2="36" />
      <circle cx="11" cy="37" r="1.5" fill="currentColor" />
    </svg>
  );
}

export function ResearchGlyph({
  glyphKey,
  className = "w-6 h-6",
  size = 24,
}: {
  glyphKey: string;
  className?: string;
  size?: number;
}) {
  switch (glyphKey.toLowerCase()) {
    case "microbial":
      return <MicrobialGlyph className={className} size={size} />;
    case "bioprocess":
      return <BioprocessGlyph className={className} size={size} />;
    case "biomaterial":
      return <BiomaterialGlyph className={className} size={size} />;
    case "computational":
      return <ComputationalGlyph className={className} size={size} />;
    case "protein":
      return <ProteinGlyph className={className} size={size} />;
    case "algae":
      return <AlgaeGlyph className={className} size={size} />;
    case "molecular":
      return <MolecularGlyph className={className} size={size} />;
    case "nano":
      return <NanoGlyph className={className} size={size} />;
    default:
      return <MicrobialGlyph className={className} size={size} />;
  }
}
