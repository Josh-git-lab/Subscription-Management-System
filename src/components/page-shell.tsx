import { cn } from "@/lib/utils";

type PageShellProps = {
  title: string;
  description?: string;
  actions?: React.ReactNode;
  width?: "md" | "lg" | "xl" | "full";
  children: React.ReactNode;
};

const widthClass = {
  md: "max-w-3xl",
  lg: "max-w-5xl",
  xl: "max-w-6xl",
  full: "max-w-none w-full px-0 sm:px-0",
};

export function PageShell({
  title,
  description,
  actions,
  width = "lg",
  children,
}: PageShellProps) {
  return (
    <main
      className={cn(
        "rf-env-wash-flat mx-auto flex w-full flex-1 flex-col gap-8 py-6 sm:py-8",
        width !== "full" && "px-4 sm:px-6",
        widthClass[width],
      )}
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-2">
          <h1 className="rf-type-h1 text-balance">{title}</h1>
          {description ? (
            <p className="text-muted-foreground rf-type-body-lg max-w-2xl">
              {description}
            </p>
          ) : null}
        </div>
        {actions ? <div className="shrink-0">{actions}</div> : null}
      </div>
      {children}
    </main>
  );
}
