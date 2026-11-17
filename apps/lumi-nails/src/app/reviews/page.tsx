"use client";

import { useEffect, useMemo, useState } from "react";
import { createReview, getReviews } from "@/lib/api";
import type { Review } from "@/lib/types";
import { formatDate } from "@/lib/utils";
import { useToast } from "@/components/providers/ToastProvider";
import { Container } from "@/components/layout/Container";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Button } from "@/components/ui/Button";
import { StarRating } from "@/components/ui/StarRating";
import { Skeleton } from "@/components/ui/Skeleton";
import { EmptyState } from "@/components/ui/EmptyState";
import { FadeIn } from "@/components/ui/FadeIn";

export default function ReviewsPage() {
  const { error, success } = useToast();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [name, setName] = useState("");
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [formErrors, setFormErrors] = useState<{
    name?: string;
    comment?: string;
  }>({});

  async function loadReviews() {
    setLoading(true);
    try {
      const data = await getReviews();
      setReviews(data);
    } catch {
      error("Could not load reviews.");
      setReviews([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadReviews();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const summary = useMemo(() => {
    if (reviews.length === 0) {
      return { avg: 0, count: 0, buckets: [0, 0, 0, 0, 0] };
    }
    const buckets = [0, 0, 0, 0, 0];
    let total = 0;
    reviews.forEach((review) => {
      total += review.rating;
      buckets[review.rating - 1] += 1;
    });
    return {
      avg: total / reviews.length,
      count: reviews.length,
      buckets,
    };
  }, [reviews]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const nextErrors: typeof formErrors = {};
    if (!name.trim()) nextErrors.name = "Name is required.";
    if (!comment.trim()) nextErrors.comment = "Please share a few words.";
    setFormErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;

    setSubmitting(true);
    try {
      await createReview({
        name: name.trim(),
        rating,
        comment: comment.trim(),
      });
      success("Thank you—your review is live.");
      setName("");
      setComment("");
      setRating(5);
      await loadReviews();
    } catch {
      error("Could not submit your review.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="py-14 sm:py-16">
      <Container>
        <FadeIn>
          <SectionHeader
            eyebrow="Reviews"
            title="Guest experiences"
            description="Honest notes from the chair—soft finishes, careful hands, lasting wear."
          />
        </FadeIn>

        <div className="mt-10 grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <FadeIn>
            <Card className="p-6 sm:p-7">
              {loading ? (
                <div className="space-y-3">
                  <Skeleton className="h-12 w-24" />
                  <Skeleton className="h-4 w-40" />
                  <Skeleton className="h-28 w-full" />
                </div>
              ) : (
                <>
                  <p className="font-display text-5xl text-ink">
                    {summary.count ? summary.avg.toFixed(1) : "—"}
                  </p>
                  <div className="mt-2">
                    <StarRating
                      value={Math.round(summary.avg || 0)}
                      readOnly
                    />
                  </div>
                  <p className="mt-2 text-sm text-ink/60">
                    Based on {summary.count} review
                    {summary.count === 1 ? "" : "s"}
                  </p>
                  <div className="mt-6 space-y-2">
                    {[5, 4, 3, 2, 1].map((star) => {
                      const count = summary.buckets[star - 1];
                      const pct = summary.count
                        ? Math.round((count / summary.count) * 100)
                        : 0;
                      return (
                        <div
                          key={star}
                          className="flex items-center gap-3 text-xs text-ink/60"
                        >
                          <span className="w-8">{star}★</span>
                          <div className="h-2 flex-1 overflow-hidden rounded-full bg-blush/40">
                            <div
                              className="h-full rounded-full bg-gold"
                              style={{ width: `${pct}%` }}
                            />
                          </div>
                          <span className="w-8 text-right">{count}</span>
                        </div>
                      );
                    })}
                  </div>
                </>
              )}
            </Card>
          </FadeIn>

          <FadeIn delay={0.08}>
            <Card className="p-6 sm:p-7">
              <h2 className="font-display text-2xl text-ink">
                Write a review
              </h2>
              <form className="mt-5 space-y-4" onSubmit={onSubmit}>
                <Input
                  label="Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  error={formErrors.name}
                />
                <div className="space-y-2">
                  <span className="text-sm font-medium text-ink/80">
                    Rating
                  </span>
                  <StarRating value={rating} onChange={setRating} />
                </div>
                <Textarea
                  label="Your experience"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  error={formErrors.comment}
                  placeholder="Tell us about your set, service, and vibe…"
                />
                <Button type="submit" disabled={submitting}>
                  {submitting ? "Sending…" : "Submit review"}
                </Button>
              </form>
            </Card>
          </FadeIn>
        </div>

        <div className="mt-10 grid gap-4 md:grid-cols-2">
          {loading
            ? Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-40 w-full" />
              ))
            : null}

          {!loading && reviews.length === 0 ? (
            <div className="md:col-span-2">
              <EmptyState
                title="No reviews yet"
                description="Be the first to share your Lumi visit."
              />
            </div>
          ) : null}

          {!loading
            ? reviews.map((review, index) => (
                <FadeIn key={review._id} delay={index * 0.04}>
                  <Card className="h-full p-6">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="font-medium text-ink">{review.name}</p>
                        <p className="mt-1 text-xs text-ink/50">
                          {formatDate(review.createdAt)}
                        </p>
                      </div>
                      <StarRating value={review.rating} readOnly size="sm" />
                    </div>
                    <p className="mt-4 text-sm leading-relaxed text-ink/75">
                      {review.comment}
                    </p>
                  </Card>
                </FadeIn>
              ))
            : null}
        </div>
      </Container>
    </div>
  );
}
