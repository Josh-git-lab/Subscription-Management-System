import { Badge } from "@/components/ui/badge";

const subscriptionVariant: Record<
  string,
  "success" | "warning" | "muted" | "secondary" | "outline"
> = {
  ACTIVE: "success",
  CLOSED: "muted",
  DRAFT: "outline",
  QUOTATION: "warning",
  CONFIRMED: "secondary",
};

const invoiceVariant: Record<
  string,
  "success" | "warning" | "muted" | "secondary" | "outline"
> = {
  PAID: "success",
  PARTIAL: "warning",
  ISSUED: "secondary",
  DRAFT: "outline",
  VOID: "muted",
};

export function SubscriptionStatusBadge({ status }: { status: string }) {
  return (
    <Badge variant={subscriptionVariant[status] ?? "outline"}>{status}</Badge>
  );
}

export function InvoiceStatusBadge({ status }: { status: string }) {
  return (
    <Badge variant={invoiceVariant[status] ?? "outline"}>{status}</Badge>
  );
}
