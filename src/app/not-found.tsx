import Link from "next/link";

import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <main className="mx-auto flex w-full max-w-lg flex-1 flex-col items-center justify-center gap-6 px-4 py-16 text-center">
      <p className="text-primary text-sm font-medium tracking-wide uppercase">
        404
      </p>
      <h1 className="text-3xl font-semibold tracking-tight">Page not found</h1>
      <p className="text-muted-foreground text-base">
        This Brightloop route does not exist. Check the URL or return to the
        home page.
      </p>
      <Link href="/">
        <Button type="button">Back to home</Button>
      </Link>
    </main>
  );
}
