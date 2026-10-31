import Link from "next/link";

import { Wordmark } from "@/components/marketing/wordmark";
import { cn } from "@/lib/utils";

type Props = {
  href?: string;
  className?: string;
};

export function LogoChip({ href = "/", className }: Props) {
  return (
    <Link
      className={cn("m-header__logo m-logo-chip m-logo-chip--wordmark", className)}
      href={href}
      aria-label="Brightloop home"
    >
      <Wordmark />
    </Link>
  );
}
