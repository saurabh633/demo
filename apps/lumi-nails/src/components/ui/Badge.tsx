import { cn } from "@/lib/utils";

export function Badge({
  children,
  active,
  className,
  onClick,
}: {
  children: React.ReactNode;
  active?: boolean;
  className?: string;
  onClick?: () => void;
}) {
  const Comp = onClick ? "button" : "span";
  return (
    <Comp
      type={onClick ? "button" : undefined}
      onClick={onClick}
      className={cn(
        "inline-flex items-center rounded-2xl border px-3 py-1.5 text-xs font-medium transition",
        active
          ? "border-mauve bg-mauve text-cream"
          : "border-blush/70 bg-white/60 text-ink/80 hover:border-mauve/30",
        className,
      )}
    >
      {children}
    </Comp>
  );
}
