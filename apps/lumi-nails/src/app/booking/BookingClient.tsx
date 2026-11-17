"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  createBooking,
  getDesignById,
  getDesigns,
  getServices,
  getSlots,
} from "@/lib/api";
import type { Design, Service, Slot } from "@/lib/types";
import { formatDuration, formatPrice, cn } from "@/lib/utils";
import { useToast } from "@/components/providers/ToastProvider";
import { Container } from "@/components/layout/Container";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Button } from "@/components/ui/Button";
import { Skeleton } from "@/components/ui/Skeleton";
import { EmptyState } from "@/components/ui/EmptyState";
import { FadeIn } from "@/components/ui/FadeIn";

type FormErrors = Partial<
  Record<"serviceId" | "date" | "time" | "name" | "phone", string>
>;

function tomorrowISO() {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  return d.toISOString().slice(0, 10);
}

export function BookingClient() {
  const searchParams = useSearchParams();
  const { error, success } = useToast();

  const [step, setStep] = useState(1);
  const [services, setServices] = useState<Service[]>([]);
  const [designs, setDesigns] = useState<Design[]>([]);
  const [slots, setSlots] = useState<Slot[]>([]);
  const [loadingServices, setLoadingServices] = useState(true);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [bookingId, setBookingId] = useState<string | null>(null);

  const [serviceId, setServiceId] = useState(
    searchParams.get("serviceId") || "",
  );
  const [designId, setDesignId] = useState(searchParams.get("designId") || "");
  const [date, setDate] = useState(tomorrowISO());
  const [time, setTime] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [notes, setNotes] = useState("");
  const [errors, setErrors] = useState<FormErrors>({});

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const [serviceData, designData] = await Promise.all([
          getServices(),
          getDesigns(),
        ]);
        if (!alive) return;
        setServices(serviceData);
        setDesigns(designData);

        const preDesign = searchParams.get("designId");
        if (preDesign) {
          const design = await getDesignById(preDesign);
          if (design && alive) setDesignId(design._id);
        }
      } catch {
        error("Could not load booking options.");
      } finally {
        if (alive) setLoadingServices(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, [error, searchParams]);

  useEffect(() => {
    if (!date) return;
    let alive = true;
    setLoadingSlots(true);
    setTime("");
    (async () => {
      try {
        const data = await getSlots(date);
        if (alive) setSlots(data);
      } catch {
        error("Could not load available time slots.");
        if (alive) setSlots([]);
      } finally {
        if (alive) setLoadingSlots(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, [date, error]);

  const selectedService = useMemo(
    () => services.find((s) => s._id === serviceId),
    [services, serviceId],
  );
  const selectedDesign = useMemo(
    () => designs.find((d) => d._id === designId),
    [designs, designId],
  );

  function validateStep(current: number) {
    const nextErrors: FormErrors = {};
    if (current === 1 && !serviceId) {
      nextErrors.serviceId = "Please choose a service.";
    }
    if (current === 2) {
      if (!date) nextErrors.date = "Select a date.";
      if (!time) nextErrors.time = "Select a time slot.";
    }
    if (current === 3) {
      if (!name.trim()) nextErrors.name = "Name is required.";
      if (!phone.trim()) nextErrors.phone = "Phone is required.";
      else if (!/^[+\d][\d\s()-]{6,}$/.test(phone.trim())) {
        nextErrors.phone = "Enter a valid phone number.";
      }
    }
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }

  async function onSubmit() {
    if (!validateStep(3)) return;
    setSubmitting(true);
    try {
      const booking = await createBooking({
        serviceId,
        designId: designId || undefined,
        date,
        time,
        name: name.trim(),
        phone: phone.trim(),
        notes: notes.trim(),
      });
      setBookingId(booking._id);
      success("Booking request received.");
      setStep(4);
    } catch {
      error("Booking failed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  if (step === 4 && bookingId) {
    return (
      <div className="py-14 sm:py-16">
        <Container className="max-w-xl">
          <FadeIn>
            <Card className="p-8 text-center">
              <p className="text-xs uppercase tracking-[0.2em] text-gold">
                Confirmed request
              </p>
              <h1 className="mt-3 font-display text-4xl text-ink">
                You’re on the list
              </h1>
              <p className="mt-4 text-sm text-ink/65">
                We’ve saved your appointment request. Save this booking ID for
                your records.
              </p>
              <p className="mt-6 rounded-2xl bg-blush/30 px-4 py-3 font-mono text-sm text-mauve">
                {bookingId}
              </p>
              <div className="mt-6 space-y-2 text-sm text-ink/70">
                <p>{selectedService?.name}</p>
                {selectedDesign ? <p>Design: {selectedDesign.title}</p> : null}
                <p>
                  {date} at {time}
                </p>
                <p>
                  {name} · {phone}
                </p>
              </div>
              <div className="mt-8 flex flex-wrap justify-center gap-3">
                <Button href="/">Back home</Button>
                <Button href="/gallery" variant="secondary">
                  Browse designs
                </Button>
              </div>
            </Card>
          </FadeIn>
        </Container>
      </div>
    );
  }

  return (
    <div className="py-14 sm:py-16">
      <Container className="max-w-3xl">
        <FadeIn>
          <SectionHeader
            eyebrow="Booking"
            title="Reserve your chair"
            description="Three short steps—service, time, and your details."
          />
        </FadeIn>

        <div className="mt-8">
          <ProgressBar
            step={Math.min(step, 3)}
            total={3}
            labels={["Service", "Schedule", "Details"]}
          />
        </div>

        <Card className="mt-8 p-5 sm:p-7">
          {step === 1 ? (
            <div className="space-y-6">
              <h2 className="font-display text-2xl text-ink">
                Choose a service
              </h2>
              {loadingServices ? (
                <div className="space-y-3">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <Skeleton key={i} className="h-20 w-full" />
                  ))}
                </div>
              ) : services.length === 0 ? (
                <EmptyState
                  title="No services available"
                  description="Please try again shortly."
                />
              ) : (
                <div className="space-y-3">
                  {services.map((service) => (
                    <button
                      key={service._id}
                      type="button"
                      onClick={() => {
                        setServiceId(service._id);
                        setErrors((e) => ({ ...e, serviceId: undefined }));
                      }}
                      className={cn(
                        "w-full rounded-2xl border px-4 py-4 text-left transition",
                        serviceId === service._id
                          ? "border-mauve bg-blush/35"
                          : "border-blush/50 bg-white/50 hover:border-mauve/30",
                      )}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="font-medium text-ink">{service.name}</p>
                          <p className="mt-1 text-sm text-ink/60">
                            {service.description}
                          </p>
                        </div>
                        <p className="shrink-0 text-sm text-mauve">
                          {formatPrice(service.price)}
                        </p>
                      </div>
                      <p className="mt-2 text-xs text-ink/50">
                        {formatDuration(service.durationMin)}
                      </p>
                    </button>
                  ))}
                </div>
              )}
              {errors.serviceId ? (
                <p className="text-xs text-red-600">{errors.serviceId}</p>
              ) : null}

              <div>
                <p className="mb-3 text-sm font-medium text-ink/80">
                  Optional design
                </p>
                <div className="flex gap-3 overflow-x-auto pb-2">
                  <button
                    type="button"
                    onClick={() => setDesignId("")}
                    className={cn(
                      "min-w-[140px] rounded-2xl border px-3 py-3 text-left text-sm",
                      !designId
                        ? "border-mauve bg-blush/35"
                        : "border-blush/50 bg-white/50",
                    )}
                  >
                    No specific design
                  </button>
                  {designs.map((design) => (
                    <button
                      key={design._id}
                      type="button"
                      onClick={() => setDesignId(design._id)}
                      className={cn(
                        "min-w-[160px] rounded-2xl border px-3 py-3 text-left text-sm",
                        designId === design._id
                          ? "border-mauve bg-blush/35"
                          : "border-blush/50 bg-white/50",
                      )}
                    >
                      <p className="font-medium text-ink">{design.title}</p>
                      <p className="mt-1 text-xs text-ink/55">
                        {formatPrice(design.price)}
                      </p>
                    </button>
                  ))}
                </div>
              </div>

              <Button
                className="w-full sm:w-auto"
                onClick={() => {
                  if (validateStep(1)) setStep(2);
                }}
              >
                Continue
              </Button>
            </div>
          ) : null}

          {step === 2 ? (
            <div className="space-y-6">
              <h2 className="font-display text-2xl text-ink">Pick a time</h2>
              <Input
                label="Date"
                type="date"
                value={date}
                min={tomorrowISO()}
                onChange={(e) => setDate(e.target.value)}
                error={errors.date}
              />

              <div>
                <p className="mb-3 text-sm font-medium text-ink/80">
                  Available slots
                </p>
                {loadingSlots ? (
                  <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                    {Array.from({ length: 7 }).map((_, i) => (
                      <Skeleton key={i} className="h-11 w-full" />
                    ))}
                  </div>
                ) : slots.length === 0 ? (
                  <EmptyState
                    title="No slots for this date"
                    description="Try another day."
                  />
                ) : (
                  <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                    {slots.map((slot) => (
                      <button
                        key={slot.time}
                        type="button"
                        disabled={!slot.available}
                        onClick={() => {
                          setTime(slot.time);
                          setErrors((e) => ({ ...e, time: undefined }));
                        }}
                        className={cn(
                          "rounded-2xl border px-3 py-2.5 text-sm transition",
                          !slot.available &&
                            "cursor-not-allowed opacity-40",
                          slot.available &&
                            time === slot.time &&
                            "border-mauve bg-blush/40 text-mauve",
                          slot.available &&
                            time !== slot.time &&
                            "border-blush/50 bg-white/60 hover:border-mauve/30",
                        )}
                      >
                        {slot.time}
                      </button>
                    ))}
                  </div>
                )}
                {errors.time ? (
                  <p className="mt-2 text-xs text-red-600">{errors.time}</p>
                ) : null}
              </div>

              <div className="flex flex-wrap gap-3">
                <Button variant="secondary" onClick={() => setStep(1)}>
                  Back
                </Button>
                <Button
                  onClick={() => {
                    if (validateStep(2)) setStep(3);
                  }}
                >
                  Continue
                </Button>
              </div>
            </div>
          ) : null}

          {step === 3 ? (
            <div className="space-y-6">
              <h2 className="font-display text-2xl text-ink">Your details</h2>
              <div className="rounded-2xl bg-blush/25 px-4 py-3 text-sm text-ink/70">
                <p>{selectedService?.name}</p>
                {selectedDesign ? <p>Design: {selectedDesign.title}</p> : null}
                <p>
                  {date} · {time}
                </p>
              </div>
              <Input
                label="Full name"
                name="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                error={errors.name}
                autoComplete="name"
              />
              <Input
                label="Phone"
                name="phone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                error={errors.phone}
                autoComplete="tel"
              />
              <Textarea
                label="Notes (optional)"
                name="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Allergies, shape preference, inspiration…"
              />
              <div className="flex flex-wrap gap-3">
                <Button variant="secondary" onClick={() => setStep(2)}>
                  Back
                </Button>
                <Button onClick={onSubmit} disabled={submitting}>
                  {submitting ? "Submitting…" : "Confirm booking"}
                </Button>
              </div>
            </div>
          ) : null}
        </Card>
      </Container>
    </div>
  );
}
