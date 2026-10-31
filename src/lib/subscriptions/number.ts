import { prisma } from "@/lib/db/prisma";

export async function allocateSubscriptionNumber(): Promise<string> {
  const latest = await prisma.subscription.findFirst({
    where: { number: { not: null } },
    orderBy: { number: "desc" },
    select: { number: true },
  });
  const current = latest?.number?.match(/(\d+)$/)?.[1];
  const next = current ? Number(current) + 1 : 1;
  return `SUB-${String(next).padStart(6, "0")}`;
}
