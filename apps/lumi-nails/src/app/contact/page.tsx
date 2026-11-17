"use client";

import { useState } from "react";
import { createInquiry } from "@/lib/api";
import { STUDIO, WHATSAPP_URL } from "@/lib/constants";
import { useToast } from "@/components/providers/ToastProvider";
import { Container } from "@/components/layout/Container";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Button } from "@/components/ui/Button";
import { FadeIn } from "@/components/ui/FadeIn";

export default function ContactPage() {
  const { error, success } = useToast();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<{
    name?: string;
    phone?: string;
    message?: string;
  }>({});

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const nextErrors: typeof errors = {};
    if (!name.trim()) nextErrors.name = "Name is required.";
    if (!phone.trim()) nextErrors.phone = "Phone is required.";
    else if (!/^[+\d][\d\s()-]{6,}$/.test(phone.trim())) {
      nextErrors.phone = "Enter a valid phone number.";
    }
    if (!message.trim()) nextErrors.message = "Please include a message.";
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;

    setSubmitting(true);
    try {
      await createInquiry({
        name: name.trim(),
        phone: phone.trim(),
        message: message.trim(),
      });
      success("Message sent—we’ll reply soon.");
      setName("");
      setPhone("");
      setMessage("");
    } catch {
      error("Could not send your inquiry.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="py-14 sm:py-16">
      <Container>
        <FadeIn>
          <SectionHeader
            eyebrow="Contact"
            title="Say hello"
            description="Questions about designs, timing, or private appointments—send a note or WhatsApp us."
          />
        </FadeIn>

        <div className="mt-10 grid gap-6 lg:grid-cols-2">
          <FadeIn>
            <Card className="p-6 sm:p-7">
              <h2 className="font-display text-2xl text-ink">Inquiry form</h2>
              <form className="mt-5 space-y-4" onSubmit={onSubmit}>
                <Input
                  label="Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  error={errors.name}
                  autoComplete="name"
                />
                <Input
                  label="Phone"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  error={errors.phone}
                  autoComplete="tel"
                />
                <Textarea
                  label="Message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  error={errors.message}
                  placeholder="How can we help?"
                />
                <Button type="submit" disabled={submitting}>
                  {submitting ? "Sending…" : "Send inquiry"}
                </Button>
              </form>
            </Card>
          </FadeIn>

          <div className="space-y-6">
            <FadeIn delay={0.06}>
              <Card className="overflow-hidden">
                <div
                  className="relative flex h-56 items-center justify-center bg-[linear-gradient(135deg,#f4c9d0_0%,#fbf6f1_45%,#e8d5b5_100%)]"
                  role="img"
                  aria-label={`Map placeholder for ${STUDIO.address}`}
                >
                  <div className="rounded-2xl border border-white/70 bg-white/70 px-5 py-4 text-center backdrop-blur-md">
                    <p className="text-xs uppercase tracking-[0.18em] text-gold">
                      Studio map
                    </p>
                    <p className="mt-2 max-w-xs text-sm text-ink/75">
                      {STUDIO.address}
                    </p>
                  </div>
                </div>
              </Card>
            </FadeIn>

            <FadeIn delay={0.1}>
              <Card className="space-y-5 p-6 sm:p-7">
                <div>
                  <p className="text-xs uppercase tracking-[0.18em] text-gold">
                    Hours
                  </p>
                  <ul className="mt-3 space-y-2 text-sm text-ink/75">
                    {STUDIO.hours.map((item) => (
                      <li
                        key={item.day}
                        className="flex items-center justify-between gap-4"
                      >
                        <span>{item.day}</span>
                        <span>{item.time}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="space-y-1 text-sm text-ink/75">
                  <p>
                    <a
                      href={`tel:${STUDIO.phone}`}
                      className="hover:text-mauve"
                    >
                      {STUDIO.phone}
                    </a>
                  </p>
                  <p>
                    <a
                      href={`mailto:${STUDIO.email}`}
                      className="hover:text-mauve"
                    >
                      {STUDIO.email}
                    </a>
                  </p>
                </div>
                <Button
                  href={WHATSAPP_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  variant="gold"
                  className="w-full"
                >
                  Message on WhatsApp
                </Button>
              </Card>
            </FadeIn>
          </div>
        </div>
      </Container>
    </div>
  );
}
