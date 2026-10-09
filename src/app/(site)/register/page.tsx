import * as React from "react";
import { Metadata } from "next";
import Image from "next/image";
import { getActiveFacultyList } from "@/server/actions/faculty";
import { RegisterFormClient } from "./register-form-client";
import { ShieldCheck } from "lucide-react";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata: Metadata = {
  title: "Student Registration | BTIB Laboratory - Jahangirnagar University",
  description:
    "Register your student or scholar profile to access the BTIB Laboratory portal, reserve specialized instrumentation, and log research hours.",
};

export default async function StudentRegisterPage() {
  const facultyList = await getActiveFacultyList();

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-8">
      {/* Header Banner */}
      <div className="text-center space-y-3">
        <div className="w-16 h-16 mx-auto relative flex items-center justify-center p-2 rounded-md bg-[var(--surface-raised)] border border-[var(--border)] shadow-xs">
          <Image
            src="/images/btib-logo.png"
            alt="BTIB Laboratory"
            width={48}
            height={48}
            priority
            className="w-full h-full object-contain theme-invert-dark"
          />
        </div>

        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-[11px] font-mono font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Academic Laboratory Onboarding</span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-black font-sans tracking-tight text-[var(--text-primary)]">
          Student & Research Scholar Registration
        </h1>
        <p className="text-xs sm:text-sm text-[var(--text-secondary)] font-light max-w-lg mx-auto leading-relaxed">
          Create your researcher profile to unlock instrument auto-booking, submit thesis protocols, and maintain your experimental logbook.
        </p>
      </div>

      {/* Main Registration Form Card */}
      <div className="p-6 sm:p-10 rounded-md border border-[var(--border)] bg-[var(--surface)] shadow-lg relative overflow-hidden">
        <RegisterFormClient facultyList={facultyList} />
      </div>
    </div>
  );
}
