import * as React from "react";
import { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { Role } from "@prisma/client";
import { traceDepartmentExperimentLogsAction } from "@/server/actions/experiment-log";
import { ActivityTracerClient } from "./activity-tracer-client";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata: Metadata = {
  title: "Activity Tracer & Sign-off | BTIB Faculty Portal",
  description: "Review and digitally verify student laboratory procedures and machine runtimes.",
};

export default async function FacultyActivityTracerPage() {
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

  const res = await traceDepartmentExperimentLogsAction(
    facultyProfile ? { facultyId: facultyProfile.id } : undefined
  );

  type TracerProps = React.ComponentProps<typeof ActivityTracerClient>;

  return (
    <ActivityTracerClient
      logs={(res.logs || []) as unknown as TracerProps["logs"]}
      facultyName={session.user.name || "Faculty Supervisor"}
    />
  );
}
