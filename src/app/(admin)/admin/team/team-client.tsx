"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { DataTable, Column } from "@/components/admin/data-table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/toast";
import { createTeamMember, updateTeamMember, deleteTeamMember } from "@/server/actions/team";
import { fetchPublicationMetadataByDoi } from "@/server/actions/doi";
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
  Sparkles,
  Plus,
  GraduationCap,
  Award,
  Loader2,
} from "lucide-react";

export interface PersonalProject {
  id: string;
  title: string;
  role?: string;
  status?: string;
  startYear?: number | string;
  endYear?: number | string;
  funder?: string;
  summary?: string;
  link?: string;
}

export interface PersonalPublication {
  id: string;
  title: string;
  authors?: string;
  venue?: string;
  year?: number | string;
  type?: string;
  doi?: string;
  url?: string;
}

export interface EducationItem {
  id: string;
  degree: string;
  institution: string;
  year?: number | string;
  field?: string;
}

export interface AwardItem {
  id: string;
  title: string;
  issuer?: string;
  year?: number | string;
}

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
  personalProjects?: PersonalProject[];
  personalPublications?: PersonalPublication[];
  education?: EducationItem[];
  awards?: AwardItem[];
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

type FormTab = "identity" | "bio" | "links" | "projects" | "publications" | "education";

export function TeamClient({
  initialData,
  availableProjects = [],
  availablePublications = [],
}: {
  initialData: TeamItem[];
  availableProjects?: AvailableProject[];
  availablePublications?: AvailablePublication[];
}) {
  const router = useRouter();
  const { toast } = useToast();
  const [data, setData] = React.useState<TeamItem[]>(initialData);
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [editingItem, setEditingItem] = React.useState<TeamItem | null>(null);
  const [activeTab, setActiveTab] = React.useState<FormTab>("identity");

  React.useEffect(() => {
    setData(initialData);
  }, [initialData]);

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

  // Personal Items
  const [personalProjects, setPersonalProjects] = React.useState<PersonalProject[]>([]);
  const [personalPublications, setPersonalPublications] = React.useState<PersonalPublication[]>([]);
  const [educationList, setEducationList] = React.useState<EducationItem[]>([]);
  const [awardsList, setAwardsList] = React.useState<AwardItem[]>([]);

  // DOI Auto-Fetch State for Personal Publications
  const [quickDoiInput, setQuickDoiInput] = React.useState("");
  const [fetchingQuickDoi, setFetchingQuickDoi] = React.useState(false);
  const [fetchingDoiIndex, setFetchingDoiIndex] = React.useState<number | null>(null);

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
    setPersonalProjects([]);
    setPersonalPublications([]);
    setEducationList([]);
    setAwardsList([]);

    setQuickDoiInput("");
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
    setPersonalProjects(item.personalProjects || []);
    setPersonalPublications(item.personalPublications || []);
    setEducationList(item.education || []);
    setAwardsList(item.awards || []);

    setQuickDoiInput("");
    setProjectSearch("");
    setPublicationSearch("");
    setDialogOpen(true);
  };

  // Helper for adding Personal Project
  const handleAddPersonalProject = () => {
    setPersonalProjects([
      ...personalProjects,
      {
        id: `proj_${Date.now()}`,
        title: "",
        role: "Lead Researcher",
        status: "ACTIVE",
        startYear: new Date().getFullYear(),
        endYear: "",
        funder: "",
        summary: "",
        link: "",
      },
    ]);
  };

  // Helper for adding Personal Publication Manually
  const handleAddPersonalPublication = () => {
    setPersonalPublications([
      ...personalPublications,
      {
        id: `pub_${Date.now()}`,
        title: "",
        authors: name || "Author",
        venue: "",
        year: new Date().getFullYear(),
        type: "JOURNAL",
        doi: "",
        url: "",
      },
    ]);
  };

  // Helper: Quick-Add Personal Publication by Fetching from DOI
  const handleQuickAddPersonalPublicationByDoi = async () => {
    if (!quickDoiInput.trim()) {
      toast("Please paste a DOI or DOI link first", "error");
      return;
    }

    setFetchingQuickDoi(true);
    try {
      const res = await fetchPublicationMetadataByDoi(quickDoiInput);
      if (res.success && res.data) {
        const meta = res.data;
        const newPub: PersonalPublication = {
          id: `pub_${Date.now()}`,
          title: meta.title,
          authors: meta.authors || name || "Author",
          venue: meta.venue || "",
          year: meta.year || new Date().getFullYear(),
          type: meta.type || "JOURNAL",
          doi: meta.doi || quickDoiInput.trim(),
          url: meta.url || "",
        };
        setPersonalPublications([newPub, ...personalPublications]);
        setQuickDoiInput("");
        toast(`Added: "${meta.title.slice(0, 45)}..."`, "success");
      } else {
        toast(res.error || "DOI not found. You can add it manually below.", "error");
      }
    } catch {
      toast("Failed to fetch DOI metadata. Please add details manually.", "error");
    } finally {
      setFetchingQuickDoi(false);
    }
  };

  // Helper: Auto-Fetch & Update a specific existing publication item via its DOI field
  const handleAutoFetchDoiForItem = async (idx: number, rawDoi?: string) => {
    if (!rawDoi || !rawDoi.trim()) {
      toast("Please enter a DOI in the field first", "error");
      return;
    }

    setFetchingDoiIndex(idx);
    try {
      const res = await fetchPublicationMetadataByDoi(rawDoi);
      if (res.success && res.data) {
        const meta = res.data;
        const updated = [...personalPublications];
        if (meta.title) updated[idx].title = meta.title;
        if (meta.authors) updated[idx].authors = meta.authors;
        if (meta.venue) updated[idx].venue = meta.venue;
        if (meta.year) updated[idx].year = meta.year;
        if (meta.type) updated[idx].type = meta.type;
        if (meta.doi) updated[idx].doi = meta.doi;
        if (meta.url) updated[idx].url = meta.url;
        setPersonalPublications(updated);
        toast(`Auto-filled: "${meta.title.slice(0, 45)}..."`, "success");
      } else {
        toast(res.error || "DOI not found. You can adjust details manually.", "error");
      }
    } catch {
      toast("Failed to fetch DOI metadata.", "error");
    } finally {
      setFetchingDoiIndex(null);
    }
  };

  // Helper for adding Education
  const handleAddEducation = () => {
    setEducationList([
      ...educationList,
      {
        id: `edu_${Date.now()}`,
        degree: "B.Sc. in Biotechnology",
        institution: "Jahangirnagar University",
        year: new Date().getFullYear(),
        field: "Biotechnology & Genetic Engineering",
      },
    ]);
  };

  // Helper for adding Award
  const handleAddAward = () => {
    setAwardsList([
      ...awardsList,
      {
        id: `award_${Date.now()}`,
        title: "Dean's Excellence Award",
        issuer: "Jahangirnagar University",
        year: new Date().getFullYear(),
      },
    ]);
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

    const validPersonalProjects = personalProjects.filter((p) => p.title.trim() !== "");
    const validPersonalPublications = personalPublications.filter((p) => p.title.trim() !== "");
    const validEducation = educationList.filter((e) => e.degree.trim() !== "");
    const validAwards = awardsList.filter((a) => a.title.trim() !== "");

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
          personalProjects: validPersonalProjects,
          personalPublications: validPersonalPublications,
          education: validEducation,
          awards: validAwards,
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
          personalProjects: validPersonalProjects,
          personalPublications: validPersonalPublications,
          education: validEducation,
          awards: validAwards,
          projectIds: selectedProjectIds,
          publicationIds: selectedPublicationIds,
        });
        toast("New team profile created successfully", "success");
      }
      setDialogOpen(false);
      setSubmitting(false);
      React.startTransition(() => {
        router.refresh();
      });
    } catch (err: unknown) {
      toast(err instanceof Error ? err.message : "Operation failed", "error");
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string, memberName: string) => {
    if (!window.confirm(`Delete "${memberName}" from team roster?`)) return;

    const previousData = data;
    setData((prev) => prev.filter((m) => m.id !== id));

    try {
      await deleteTeamMember(id);
      toast("Member removed", "success");
      React.startTransition(() => {
        router.refresh();
      });
    } catch (err: unknown) {
      setData(previousData);
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
          <div className="relative w-9 h-9 rounded border border-[var(--border)] bg-[var(--surface-raised)] overflow-hidden shrink-0 flex items-center justify-center font-bold text-xs text-[var(--bio-teal)]">
            {item.photoUrl ? (
              <Image
                src={item.photoUrl}
                alt={item.name}
                fill
                unoptimized
                className="object-cover"
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
      header: "Dynamic Works",
      render: (item) => {
        const totalProjects = item.projectIds.length + (item.personalProjects?.length || 0);
        const totalPubs = item.publicationIds.length + (item.personalPublications?.length || 0);
        return (
          <div className="flex items-center gap-2 text-[11px] font-mono">
            <span
              className={`px-2 py-0.5 rounded border ${
                totalProjects > 0
                  ? "border-[var(--brand-primary)]/40 bg-[var(--brand-primary-subtle)] text-[var(--brand-primary)] font-semibold"
                  : "border-[var(--border)] text-[var(--text-muted)] bg-[var(--surface-raised)]"
              }`}
            >
              {totalProjects} Projects
            </span>
            <span
              className={`px-2 py-0.5 rounded border ${
                totalPubs > 0
                  ? "border-[var(--bio-emerald)]/40 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-semibold"
                  : "border-[var(--border)] text-[var(--text-muted)] bg-[var(--surface-raised)]"
              }`}
            >
              {totalPubs} Papers
            </span>
          </div>
        );
      },
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
        description="Manage faculty, scholars, personal projects, publications, degrees, and dynamic repository links."
        columns={columns}
        data={data}
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
        size="4xl"
        title={editingItem ? `Edit Profile: ${editingItem.name}` : "Create Team Member Profile"}
        description="Configure academic role, credentials, research domains, personal projects, and publications."
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Form Tabs Bar */}
          <div className="flex items-center gap-1 border-b border-[var(--border)] pb-2 overflow-x-auto">
            <button
              type="button"
              onClick={() => setActiveTab("identity")}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors flex items-center gap-1.5 shrink-0 ${
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
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors flex items-center gap-1.5 shrink-0 ${
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
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors flex items-center gap-1.5 shrink-0 ${
                activeTab === "links"
                  ? "bg-[var(--brand-primary)] text-white font-semibold"
                  : "text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-raised)]"
              }`}
            >
              <Globe className="w-3.5 h-3.5" />
              <span>3. Links</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("projects")}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors flex items-center gap-1.5 shrink-0 ${
                activeTab === "projects"
                  ? "bg-[var(--brand-primary)] text-white font-semibold"
                  : "text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-raised)]"
              }`}
            >
              <FolderKanban className="w-3.5 h-3.5" />
              <span>4. Projects ({selectedProjectIds.length + personalProjects.length})</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("publications")}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors flex items-center gap-1.5 shrink-0 ${
                activeTab === "publications"
                  ? "bg-[var(--brand-primary)] text-white font-semibold"
                  : "text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-raised)]"
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>5. Publications ({selectedPublicationIds.length + personalPublications.length})</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("education")}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors flex items-center gap-1.5 shrink-0 ${
                activeTab === "education"
                  ? "bg-[var(--brand-primary)] text-white font-semibold"
                  : "text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-raised)]"
              }`}
            >
              <GraduationCap className="w-3.5 h-3.5" />
              <span>6. Education & Awards ({educationList.length + awardsList.length})</span>
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
                      className="w-full rounded-md border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-sm text-[var(--text-primary)] focus:outline-none"
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

            {/* TAB 4: Involved Research Projects (Both Lab & Personal Projects) */}
            {activeTab === "projects" && (
              <div className="space-y-6">
                {/* SECTION A: Personal / Specific Projects */}
                <div className="space-y-3 p-4 rounded-md border border-[var(--border)] bg-[var(--surface-raised)]">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-xs font-bold text-[var(--text-primary)] flex items-center gap-1.5">
                        <FolderKanban className="w-3.5 h-3.5 text-[var(--brand-primary)]" />
                        Personal & Independent Research Projects ({personalProjects.length})
                      </h4>
                      <p className="text-[11px] text-[var(--text-muted)]">
                        Add candidate-specific thesis projects, independent grants, or previous research.
                      </p>
                    </div>
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      onClick={handleAddPersonalProject}
                      className="text-xs gap-1"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add Personal Project</span>
                    </Button>
                  </div>

                  {personalProjects.length === 0 ? (
                    <div className="p-3 text-center text-xs font-mono text-[var(--text-muted)] border border-dashed border-[var(--border)] rounded-md bg-[var(--surface)]">
                      No personal projects added yet. Click &ldquo;Add Personal Project&rdquo; to add thesis or individual research.
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {personalProjects.map((p, idx) => (
                        <div
                          key={p.id || idx}
                          className="p-3.5 rounded-md border border-[var(--border)] bg-[var(--surface)] space-y-3 shadow-2xs"
                        >
                          <div className="flex items-center justify-between gap-2 border-b border-[var(--border)] pb-2">
                            <span className="text-xs font-bold font-mono text-[var(--brand-primary)]">
                              Project #{idx + 1}
                            </span>
                            <button
                              type="button"
                              onClick={() => {
                                setPersonalProjects(personalProjects.filter((_, i) => i !== idx));
                              }}
                              className="text-[11px] text-[var(--danger)] hover:underline flex items-center gap-1 font-mono"
                            >
                              <Trash2 className="w-3 h-3" />
                              <span>Remove</span>
                            </button>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div className="space-y-1 sm:col-span-2">
                              <label className="text-[11px] font-mono text-[var(--text-secondary)]">
                                PROJECT TITLE *
                              </label>
                              <Input
                                value={p.title}
                                onChange={(e) => {
                                  const updated = [...personalProjects];
                                  updated[idx].title = e.target.value;
                                  setPersonalProjects(updated);
                                }}
                                placeholder="e.g. Investigation into Microbial Polyhydroxyalkanoate Synthesis"
                              />
                            </div>

                            <div className="space-y-1">
                              <label className="text-[11px] font-mono text-[var(--text-secondary)]">
                                ROLE IN PROJECT
                              </label>
                              <Input
                                value={p.role || ""}
                                onChange={(e) => {
                                  const updated = [...personalProjects];
                                  updated[idx].role = e.target.value;
                                  setPersonalProjects(updated);
                                }}
                                placeholder="e.g. Lead Investigator / Thesis Scholar"
                              />
                            </div>

                            <div className="space-y-1">
                              <label className="text-[11px] font-mono text-[var(--text-secondary)]">
                                STATUS
                              </label>
                              <select
                                className="w-full rounded-md border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-xs text-[var(--text-primary)]"
                                value={p.status || "ACTIVE"}
                                onChange={(e) => {
                                  const updated = [...personalProjects];
                                  updated[idx].status = e.target.value;
                                  setPersonalProjects(updated);
                                }}
                              >
                                <option value="ACTIVE">ACTIVE</option>
                                <option value="COMPLETED">COMPLETED</option>
                                <option value="UPCOMING">UPCOMING</option>
                              </select>
                            </div>

                            <div className="space-y-1">
                              <label className="text-[11px] font-mono text-[var(--text-secondary)]">
                                START YEAR
                              </label>
                              <Input
                                type="number"
                                value={p.startYear || ""}
                                onChange={(e) => {
                                  const updated = [...personalProjects];
                                  updated[idx].startYear = e.target.value;
                                  setPersonalProjects(updated);
                                }}
                              />
                            </div>

                            <div className="space-y-1">
                              <label className="text-[11px] font-mono text-[var(--text-secondary)]">
                                END YEAR
                              </label>
                              <Input
                                type="number"
                                value={p.endYear || ""}
                                onChange={(e) => {
                                  const updated = [...personalProjects];
                                  updated[idx].endYear = e.target.value;
                                  setPersonalProjects(updated);
                                }}
                                placeholder="Leave blank if active"
                              />
                            </div>

                            <div className="space-y-1">
                              <label className="text-[11px] font-mono text-[var(--text-secondary)]">
                                FUNDER / INSTITUTION
                              </label>
                              <Input
                                value={p.funder || ""}
                                onChange={(e) => {
                                  const updated = [...personalProjects];
                                  updated[idx].funder = e.target.value;
                                  setPersonalProjects(updated);
                                }}
                                placeholder="e.g. UGC / MoST / Jahangirnagar University"
                              />
                            </div>

                            <div className="space-y-1">
                              <label className="text-[11px] font-mono text-[var(--text-secondary)]">
                                PROJECT LINK / DOSSIER URL
                              </label>
                              <Input
                                value={p.link || ""}
                                onChange={(e) => {
                                  const updated = [...personalProjects];
                                  updated[idx].link = e.target.value;
                                  setPersonalProjects(updated);
                                }}
                                placeholder="https://..."
                              />
                            </div>

                            <div className="space-y-1 sm:col-span-2">
                              <label className="text-[11px] font-mono text-[var(--text-secondary)]">
                                SUMMARY & FINDINGS
                              </label>
                              <Textarea
                                rows={2}
                                value={p.summary || ""}
                                onChange={(e) => {
                                  const updated = [...personalProjects];
                                  updated[idx].summary = e.target.value;
                                  setPersonalProjects(updated);
                                }}
                                placeholder="Brief abstract of the project methodologies and results..."
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* SECTION B: Shared Lab Repository Projects */}
                <div className="space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[var(--border)] pb-2">
                    <div>
                      <h4 className="text-xs font-bold text-[var(--text-primary)]">
                        Link Shared Laboratory Projects ({selectedProjectIds.length})
                      </h4>
                      <p className="text-[11px] text-[var(--text-muted)]">
                        Select from central BTIB Lab project initiatives.
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
                      placeholder="Search shared lab projects..."
                      className="pl-8 text-xs"
                    />
                  </div>

                  {/* Projects List */}
                  {filteredProjects.length === 0 ? (
                    <div className="p-4 text-center text-xs font-mono text-[var(--text-muted)] border border-[var(--border)] rounded-md">
                      No matching projects found.
                    </div>
                  ) : (
                    <div className="space-y-2 max-h-[30vh] overflow-y-auto pr-1">
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
                            className={`p-3 rounded-md border transition-all cursor-pointer flex items-start justify-between gap-3 ${
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
              </div>
            )}

            {/* TAB 5: Authored Publications (Both Lab & Personal Publications) */}
            {activeTab === "publications" && (
              <div className="space-y-6">
                {/* SECTION A: Personal Publications */}
                <div className="space-y-4 p-4 rounded-md border border-[var(--border)] bg-[var(--surface-raised)]">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[var(--border)] pb-3">
                    <div>
                      <h4 className="text-xs font-bold text-[var(--text-primary)] flex items-center gap-1.5">
                        <BookOpen className="w-3.5 h-3.5 text-[var(--bio-emerald)]" />
                        <span>Personal & External Publications ({personalPublications.length})</span>
                      </h4>
                      <p className="text-[11px] text-[var(--text-muted)]">
                        Add individual papers, previous research articles, or external book chapters with automated DOI lookup or manual typing.
                      </p>
                    </div>

                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      onClick={handleAddPersonalPublication}
                      className="text-xs gap-1 shrink-0"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add Manually</span>
                    </Button>
                  </div>

                  {/* Quick-Add via DOI Box */}
                  <div className="p-3 rounded-md border border-[var(--bio-emerald)]/30 bg-[var(--bio-emerald)]/5 space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="text-[11px] font-mono font-bold text-[var(--bio-emerald)] flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>QUICK-ADD VIA DOI (MAGIC AUTO-FETCH)</span>
                      </label>
                      <span className="text-[10px] font-mono text-[var(--text-muted)]">
                        CrossRef / DOI.org
                      </span>
                    </div>

                    <div className="flex gap-2">
                      <Input
                        value={quickDoiInput}
                        onChange={(e) => setQuickDoiInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            handleQuickAddPersonalPublicationByDoi();
                          }
                        }}
                        placeholder="Paste DOI (e.g. 10.1016/j.biortech.2023.129400 or https://doi.org/...)"
                        className="text-xs bg-[var(--surface)] border-[var(--border)]"
                      />
                      <Button
                        type="button"
                        onClick={handleQuickAddPersonalPublicationByDoi}
                        disabled={fetchingQuickDoi}
                        className="shrink-0 text-xs gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs"
                      >
                        {fetchingQuickDoi ? (
                          <>
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            <span>Fetching...</span>
                          </>
                        ) : (
                          <>
                            <Sparkles className="w-3.5 h-3.5" />
                            <span>Fetch & Add</span>
                          </>
                        )}
                      </Button>
                    </div>
                  </div>

                  {personalPublications.length === 0 ? (
                    <div className="p-4 text-center text-xs font-mono text-[var(--text-muted)] border border-dashed border-[var(--border)] rounded-md bg-[var(--surface)] space-y-1">
                      <p>No personal publications added yet.</p>
                      <p className="text-[11px] text-[var(--text-secondary)] font-sans">
                        Paste a DOI above for instant auto-fill, or click &ldquo;Add Manually&rdquo; to type paper details directly.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {personalPublications.map((pub, idx) => (
                        <div
                          key={pub.id || idx}
                          className="p-3.5 rounded-md border border-[var(--border)] bg-[var(--surface)] space-y-3 shadow-2xs"
                        >
                          <div className="flex items-center justify-between gap-2 border-b border-[var(--border)] pb-2">
                            <span className="text-xs font-bold font-mono text-[var(--bio-emerald)]">
                              Publication #{idx + 1}
                            </span>
                            <button
                              type="button"
                              onClick={() => {
                                setPersonalPublications(personalPublications.filter((_, i) => i !== idx));
                              }}
                              className="text-[11px] text-[var(--danger)] hover:underline flex items-center gap-1 font-mono"
                            >
                              <Trash2 className="w-3 h-3" />
                              <span>Remove</span>
                            </button>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {/* Inline DOI Fetch Helper inside Card */}
                            <div className="space-y-1 sm:col-span-2">
                              <label className="text-[11px] font-mono text-[var(--text-secondary)] flex items-center justify-between">
                                <span>DOI IDENTIFIER OR LINK</span>
                                <span className="text-[10px] text-[var(--text-muted)]">
                                  Click &apos;Auto-Fetch&apos; to populate details
                                </span>
                              </label>
                              <div className="flex gap-2">
                                <Input
                                  value={pub.doi || ""}
                                  onChange={(e) => {
                                    const updated = [...personalPublications];
                                    updated[idx].doi = e.target.value;
                                    setPersonalPublications(updated);
                                  }}
                                  placeholder="10.1371/journal.pone.0292931 or https://doi.org/..."
                                  className="text-xs"
                                />
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="sm"
                                  disabled={fetchingDoiIndex === idx}
                                  onClick={() => handleAutoFetchDoiForItem(idx, pub.doi)}
                                  className="shrink-0 text-xs gap-1 border-[var(--bio-emerald)]/40 text-[var(--bio-emerald)] hover:bg-[var(--bio-emerald)]/10"
                                >
                                  {fetchingDoiIndex === idx ? (
                                    <>
                                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                      <span>Fetching...</span>
                                    </>
                                  ) : (
                                    <>
                                      <Sparkles className="w-3.5 h-3.5" />
                                      <span>Auto-Fetch</span>
                                    </>
                                  )}
                                </Button>
                              </div>
                            </div>

                            <div className="space-y-1 sm:col-span-2">
                              <label className="text-[11px] font-mono text-[var(--text-secondary)]">
                                ARTICLE / CHAPTER TITLE *
                              </label>
                              <Input
                                value={pub.title}
                                onChange={(e) => {
                                  const updated = [...personalPublications];
                                  updated[idx].title = e.target.value;
                                  setPersonalPublications(updated);
                                }}
                                placeholder="e.g. Bioactive profiling of indigenous isolates"
                              />
                            </div>

                            <div className="space-y-1 sm:col-span-2">
                              <label className="text-[11px] font-mono text-[var(--text-secondary)]">
                                AUTHORS (IN ORDER)
                              </label>
                              <Input
                                value={pub.authors || ""}
                                onChange={(e) => {
                                  const updated = [...personalPublications];
                                  updated[idx].authors = e.target.value;
                                  setPersonalPublications(updated);
                                }}
                                placeholder="Rahman MS, Khan AW, et al."
                              />
                            </div>

                            <div className="space-y-1">
                              <label className="text-[11px] font-mono text-[var(--text-secondary)]">
                                JOURNAL / VENUE
                              </label>
                              <Input
                                value={pub.venue || ""}
                                onChange={(e) => {
                                  const updated = [...personalPublications];
                                  updated[idx].venue = e.target.value;
                                  setPersonalPublications(updated);
                                }}
                                placeholder="e.g. PLOS ONE / Elsevier"
                              />
                            </div>

                            <div className="space-y-1">
                              <label className="text-[11px] font-mono text-[var(--text-secondary)]">
                                YEAR
                              </label>
                              <Input
                                type="number"
                                value={pub.year || ""}
                                onChange={(e) => {
                                  const updated = [...personalPublications];
                                  updated[idx].year = e.target.value;
                                  setPersonalPublications(updated);
                                }}
                              />
                            </div>

                            <div className="space-y-1 sm:col-span-2">
                              <label className="text-[11px] font-mono text-[var(--text-secondary)]">
                                DIRECT PAPER / OPEN ACCESS URL
                              </label>
                              <Input
                                value={pub.url || ""}
                                onChange={(e) => {
                                  const updated = [...personalPublications];
                                  updated[idx].url = e.target.value;
                                  setPersonalPublications(updated);
                                }}
                                placeholder="https://..."
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* SECTION B: Shared Lab Repository Publications */}
                <div className="space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[var(--border)] pb-2">
                    <div>
                      <h4 className="text-xs font-bold text-[var(--text-primary)]">
                        Link Central Laboratory Publications ({selectedPublicationIds.length})
                      </h4>
                      <p className="text-[11px] text-[var(--text-muted)]">
                        Map peer-reviewed articles from the central laboratory database.
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
                      placeholder="Search central publications by title, venue, or year..."
                      className="pl-8 text-xs"
                    />
                  </div>

                  {/* Publications List */}
                  {filteredPublications.length === 0 ? (
                    <div className="p-4 text-center text-xs font-mono text-[var(--text-muted)] border border-[var(--border)] rounded-md">
                      No matching publications found.
                    </div>
                  ) : (
                    <div className="space-y-2 max-h-[30vh] overflow-y-auto pr-1">
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
                            className={`p-3 rounded-md border transition-all cursor-pointer flex items-start justify-between gap-3 ${
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
              </div>
            )}

            {/* TAB 6: Academic Education & Honors / Awards */}
            {activeTab === "education" && (
              <div className="space-y-6">
                {/* Education Section */}
                <div className="space-y-3 p-4 rounded-md border border-[var(--border)] bg-[var(--surface-raised)]">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-xs font-bold text-[var(--text-primary)] flex items-center gap-1.5">
                        <GraduationCap className="w-3.5 h-3.5 text-[var(--brand-primary)]" />
                        Academic Degrees & Qualifications ({educationList.length})
                      </h4>
                      <p className="text-[11px] text-[var(--text-muted)]">
                        Add degrees (Ph.D., D.Engg, M.Sc., B.Sc.) and academic institutions.
                      </p>
                    </div>
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      onClick={handleAddEducation}
                      className="text-xs gap-1"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add Degree</span>
                    </Button>
                  </div>

                  {educationList.length === 0 ? (
                    <div className="p-3 text-center text-xs font-mono text-[var(--text-muted)] border border-dashed border-[var(--border)] rounded-md bg-[var(--surface)]">
                      No education records added yet. Click &ldquo;Add Degree&rdquo; to add qualifications.
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {educationList.map((edu, idx) => (
                        <div
                          key={edu.id || idx}
                          className="p-3.5 rounded-md border border-[var(--border)] bg-[var(--surface)] space-y-3 shadow-2xs"
                        >
                          <div className="flex items-center justify-between gap-2 border-b border-[var(--border)] pb-2">
                            <span className="text-xs font-bold font-mono text-[var(--brand-primary)]">
                              Degree #{idx + 1}
                            </span>
                            <button
                              type="button"
                              onClick={() => {
                                setEducationList(educationList.filter((_, i) => i !== idx));
                              }}
                              className="text-[11px] text-[var(--danger)] hover:underline flex items-center gap-1 font-mono"
                            >
                              <Trash2 className="w-3 h-3" />
                              <span>Remove</span>
                            </button>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div className="space-y-1 sm:col-span-2">
                              <label className="text-[11px] font-mono text-[var(--text-secondary)]">
                                DEGREE / TITLE *
                              </label>
                              <Input
                                value={edu.degree}
                                onChange={(e) => {
                                  const updated = [...educationList];
                                  updated[idx].degree = e.target.value;
                                  setEducationList(updated);
                                }}
                                placeholder="e.g. Doctor of Engineering (D.Engg)"
                              />
                            </div>

                            <div className="space-y-1">
                              <label className="text-[11px] font-mono text-[var(--text-secondary)]">
                                INSTITUTION / UNIVERSITY
                              </label>
                              <Input
                                value={edu.institution}
                                onChange={(e) => {
                                  const updated = [...educationList];
                                  updated[idx].institution = e.target.value;
                                  setEducationList(updated);
                                }}
                                placeholder="e.g. Tokyo Institute of Technology, Japan"
                              />
                            </div>

                            <div className="space-y-1">
                              <label className="text-[11px] font-mono text-[var(--text-secondary)]">
                                YEAR
                              </label>
                              <Input
                                type="number"
                                value={edu.year || ""}
                                onChange={(e) => {
                                  const updated = [...educationList];
                                  updated[idx].year = e.target.value;
                                  setEducationList(updated);
                                }}
                              />
                            </div>

                            <div className="space-y-1 sm:col-span-2">
                              <label className="text-[11px] font-mono text-[var(--text-secondary)]">
                                SPECIALIZATION / MAJOR
                              </label>
                              <Input
                                value={edu.field || ""}
                                onChange={(e) => {
                                  const updated = [...educationList];
                                  updated[idx].field = e.target.value;
                                  setEducationList(updated);
                                }}
                                placeholder="e.g. Industrial Biotechnology & Bioprocess"
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Awards Section */}
                <div className="space-y-3 p-4 rounded-md border border-[var(--border)] bg-[var(--surface-raised)]">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-xs font-bold text-[var(--text-primary)] flex items-center gap-1.5">
                        <Award className="w-3.5 h-3.5 text-amber-500" />
                        Honors, Grants & Awards ({awardsList.length})
                      </h4>
                      <p className="text-[11px] text-[var(--text-muted)]">
                        Add academic recognition, research fellowships, or competitive grants.
                      </p>
                    </div>
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      onClick={handleAddAward}
                      className="text-xs gap-1"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add Honor/Award</span>
                    </Button>
                  </div>

                  {awardsList.length === 0 ? (
                    <div className="p-3 text-center text-xs font-mono text-[var(--text-muted)] border border-dashed border-[var(--border)] rounded-md bg-[var(--surface)]">
                      No honors or awards recorded yet. Click &ldquo;Add Honor/Award&rdquo; to add accolades.
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {awardsList.map((aw, idx) => (
                        <div
                          key={aw.id || idx}
                          className="p-3.5 rounded-md border border-[var(--border)] bg-[var(--surface)] space-y-3 shadow-2xs"
                        >
                          <div className="flex items-center justify-between gap-2 border-b border-[var(--border)] pb-2">
                            <span className="text-xs font-bold font-mono text-amber-600 dark:text-amber-400">
                              Honor #{idx + 1}
                            </span>
                            <button
                              type="button"
                              onClick={() => {
                                setAwardsList(awardsList.filter((_, i) => i !== idx));
                              }}
                              className="text-[11px] text-[var(--danger)] hover:underline flex items-center gap-1 font-mono"
                            >
                              <Trash2 className="w-3 h-3" />
                              <span>Remove</span>
                            </button>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                            <div className="space-y-1 sm:col-span-2">
                              <label className="text-[11px] font-mono text-[var(--text-secondary)]">
                                AWARD TITLE *
                              </label>
                              <Input
                                value={aw.title}
                                onChange={(e) => {
                                  const updated = [...awardsList];
                                  updated[idx].title = e.target.value;
                                  setAwardsList(updated);
                                }}
                                placeholder="e.g. Best Researcher Award"
                              />
                            </div>

                            <div className="space-y-1">
                              <label className="text-[11px] font-mono text-[var(--text-secondary)]">
                                YEAR
                              </label>
                              <Input
                                type="number"
                                value={aw.year || ""}
                                onChange={(e) => {
                                  const updated = [...awardsList];
                                  updated[idx].year = e.target.value;
                                  setAwardsList(updated);
                                }}
                              />
                            </div>

                            <div className="space-y-1 sm:col-span-3">
                              <label className="text-[11px] font-mono text-[var(--text-secondary)]">
                                ISSUING BODY / INSTITUTION
                              </label>
                              <Input
                                value={aw.issuer || ""}
                                onChange={(e) => {
                                  const updated = [...awardsList];
                                  updated[idx].issuer = e.target.value;
                                  setAwardsList(updated);
                                }}
                                placeholder="e.g. Ministry of Science and Technology, Bangladesh"
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Form Actions Footer */}
          <div className="flex items-center justify-between pt-4 border-t border-[var(--border)]">
            <div className="text-xs font-mono text-[var(--text-muted)]">
              {selectedProjectIds.length + personalProjects.length} Projects · {selectedPublicationIds.length + personalPublications.length} Publications
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
