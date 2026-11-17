"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { adminApi } from "@/lib/api";
import { cn } from "@/lib/utils";
import { useToast } from "@/components/providers/ToastProvider";

const LINKS = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/bookings", label: "Bookings" },
  { href: "/admin/designs", label: "Designs" },
  { href: "/admin/services", label: "Services" },
  { href: "/admin/categories", label: "Categories" },
  { href: "/admin/reviews", label: "Reviews" },
  { href: "/admin/inquiries", label: "Inquiries" },
];

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { error } = useToast();
  const [ready, setReady] = useState(false);
  const [email, setEmail] = useState("");

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const me = await adminApi.me();
        if (!alive) return;
        setEmail(me.email);
        setReady(true);
      } catch {
        if (!alive) return;
        router.replace("/admin/login");
      }
    })();
    return () => {
      alive = false;
    };
  }, [router]);

  async function logout() {
    try {
      await adminApi.logout();
      router.replace("/admin/login");
    } catch (err: any) {
      error(err?.message || "Logout failed");
    }
  }

  if (!ready) {
    return (
      <div className="flex min-h-screen items-center justify-center text-sm text-ink/60">
        Checking admin session…
      </div>
    );
  }

  return (
    <div className="mx-auto flex min-h-screen max-w-7xl flex-col md:flex-row">
      <aside className="border-b border-blush/50 bg-white/70 p-4 backdrop-blur md:w-56 md:border-b-0 md:border-r">
        <p className="font-display text-2xl text-mauve">Lumi Admin</p>
        <p className="mt-1 truncate text-xs text-ink/50">{email}</p>
        <nav className="mt-6 flex flex-wrap gap-1 md:flex-col">
          {LINKS.map((link) => {
            const active =
              link.href === "/admin"
                ? pathname === "/admin"
                : pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "rounded-2xl px-3 py-2 text-sm transition",
                  active
                    ? "bg-mauve text-cream"
                    : "text-ink/70 hover:bg-blush/40",
                )}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>
        <button
          type="button"
          onClick={logout}
          className="mt-6 text-sm text-ink/60 underline-offset-2 hover:underline"
        >
          Log out
        </button>
      </aside>
      <div className="flex-1 p-4 sm:p-6">{children}</div>
    </div>
  );
}
