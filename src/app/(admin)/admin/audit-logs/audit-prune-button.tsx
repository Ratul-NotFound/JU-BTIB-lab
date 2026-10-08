"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast";
import { pruneAuditLogsAction } from "@/server/actions/audit";
import { Trash2 } from "lucide-react";

export function AuditPruneButton() {
  const [loading, setLoading] = React.useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const handlePrune = async () => {
    if (!window.confirm("Delete audit logs older than 90 days to free up database storage? This action cannot be undone.")) {
      return;
    }

    setLoading(true);
    try {
      const res = await pruneAuditLogsAction(90);
      if (res.success) {
        toast(`Successfully pruned ${res.count ?? 0} historical audit log(s)`, "success");
        React.startTransition(() => {
          router.refresh();
        });
      } else {
        toast(res.error || "Failed to prune logs", "error");
      }
    } catch (err: unknown) {
      toast(err instanceof Error ? err.message : "Failed to prune logs", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      variant="outline"
      size="sm"
      isLoading={loading}
      onClick={handlePrune}
      className="gap-1.5 text-xs text-[var(--text-muted)] hover:text-red-500 hover:border-red-500/40"
    >
      <Trash2 className="w-3.5 h-3.5" />
      <span>Prune Logs &gt; 90 Days</span>
    </Button>
  );
}
