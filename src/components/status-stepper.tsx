import { cn } from "@/lib/utils";

const steps = ["DRAFT", "QUOTATION", "CONFIRMED", "ACTIVE", "CLOSED"] as const;

export function StatusStepper({ status }: { status: string }) {
  const current = steps.indexOf(status as (typeof steps)[number]);

  return (
    <ol className="flex flex-wrap gap-1" aria-label={`Status ${status}`}>
      {steps.map((step, index) => {
        const reached = current >= 0 && index <= current && status !== "CLOSED";
        const isClosed = status === "CLOSED" && step === "CLOSED";
        const active = step === status;
        return (
          <li
            key={step}
            className={cn(
              "rounded px-1.5 py-0.5 text-[10px] font-medium tracking-wide",
              active
                ? "bg-primary text-primary-foreground"
                : reached || isClosed
                  ? "bg-muted text-foreground"
                  : "text-muted-foreground",
            )}
            aria-current={active ? "step" : undefined}
          >
            {step}
          </li>
        );
      })}
    </ol>
  );
}
