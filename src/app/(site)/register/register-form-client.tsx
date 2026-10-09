"use client";

import * as React from "react";
import Link from "next/link";
import { registerStudentAction, StudentRegisterInput } from "@/server/actions/student";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AcademicProgram } from "@prisma/client";
import {
  GraduationCap,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  BookOpen,
  UserCheck,
} from "lucide-react";

interface FacultyOption {
  id: string;
  name: string;
  designation: string;
}

export function RegisterFormClient({ facultyList }: { facultyList: FacultyOption[] }) {
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [success, setSuccess] = React.useState(false);

  const [formData, setFormData] = React.useState<StudentRegisterInput>({
    name: "",
    email: "",
    password: "",
    studentId: "",
    program: AcademicProgram.BSC_THESIS,
    department: "Department of Biotechnology & Genetic Engineering",
    institution: "Jahangirnagar University",
    sessionYear: "2020-2021",
    batch: "49th Batch",
    supervisorId: facultyList[0]?.id || "",
    supervisorName: facultyList[0]?.name || "",
    thesisTitle: "",
    phone: "",
    idCardPhotoUrl: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSupervisorChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const supervisorId = e.target.value;
    const selected = facultyList.find((f) => f.id === supervisorId);
    setFormData((prev) => ({
      ...prev,
      supervisorId,
      supervisorName: selected ? `${selected.designation} ${selected.name}` : "",
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await registerStudentAction(formData);

      if (!res.success) {
        setError(res.error || "Failed to submit registration.");
      } else {
        setSuccess(true);
      }
    } catch {
      setError("An unexpected error occurred during registration.");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="p-8 sm:p-12 rounded-3xl border border-emerald-500/30 bg-emerald-500/5 text-center space-y-5 max-w-xl mx-auto shadow-lg">
        <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 mx-auto flex items-center justify-center">
          <CheckCircle2 className="w-9 h-9" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-black font-sans text-[var(--text-primary)]">
            Registration Submitted Successfully!
          </h2>
          <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed font-light">
            Your academic profile has been registered in the BTIB Laboratory system. As an institutional safety policy, all new student accounts are submitted for **faculty or administrator verification**.
          </p>
        </div>

        <div className="p-4 rounded-xl border border-[var(--border)] bg-[var(--surface)] text-left text-xs font-mono text-[var(--text-muted)] space-y-1">
          <div><span className="text-[var(--text-secondary)]">Student Name:</span> {formData.name}</div>
          <div><span className="text-[var(--text-secondary)]">Student / Roll ID:</span> {formData.studentId}</div>
          <div><span className="text-[var(--text-secondary)]">Supervisor:</span> {formData.supervisorName || "Assigned Faculty"}</div>
          <div><span className="text-[var(--text-secondary)]">Status:</span> <span className="text-amber-500 font-bold">PENDING APPROVAL</span></div>
        </div>

        <div className="pt-2">
          <Link
            href="/login"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[var(--brand-primary)] hover:bg-[var(--brand-primary-hover)] text-white text-xs font-bold transition-all shadow-sm"
          >
            <span>Proceed to Login Portal</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {error && (
        <div className="p-4 rounded-xl border border-red-500/30 bg-red-500/10 text-xs text-red-600 dark:text-red-400 flex items-start gap-2.5">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <span className="leading-relaxed">{error}</span>
        </div>
      )}

      {/* 1. Account Credentials */}
      <div className="space-y-4">
        <h3 className="text-xs font-mono uppercase tracking-wider text-[var(--text-muted)] flex items-center gap-2">
          <UserCheck className="w-4 h-4 text-[var(--brand-primary)]" />
          <span>1. User & Account Credentials</span>
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-mono text-[var(--text-secondary)]">Full Name *</label>
            <Input
              name="name"
              required
              placeholder="e.g. Ayesha Siddiqua"
              value={formData.name}
              onChange={handleChange}
              disabled={loading}
              className="h-10 rounded-xl"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-mono text-[var(--text-secondary)]">Institutional / Student Email *</label>
            <Input
              type="email"
              name="email"
              required
              placeholder="ayesha.student@juniv.edu"
              value={formData.email}
              onChange={handleChange}
              disabled={loading}
              className="h-10 rounded-xl"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-mono text-[var(--text-secondary)]">Password (min 8 chars) *</label>
            <Input
              type="password"
              name="password"
              required
              minLength={8}
              placeholder="••••••••••••"
              value={formData.password}
              onChange={handleChange}
              disabled={loading}
              className="h-10 rounded-xl"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-mono text-[var(--text-secondary)]">Phone Number *</label>
            <Input
              type="tel"
              name="phone"
              required
              placeholder="+880 1700-000000"
              value={formData.phone}
              onChange={handleChange}
              disabled={loading}
              className="h-10 rounded-xl"
            />
          </div>
        </div>
      </div>

      {/* 2. Academic & Thesis Information */}
      <div className="space-y-4 pt-4 border-t border-[var(--border)]">
        <h3 className="text-xs font-mono uppercase tracking-wider text-[var(--text-muted)] flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-[var(--brand-primary)]" />
          <span>2. Academic & Research Details</span>
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-mono text-[var(--text-secondary)]">JU Student / Roll ID *</label>
            <Input
              name="studentId"
              required
              placeholder="e.g. 2020365012"
              value={formData.studentId}
              onChange={handleChange}
              disabled={loading}
              className="h-10 rounded-xl"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-mono text-[var(--text-secondary)]">Academic Program *</label>
            <select
              name="program"
              value={formData.program}
              onChange={handleChange}
              disabled={loading}
              className="w-full h-10 px-3 rounded-xl border border-[var(--border)] bg-[var(--surface-raised)] text-xs text-[var(--text-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--brand-primary)]"
            >
              <option value={AcademicProgram.BSC_THESIS}>B.Sc (Hons) Thesis Student</option>
              <option value={AcademicProgram.MSC_THESIS}>M.Sc Thesis Scholar</option>
              <option value={AcademicProgram.MPHIL}>M.Phil Scholar</option>
              <option value={AcademicProgram.PHD}>Ph.D. Fellow</option>
              <option value={AcademicProgram.RESEARCH_ASSISTANT}>Research Assistant (RA)</option>
              <option value={AcademicProgram.VISITING_FELLOW}>Visiting Research Scholar</option>
            </select>
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-mono text-[var(--text-secondary)]">Session Year *</label>
            <Input
              name="sessionYear"
              required
              placeholder="e.g. 2020-2021"
              value={formData.sessionYear}
              onChange={handleChange}
              disabled={loading}
              className="h-10 rounded-xl"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-mono text-[var(--text-secondary)]">Academic Batch</label>
            <Input
              name="batch"
              placeholder="e.g. 49th Batch"
              value={formData.batch}
              onChange={handleChange}
              disabled={loading}
              className="h-10 rounded-xl"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-mono text-[var(--text-secondary)]">Assigned Thesis Supervisor *</label>
            <select
              name="supervisorId"
              value={formData.supervisorId}
              onChange={handleSupervisorChange}
              disabled={loading}
              className="w-full h-10 px-3 rounded-xl border border-[var(--border)] bg-[var(--surface-raised)] text-xs text-[var(--text-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--brand-primary)]"
            >
              {facultyList.length > 0 ? (
                facultyList.map((f) => (
                  <option key={f.id} value={f.id}>
                    {f.designation} {f.name}
                  </option>
                ))
              ) : (
                <option value="">Prof. Dr. Md. Shahedur Rahman (Lab Head)</option>
              )}
            </select>
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-mono text-[var(--text-secondary)]">Research / Thesis Topic Title</label>
          <Input
            name="thesisTitle"
            placeholder="e.g. Microbial production of bioplastics utilizing agricultural biomass"
            value={formData.thesisTitle}
            onChange={handleChange}
            disabled={loading}
            className="h-10 rounded-xl"
          />
        </div>
      </div>

      <div className="p-4 rounded-xl border border-[var(--border)] bg-[var(--surface-raised)]/50 text-xs text-[var(--text-muted)] space-y-1">
        <div className="font-semibold text-[var(--text-primary)] flex items-center gap-1.5">
          <ShieldCheck className="w-4 h-4 text-emerald-500" />
          <span>Verification & Lab Conduct Policy</span>
        </div>
        <p className="font-light leading-relaxed">
          By registering, you confirm that you are an enrolled student or researcher at Jahangirnagar University. Upon verification by your supervisor, you will receive equipment booking authorization.
        </p>
      </div>

      <Button
        type="submit"
        className="w-full h-11 rounded-xl bg-[var(--brand-primary)] hover:bg-[var(--brand-primary-hover)] text-white font-bold transition-all shadow-md"
        isLoading={loading}
      >
        <GraduationCap className="w-4 h-4 mr-2" />
        <span>Submit Student Profile for Approval</span>
      </Button>

      <div className="text-center text-xs text-[var(--text-muted)]">
        Already have an approved account?{" "}
        <Link href="/login" className="font-bold text-[var(--brand-primary)] hover:underline">
          Sign In Here
        </Link>
      </div>
    </form>
  );
}
