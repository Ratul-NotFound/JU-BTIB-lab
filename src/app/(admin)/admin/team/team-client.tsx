"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { DataTable, Column } from "@/components/admin/data-table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/toast";
import { createTeamMember, updateTeamMember, deleteTeamMember } from "@/server/actions/team";
import { MediaPicker } from "@/components/admin/media-picker";
import { MemberCategory } from "@prisma/client";
import {
  Edit2,
  Trash2,
  ExternalLink,
  FolderKanban,
  BookOpen,
  User,
  Globe,
  Search,
  CheckCircle2,
  Layers,
  Sparkles,
} from "lucide-react";

export interface TeamItem {
  id: string;
  name: string;
  slug: string;
  category: MemberCategory;
  title: string | null;
  bio: string | null;
  email: string | null;
  photoUrl: string | null;
  joinYear: number;
  leaveYear: number | null;
  interests: string[];
  order: number;
  published: boolean;
  profileLinks: Record<string, string> | null;
  projectIds: string[];
  publicationIds: string[];
}

export interface AvailableProject {
  id: string;
  title: string;
  slug: string;
  status: string;
  startYear: number;
  endYear: number | null;
}

export interface AvailablePublication {
  id: string;
  title: string;
  year: number;
  type: string;
  venue: string;
}

export interface AvailableResearchArea {
  id: string;
  title: string;
  slug: string;
}

const CATEGORY_LABELS: Record<MemberCategory, string> = {
  PI_FACULTY: "Principal Investigator / Faculty",
  POSTDOC: "Postdoctoral Researcher",
  PHD: "Ph.D. Researcher",
  MPHIL: "M.Phil. Researcher",
  MSC: "M.Sc. Student",
  BSC_THESIS: "B.Sc. Thesis Student",
  RESEARCH_ASSISTANT: "Research Assistant",
  ALUMNI: "Lab Alumni",
};

type FormTab = "identity" | "bio" | "links" | "projects" | "publications";

export function TeamClient({
  initialData,
  availableProjects = [],
  availablePublications = [],
  availableResearchAreas = [],
}: {
  initialData: TeamItem[];
  availableProjects?: AvailableProject[];
  availablePublications?: AvailablePublication[];
  availableResearchAreas?: AvailableResearchArea[];
}) {
  const router = useRouter();
  const { toast } = useToast();
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [editingItem, setEditingItem] = React.useState<TeamItem | null>(null);
  const [activeTab, setActiveTab] = React.useState<FormTab>("identity");

  // Form State
  const [name, setName] = React.useState("");
  const [slug, setSlug] = React.useState("");
  const [category, setCategory] = React.useState<MemberCategory>(MemberCategory.BSC_THESIS);
  const [title, setTitle] = React.useState("");
  const [bio, setBio] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [photoUrl, setPhotoUrl] = React.useState("");
  const [interestsText, setInterestsText] = React.useState("");
  const [joinYear, setJoinYear] = React.useState(new Date().getFullYear());
  const [leaveYear, setLeaveYear] = React.useState<number | "">("");
  const [order, setOrder] = React.useState(0);
  const [published, setPublished] = React.useState(true);

  // Profile Links
  const [scholarUrl, setScholarUrl] = React.useState("");
  const [researchGateUrl, setResearchGateUrl] = React.useState("");
  const [orcidUrl, setOrcidUrl] = React.useState("");
  const [linkedinUrl, setLinkedinUrl] = React.useState("");
  const [githubUrl, setGithubUrl] = React.useState("");
  const [websiteUrl, setWebsiteUrl] = React.useState("");

  // Relational Attachments
  const [selectedProjectIds, setSelectedProjectIds] = React.useState<string[]>([]);
  const [selectedPublicationIds, setSelectedPublicationIds] = React.useState<string[]>([]);

  // Search Filters inside dialog
  const [projectSearch, setProjectSearch] = React.useState("");
  const [publicationSearch, setPublicationSearch] = React.useState("");

  const [submitting, setSubmitting] = React.useState(false);

  const handleOpenCreate = () => {
    setEditingItem(null);
    setActiveTab("identity");
    setName("");
    setSlug("");
    setCategory(MemberCategory.BSC_THESIS);
    setTitle("");
    setBio("");
    setEmail("");
    setPhotoUrl("");
    setInterestsText("");
    setJoinYear(new Date().getFullYear());
    setLeaveYear("");
    setOrder(initialData.length + 1);
    setPublished(true);

    setScholarUrl("");
    setResearchGateUrl("");
    setOrcidUrl("");
    setLinkedinUrl("");
    setGithubUrl("");
    setWebsiteUrl("");

    setSelectedProjectIds([]);
    setSelectedPublicationIds([]);
    setProjectSearch("");
    setPublicationSearch("");
    setDialogOpen(true);
  };

  const handleOpenEdit = (item: TeamItem) => {
    setEditingItem(item);
    setActiveTab("identity");
    setName(item.name);
    setSlug(item.slug);
    setCategory(item.category);
    setTitle(item.title || "");
    setBio(item.bio || "");
    setEmail(item.email || "");
    setPhotoUrl(item.photoUrl || "");
    setInterestsText(item.interests.join(", "));
    setJoinYear(item.joinYear);
    setLeaveYear(item.leaveYear ?? "");
    setOrder(item.order);
    setPublished(item.published);

    const links = item.profileLinks || {};
    setScholarUrl(links.googleScholar || links.scholar || "");
    setResearchGateUrl(links.researchGate || links.researchgate || "");
    setOrcidUrl(links.orcid || "");
    setLinkedinUrl(links.linkedin || "");
    setGithubUrl(links.github || "");
    setWebsiteUrl(links.website || links.juProfile || "");

    setSelectedProjectIds(item.projectIds || []);
    setSelectedPublicationIds(item.publicationIds || []);
    setProjectSearch("");
    setPublicationSearch("");
    setDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    const interests = interestsText
      .split(",")
      .map((i) => i.trim())
      .filter(Boolean);

    const profileLinks: Record<string, string> = {};
    if (scholarUrl.trim()) profileLinks.googleScholar = scholarUrl.trim();
    if (researchGateUrl.trim()) profileLinks.researchGate = researchGateUrl.trim();
    if (orcidUrl.trim()) profileLinks.orcid = orcidUrl.trim();
    if (linkedinUrl.trim()) profileLinks.linkedin = linkedinUrl.trim();
    if (githubUrl.trim()) profileLinks.github = githubUrl.trim();
    if (websiteUrl.trim()) profileLinks.website = websiteUrl.trim();

    try {
      if (editingItem) {
        await updateTeamMember(editingItem.id, {
          name,
          slug,
          category,
          title: title || null,
          bio: bio || null,
          email: email || null,
          photoUrl: photoUrl || null,
          interests,
          joinYear,
          leaveYear: leaveYear === "" ? null : Number(leaveYear),
          order,
          published,
          profileLinks: Object.keys(profileLinks).length > 0 ? profileLinks : null,
          projectIds: selectedProjectIds,
          publicationIds: selectedPublicationIds,
        });
        toast("Team profile updated successfully", "success");
      } else {
        await createTeamMember({
          name,
          slug,
          category,
          title: title || null,
          bio: bio || null,
          email: email || null,
          photoUrl: photoUrl || null,
          interests,
          joinYear,
          leaveYear: leaveYear === "" ? null : Number(leaveYear),
          order,
          published,
          profileLinks: Object.keys(profileLinks).length > 0 ? profileLinks : null,
          projectIds: selectedProjectIds,
          publicationIds: selectedPublicationIds,
        });
        toast("New team profile created successfully", "success");
      }
      setDialogOpen(false);
      router.refresh();
    } catch (err: unknown) {
      toast(err instanceof Error ? err.message : "Operation failed", "error");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string, memberName: string) => {
    if (!window.confirm(`Delete "${memberName}" from team roster?`)) return;

    try {
      await deleteTeamMember(id);
      toast("Member removed", "success");
      router.refresh();
    } catch (err: unknown) {
      toast(err instanceof Error ? err.message : "Delete failed", "error");
    }
  };

  const filteredProjects = availableProjects.filter(
    (p) =>
      p.title.toLowerCase().includes(projectSearch.toLowerCase()) ||
      p.slug.toLowerCase().includes(projectSearch.toLowerCase())
  );

  const filteredPublications = availablePublications.filter(
    (pub) =>
      pub.title.toLowerCase().includes(publicationSearch.toLowerCase()) ||
      pub.venue.toLowerCase().includes(publicationSearch.toLowerCase()) ||
      String(pub.year).includes(publicationSearch)
  );

  const columns: Column<TeamItem>[] = [
    {
      key: "name",
      header: "Member Profile",
      render: (item) => (
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg border border-[var(--border)] bg-[var(--surface-raised)] overflow-hidden shrink-0 flex items-center justify-center font-bold text-xs text-[var(--bio-teal)]">
            {item.photoUrl ? (
              <img
                src={item.photoUrl}
                alt={item.name}
                className="w-full h-full object-cover"
              />
            ) : (
              item.name
                .split(" ")
                .map((n) => n[0])
                .join("")
                .slice(0, 2)
            )}
          </div>
          <div className="space-y-0.5">
            <div className="font-semibold text-sm text-[var(--text-primary)]">{item.name}</div>
            <div className="text-[11px] text-[var(--text-muted)] truncate max-w-xs">
              {item.title || "Biotechnology Researcher"}
            </div>
          </div>
        </div>
      ),
    },
    {
      key: "category",
      header: "Academic Role",
      render: (item) => (
        <Badge variant={item.category === "PI_FACULTY" ? "teal" : "default"}>
          {CATEGORY_LABELS[item.category] || item.category}
        </Badge>
      ),
    },
    {
      key: "timeline",
      header: "Years Active",
      render: (item) => (
        <span className="font-mono text-xs text-[var(--text-muted)]">
          {item.joinYear} – {item.leaveYear || "Present"}
        </span>
      ),
    },
    {
      key: "relations",
      header: "Dynamic Links",
      render: (item) => (
        <div className="flex items-center gap-2 text-[11px] font-mono">
          <span
            className={`px-2 py-0.5 rounded border ${
              item.projectIds.length > 0
                ? "border-[var(--brand-primary)]/40 bg-[var(--brand-primary-subtle)] text-[var(--brand-primary)] font-semibold"
                : "border-[var(--border)] text-[var(--text-muted)] bg-[var(--surface-raised)]"
            }`}
          >
            {item.projectIds.length} Projects
          </span>
          <span
            className={`px-2 py-0.5 rounded border ${
              item.publicationIds.length > 0
                ? "border-[var(--bio-emerald)]/40 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-semibold"
                : "border-[var(--border)] text-[var(--text-muted)] bg-[var(--surface-raised)]"
            }`}
          >
            {item.publicationIds.length} Papers
          </span>
        </div>
      ),
    },
    {
      key: "status",
      header: "Visibility",
      render: (item) =>
        item.published ? (
          <Badge variant="success">Active</Badge>
        ) : (
          <Badge variant="outline">Hidden</Badge>
        ),
    },
  ];

  return (
    <div className="space-y-6">
      <DataTable
        title="Team Directory & Researcher Profiles"
        description="Manage faculty, doctoral researchers, thesis students, alumni, and their dynamically linked projects and publications."
        columns={columns}
        data={initialData}
        searchKey="name"
        onAdd={handleOpenCreate}
        addLabel="Add Member Profile"
        actions={(item) => (
          <div className="flex items-center gap-1">
            <Link
              href={`/team/${item.slug}`}
              target="_blank"
              className="p-1 rounded text-[var(--text-muted)] hover:text-[var(--bio-teal)] hover:bg-[var(--surface-raised)] transition-colors"
              title="View Public Profile Page"
            >
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>
            <button
              onClick={() => handleOpenEdit(item)}
              className="p-1 rounded text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-raised)] transition-colors"
              title="Edit Profile & Link Projects/Publications"
            >
              <Edit2 className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => handleDelete(item.id, item.name)}
              className="p-1 rounded text-[var(--danger)] hover:bg-[var(--danger-surface)] transition-colors"
              title="Delete"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      />

      {/* Comprehensive Full Profile Modal */}
      <Dialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        title={editingItem ? `Edit Profile: ${editingItem.name}` : "Create Team Member Profile"}
        description="Configure academic role, credentials, research domains, profile links, and dynamic associations."
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Form Tabs Bar */}
          <div className="flex items-center gap-1 border-b border-[var(--border)] pb-2 overflow-x-auto">
            <button
              type="button"
              onClick={() => setActiveTab("identity")}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center gap-1.5 shrink-0 ${
                activeTab === "identity"
                  ? "bg-[var(--brand-primary)] text-white font-semibold"
                  : "text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-raised)]"
              }`}
            >
              <User className="w-3.5 h-3.5" />
              <span>1. Identity & Role</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("bio")}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center gap-1.5 shrink-0 ${
                activeTab === "bio"
                  ? "bg-[var(--brand-primary)] text-white font-semibold"
                  : "text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-raised)]"
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>2. Bio & Photo</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("links")}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center gap-1.5 shrink-0 ${
                activeTab === "links"
                  ? "bg-[var(--brand-primary)] text-white font-semibold"
                  : "text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-raised)]"
              }`}
            >
              <Globe className="w-3.5 h-3.5" />
              <span>3. Scholarly Links</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("projects")}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center gap-1.5 shrink-0 ${
                activeTab === "projects"
                  ? "bg-[var(--brand-primary)] text-white font-semibold"
                  : "text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-raised)]"
              }`}
            >
              <FolderKanban className="w-3.5 h-3.5" />
              <span>4. Projects ({selectedProjectIds.length})</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("publications")}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center gap-1.5 shrink-0 ${
                activeTab === "publications"
                  ? "bg-[var(--brand-primary)] text-white font-semibold"
                  : "text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-raised)]"
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>5. Publications ({selectedPublicationIds.length})</span>
            </button>
          </div>

          <div className="max-h-[65vh] overflow-y-auto px-1 space-y-4">
            {/* TAB 1: Identity & Role */}
            {activeTab === "identity" && (
              <div className="space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-mono text-[var(--text-secondary)]">
                    FULL NAME *
                  </label>
                  <Input
                    required
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value);
                      if (!editingItem) {
                        setSlug(
                          e.target.value
                            .toLowerCase()
                            .replace(/[^a-z0-9]+/g, "-")
                            .replace(/^-|-$/g, "")
                        );
                      }
                    }}
                    placeholder="e.g. Prof. Mohammad Shahedur Rahman"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-mono text-[var(--text-secondary)]">
                    URL SLUG *
                  </label>
                  <Input
                    required
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    placeholder="mohammad-shahedur-rahman"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-mono text-[var(--text-secondary)]">
                      ACADEMIC ROLE CATEGORY *
                    </label>
                    <select
                      className="w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-sm text-[var(--text-primary)] focus:outline-none"
                      value={category}
                      onChange={(e) => setCategory(e.target.value as MemberCategory)}
                    >
                      {Object.entries(CATEGORY_LABELS).map(([val, label]) => (
                        <option key={val} value={val}>
                          {label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-mono text-[var(--text-secondary)]">
                      OFFICIAL ACADEMIC TITLE
                    </label>
                    <Input
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="e.g. Professor & Principal Investigator"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-mono text-[var(--text-secondary)]">
                      JOIN YEAR *
                    </label>
                    <Input
                      type="number"
                      required
                      value={joinYear}
                      onChange={(e) => setJoinYear(Number(e.target.value))}
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-mono text-[var(--text-secondary)]">
                      LEAVE YEAR (LEAVE BLANK IF ACTIVE)
                    </label>
                    <Input
                      type="number"
                      value={leaveYear}
                      onChange={(e) =>
                        setLeaveYear(e.target.value === "" ? "" : Number(e.target.value))
                      }
                      placeholder="e.g. 2024 for Alumni"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-[var(--border)]">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="member-published"
                      checked={published}
                      onChange={(e) => setPublished(e.target.checked)}
                      className="rounded border-[var(--border)] text-[var(--bio-teal)]"
                    />
                    <label
                      htmlFor="member-published"
                      className="text-xs font-mono text-[var(--text-secondary)] cursor-pointer"
                    >
                      Display profile on public website
                    </label>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-mono text-[var(--text-secondary)]">
                      DISPLAY ORDER INDEX
                    </label>
                    <Input
                      type="number"
                      value={order}
                      onChange={(e) => setOrder(Number(e.target.value))}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: Bio, Photo & Research Topics */}
            {activeTab === "bio" && (
              <div className="space-y-4">
                <div className="space-y-1">
                  <MediaPicker
                    label="Portrait Photo (Optimized for WebP CDN)"
                    value={photoUrl}
                    onChange={setPhotoUrl}
                    folder="team"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-mono text-[var(--text-secondary)]">
                    EMAIL ADDRESS
                  </label>
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@bgeju.edu.bd"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-mono text-[var(--text-secondary)]">
                    RESEARCH TOPICS & DOMAINS (COMMA-SEPARATED)
                  </label>
                  <Input
                    value={interestsText}
                    onChange={(e) => setInterestsText(e.target.value)}
                    placeholder="Microbial Bioprocess, Photobioreactors, Biofilms, Enzyme Kinetics"
                  />
                  {interestsText && (
                    <div className="flex flex-wrap gap-1.5 pt-1.5">
                      {interestsText
                        .split(",")
                        .map((t) => t.trim())
                        .filter(Boolean)
                        .map((tag) => (
                          <span
                            key={tag}
                            className="px-2 py-0.5 rounded text-[10px] font-mono border border-[var(--border)] bg-[var(--surface-raised)] text-[var(--bio-teal)]"
                          >
                            {tag}
                          </span>
                        ))}
                    </div>
                  )}
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-mono text-[var(--text-secondary)]">
                    ACADEMIC BIOGRAPHY & RESEARCH TRAJECTORY
                  </label>
                  <Textarea
                    rows={6}
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    placeholder="Provide academic background, degrees (e.g. D.Engg Tokyo Tech), research breakthroughs, and responsibilities at BTIB Lab..."
                  />
                </div>
              </div>
            )}

            {/* TAB 3: Scholarly & Social Profile Links */}
            {activeTab === "links" && (
              <div className="space-y-3.5">
                <p className="text-xs text-[var(--text-secondary)]">
                  Add external academic repositories, Google Scholar profiles, and institutional links to display dynamic buttons on the researcher profile.
                </p>

                <div className="space-y-1">
                  <label className="text-xs font-mono text-[var(--text-secondary)]">
                    GOOGLE SCHOLAR PROFILE URL
                  </label>
                  <Input
                    value={scholarUrl}
                    onChange={(e) => setScholarUrl(e.target.value)}
                    placeholder="https://scholar.google.com/citations?user=..."
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-mono text-[var(--text-secondary)]">
                    RESEARCHGATE PROFILE URL
                  </label>
                  <Input
                    value={researchGateUrl}
                    onChange={(e) => setResearchGateUrl(e.target.value)}
                    placeholder="https://www.researchgate.net/profile/..."
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-mono text-[var(--text-secondary)]">
                    ORCID URL OR IDENTIFIER
                  </label>
                  <Input
                    value={orcidUrl}
                    onChange={(e) => setOrcidUrl(e.target.value)}
                    placeholder="https://orcid.org/0000-0002-..."
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-mono text-[var(--text-secondary)]">
                    LINKEDIN PROFILE URL
                  </label>
                  <Input
                    value={linkedinUrl}
                    onChange={(e) => setLinkedinUrl(e.target.value)}
                    placeholder="https://www.linkedin.com/in/..."
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-mono text-[var(--text-secondary)]">
                    GITHUB / LAB REPOSITORY URL
                  </label>
                  <Input
                    value={githubUrl}
                    onChange={(e) => setGithubUrl(e.target.value)}
                    placeholder="https://github.com/..."
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-mono text-[var(--text-secondary)]">
                    PERSONAL / JAHANGIRNAGAR UNIVERSITY WEBPAGE URL
                  </label>
                  <Input
                    value={websiteUrl}
                    onChange={(e) => setWebsiteUrl(e.target.value)}
                    placeholder="https://juniv.edu/teachers/..."
                  />
                </div>
              </div>
            )}

            {/* TAB 4: Involved Research Projects (Dynamic Multi-Select) */}
            {activeTab === "projects" && (
              <div className="space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[var(--border)] pb-2">
                  <div>
                    <h4 className="text-xs font-bold text-[var(--text-primary)]">
                      Select Laboratory Projects
                    </h4>
                    <p className="text-[11px] text-[var(--text-muted)]">
                      Attaching projects will dynamically showcase them on this researcher&apos;s public profile.
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() =>
                        setSelectedProjectIds(availableProjects.map((p) => p.id))
                      }
                      className="text-[11px] font-mono text-[var(--bio-teal)] hover:underline"
                    >
                      Select All
                    </button>
                    <span className="text-[var(--border)]">•</span>
                    <button
                      type="button"
                      onClick={() => setSelectedProjectIds([])}
                      className="text-[11px] font-mono text-[var(--text-muted)] hover:underline"
                    >
                      Clear All
                    </button>
                  </div>
                </div>

                {/* Search Bar */}
                <div className="relative">
                  <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
                  <Input
                    value={projectSearch}
                    onChange={(e) => setProjectSearch(e.target.value)}
                    placeholder="Search projects by title..."
                    className="pl-8 text-xs"
                  />
                </div>

                {/* Projects List */}
                {filteredProjects.length === 0 ? (
                  <div className="p-4 text-center text-xs font-mono text-[var(--text-muted)] border border-[var(--border)] rounded-xl">
                    No matching projects found.
                  </div>
                ) : (
                  <div className="space-y-2 max-h-[40vh] overflow-y-auto pr-1">
                    {filteredProjects.map((project) => {
                      const isSelected = selectedProjectIds.includes(project.id);
                      return (
                        <div
                          key={project.id}
                          onClick={() => {
                            setSelectedProjectIds(
                              isSelected
                                ? selectedProjectIds.filter((id) => id !== project.id)
                                : [...selectedProjectIds, project.id]
                            );
                          }}
                          className={`p-3 rounded-xl border transition-all cursor-pointer flex items-start justify-between gap-3 ${
                            isSelected
                              ? "border-[var(--brand-primary)] bg-[var(--brand-primary-subtle)]"
                              : "border-[var(--border)] bg-[var(--surface)] hover:border-[var(--brand-primary)]/50"
                          }`}
                        >
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <span className="px-1.5 py-0.5 rounded text-[9px] font-mono font-medium border border-[var(--border)] bg-[var(--surface-raised)] text-[var(--text-muted)]">
                                {project.status}
                              </span>
                              <span className="text-[10px] font-mono text-[var(--text-muted)]">
                                {project.startYear} – {project.endYear || "Present"}
                              </span>
                            </div>
                            <div className="text-xs font-semibold text-[var(--text-primary)]">
                              {project.title}
                            </div>
                          </div>

                          <div className="shrink-0 pt-1">
                            <div
                              className={`w-4 h-4 rounded-md border flex items-center justify-center transition-colors ${
                                isSelected
                                  ? "bg-[var(--brand-primary)] border-[var(--brand-primary)] text-white"
                                  : "border-[var(--border)] bg-[var(--surface)]"
                              }`}
                            >
                              {isSelected && <CheckCircle2 className="w-3.5 h-3.5" />}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* TAB 5: Authored Publications (Dynamic Multi-Select) */}
            {activeTab === "publications" && (
              <div className="space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[var(--border)] pb-2">
                  <div>
                    <h4 className="text-xs font-bold text-[var(--text-primary)]">
                      Select Authored Publications
                    </h4>
                    <p className="text-[11px] text-[var(--text-muted)]">
                      Link published papers, conference proceedings, or patents to display on this researcher&apos;s page.
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() =>
                        setSelectedPublicationIds(availablePublications.map((pub) => pub.id))
                      }
                      className="text-[11px] font-mono text-[var(--bio-teal)] hover:underline"
                    >
                      Select All
                    </button>
                    <span className="text-[var(--border)]">•</span>
                    <button
                      type="button"
                      onClick={() => setSelectedPublicationIds([])}
                      className="text-[11px] font-mono text-[var(--text-muted)] hover:underline"
                    >
                      Clear All
                    </button>
                  </div>
                </div>

                {/* Search Bar */}
                <div className="relative">
                  <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
                  <Input
                    value={publicationSearch}
                    onChange={(e) => setPublicationSearch(e.target.value)}
                    placeholder="Search publications by title, venue, or year..."
                    className="pl-8 text-xs"
                  />
                </div>

                {/* Publications List */}
                {filteredPublications.length === 0 ? (
                  <div className="p-4 text-center text-xs font-mono text-[var(--text-muted)] border border-[var(--border)] rounded-xl">
                    No matching publications found.
                  </div>
                ) : (
                  <div className="space-y-2 max-h-[40vh] overflow-y-auto pr-1">
                    {filteredPublications.map((pub) => {
                      const isSelected = selectedPublicationIds.includes(pub.id);
                      return (
                        <div
                          key={pub.id}
                          onClick={() => {
                            setSelectedPublicationIds(
                              isSelected
                                ? selectedPublicationIds.filter((id) => id !== pub.id)
                                : [...selectedPublicationIds, pub.id]
                            );
                          }}
                          className={`p-3 rounded-xl border transition-all cursor-pointer flex items-start justify-between gap-3 ${
                            isSelected
                              ? "border-[var(--bio-emerald)] bg-emerald-500/10 dark:bg-emerald-950/20"
                              : "border-[var(--border)] bg-[var(--surface)] hover:border-[var(--bio-emerald)]/50"
                          }`}
                        >
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <span className="font-mono text-[10px] font-bold text-[var(--bio-teal)]">
                                {pub.year}
                              </span>
                              <span className="px-1.5 py-0.5 rounded text-[9px] font-mono border border-[var(--border)] bg-[var(--surface-raised)] text-[var(--text-muted)]">
                                {pub.type}
                              </span>
                              <span className="text-[10px] text-[var(--text-muted)] truncate max-w-[200px]">
                                {pub.venue}
                              </span>
                            </div>
                            <div className="text-xs font-semibold text-[var(--text-primary)] line-clamp-2">
                              {pub.title}
                            </div>
                          </div>

                          <div className="shrink-0 pt-1">
                            <div
                              className={`w-4 h-4 rounded-md border flex items-center justify-center transition-colors ${
                                isSelected
                                  ? "bg-[var(--bio-emerald)] border-[var(--bio-emerald)] text-white"
                                  : "border-[var(--border)] bg-[var(--surface)]"
                              }`}
                            >
                              {isSelected && <CheckCircle2 className="w-3.5 h-3.5" />}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Form Actions Footer */}
          <div className="flex items-center justify-between pt-4 border-t border-[var(--border)]">
            <div className="text-xs font-mono text-[var(--text-muted)]">
              {selectedProjectIds.length} Projects · {selectedPublicationIds.length} Publications linked
            </div>
            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={() => setDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" size="sm" isLoading={submitting}>
                {editingItem ? "Update Profile" : "Save Profile"}
              </Button>
            </div>
          </div>
        </form>
      </Dialog>
    </div>
  );
}
