import { cn } from "@/lib/utils";

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "border-border bg-background placeholder:text-muted-foreground flex min-h-11 w-full min-w-0 rounded-[var(--rf-radius-control)] border px-3 py-2 text-base shadow-none transition-colors outline-none focus-visible:border-[color:var(--primary)] focus-visible:ring-0 focus-visible:[box-shadow:var(--rf-shadow-focus)] disabled:pointer-events-none disabled:opacity-50",
        className,
      )}
      {...props}
    />
  );
}

export { Input };
