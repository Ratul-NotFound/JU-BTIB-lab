"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { SpecimenLabel } from "@/components/ui/specimen-label";
import { ScaleBar } from "@/components/ui/scale-bar";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Dialog } from "@/components/ui/dialog";
import { Reveal } from "@/components/ui/reveal";
import { useToast } from "@/components/ui/toast";
import { Dna, FlaskConical, Microchip } from "lucide-react";

export default function DesignSystemPage() {
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const { toast } = useToast();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      {/* Header */}
      <div className="space-y-3 border-b border-[var(--border)] pb-6">
        <div className="flex items-center gap-2">
          <SpecimenLabel code="DS-01" subtext="FOUNDATION" />
          <span className="text-xs font-mono text-[var(--bio-teal)]">
            LABORATORY DESIGN SYSTEM & PRIMITIVES
          </span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-[var(--text-primary)]">
          Editorial-Scientific <span className="font-serif italic font-normal text-[var(--bio-teal)]">Design Language</span>
        </h1>
        <p className="text-sm text-[var(--text-muted)] max-w-2xl">
          Visual tokens, specimen catalogue tags, calibrated micrometer dividers, and accessible UI primitives for the BTIB Lab website.
        </p>
      </div>

      {/* 1. Color Palette Tokens */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-[var(--text-primary)] flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[var(--bio-teal)]" />
            1. Brand & Semantic Tokens
          </h2>
          <span className="font-mono text-xs text-[var(--text-muted)]">WCAG AA CERTIFIED</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-4 font-mono text-xs">
          <div className="p-4 rounded border border-[var(--border)] bg-[var(--surface)] space-y-2">
            <div className="w-full h-10 rounded bg-[var(--bio-teal)]" />
            <div className="font-semibold text-[var(--text-primary)]">Bio-Teal</div>
            <div className="text-[var(--text-muted)] text-[11px]">Primary Mark</div>
          </div>
          <div className="p-4 rounded border border-[var(--border)] bg-[var(--surface)] space-y-2">
            <div className="w-full h-10 rounded bg-[var(--bio-cyan)]" />
            <div className="font-semibold text-[var(--text-primary)]">Bio-Cyan</div>
            <div className="text-[var(--text-muted)] text-[11px]">Accent / Interactivity</div>
          </div>
          <div className="p-4 rounded border border-[var(--border)] bg-[var(--surface)] space-y-2">
            <div className="w-full h-10 rounded bg-[var(--surface-raised)] border border-[var(--border)]" />
            <div className="font-semibold text-[var(--text-primary)]">Surface Raised</div>
            <div className="text-[var(--text-muted)] text-[11px]">Specimen Cards</div>
          </div>
          <div className="p-4 rounded border border-[var(--border)] bg-[var(--surface)] space-y-2">
            <div className="w-full h-10 rounded bg-[var(--success)]" />
            <div className="font-semibold text-[var(--text-primary)]">Success</div>
            <div className="text-[var(--text-muted)] text-[11px]">Active / Verified</div>
          </div>
          <div className="p-4 rounded border border-[var(--border)] bg-[var(--surface)] space-y-2">
            <div className="w-full h-10 rounded bg-[var(--warning)]" />
            <div className="font-semibold text-[var(--text-primary)]">Warning</div>
            <div className="text-[var(--text-muted)] text-[11px]">Pending Review</div>
          </div>
          <div className="p-4 rounded border border-[var(--border)] bg-[var(--surface)] space-y-2">
            <div className="w-full h-10 rounded bg-[var(--danger)]" />
            <div className="font-semibold text-[var(--text-primary)]">Danger</div>
            <div className="text-[var(--text-muted)] text-[11px]">Error / Terminal</div>
          </div>
        </div>
      </section>

      <ScaleBar scale="0 — 10 µm" />

      {/* 2. Specimen Motif & Scale Bars */}
      <section className="space-y-6">
        <h2 className="text-xl font-bold text-[var(--text-primary)] flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[var(--bio-teal)]" />
          2. Specimen Labels & Calibrated Dividers
        </h2>
        <div className="p-6 rounded border border-[var(--border)] bg-[var(--surface)] space-y-6">
          <div className="flex flex-wrap items-center gap-3">
            <SpecimenLabel code="BTIB / RA-01" subtext="MICROBIOLOGY" />
            <SpecimenLabel code="PUB / 2025" subtext="PEER-REVIEWED" />
            <SpecimenLabel code="PRJ / EDGE-02" subtext="LIQUID-TREE" />
            <SpecimenLabel code="SAMPLE / JU-084" />
          </div>

          <div className="space-y-2">
            <p className="text-xs font-mono text-[var(--text-muted)]">
              MICROMETER SCALE-BAR WITH ENDPOINT & MIDPOINT TICKS:
            </p>
            <ScaleBar scale="0 — 25 µm" align="left" />
          </div>
        </div>
      </section>

      {/* 3. Typography Hierarchy */}
      <section className="space-y-6">
        <h2 className="text-xl font-bold text-[var(--text-primary)] flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[var(--bio-teal)]" />
          3. Typography Hierarchy
        </h2>
        <div className="p-6 rounded border border-[var(--border)] bg-[var(--surface)] space-y-6">
          <div>
            <div className="text-xs font-mono text-[var(--text-muted)] mb-1">DISPLAY SERIF ACCENT</div>
            <p className="text-2xl sm:text-3xl font-serif italic text-[var(--text-primary)]">
              &ldquo;From bioresource isolation to bioprocess optimization.&rdquo;
            </p>
          </div>
          <div>
            <div className="text-xs font-mono text-[var(--text-muted)] mb-1">EDITORIAL BODY (GEIST SANS)</div>
            <p className="text-base text-[var(--text-secondary)] leading-relaxed max-w-3xl">
              The Department of Biotechnology and Genetic Engineering at Jahangirnagar University develops foundational biotechnological solutions leveraging indigenous algae, enzymes, and microbial strains for environmental mitigation.
            </p>
          </div>
          <div>
            <div className="text-xs font-mono text-[var(--text-muted)] mb-1">SPECIMEN MONOSPACE (GEIST MONO)</div>
            <p className="text-xs font-mono text-[var(--text-muted)]">
              NCBI: OQ865421.1 · DOI: 10.1371/journal.pone.0292931 · PDB: 4BGE
            </p>
          </div>
        </div>
      </section>

      <ScaleBar scale="0 — 50 µm" />

      {/* 4. Interactive UI Primitives */}
      <section className="space-y-6">
        <h2 className="text-xl font-bold text-[var(--text-primary)] flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[var(--bio-teal)]" />
          4. Buttons, Forms & Interactive Feedback
        </h2>

        {/* Buttons */}
        <div className="p-6 rounded border border-[var(--border)] bg-[var(--surface)] space-y-4">
          <div className="text-xs font-mono text-[var(--text-muted)]">BUTTON VARIANTS & SIZES</div>
          <div className="flex flex-wrap items-center gap-3">
            <Button variant="default">Primary Teal</Button>
            <Button variant="secondary">Secondary Surface</Button>
            <Button variant="outline">Hairline Outline</Button>
            <Button variant="ghost">Ghost Interaction</Button>
            <Button variant="danger">Destructive Action</Button>
            <Button isLoading>Processing...</Button>
            <Button variant="default" size="sm">Small Tag</Button>
            <Button variant="default" size="lg">Large Action</Button>
          </div>

          <div className="flex items-center gap-3 pt-4 border-t border-[var(--border)]">
            <Button onClick={() => setDialogOpen(true)} variant="outline" size="sm">
              Open Dialog Modal
            </Button>
            <Button
              onClick={() => toast("Citation copied to clipboard (BibTeX format)", "success")}
              variant="secondary"
              size="sm"
            >
              Trigger Success Toast
            </Button>
            <Button
              onClick={() => toast("Failed to connect to microalgae sensor", "error")}
              variant="danger"
              size="sm"
            >
              Trigger Error Toast
            </Button>
          </div>
        </div>

        {/* Form Inputs */}
        <div className="p-6 rounded border border-[var(--border)] bg-[var(--surface)] space-y-4">
          <div className="text-xs font-mono text-[var(--text-muted)]">FORM CONTROLS</div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Input placeholder="Search publications or authors..." />
            <Select
              options={[
                { label: "All Research Disciplines", value: "all" },
                { label: "Microbial Biotechnology", value: "microbial" },
                { label: "Algae Biotechnology", value: "algae" },
              ]}
            />
            <Input error="Invalid DOI format (must start with 10.)" defaultValue="invalid-doi-entry" />
          </div>
          <Textarea placeholder="Research inquiry or methodology statement..." />
        </div>

        {/* Badges */}
        <div className="p-6 rounded border border-[var(--border)] bg-[var(--surface)] space-y-3">
          <div className="text-xs font-mono text-[var(--text-muted)]">STATUS BADGES</div>
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="teal">Peer-Reviewed</Badge>
            <Badge variant="cyan">Active Project</Badge>
            <Badge variant="success">Completed</Badge>
            <Badge variant="warning">Needs Review</Badge>
            <Badge variant="danger">Archived</Badge>
            <Badge variant="outline">Open Access</Badge>
          </div>
        </div>
      </section>

      {/* 5. Compound Card & Table Primitives */}
      <section className="space-y-6">
        <h2 className="text-xl font-bold text-[var(--text-primary)] flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[var(--bio-teal)]" />
          5. Compound Cards & Editorial Data Table
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <SpecimenLabel code="PRJ-01" subtext="ACTIVE" />
                <Badge variant="teal">Featured</Badge>
              </div>
              <CardTitle className="pt-2">Liquid-Tree Photobioreactor</CardTitle>
              <CardDescription>
                Microalgae column capturing atmospheric carbon dioxide in urban centers.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-[var(--text-secondary)]">
                Utilizes native freshwater microalgae strains cultured in 250L photobioreactors to deliver the oxygen output equivalent to an adult tree.
              </p>
            </CardContent>
            <CardFooter className="justify-between text-xs font-mono">
              <span className="text-[var(--text-muted)]">RIC JU / EDGE 2024</span>
              <span className="text-[var(--bio-teal)]">View Abstract →</span>
            </CardFooter>
          </Card>

          <div className="space-y-2">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Specimen Code</TableHead>
                  <TableHead>Strain / Resource</TableHead>
                  <TableHead>Application</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell className="font-mono font-medium">BTIB-B01</TableCell>
                  <TableCell>Bacillus subtilis</TableCell>
                  <TableCell>Surfactin Secretion</TableCell>
                  <TableCell><Badge variant="teal">Verified</Badge></TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-mono font-medium">BTIB-A04</TableCell>
                  <TableCell>Chlorella vulgaris</TableCell>
                  <TableCell>CO₂ Sequestration</TableCell>
                  <TableCell><Badge variant="cyan">Culturing</Badge></TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-mono font-medium">BTIB-E02</TableCell>
                  <TableCell>Multi-Enzyme Matrix</TableCell>
                  <TableCell>HFCS Production</TableCell>
                  <TableCell><Badge variant="success">Published</Badge></TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </div>
      </section>

      {/* 6. Motion Reveal Primitive Demonstration */}
      <section className="space-y-6">
        <h2 className="text-xl font-bold text-[var(--text-primary)] flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[var(--bio-teal)]" />
          6. Motion Reveal Primitive (Reduced-Motion Safe)
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Reveal delay={0.1}>
            <div className="p-4 rounded border border-[var(--border)] bg-[var(--surface)] text-center space-y-2">
              <Dna className="w-6 h-6 mx-auto text-[var(--bio-teal)]" />
              <div className="text-xs font-semibold text-[var(--text-primary)]">Staggered Reveal 1</div>
              <div className="text-[11px] text-[var(--text-muted)]">Transforms Y: 12px → 0px</div>
            </div>
          </Reveal>
          <Reveal delay={0.2}>
            <div className="p-4 rounded border border-[var(--border)] bg-[var(--surface)] text-center space-y-2">
              <FlaskConical className="w-6 h-6 mx-auto text-[var(--bio-cyan)]" />
              <div className="text-xs font-semibold text-[var(--text-primary)]">Staggered Reveal 2</div>
              <div className="text-[11px] text-[var(--text-muted)]">Cubic bezier organic ease</div>
            </div>
          </Reveal>
          <Reveal delay={0.3}>
            <div className="p-4 rounded border border-[var(--border)] bg-[var(--surface)] text-center space-y-2">
              <Microchip className="w-6 h-6 mx-auto text-[var(--bio-teal)]" />
              <div className="text-xs font-semibold text-[var(--text-primary)]">Staggered Reveal 3</div>
              <div className="text-[11px] text-[var(--text-muted)]">Static fallback on reduced motion</div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Interactive Dialog Modal */}
      <Dialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        title="Specimen Tube Details"
        description="Catalogued sample properties from BTIB repository."
      >
        <div className="space-y-4 text-xs text-[var(--text-secondary)]">
          <div className="p-3 rounded border border-[var(--border)] bg-[var(--surface-raised)] font-mono space-y-1">
            <div>IDENTIFIER: BTIB-SP-2026-004</div>
            <div>LOCATION: Savar Campus Cryopreservation Unit 2</div>
            <div>ORIGIN: Indigenous Algal Photobioreactor Column</div>
          </div>
          <p>
            All manipulations require approval by the Principal Investigator and compliance with BGE Biosafety Guidelines.
          </p>
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="secondary" size="sm" onClick={() => setDialogOpen(false)}>
              Close
            </Button>
            <Button variant="default" size="sm" onClick={() => setDialogOpen(false)}>
              Confirm Extraction
            </Button>
          </div>
        </div>
      </Dialog>
    </div>
  );
}
