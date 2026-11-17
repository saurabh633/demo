"use client";

import { FormEvent, useEffect, useState } from "react";
import { AdminShell } from "@/app/admin/AdminShell";
import { adminApi } from "@/lib/api";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { useToast } from "@/components/providers/ToastProvider";

type Cat = { _id: string; name: string; slug: string };

export default function AdminCategoriesPage() {
  const { error, success } = useToast();
  const [items, setItems] = useState<Cat[]>([]);
  const [name, setName] = useState("");

  async function load() {
    try {
      setItems(await adminApi.categories());
    } catch (err: any) {
      error(err?.message || "Could not load categories");
    }
  }

  useEffect(() => {
    void load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function onCreate(e: FormEvent) {
    e.preventDefault();
    try {
      await adminApi.createCategory({ name });
      success("Category created");
      setName("");
      await load();
    } catch (err: any) {
      error(err?.message || "Create failed");
    }
  }

  return (
    <AdminShell>
      <h1 className="font-display text-3xl">Categories</h1>
      <ul className="mt-6 space-y-2">
        {items.map((c) => (
          <li
            key={c._id}
            className="flex items-center justify-between rounded-2xl border border-blush/40 bg-white/60 px-4 py-3"
          >
            <span>
              {c.name}{" "}
              <span className="text-xs text-ink/45">/{c.slug}</span>
            </span>
            <Button
              size="sm"
              variant="ghost"
              onClick={async () => {
                try {
                  await adminApi.deleteCategory(c._id);
                  success("Deleted");
                  await load();
                } catch (err: any) {
                  error(err?.message || "Delete failed");
                }
              }}
            >
              Delete
            </Button>
          </li>
        ))}
      </ul>
      <Card className="mt-8 p-5">
        <form className="flex flex-wrap items-end gap-3" onSubmit={onCreate}>
          <div className="min-w-[220px] flex-1">
            <Input
              label="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <Button type="submit">Add</Button>
        </form>
      </Card>
    </AdminShell>
  );
}
