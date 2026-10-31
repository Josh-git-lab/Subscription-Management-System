import Link from "next/link";

type Props = {
  href?: string;
};

export function LogoChip({ href = "/" }: Props) {
  return (
    <Link className="m-logo-chip" href={href} aria-label="Brightloop home">
      <span className="m-logo-chip__glyph" aria-hidden>
        b
      </span>
    </Link>
  );
}
