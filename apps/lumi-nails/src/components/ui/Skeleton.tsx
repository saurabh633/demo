import { cn } from "@/lib/utils";

export function Skeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-2xl bg-gradient-to-r from-blush/40 via-white/60 to-blush/40",
        className,
      )}
      aria-hidden
    />
  );
}

export function DesignCardSkeleton() {
  return (
    <div className="space-y-3">
      <Skeleton className="aspect-[3/4] w-full" />
      <Skeleton className="h-4 w-2/3" />
      <Skeleton className="h-3 w-1/3" />
    </div>
  );
}

export function ServiceCardSkeleton() {
  return (
    <div className="space-y-4 rounded-2xl border border-white/50 bg-white/40 p-6">
      <Skeleton className="h-6 w-1/2" />
      <Skeleton className="h-16 w-full" />
      <Skeleton className="h-4 w-1/3" />
    </div>
  );
}
