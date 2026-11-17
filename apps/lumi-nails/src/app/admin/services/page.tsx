"use client";

import { FormEvent, useEffect, useState } from "react";
import { AdminShell } from "@/app/admin/AdminShell";
import { adminApi } from "@/lib/api";
import type { Service } from "@/lib/types";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { useToast } from "@/components/providers/ToastProvider";

export default function AdminServicesPage() {
  const { error, success } = useToast();
  const [items, setItems] = useState<Service[]>([]);
  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "55",
    durationMin: "60",
  });
  const [editId, setEditId] = useState<string | null>(null);

  async function load() {
    try {
      setItems(await adminApi.services());
    } catch (err: any) {
      error(err?.message || "Could not load services");
    }
  }

  useEffect(() => {
    void load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    const payload = {
      name: form.name,
      description: form.description,
      price: Number(form.price),
      durationMin: Number(form.durationMin),
    };
    try {
      if (editId) {
        await adminApi.updateService(editId, payload);
        success("Service updated");
      } else {
        await adminApi.createService(payload);
        success("Service created");
      }
      setEditId(null);
      setForm({ name: "", description: "", price: "55", durationMin: "60" });
      await load();
    } catch (err: any) {
      error(err?.message || "Save failed");
    }
  }

  return (
    <AdminShell>
      <h1 className="font-display text-3xl">Services</h1>
      <div className="mt-6 space-y-3">
        {items.map((s) => (
          <Card key={s._id} className="flex flex-wrap items-start justify-between gap-3 p-4">
            <div>
              <p className="font-medium">{s.name}</p>
              <p className="text-sm text-ink/60">{s.description}</p>
              <p className="mt-1 text-xs text-mauve">
                ${s.price} · {s.durationMin} min
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="secondary"
                onClick={() => {
                  setEditId(s._id);
                  setForm({
                    name: s.name,
                    description: s.description,
                    price: String(s.price),
                    durationMin: String(s.durationMin),
                  });
                }}
              >
                Edit
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={async () => {
                  try {
                    await adminApi.deleteService(s._id);
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
          </Card>
        ))}
      </div>
      <Card className="mt-8 p-5">
        <h2 className="font-display text-2xl">
          {editId ? "Edit service" : "Add service"}
        </h2>
        <form className="mt-4 space-y-3" onSubmit={onSubmit}>
          <Input
            label="Name"
            value={form.name}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            required
          />
          <Textarea
            label="Description"
            value={form.description}
            onChange={(e) =>
              setForm((f) => ({ ...f, description: e.target.value }))
            }
            required
          />
          <div className="grid gap-3 sm:grid-cols-2">
            <Input
              label="Price"
              type="number"
              value={form.price}
              onChange={(e) =>
                setForm((f) => ({ ...f, price: e.target.value }))
              }
            />
            <Input
              label="Duration (min)"
              type="number"
              value={form.durationMin}
              onChange={(e) =>
                setForm((f) => ({ ...f, durationMin: e.target.value }))
              }
            />
          </div>
          <Button type="submit">{editId ? "Update" : "Create"}</Button>
        </form>
      </Card>
    </AdminShell>
  );
}
