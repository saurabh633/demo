"use client";

import { useEffect, useState } from "react";
import { getServices } from "@/lib/api";
import type { Service } from "@/lib/types";
import { formatDuration, formatPrice } from "@/lib/utils";
import { useToast } from "@/components/providers/ToastProvider";
import { Container } from "@/components/layout/Container";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { ServiceCardSkeleton } from "@/components/ui/Skeleton";
import { EmptyState } from "@/components/ui/EmptyState";
import { FadeIn } from "@/components/ui/FadeIn";

export default function ServicesPage() {
  const { error } = useToast();
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const data = await getServices();
        if (alive) setServices(data);
      } catch {
        error("Could not load services.");
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, [error]);

  return (
    <div className="py-14 sm:py-16">
      <Container>
        <FadeIn>
          <SectionHeader
            eyebrow="Services"
            title="Everything for a lasting set"
            description="Extensions, gel, acrylic, refill, and removal—each with clear pricing and timing."
          />
        </FadeIn>

        <div className="mt-10 grid gap-5 md:grid-cols-2">
          {loading
            ? Array.from({ length: 5 }).map((_, i) => (
                <ServiceCardSkeleton key={i} />
              ))
            : null}

          {!loading && services.length === 0 ? (
            <div className="md:col-span-2">
              <EmptyState
                title="No services found"
                description="Please refresh or try again shortly."
              />
            </div>
          ) : null}

          {!loading
            ? services.map((service, index) => (
                <FadeIn key={service._id} delay={index * 0.05}>
                  <Card className="flex h-full flex-col p-6 sm:p-7">
                    <h2 className="font-display text-3xl text-ink">
                      {service.name}
                    </h2>
                    <p className="mt-3 flex-1 text-sm leading-relaxed text-ink/65">
                      {service.description}
                    </p>
                    <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
                      <p className="text-sm font-medium text-mauve">
                        {formatPrice(service.price)} ·{" "}
                        {formatDuration(service.durationMin)}
                      </p>
                      <Button
                        href={`/booking?serviceId=${service._id}`}
                        size="sm"
                      >
                        Book
                      </Button>
                    </div>
                  </Card>
                </FadeIn>
              ))
            : null}
        </div>
      </Container>
    </div>
  );
}
