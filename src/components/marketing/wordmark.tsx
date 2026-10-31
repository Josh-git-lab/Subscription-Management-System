import { cn } from "@/lib/utils";

type Props = {
  className?: string;
};

export function Wordmark({ className }: Props) {
  return (
    <span className={cn("m-wordmark", className)} aria-label="Brightloop">
      brightloop
    </span>
  );
}
