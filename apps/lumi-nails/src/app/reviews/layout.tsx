import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Reviews",
  description: "Read guest reviews and share your Lumi Nails experience.",
};

export default function ReviewsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
