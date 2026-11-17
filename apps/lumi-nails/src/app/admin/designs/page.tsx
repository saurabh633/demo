"use client";

import Image from "next/image";
import { FormEvent, useEffect, useState } from "react";
import { AdminShell } from "@/app/admin/AdminShell";
import { adminApi } from "@/lib/api";
import { mediaUrl } from "@/lib/media";
import type { Design } from "@/lib/types";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { useToast } from "@/components/providers/ToastProvider";

export default function AdminDesignsPage() {
  const { error, success } = useToast();
  const [items, setItems] = useState<Design[]>([]);
  const [file, setFile] = useState<File | null>(null);
  const [form, setForm] = useState({
    title: "",
    category: "Minimal",
    shape: "almond",
    colors: "nude",
    price: "75",
    durationMin: "90",
    tags: "studio",
    isFeatured: false,
  });

  async function load() {
    try {
      const data = await adminApi.designs(1);
      setItems(data.items.map((d) => ({ ...d, imageUrl: mediaUrl(d.imageUrl) })));
    } catch (err: any) {
      error(err?.message || "Could not load designs");
    }
  }

  useEffect(() => {
    void load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function onCreate(e: FormEvent) {
    e.preventDefault();
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, String(v)));
      if (file) fd.append("image", file);
      await adminApi.createDesign(fd);
      success("Design created");
      setForm((f) => ({ ...f, title: "" }));
      setFile(null);
      await load();
    } catch (err: any) {
      error(err?.message || "Create failed");
    }
  }

  async function onDelete(id: string) {
    try {
      await adminApi.deleteDesign(id);
      success("Deleted");
      await load();
    } catch (err: any) {
      error(err?.message || "Delete failed");
    }
  }

  return (
    <AdminShell>
      <h1 className="font-display text-3xl">Designs</h1>
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((d) => (
          <Card key={d._id} className="overflow-hidden">
            <div className="relative aspect-[4/5]">
              <Image
                src={d.imageUrl}
                alt={d.title}
                fill
                className="object-cover"
                sizes="300px"
              />
            </div>
            <div className="space-y-2 p-4">
              <p className="font-medium">{d.title}</p>
              <p className="text-xs text-ink/55">
                {d.category} · {d.shape}
              </p>
              <Button
                size="sm"
                variant="secondary"
                onClick={() => onDelete(d._id)}
              >
                Delete
              </Button>
            </div>
          </Card>
        ))}
      </div>

      <Card className="mt-8 p-5">
        <h2 className="font-display text-2xl">Add design</h2>
        <form className="mt-4 grid gap-3 sm:grid-cols-2" onSubmit={onCreate}>
          <Input
            label="Title"
            value={form.title}
            onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
            required
          />
          <Input
            label="Category"
            value={form.category}
            onChange={(e) =>
              setForm((f) => ({ ...f, category: e.target.value }))
            }
            required
          />
          <label className="block space-y-2 text-sm">
            <span className="font-medium text-ink/80">Shape</span>
            <select
              className="w-full rounded-2xl border border-blush/50 bg-white/70 px-4 py-3"
              value={form.shape}
              onChange={(e) =>
                setForm((f) => ({ ...f, shape: e.target.value }))
              }
            >
              {["almond", "square", "coffin", "stiletto"].map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </label>
          <Input
            label="Colors (comma-separated)"
            value={form.colors}
            onChange={(e) => setForm((f) => ({ ...f, colors: e.target.value }))}
          />
          <Input
            label="Price"
            type="number"
            value={form.price}
            onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))}
          />
          <Input
            label="Duration (min)"
            type="number"
            value={form.durationMin}
            onChange={(e) =>
              setForm((f) => ({ ...f, durationMin: e.target.value }))
            }
          />
          <Input
            label="Tags"
            value={form.tags}
            onChange={(e) => setForm((f) => ({ ...f, tags: e.target.value }))}
          />
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={form.isFeatured}
              onChange={(e) =>
                setForm((f) => ({ ...f, isFeatured: e.target.checked }))
              }
            />
            Featured
          </label>
          <label className="block space-y-2 text-sm sm:col-span-2">
            <span className="font-medium text-ink/80">Image</span>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
            />
          </label>
          <Button type="submit">Create design</Button>
        </form>
      </Card>
    </AdminShell>
  );
}
