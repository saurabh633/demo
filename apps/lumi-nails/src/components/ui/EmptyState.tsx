import { Button } from "@/components/ui/Button";

export function EmptyState({
  title,
  description,
  actionLabel,
  onAction,
}: {
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}) {
  return (
    <div className="rounded-2xl border border-dashed border-blush/70 bg-white/40 px-6 py-14 text-center">
      <h3 className="font-display text-2xl text-ink">{title}</h3>
      <p className="mx-auto mt-2 max-w-md text-sm text-ink/65">{description}</p>
      {actionLabel && onAction ? (
        <Button className="mt-6" variant="secondary" onClick={onAction}>
          {actionLabel}
        </Button>
      ) : null}
    </div>
  );
}
