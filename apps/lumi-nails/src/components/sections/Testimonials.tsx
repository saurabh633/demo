"use client";

import { useEffect, useState } from "react";
import { getReviews } from "@/lib/api";
import type { Review } from "@/lib/types";
import { useToast } from "@/components/providers/ToastProvider";
import { Container } from "@/components/layout/Container";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Card } from "@/components/ui/Card";
import { Skeleton } from "@/components/ui/Skeleton";
import { EmptyState } from "@/components/ui/EmptyState";
import { StarRating } from "@/components/ui/StarRating";
import { FadeIn } from "@/components/ui/FadeIn";
import { Button } from "@/components/ui/Button";

export function Testimonials() {
  const { error } = useToast();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const data = await getReviews();
        if (alive) setReviews(data.slice(0, 3));
      } catch {
        error("Could not load reviews.");
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
            eyebrow="Love notes"
            title="What guests say"
            description="Real appointments, soft finishes, lasting impressions."
          />
        </FadeIn>

        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {loading
            ? Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="h-48 w-full" />
              ))
            : null}
          {!loading && reviews.length === 0 ? (
            <div className="md:col-span-3">
              <EmptyState
                title="No reviews yet"
                description="Be the first to share your Lumi experience."
              />
            </div>
          ) : null}
          {!loading
            ? reviews.map((review, index) => (
                <FadeIn key={review._id} delay={index * 0.06}>
                  <Card className="h-full p-6">
                    <StarRating value={review.rating} readOnly size="sm" />
                    <p className="mt-4 text-sm leading-relaxed text-ink/75">
                      “{review.comment}”
                    </p>
                    <p className="mt-5 text-sm font-medium text-mauve">
                      {review.name}
                    </p>
                  </Card>
                </FadeIn>
              ))
            : null}
        </div>

        <div className="mt-8">
          <Button href="/reviews" variant="secondary">
            Read all reviews
          </Button>
        </div>
      </Container>
    </section>
  );
}
