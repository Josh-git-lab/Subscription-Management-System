import Link from "next/link";
import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

type Props = {
  children: ReactNode;
  href?: string;
  className?: string;
  reflective?: boolean;
  type?: "button" | "submit";
  onClick?: () => void;
};

export function GlassButton({
  children,
  href,
  className,
  reflective = false,
  type = "button",
  onClick,
}: Props) {
  const surface = reflective ? "glass-reflective" : "glass-control";
  const classes = cn("btn-glass", surface, className);
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
