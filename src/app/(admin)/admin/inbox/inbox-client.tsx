"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { DataTable, Column } from "@/components/admin/data-table";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/toast";
import { updateContactMessageStatus, deleteContactMessage } from "@/server/actions/contact";
import { MessageStatus } from "@prisma/client";
import { Eye, Trash2, Mail, CheckCircle2 } from "lucide-react";

export interface MessageItem {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: MessageStatus;
  createdAt: Date;
}

export function InboxClient({ initialData }: { initialData: MessageItem[] }) {
  const router = useRouter();
  const { toast } = useToast();
  const [activeMessage, setActiveMessage] = React.useState<MessageItem | null>(null);

  const handleView = async (item: MessageItem) => {
    setActiveMessage(item);
    if (item.status === "NEW") {
      try {
        await updateContactMessageStatus(item.id, MessageStatus.READ);
        router.refresh();
      } catch {
        // Status update error handled silently
      }
    }
  };

  const handleArchive = async (id: string) => {
    try {
      await updateContactMessageStatus(id, MessageStatus.ARCHIVED);
      toast("Message moved to archive", "success");
      setActiveMessage(null);
      router.refresh();
    } catch (err: unknown) {
      toast(err instanceof Error ? err.message : "Archive failed", "error");
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Permanently delete this inquiry?")) return;

    try {
      await deleteContactMessage(id);
      toast("Message deleted", "success");
      setActiveMessage(null);
      router.refresh();
    } catch (err: unknown) {
      toast(err instanceof Error ? err.message : "Delete failed", "error");
    }
  };

  const columns: Column<MessageItem>[] = [
    {
      key: "name",
      header: "Sender & Email",
      render: (item) => (
        <div>
          <div className="font-medium text-[var(--text-primary)]">{item.name}</div>
          <div className="font-mono text-[11px] text-[var(--text-muted)]">{item.email}</div>
        </div>
      ),
    },
    {
      key: "subject",
      header: "Subject",
      render: (item) => (
        <div className="max-w-md">
          <div className="font-medium text-[var(--text-primary)]">{item.subject}</div>
          <div className="text-[11px] text-[var(--text-muted)] truncate">{item.message}</div>
        </div>
      ),
    },
    {
      key: "status",
      header: "Status",
      render: (item) => (
        <Badge
          variant={
            item.status === "NEW"
              ? "teal"
              : item.status === "READ"
              ? "default"
              : "outline"
          }
        >
          {item.status}
        </Badge>
      ),
    },
    {
      key: "createdAt",
      header: "Received",
      render: (item) => (
        <span className="font-mono text-xs text-[var(--text-muted)]">
          {new Date(item.createdAt).toLocaleDateString()}
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <DataTable
        title="Contact Inquiry Inbox"
        description="Public inquiries submitted through the official laboratory contact channel."
        columns={columns}
        data={initialData}
        searchKey="name"
        actions={(item) => (
          <>
            <button
              onClick={() => handleView(item)}
              className="p-1 rounded text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-raised)]"
              title="Read Message"
            >
              <Eye className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => handleDelete(item.id)}
              className="p-1 rounded text-[var(--danger)] hover:bg-[var(--danger-surface)]"
              title="Delete"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </>
        )}
      />

      {/* Message Reader Dialog */}
      <Dialog
        open={!!activeMessage}
        onOpenChange={(open) => !open && setActiveMessage(null)}
        title={activeMessage?.subject || "Inquiry Details"}
        description={`From: ${activeMessage?.name} (${activeMessage?.email})`}
      >
        {activeMessage && (
          <div className="space-y-4">
            <div className="p-3 rounded border border-[var(--border)] bg-[var(--surface-raised)] text-xs font-mono space-y-1">
              <div>RECEIVED: {new Date(activeMessage.createdAt).toLocaleString()}</div>
              <div>STATUS: {activeMessage.status}</div>
            </div>

            <div className="p-4 rounded border border-[var(--border)] bg-[var(--surface)] text-sm text-[var(--text-primary)] whitespace-pre-wrap leading-relaxed">
              {activeMessage.message}
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-[var(--border)]">
              <a
                href={`mailto:${activeMessage.email}?subject=Re: ${encodeURIComponent(
                  activeMessage.subject
                )}`}
                className="inline-flex items-center gap-1.5 text-xs font-mono text-[var(--bio-teal)] hover:underline"
              >
                <Mail className="w-3.5 h-3.5" />
                <span>Reply via Mail Client</span>
              </a>

              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() => handleArchive(activeMessage.id)}
                  className="gap-1"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Archive</span>
                </Button>
                <Button
                  size="sm"
                  variant="danger"
                  onClick={() => handleDelete(activeMessage.id)}
                >
                  Delete
                </Button>
              </div>
            </div>
          </div>
        )}
      </Dialog>
    </div>
  );
}
