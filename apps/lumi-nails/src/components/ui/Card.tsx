import { cn } from "@/lib/utils";

export function Card({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-white/50 bg-white/55 shadow-[0_12px_40px_rgba(31,26,28,0.06)] backdrop-blur-xl",
        className,
      )}
    >
      {children}
    </div>
  );
}
