"use client";

import { useEffect, useState } from "react";
import { getServices } from "@/lib/api";
import type { Service } from "@/lib/types";
import { formatDuration, formatPrice } from "@/lib/utils";
import { useToast } from "@/components/providers/ToastProvider";
import { Container } from "@/components/layout/Container";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Card } from "@/components/ui/Card";
import { ServiceCardSkeleton } from "@/components/ui/Skeleton";
import { EmptyState } from "@/components/ui/EmptyState";
import { FadeIn } from "@/components/ui/FadeIn";
import { Button } from "@/components/ui/Button";

export function ServicesStrip() {
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
    <section className="py-20">
      <Container>
        <FadeIn>
          <SectionHeader
            eyebrow="Services"
            title="Studio menu"
            description="Extensions, gel, acrylic, refill, and gentle removal—priced transparently."
          />
        </FadeIn>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {loading
            ? Array.from({ length: 3 }).map((_, i) => (
                <ServiceCardSkeleton key={i} />
              ))
            : null}
          {!loading && services.length === 0 ? (
            <div className="sm:col-span-2 lg:col-span-3">
              <EmptyState
                title="Services unavailable"
                description="Please try again in a moment."
              />
            </div>
          ) : null}
          {!loading
            ? services.slice(0, 3).map((service, index) => (
                <FadeIn key={service._id} delay={index * 0.06}>
                  <Card className="h-full p-6">
                    <h3 className="font-display text-2xl text-ink">
                      {service.name}
                    </h3>
                    <p className="mt-3 text-sm leading-relaxed text-ink/65">
                      {service.description}
                    </p>
                    <p className="mt-5 text-sm font-medium text-mauve">
                      {formatPrice(service.price)} ·{" "}
                      {formatDuration(service.durationMin)}
                    </p>
                  </Card>
                </FadeIn>
              ))
            : null}
        </div>

        <div className="mt-8">
          <Button href="/services" variant="secondary">
            See all services
          </Button>
        </div>
      </Container>
    </section>
  );
}
