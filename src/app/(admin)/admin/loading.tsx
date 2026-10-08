export default function AdminLoading() {
  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-8 animate-pulse">
      {/* Page Header Skeleton */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[var(--border)] pb-6">
        <div className="space-y-2.5">
          <div className="flex items-center gap-2">
            <div className="h-5 w-24 bg-[var(--surface-raised)] border border-[var(--border)] rounded" />
            <div className="h-3 w-32 bg-[var(--surface-raised)] rounded" />
          </div>
          <div className="h-8 w-64 bg-[var(--surface-raised)] rounded" />
          <div className="h-3.5 w-80 max-w-full bg-[var(--surface-raised)]/70 rounded" />
        </div>
        <div className="flex items-center gap-2">
          <div className="h-8 w-28 bg-[var(--surface-raised)] border border-[var(--border)] rounded" />
          <div className="h-8 w-28 bg-[var(--surface-raised)] border border-[var(--border)] rounded" />
        </div>
      </div>

      {/* Stats Cards / Grid Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="p-5 rounded border border-[var(--border)] bg-[var(--surface)] space-y-4"
          >
            <div className="flex items-center justify-between">
              <div className="w-8 h-8 rounded border border-[var(--border)] bg-[var(--surface-raised)]" />
              <div className="h-3 w-16 bg-[var(--surface-raised)] rounded" />
            </div>
            <div className="space-y-2">
              <div className="h-7 w-12 bg-[var(--surface-raised)] rounded" />
              <div className="h-3 w-28 bg-[var(--surface-raised)]/80 rounded" />
            </div>
            <div className="pt-3 border-t border-[var(--border)] flex justify-between items-center">
              <div className="h-3 w-14 bg-[var(--surface-raised)] rounded" />
              <div className="h-3 w-4 bg-[var(--surface-raised)] rounded" />
            </div>
          </div>
        ))}
      </div>

      {/* Table / Content Skeleton */}
      <div className="rounded border border-[var(--border)] bg-[var(--surface)] p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-[var(--border)] pb-3">
          <div className="h-4 w-44 bg-[var(--surface-raised)] rounded" />
          <div className="h-3 w-20 bg-[var(--surface-raised)] rounded" />
        </div>
        <div className="space-y-3 pt-2">
          {[1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              className="py-3 flex items-center justify-between border-b border-[var(--border)]/60 last:border-b-0"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded bg-[var(--surface-raised)] shrink-0" />
                <div className="space-y-1.5">
                  <div className="h-3.5 w-48 bg-[var(--surface-raised)] rounded" />
                  <div className="h-2.5 w-32 bg-[var(--surface-raised)]/70 rounded" />
                </div>
              </div>
              <div className="h-4 w-20 bg-[var(--surface-raised)] rounded" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
