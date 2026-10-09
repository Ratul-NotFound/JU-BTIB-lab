import * as React from "react";
import { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { Role } from "@prisma/client";
import { getActiveLabFloorActivity, getMasterScheduleAction } from "@/server/actions/booking";
import { BookingsAdminClient } from "./bookings-admin-client";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata: Metadata = {
  title: "Equipment Bookings & Live Floor Monitor | Admin Console",
  description: "Live real-time floor monitoring and master equipment schedules.",
};

export default async function AdminBookingsPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/admin/login");
  }

  if (session.user.role !== Role.SUPER_ADMIN && session.user.role !== Role.EDITOR) {
    redirect("/portal");
  }

  const [floorSessions, scheduleRes] = await Promise.all([
    getActiveLabFloorActivity(),
    getMasterScheduleAction({ includeCancelled: true }),
  ]);

  return (
    <BookingsAdminClient
      initialFloor={floorSessions as unknown as React.ComponentProps<typeof BookingsAdminClient>["initialFloor"]}
      initialBookings={(scheduleRes.bookings || []) as unknown as React.ComponentProps<typeof BookingsAdminClient>["initialBookings"]}
    />
  );
}
