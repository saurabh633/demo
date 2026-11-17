import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Services",
  description:
    "Nail extensions, gel manicure, acrylic, refill, and removal at Lumi Nails.",
};

export default function ServicesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
