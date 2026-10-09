"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { createFacultyAccountAction } from "@/server/actions/faculty";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  GraduationCap,
  UserPlus,
  Phone,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Users,
  Search,
  Copy,
  Check,
} from "lucide-react";

interface FacultyItem {
  id: string;
  name: string | null;
  email: string;
  designation: string;
  department: string;
  officeRoom: string | null;
  phone: string | null;
  studentCount: number;
}

interface FacultyAdminClientProps {
  initialFaculty: FacultyItem[];
}

export function FacultyAdminClient({ initialFaculty }: FacultyAdminClientProps) {
  const router = useRouter();
  const [facultyList] = React.useState<FacultyItem[]>(initialFaculty);
  const [showGenerator, setShowGenerator] = React.useState(false);

  // Form State
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("BtibFaculty@2026");
  const [designation, setDesignation] = React.useState("Professor");
  const [department, setDepartment] = React.useState("Department of Biotechnology & Genetic Engineering");
  const [officeRoom, setOfficeRoom] = React.useState("");
  const [phone, setPhone] = React.useState("");
  const [employeeId, setEmployeeId] = React.useState("");
  const [researchFocus, setResearchFocus] = React.useState("");

  const [submitting, setSubmitting] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [successCreds, setSuccessCreds] = React.useState<{ email: string; pass: string } | null>(null);
  const [copied, setCopied] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState("");

  const handleGenerateFaculty = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessCreds(null);
    setSubmitting(true);

    try {
      const res = await createFacultyAccountAction({
        name,
        email,
        password,
        designation,
        department,
        officeRoom: officeRoom ? officeRoom : undefined,
        phone: phone ? phone : undefined,
        employeeId: employeeId ? employeeId : undefined,
        researchFocus: researchFocus ? researchFocus : undefined,
      });

      if (!res.success) {
        setError(res.error || "Failed to create faculty account.");
      } else {
        setSuccessCreds({ email, pass: password });
        setName("");
        setEmail("");
        setPassword("BtibFaculty@2026");
        setOfficeRoom("");
        setPhone("");
        setEmployeeId("");
        setResearchFocus("");
        setShowGenerator(false);
        router.refresh();
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "An unexpected error occurred.";
      setError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  const copyCredentials = () => {
    if (!successCreds) return;
    navigator.clipboard.writeText(`Faculty Login:\nEmail: ${successCreds.email}\nPassword: ${successCreds.pass}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const filteredFaculty = facultyList.filter((f) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      (f.name && f.name.toLowerCase().includes(q)) ||
      f.email.toLowerCase().includes(q) ||
      f.designation.toLowerCase().includes(q)
    );
  });

  return (
    <div className="p-6 sm:p-8 space-y-8 max-w-7xl mx-auto">
      {/* 1. Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-md border border-[var(--border)] bg-[var(--surface)] shadow-xs">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="specimen-tag text-[10px] py-0 px-2 font-bold uppercase">
              Super Admin Direct Provisioning
            </span>
            <span className="text-xs font-mono text-[var(--text-secondary)]">
              {facultyList.length} Active Faculty
            </span>
          </div>

          <h1 className="text-2xl font-bold font-sans tracking-tight text-[var(--text-primary)] flex items-center gap-2">
            <GraduationCap className="w-6 h-6 text-purple-600" />
            <span>Faculty Management & Account Generator</span>
          </h1>

          <p className="text-xs sm:text-sm text-[var(--text-secondary)] max-w-2xl font-light">
            Directly provision teacher accounts for busy professors who don&apos;t have time to self-register.
            Faculty accounts can supervise scholars, approve thesis registrations, and verify experiment logs.
          </p>
        </div>

        <div>
          <Button
            onClick={() => setShowGenerator(!showGenerator)}
            className="bg-purple-600 hover:bg-purple-700 text-white text-xs px-4 py-2.5 rounded-md flex items-center gap-2 shadow-sm font-semibold"
          >
            <UserPlus className="w-4 h-4" />
            <span>{showGenerator ? "Hide Generator" : "Provision New Faculty"}</span>
          </Button>
        </div>
      </div>

      {/* 2. Success Alert with Copyable Credentials */}
      {successCreds && (
        <div className="p-5 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-emerald-800 dark:text-emerald-200 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              <span className="font-bold text-sm">Faculty Account Created Successfully!</span>
            </div>
            <Button
              size="sm"
              variant="outline"
              onClick={copyCredentials}
              className="text-xs border-emerald-500/30 hover:bg-emerald-500/20"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 mr-1 text-emerald-600" />
                  <span>Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 mr-1" />
                  <span>Copy Credentials</span>
                </>
              )}
            </Button>
          </div>
          <div className="p-3 rounded bg-[var(--surface)] text-xs font-mono border border-[var(--border)] text-[var(--text-primary)] space-y-1">
            <div>
              <span className="text-[var(--text-secondary)]">Login Email: </span>
              <span className="font-semibold">{successCreds.email}</span>
            </div>
            <div>
              <span className="text-[var(--text-secondary)]">Initial Password: </span>
              <span className="font-semibold">{successCreds.pass}</span>
            </div>
          </div>
          <p className="text-xs text-emerald-700 dark:text-emerald-300">
            Send these credentials to the professor. They can log in immediately at <span className="font-mono">/login</span> to access their Faculty Portal.
          </p>
        </div>
      )}

      {/* 3. Direct Provisioning Form */}
      {showGenerator && (
        <form
          onSubmit={handleGenerateFaculty}
          className="p-6 sm:p-8 rounded-md border border-purple-500/30 bg-[var(--surface)] shadow-md space-y-6 relative overflow-hidden"
        >
          <div className="space-y-1">
            <h2 className="text-lg font-bold font-sans text-[var(--text-primary)] flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-purple-600" />
              <span>Direct Faculty Account Provisioning</span>
            </h2>
            <p className="text-xs text-[var(--text-secondary)]">
              This immediately creates a verified faculty account with supervisory and verification rights.
            </p>
          </div>

          {error && (
            <div className="p-4 rounded bg-red-500/10 border border-red-500/20 text-red-600 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)]">
                Full Name *
              </label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Dr. Shahedur Rahman"
                required
                className="bg-[var(--surface-raised)] border-[var(--border)]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)]">
                Institutional Email *
              </label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="e.g. srahman@juniv.edu"
                required
                className="bg-[var(--surface-raised)] border-[var(--border)]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)]">
                Initial Password *
              </label>
              <Input
                type="text"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="bg-[var(--surface-raised)] border-[var(--border)] font-mono text-xs"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)]">
                Designation *
              </label>
              <select
                value={designation}
                onChange={(e) => setDesignation(e.target.value)}
                className="w-full h-10 px-3 rounded-md border border-[var(--border)] bg-[var(--surface-raised)] text-[var(--text-primary)] text-sm focus:ring-2 focus:ring-purple-500"
                required
              >
                <option value="Professor">Professor</option>
                <option value="Associate Professor">Associate Professor</option>
                <option value="Assistant Professor">Assistant Professor</option>
                <option value="Lecturer">Lecturer</option>
                <option value="Adjunct Faculty">Adjunct Faculty</option>
                <option value="Principal Investigator">Principal Investigator</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)]">
                Office / Room No.
              </label>
              <Input
                value={officeRoom}
                onChange={(e) => setOfficeRoom(e.target.value)}
                placeholder="e.g. Room 304, Academic Bldg"
                className="bg-[var(--surface-raised)] border-[var(--border)]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)]">
                Official Phone
              </label>
              <Input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="e.g. +880 1712-345678"
                className="bg-[var(--surface-raised)] border-[var(--border)]"
              />
            </div>

            <div className="space-y-1.5 md:col-span-2 lg:col-span-3">
              <label className="text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)]">
                Department & Institution
              </label>
              <Input
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="bg-[var(--surface-raised)] border-[var(--border)]"
              />
            </div>

            <div className="space-y-1.5 md:col-span-2 lg:col-span-3">
              <label className="text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)]">
                Research Focus & Field (Optional)
              </label>
              <Textarea
                value={researchFocus}
                onChange={(e) => setResearchFocus(e.target.value)}
                placeholder="e.g. Microbial Biotechnology, Molecular Diagnostics, Plant Tissue Culture..."
                rows={2}
                className="bg-[var(--surface-raised)] border-[var(--border)]"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-[var(--border)]">
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowGenerator(false)}
              className="text-xs"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={submitting}
              className="bg-purple-600 hover:bg-purple-700 text-white text-xs px-6 py-2.5 rounded-md font-medium"
            >
              {submitting ? "Generating Account..." : "Provision Faculty Account"}
            </Button>
          </div>
        </form>
      )}

      {/* 4. Active Faculty Directory Table */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <h2 className="text-lg font-bold font-sans text-[var(--text-primary)]">
            Department Faculty Roster
          </h2>

          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-secondary)]" />
            <Input
              type="text"
              placeholder="Search faculty name or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 h-9 text-xs bg-[var(--surface)] border-[var(--border)]"
            />
          </div>
        </div>

        {filteredFaculty.length === 0 ? (
          <div className="p-12 text-center rounded-md border border-dashed border-[var(--border)] bg-[var(--surface)] space-y-2">
            <GraduationCap className="w-10 h-10 text-[var(--text-secondary)] mx-auto opacity-40" />
            <p className="text-sm font-semibold text-[var(--text-primary)]">No faculty accounts found</p>
            <p className="text-xs text-[var(--text-secondary)]">
              Click &quot;Provision New Faculty&quot; above to add your first faculty member.
            </p>
          </div>
        ) : (
          <div className="rounded-md border border-[var(--border)] bg-[var(--surface)] overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-[var(--border)] bg-[var(--surface-raised)]/50 text-[var(--text-secondary)] font-mono uppercase tracking-wider">
                    <th className="p-3.5 pl-5">Faculty Member</th>
                    <th className="p-3.5">Designation</th>
                    <th className="p-3.5">Contact Details</th>
                    <th className="p-3.5">Office</th>
                    <th className="p-3.5">Supervised Scholars</th>
                    <th className="p-3.5 pr-5">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--border)]">
                  {filteredFaculty.map((f) => (
                    <tr key={f.id} className="hover:bg-[var(--surface-raised)]/30 transition-colors">
                      <td className="p-3.5 pl-5">
                        <div className="font-bold text-sm text-[var(--text-primary)]">
                          {f.name || "Faculty Member"}
                        </div>
                        <div className="text-[11px] font-mono text-[var(--text-secondary)]">
                          {f.email}
                        </div>
                      </td>
                      <td className="p-3.5">
                        <span className="font-medium text-[var(--text-primary)]">
                          {f.designation}
                        </span>
                        <div className="text-[11px] text-[var(--text-secondary)]">
                          {f.department}
                        </div>
                      </td>
                      <td className="p-3.5 text-[var(--text-secondary)]">
                        {f.phone ? (
                          <div className="flex items-center gap-1 font-mono">
                            <Phone className="w-3 h-3 text-[var(--text-secondary)]" />
                            <span>{f.phone}</span>
                          </div>
                        ) : (
                          <span className="text-[11px] italic">No phone added</span>
                        )}
                      </td>
                      <td className="p-3.5 text-[var(--text-secondary)] font-mono text-xs">
                        {f.officeRoom || "—"}
                      </td>
                      <td className="p-3.5">
                        <div className="flex items-center gap-1.5">
                          <Users className="w-3.5 h-3.5 text-purple-600" />
                          <span className="font-bold text-[var(--text-primary)]">
                            {f.studentCount}
                          </span>
                          <span className="text-[11px] text-[var(--text-secondary)]">
                            students
                          </span>
                        </div>
                      </td>
                      <td className="p-3.5 pr-5">
                        <span className="px-2.5 py-1 rounded text-[10px] font-mono font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                          ACTIVE
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
