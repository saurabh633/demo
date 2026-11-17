import { cn } from "@/lib/utils";

export function ProgressBar({
  step,
  total,
  labels,
}: {
  step: number;
  total: number;
  labels?: string[];
}) {
  const pct = Math.min(100, Math.round((step / total) * 100));
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between text-xs uppercase tracking-[0.18em] text-ink/55">
        <span>
          Step {step} of {total}
        </span>
        <span>{pct}%</span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-blush/40">
        <div
          className="h-full rounded-full bg-gradient-to-r from-mauve to-gold transition-all duration-500"
          style={{ width: `${pct}%` }}
        />
      </div>
      {labels ? (
        <div className="grid grid-cols-3 gap-2 text-center text-xs text-ink/60">
          {labels.map((label, index) => (
            <span
              key={label}
              className={cn(index + 1 <= step && "font-medium text-mauve")}
            >
              {label}
            </span>
          ))}
        </div>
      ) : null}
    </div>
  );
}
