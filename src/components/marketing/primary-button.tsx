import Link from "next/link";
import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

type Props = {
  children: ReactNode;
  href?: string;
  className?: string;
  type?: "button" | "submit";
  onClick?: () => void;
};

export function PrimaryButton({
  children,
  href,
  className,
  type = "button",
  onClick,
}: Props) {
  const classes = cn("btn-primary", className);
  if (href) {
    return (
      <Link className={classes} href={href}>
        {children}
      </Link>
    );
  }
  return (
    <button className={classes} type={type} onClick={onClick}>
      {children}
    </button>
  );
}
