import { getContactMessages } from "@/server/queries/contact";
import { InboxClient } from "./inbox-client";

export const dynamic = "force-dynamic";

export default async function AdminInboxPage() {
  const messages = await getContactMessages();

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto">
      <InboxClient initialData={messages} />
    </div>
  );
}
