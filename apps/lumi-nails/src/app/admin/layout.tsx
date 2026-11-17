import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin | Lumi Nails",
  robots: { index: false, follow: false },
};

export default function AdminRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#f7f1ec] text-ink">
      {children}
    </div>
  );
}
