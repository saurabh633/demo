import { Suspense } from "react";
import { GalleryClient } from "@/app/gallery/GalleryClient";
import { Container } from "@/components/layout/Container";
import { DesignCardSkeleton } from "@/components/ui/Skeleton";
import { Skeleton } from "@/components/ui/Skeleton";

function GalleryFallback() {
  return (
    <div className="py-14">
      <Container className="space-y-8">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-12 w-full" />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <DesignCardSkeleton key={i} />
          ))}
        </div>
      </Container>
    </div>
  );
}

export default function GalleryPage() {
  return (
    <Suspense fallback={<GalleryFallback />}>
      <GalleryClient />
    </Suspense>
  );
}
