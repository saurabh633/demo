import { cn } from "@/lib/utils";

export function StarRating({
  value,
  onChange,
  size = "md",
  readOnly,
}: {
  value: number;
  onChange?: (value: number) => void;
  size?: "sm" | "md";
  readOnly?: boolean;
}) {
  return (
    <div
      className="flex items-center gap-1"
      role={readOnly ? "img" : "radiogroup"}
      aria-label={`${value} out of 5 stars`}
    >
      {[1, 2, 3, 4, 5].map((star) => {
        const active = star <= value;
        const Comp = readOnly ? "span" : "button";
        return (
          <Comp
            key={star}
            type={readOnly ? undefined : "button"}
            onClick={readOnly ? undefined : () => onChange?.(star)}
            className={cn(
              size === "sm" ? "text-sm" : "text-lg",
              active ? "text-gold" : "text-blush",
              !readOnly && "transition hover:scale-110",
            )}
            aria-label={`${star} star${star > 1 ? "s" : ""}`}
          >
            ★
          </Comp>
        );
      })}
    </div>
  );
}
