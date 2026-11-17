"use client";

import { useEffect, useState } from "react";
import { AdminShell } from "@/app/admin/AdminShell";
import { adminApi } from "@/lib/api";
import type { Booking } from "@/lib/types";
import { Card } from "@/components/ui/Card";
import { Skeleton } from "@/components/ui/Skeleton";
import { useToast } from "@/components/providers/ToastProvider";

export default function AdminDashboardPage() {
  const { error } = useToast();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<{
    today: Booking[];
    pendingCount: number;
    unreadInquiries: number;
    designsCount: number;
  } | null>(null);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const dash = await adminApi.dashboard();
        if (alive) setData(dash);
      } catch (err: any) {
        error(err?.message || "Could not load dashboard");
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, [error]);

  return (
    <AdminShell>
      <h1 className="font-display text-3xl text-ink">Dashboard</h1>
      {loading || !data ? (
        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          <Skeleton className="h-24" />
          <Skeleton className="h-24" />
          <Skeleton className="h-24" />
        </div>
      ) : (
        <>
          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            <Card className="p-5">
              <p className="text-xs uppercase tracking-[0.16em] text-gold">
                Pending
              </p>
              <p className="mt-2 font-display text-4xl">{data.pendingCount}</p>
            </Card>
            <Card className="p-5">
              <p className="text-xs uppercase tracking-[0.16em] text-gold">
                Unread inquiries
              </p>
              <p className="mt-2 font-display text-4xl">
                {data.unreadInquiries}
              </p>
            </Card>
            <Card className="p-5">
              <p className="text-xs uppercase tracking-[0.16em] text-gold">
                Designs
              </p>
              <p className="mt-2 font-display text-4xl">{data.designsCount}</p>
            </Card>
          </div>
          <h2 className="mt-10 font-display text-2xl">Today’s bookings</h2>
          <div className="mt-4 overflow-x-auto rounded-2xl border border-blush/40 bg-white/60">
            <table className="min-w-full text-left text-sm">
              <thead className="border-b border-blush/40 text-xs uppercase tracking-[0.12em] text-ink/50">
                <tr>
                  <th className="px-4 py-3">Time</th>
                  <th className="px-4 py-3">Guest</th>
                  <th className="px-4 py-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {data.today.length === 0 ? (
                  <tr>
                    <td className="px-4 py-6 text-ink/50" colSpan={3}>
                      No bookings today
                    </td>
                  </tr>
                ) : (
                  data.today.map((b) => (
                    <tr key={b._id} className="border-t border-blush/30">
                      <td className="px-4 py-3">{b.time}</td>
                      <td className="px-4 py-3">
                        {b.name}
                        <div className="text-xs text-ink/50">{b.phone}</div>
                      </td>
                      <td className="px-4 py-3 capitalize">{b.status}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </>
      )}
    </AdminShell>
  );
}
