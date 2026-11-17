import { cn } from "@/lib/utils";

export function SectionHeader({
  eyebrow,
  title,
  description,
  align = "left",
  className,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  className?: string;
}) {
  return (
    <div
      className={cn(
        "max-w-2xl space-y-3",
        align === "center" && "mx-auto text-center",
        className,
      )}
    >
      {eyebrow ? (
        <p className="text-xs uppercase tracking-[0.22em] text-gold">{eyebrow}</p>
      ) : null}
      <h2 className="font-display text-3xl text-ink sm:text-4xl">{title}</h2>
      {description ? (
        <p className="text-base leading-relaxed text-ink/65">{description}</p>
      ) : null}
    </div>
  );
}
