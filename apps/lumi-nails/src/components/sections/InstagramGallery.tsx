"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { getDesigns } from "@/lib/api";
import type { Design } from "@/lib/types";
import { useToast } from "@/components/providers/ToastProvider";
import { Container } from "@/components/layout/Container";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { DesignCardSkeleton } from "@/components/ui/Skeleton";
import { EmptyState } from "@/components/ui/EmptyState";
import { FadeIn } from "@/components/ui/FadeIn";
import { STUDIO } from "@/lib/constants";

export function InstagramGallery() {
  const { error } = useToast();
  const [designs, setDesigns] = useState<Design[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const data = await getDesigns();
        if (alive) setDesigns(data.slice(0, 6));
      } catch {
        error("Could not load gallery preview.");
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, [error]);

  return (
    <section className="py-20">
      <Container>
        <FadeIn>
          <SectionHeader
            eyebrow={STUDIO.instagram}
            title="Studio feed"
            description="A glimpse of recent sets—follow along for weekly drops."
            align="center"
          />
        </FadeIn>

        <div className="mt-10 grid grid-cols-2 gap-3 md:grid-cols-3">
          {loading
            ? Array.from({ length: 6 }).map((_, i) => (
                <DesignCardSkeleton key={i} />
              ))
            : null}
          {!loading && designs.length === 0 ? (
            <div className="col-span-full">
              <EmptyState
                title="Gallery is empty"
                description="New looks are coming soon."
              />
            </div>
          ) : null}
          {!loading
            ? designs.map((design, index) => (
                <FadeIn key={design._id} delay={index * 0.04}>
                  <div className="relative aspect-square overflow-hidden rounded-2xl">
                    <Image
                      src={design.imageUrl}
                      alt={design.title}
                      fill
                      sizes="(max-width: 768px) 50vw, 33vw"
                      className="object-cover"
                    />
                  </div>
                </FadeIn>
              ))
            : null}
        </div>
      </Container>
    </section>
  );
}
