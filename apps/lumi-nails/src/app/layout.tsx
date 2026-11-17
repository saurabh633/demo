import type { Metadata } from "next";
import { DM_Sans, Playfair_Display } from "next/font/google";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { WhatsAppFloat } from "@/components/layout/WhatsAppFloat";
import { ToastProvider } from "@/components/providers/ToastProvider";
import { STUDIO } from "@/lib/constants";
import "./globals.css";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
});

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  display: "swap",
});

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL || "https://luminails.studio";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `${STUDIO.name} | Nail Extension & Art Studio`,
    template: `%s | ${STUDIO.name}`,
  },
  description:
    "Lumi Nails is a soft, luxurious nail extension and nail art studio. Book gel, acrylic, extensions, and custom designs.",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteUrl,
    siteName: STUDIO.name,
    title: `${STUDIO.name} | Soft luxury nail studio`,
    description:
      "Nail extensions and art with premium products, careful hygiene, and lasting wear.",
    images: [
      {
        url: "https://images.unsplash.com/photo-1604654894610-df63bc536371?auto=format&fit=crop&w=1200&q=80",
        width: 1200,
        height: 630,
        alt: "Lumi Nails soft nude nail extensions",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${STUDIO.name} | Soft luxury nail studio`,
    description:
      "Book nail extensions, gel, acrylic, and custom art at Lumi Nails.",
  },
  keywords: [
    "nail salon",
    "nail extensions",
    "nail art",
    "gel manicure",
    "acrylic nails",
    "Lumi Nails",
  ],
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  additionalType: "https://schema.org/NailSalon",
  name: STUDIO.name,
  description: STUDIO.tagline,
  telephone: STUDIO.phone,
  email: STUDIO.email,
  address: {
    "@type": "PostalAddress",
    streetAddress: "128 Soft Petal Lane",
    addressLocality: "New York",
    addressRegion: "NY",
    postalCode: "10012",
    addressCountry: "US",
  },
  openingHoursSpecification: [
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      opens: "10:00",
      closes: "19:00",
    },
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: "Saturday",
      opens: "10:00",
      closes: "18:00",
    },
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: "Sunday",
      opens: "11:00",
      closes: "17:00",
    },
  ],
  priceRange: "$$",
  image:
    "https://images.unsplash.com/photo-1604654894610-df63bc536371?auto=format&fit=crop&w=1200&q=80",
  url: siteUrl,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${playfair.variable} ${dmSans.variable} antialiased`}
      >
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <ToastProvider>
          <Navbar />
          <main className="min-h-[70vh]">{children}</main>
          <Footer />
          <WhatsAppFloat />
        </ToastProvider>
      </body>
    </html>
  );
}
