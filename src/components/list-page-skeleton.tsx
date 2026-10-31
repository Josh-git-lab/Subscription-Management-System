import { Skeleton } from "@/components/ui/skeleton";

export function TableListSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="space-y-3 rounded-xl border p-4" aria-busy="true">
      <Skeleton className="h-8 w-full max-w-md" />
      <div className="space-y-2">
        {Array.from({ length: rows }).map((_, i) => (
          <Skeleton key={i} className="h-12 w-full" />
        ))}
      </div>
    </div>
  );
}

export function PricingGridSkeleton() {
  return (
    <div
      className="grid gap-6 md:grid-cols-3"
      aria-busy="true"
      aria-label="Loading plans"
    >
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="space-y-4 rounded-xl border p-6">
          <Skeleton className="h-6 w-24" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-10 w-32" />
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-9 w-full" />
        </div>
      ))}
    </div>
  );
}

export function KpiSkeleton() {
  return (
    <div className="grid gap-4 sm:grid-cols-3" aria-busy="true">
      {Array.from({ length: 3 }).map((_, i) => (
        <Skeleton key={i} className="h-36 w-full rounded-xl" />
      ))}
    </div>
  );
}
