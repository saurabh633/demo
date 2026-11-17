import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Booking",
  description:
    "Book your Lumi Nails appointment in three steps—service, schedule, and details.",
};

export default function BookingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
