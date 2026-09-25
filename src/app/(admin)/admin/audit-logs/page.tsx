import { db } from "@/lib/db";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { SpecimenLabel } from "@/components/ui/specimen-label";

export const dynamic = "force-dynamic";

export default async function AdminAuditLogsPage() {
  const logs = await db.auditLog.findMany({
    orderBy: { timestamp: "desc" },
    take: 100,
  });

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-6">
      <div className="border-b border-[var(--border)] pb-4">
        <div className="flex items-center gap-2">
          <SpecimenLabel code="SEC / AUDIT" subtext="LOG" />
          <span className="text-xs font-mono text-[var(--bio-teal)]">TAMPER-EVIDENT TRAIL</span>
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-[var(--text-primary)] mt-1">
          Security & Mutation Audit Logs
        </h1>
        <p className="text-xs text-[var(--text-muted)] mt-1">
          Chronological audit trail of all repository modifications, administrative logins, and content updates.
        </p>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Timestamp</TableHead>
            <TableHead>Action</TableHead>
            <TableHead>Entity</TableHead>
            <TableHead>Operator</TableHead>
            <TableHead>Details</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {logs.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center py-8 font-mono text-xs text-[var(--text-muted)]">
                No audit events recorded yet.
              </TableCell>
            </TableRow>
          ) : (
            logs.map((log) => (
              <TableRow key={log.id}>
                <TableCell className="font-mono text-xs text-[var(--text-muted)]">
                  {new Date(log.timestamp).toLocaleString()}
                </TableCell>
                <TableCell>
                  <Badge
                    variant={
                      log.action === "CREATE"
                        ? "teal"
                        : log.action === "UPDATE"
                        ? "cyan"
                        : log.action === "DELETE"
                        ? "danger"
                        : "default"
                    }
                  >
                    {log.action}
                  </Badge>
                </TableCell>
                <TableCell className="font-medium text-xs">
                  {log.entity}
                </TableCell>
                <TableCell className="text-xs">
                  <div>{log.userName || "System"}</div>
                  <div className="font-mono text-[10px] text-[var(--text-muted)]">
                    {log.userEmail || "automated"}
                  </div>
                </TableCell>
                <TableCell className="font-mono text-[11px] text-[var(--text-muted)] max-w-xs truncate">
                  {log.details ? JSON.stringify(log.details) : "—"}
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
