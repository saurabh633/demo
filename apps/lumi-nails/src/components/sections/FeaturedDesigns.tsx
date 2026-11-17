"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { getDesigns } from "@/lib/api";
import type { Design } from "@/lib/types";
import { formatPrice } from "@/lib/utils";
import { useToast } from "@/components/providers/ToastProvider";
import { Container } from "@/components/layout/Container";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { DesignCardSkeleton } from "@/components/ui/Skeleton";
import { EmptyState } from "@/components/ui/EmptyState";
import { FadeIn } from "@/components/ui/FadeIn";
import { Button } from "@/components/ui/Button";

export function FeaturedDesigns() {
  const { error } = useToast();
  const [designs, setDesigns] = useState<Design[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const data = await getDesigns({ featured: true });
        if (alive) setDesigns(data);
      } catch {
        error("Could not load featured designs.");
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
            eyebrow="Featured"
            title="Designs clients keep booking"
            description="A rotating edit of soft glam, chrome, and floral sets from the studio floor."
          />
        </FadeIn>

        <div className="mt-10">
          {loading ? (
            <div className="flex gap-4 overflow-hidden">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="min-w-[240px] flex-1">
                  <DesignCardSkeleton />
                </div>
              ))}
            </div>
          ) : designs.length === 0 ? (
            <EmptyState
              title="No featured designs yet"
              description="Check back soon for new Lumi edits."
            />
          ) : (
            <div className="-mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-2 scrollbar-thin">
              {designs.map((design, index) => (
                <FadeIn key={design._id} delay={index * 0.05} className="min-w-[240px] max-w-[280px] snap-start">
                  <Link
                    href={`/gallery?design=${design._id}`}
                    className="group block"
                  >
                    <div className="relative aspect-[3/4] overflow-hidden rounded-2xl">
                      <Image
                        src={design.imageUrl}
                        alt={design.title}
                        fill
                        sizes="280px"
                        className="object-cover transition duration-500 group-hover:scale-105"
                      />
                    </div>
                    <div className="mt-3 space-y-1">
                      <p className="font-medium text-ink">{design.title}</p>
                      <p className="text-sm text-ink/60">
                        {formatPrice(design.price)} · {design.shape}
                      </p>
                    </div>
                  </Link>
                </FadeIn>
              ))}
            </div>
          )}
        </div>

        <div className="mt-8">
          <Button href="/gallery" variant="secondary">
            Browse full gallery
          </Button>
        </div>
      </Container>
    </section>
  );
}
