import * as React from "react";
import { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { Role } from "@prisma/client";
import { FacultyStudentsClient } from "./students-client";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata: Metadata = {
  title: "Supervised Scholars | BTIB Faculty Portal",
  description: "Directory of research scholars, thesis progress, and verification controls.",
};

export default async function FacultyStudentsPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  if (session.user.role !== Role.FACULTY && session.user.role !== Role.SUPER_ADMIN) {
    redirect("/portal");
  }

  // Get Faculty Profile if exists
  const facultyProfile = await db.facultyProfile.findUnique({
    where: { userId: session.user.id },
  });

  const students = await db.studentProfile.findMany({
    where: facultyProfile ? { supervisorId: facultyProfile.id } : {},
    include: {
      user: { select: { name: true, email: true } },
      workLogs: { select: { actualHoursUsed: true, verifiedAt: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  type ScholarsProps = React.ComponentProps<typeof FacultyStudentsClient>;

  return (
    <FacultyStudentsClient
      students={students as unknown as ScholarsProps["students"]}
    />
  );
}
