"use client";

import { useEffect, useState } from "react";
import { AdminShell } from "@/app/admin/AdminShell";
import { adminApi } from "@/lib/api";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { useToast } from "@/components/providers/ToastProvider";

type InquiryRow = {
  _id: string;
  name: string;
  phone: string;
  message: string;
  isRead: boolean;
  createdAt: string;
};

export default function AdminInquiriesPage() {
  const { error, success } = useToast();
  const [items, setItems] = useState<InquiryRow[]>([]);

  async function load() {
    try {
      setItems(await adminApi.inquiries());
    } catch (err: any) {
      error(err?.message || "Could not load inquiries");
    }
  }

  useEffect(() => {
    void load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <AdminShell>
      <h1 className="font-display text-3xl">Inquiries</h1>
      <div className="mt-6 space-y-3">
        {items.length === 0 ? (
          <p className="text-sm text-ink/50">No inquiries</p>
        ) : (
          items.map((item) => (
            <Card key={item._id} className="p-4">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="font-medium">
                    {item.name}{" "}
                    {!item.isRead ? (
                      <span className="ml-2 rounded-full bg-blush px-2 py-0.5 text-xs">
                        unread
                      </span>
                    ) : null}
                  </p>
                  <p className="text-xs text-ink/50">{item.phone}</p>
                  <p className="mt-2 text-sm text-ink/75">{item.message}</p>
                </div>
                {!item.isRead ? (
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={async () => {
                      try {
                        await adminApi.markInquiryRead(item._id);
                        success("Marked read");
                        await load();
                      } catch (err: any) {
                        error(err?.message || "Update failed");
                      }
                    }}
                  >
                    Mark read
                  </Button>
                ) : null}
              </div>
            </Card>
          ))
        )}
      </div>
    </AdminShell>
  );
}
