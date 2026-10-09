import * as React from "react";
import { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { Role } from "@prisma/client";
import { getActiveFacultyList } from "@/server/actions/faculty";
import { FacultyAdminClient } from "./faculty-admin-client";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata: Metadata = {
  title: "Faculty Directory & Account Generator | Admin Console",
  description: "Direct provisioning and supervision controls for faculty members.",
};

export default async function AdminFacultyPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/admin/login");
  }

  if (session.user.role !== Role.SUPER_ADMIN && session.user.role !== Role.EDITOR) {
    redirect("/portal");
  }

  const faculty = await getActiveFacultyList();

  type FacultyProps = React.ComponentProps<typeof FacultyAdminClient>;
  return (
    <FacultyAdminClient
      initialFaculty={faculty as unknown as FacultyProps["initialFaculty"]}
    />
  );
}
