import Link from "next/link";
import { NAV_LINKS, STUDIO, WHATSAPP_URL } from "@/lib/constants";
import { Container } from "@/components/layout/Container";

export function Footer() {
  return (
    <footer className="mt-20 border-t border-blush/40 bg-gradient-to-b from-cream to-[#f3e7e0]">
      <Container className="grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-4">
        <div className="space-y-3 lg:col-span-2">
          <p className="font-display text-3xl text-mauve">{STUDIO.name}</p>
          <p className="max-w-md text-sm leading-relaxed text-ink/65">
            A soft, luxurious nail extension & art studio. Thoughtful hygiene,
            premium products, and designs that last.
          </p>
        </div>

        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-gold">Explore</p>
          <ul className="mt-4 space-y-2">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="text-sm text-ink/70 transition hover:text-mauve"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-gold">Visit</p>
          <ul className="mt-4 space-y-2 text-sm text-ink/70">
            <li>{STUDIO.address}</li>
            <li>
              <a href={`tel:${STUDIO.phone}`} className="hover:text-mauve">
                {STUDIO.phone}
              </a>
            </li>
            <li>
              <a href={`mailto:${STUDIO.email}`} className="hover:text-mauve">
                {STUDIO.email}
              </a>
            </li>
            <li>
              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-mauve"
              >
                WhatsApp
              </a>
            </li>
          </ul>
        </div>
      </Container>
      <div className="border-t border-blush/30 py-5 text-center text-xs text-ink/50">
        © {new Date().getFullYear()} {STUDIO.name}. All rights reserved.
      </div>
    </footer>
  );
}
