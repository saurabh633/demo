"use client";

import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils";

export function Modal({
  open,
  onClose,
  title,
  children,
  className,
}: {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  className?: string;
}) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open ? (
        <div className="fixed inset-0 z-[70] flex items-end justify-center p-4 sm:items-center">
          <motion.button
            type="button"
            aria-label="Close dialog"
            className="absolute inset-0 bg-ink/40 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={title || "Dialog"}
            className={cn(
              "relative z-10 max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl border border-white/60 bg-cream p-5 shadow-[0_20px_60px_rgba(31,26,28,0.2)] sm:p-6",
              className,
            )}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 16 }}
            transition={{ duration: 0.28 }}
          >
            <div className="mb-4 flex items-start justify-between gap-4">
              {title ? (
                <h2 className="font-display text-2xl text-ink">{title}</h2>
              ) : (
                <span />
              )}
              <button
                type="button"
                onClick={onClose}
                className="rounded-2xl px-3 py-1 text-sm text-ink/60 hover:bg-blush/40 hover:text-ink"
                aria-label="Close"
              >
                Close
              </button>
            </div>
            {children}
          </motion.div>
        </div>
      ) : null}
    </AnimatePresence>
  );
}
