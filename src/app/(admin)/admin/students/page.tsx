import * as React from "react";
import { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { Role } from "@prisma/client";
import { getStudentsListAction } from "@/server/actions/student";
import { StudentsAdminClient } from "./students-admin-client";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata: Metadata = {
  title: "Student Scholars & Approval Queue | Admin Console",
  description: "Review academic scholar registrations and manage laboratory permissions.",
};

export default async function AdminStudentsPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/admin/login");
  }

  if (session.user.role !== Role.SUPER_ADMIN && session.user.role !== Role.EDITOR) {
    redirect("/portal");
  }

  const res = await getStudentsListAction();

  type StudentsProps = React.ComponentProps<typeof StudentsAdminClient>;
  return (
    <StudentsAdminClient
      initialStudents={(res.students || []) as unknown as StudentsProps["initialStudents"]}
    />
  );
}
