import { cn } from "@/lib/utils";

type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  error?: string;
};

export function Input({ label, error, className, id, ...props }: InputProps) {
  const inputId = id || props.name;
  return (
    <label className="block space-y-2">
      {label ? (
        <span className="text-sm font-medium text-ink/80">{label}</span>
      ) : null}
      <input
        id={inputId}
        className={cn(
          "w-full rounded-2xl border border-blush/50 bg-white/70 px-4 py-3 text-ink outline-none transition focus:border-mauve/40 focus:ring-2 focus:ring-mauve/15",
          error && "border-red-400 focus:ring-red-200",
          className,
        )}
        {...props}
      />
      {error ? <span className="text-xs text-red-600">{error}</span> : null}
    </label>
  );
}
