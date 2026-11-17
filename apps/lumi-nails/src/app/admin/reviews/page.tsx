"use client";

import { useEffect, useState } from "react";
import { AdminShell } from "@/app/admin/AdminShell";
import { adminApi } from "@/lib/api";
import type { Review } from "@/lib/types";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { StarRating } from "@/components/ui/StarRating";
import { useToast } from "@/components/providers/ToastProvider";

type AdminReview = Review & { approved?: boolean };

export default function AdminReviewsPage() {
  const { error, success } = useToast();
  const [items, setItems] = useState<AdminReview[]>([]);

  async function load() {
    try {
      setItems(await adminApi.reviews());
    } catch (err: any) {
      error(err?.message || "Could not load reviews");
    }
  }

  useEffect(() => {
    void load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <AdminShell>
      <h1 className="font-display text-3xl">Reviews</h1>
      <div className="mt-6 space-y-3">
        {items.length === 0 ? (
          <p className="text-sm text-ink/50">No reviews</p>
        ) : (
          items.map((r) => (
            <Card key={r._id} className="p-4">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="font-medium">{r.name}</p>
                  <StarRating value={r.rating} readOnly size="sm" />
                  <p className="mt-2 text-sm text-ink/70">{r.comment}</p>
                  <p className="mt-1 text-xs text-ink/45">
                    {r.approved ? "Approved" : "Pending approval"}
                  </p>
                </div>
                <div className="flex gap-2">
                  {!r.approved ? (
                    <Button
                      size="sm"
                      onClick={async () => {
                        try {
                          await adminApi.approveReview(r._id);
                          success("Approved");
                          await load();
                        } catch (err: any) {
                          error(err?.message || "Approve failed");
                        }
                      }}
                    >
                      Approve
                    </Button>
                  ) : null}
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={async () => {
                      try {
                        await adminApi.deleteReview(r._id);
                        success("Deleted");
                        await load();
                      } catch (err: any) {
                        error(err?.message || "Delete failed");
                      }
                    }}
                  >
                    Delete
                  </Button>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>
    </AdminShell>
  );
}
