"use client";

import { FormEvent, useEffect, useState } from "react";
import { AdminShell } from "@/app/admin/AdminShell";
import { adminApi, getServices } from "@/lib/api";
import type { Booking, Service } from "@/lib/types";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { useToast } from "@/components/providers/ToastProvider";

export default function AdminBookingsPage() {
  const { error, success } = useToast();
  const [items, setItems] = useState<Booking[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [status, setStatus] = useState("");
  const [date, setDate] = useState("");
  const [form, setForm] = useState({
    serviceId: "",
    date: "",
    time: "11:00",
    name: "",
    phone: "",
    notes: "",
  });

  async function load() {
    try {
      const [bookings, svc] = await Promise.all([
        adminApi.bookings({ status, date, limit: 50 }),
        getServices(),
      ]);
      setItems(bookings.items);
      setServices(svc);
      if (!form.serviceId && svc[0]) {
        setForm((f) => ({ ...f, serviceId: svc[0]._id }));
      }
    } catch (err: any) {
      error(err?.message || "Could not load bookings");
    }
  }

  useEffect(() => {
    void load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, date]);

  async function onStatus(id: string, next: string) {
    try {
      await adminApi.updateBookingStatus(id, next);
      success("Status updated");
      await load();
    } catch (err: any) {
      error(err?.message || "Update failed");
    }
  }

  async function onCreate(e: FormEvent) {
    e.preventDefault();
    try {
      await adminApi.createBooking(form);
      success("Booking created");
      setForm((f) => ({ ...f, name: "", phone: "", notes: "" }));
      await load();
    } catch (err: any) {
      error(err?.message || "Create failed");
    }
  }

  return (
    <AdminShell>
      <h1 className="font-display text-3xl">Bookings</h1>
      <div className="mt-4 flex flex-wrap gap-3">
        <select
          className="rounded-2xl border border-blush/50 bg-white/70 px-3 py-2 text-sm"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        >
          <option value="">All statuses</option>
          <option value="pending">Pending</option>
          <option value="confirmed">Confirmed</option>
          <option value="cancelled">Cancelled</option>
        </select>
        <Input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="max-w-[180px]"
        />
      </div>

      <div className="mt-6 overflow-x-auto rounded-2xl border border-blush/40 bg-white/60">
        <table className="min-w-full text-left text-sm">
          <thead className="border-b border-blush/40 text-xs uppercase tracking-[0.12em] text-ink/50">
            <tr>
              <th className="px-3 py-3">Date</th>
              <th className="px-3 py-3">Guest</th>
              <th className="px-3 py-3">Status</th>
              <th className="px-3 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-3 py-6 text-ink/50">
                  No bookings
                </td>
              </tr>
            ) : (
              items.map((b) => (
                <tr key={b._id} className="border-t border-blush/30">
                  <td className="px-3 py-3">
                    {b.date} {b.time}
                  </td>
                  <td className="px-3 py-3">
                    {b.name}
                    <div className="text-xs text-ink/50">{b.phone}</div>
                  </td>
                  <td className="px-3 py-3 capitalize">{b.status}</td>
                  <td className="px-3 py-3">
                    <div className="flex flex-wrap gap-1">
                      {(["pending", "confirmed", "cancelled"] as const).map(
                        (s) => (
                          <button
                            key={s}
                            type="button"
                            className="rounded-xl border border-blush/50 px-2 py-1 text-xs capitalize hover:bg-blush/30"
                            onClick={() => onStatus(b._id, s)}
                          >
                            {s}
                          </button>
                        ),
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <Card className="mt-8 p-5">
        <h2 className="font-display text-2xl">Create booking</h2>
        <form className="mt-4 grid gap-3 sm:grid-cols-2" onSubmit={onCreate}>
          <label className="block space-y-2 text-sm">
            <span className="font-medium text-ink/80">Service</span>
            <select
              className="w-full rounded-2xl border border-blush/50 bg-white/70 px-4 py-3"
              value={form.serviceId}
              onChange={(e) =>
                setForm((f) => ({ ...f, serviceId: e.target.value }))
              }
              required
            >
              {services.map((s) => (
                <option key={s._id} value={s._id}>
                  {s.name}
                </option>
              ))}
            </select>
          </label>
          <Input
            label="Date"
            type="date"
            value={form.date}
            onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))}
            required
          />
          <Input
            label="Time"
            value={form.time}
            onChange={(e) => setForm((f) => ({ ...f, time: e.target.value }))}
            placeholder="11:00"
            required
          />
          <Input
            label="Name"
            value={form.name}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            required
          />
          <Input
            label="Phone"
            value={form.phone}
            onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
            required
          />
          <div className="sm:col-span-2">
            <Textarea
              label="Notes"
              value={form.notes}
              onChange={(e) =>
                setForm((f) => ({ ...f, notes: e.target.value }))
              }
            />
          </div>
          <Button type="submit">Create</Button>
        </form>
      </Card>
    </AdminShell>
  );
}
