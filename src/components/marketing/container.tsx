import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

type Props = {
  children: ReactNode;
  className?: string;
};

export function MarketingContainer({ children, className }: Props) {
  return <div className={cn("m-container", className)}>{children}</div>;
}
