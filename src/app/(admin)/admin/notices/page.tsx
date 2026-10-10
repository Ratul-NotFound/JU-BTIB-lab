import * as React from "react";
import { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { Role } from "@prisma/client";
import { getAllAdminNoticesAction } from "@/server/actions/notices";
import { NoticesAdminClient } from "./notices-admin-client";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata: Metadata = {
  title: "Lab Notices & Announcements | Admin Console",
  description: "Publish laboratory announcements, safety alerts, equipment downtime notices, and academic deadlines.",
};

export default async function AdminNoticesPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/admin/login");
  }

  if (session.user.role !== Role.SUPER_ADMIN && session.user.role !== Role.EDITOR) {
    redirect("/portal");
  }

  const res = await getAllAdminNoticesAction();
  const initialNotices = res.success && res.data ? res.data : [];

  return <NoticesAdminClient initialNotices={initialNotices} adminName={session.user.name || "Admin"} />;
}
