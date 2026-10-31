import { hash } from "bcryptjs";
import { PrismaClient, PlanInterval, UserRole } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  if (process.env.NODE_ENV === "production") {
    throw new Error("Seed refused: NODE_ENV is production");
  }

  const adminPassword = process.env.SEED_ADMIN_PASSWORD;
  const staffPassword = process.env.SEED_STAFF_PASSWORD;
  const customerPassword = process.env.SEED_CUSTOMER_PASSWORD;

  if (!adminPassword || !staffPassword || !customerPassword) {
    throw new Error(
      "Set SEED_ADMIN_PASSWORD, SEED_STAFF_PASSWORD, and SEED_CUSTOMER_PASSWORD",
    );
  }

  const plans = [
    {
      slug: "basic",
      name: "Basic",
      description: "Essentials for individuals",
      priceMinor: 49900,
      interval: PlanInterval.MONTHLY,
    },
    {
      slug: "pro",
      name: "Pro",
      description: "For growing teams",
      priceMinor: 149900,
      interval: PlanInterval.MONTHLY,
    },
    {
      slug: "team",
      name: "Team",
      description: "Advanced collaboration",
      priceMinor: 299900,
      interval: PlanInterval.MONTHLY,
    },
  ];

  for (const plan of plans) {
    await prisma.plan.upsert({
      where: { slug: plan.slug },
      update: {
        name: plan.name,
        description: plan.description,
        priceMinor: plan.priceMinor,
        interval: plan.interval,
        active: true,
      },
      create: plan,
    });
  }

  const users = [
    {
      email: "admin@gmail.com",
      name: "Admin User",
      role: UserRole.ADMIN,
      password: adminPassword,
    },
    {
      email: "staff@brightloop.local",
      name: "Staff User",
      role: UserRole.STAFF,
      password: staffPassword,
    },
    {
      email: "customer@brightloop.local",
      name: "Customer User",
      role: UserRole.CUSTOMER,
      password: customerPassword,
    },
  ];

  const unnumbered = await prisma.subscription.findMany({
    where: { number: null },
    orderBy: { createdAt: "asc" },
    select: { id: true },
  });
  let sequence = await prisma.subscription.count({
    where: { number: { not: null } },
  });
  for (const sub of unnumbered) {
    sequence += 1;
    await prisma.subscription.update({
      where: { id: sub.id },
      data: { number: `SUB-${String(sequence).padStart(6, "0")}` },
    });
  }

  for (const user of users) {
    const passwordHash = await hash(user.password, 12);
    await prisma.user.upsert({
      where: { email: user.email },
      update: {
        name: user.name,
        role: user.role,
        passwordHash,
      },
      create: {
        email: user.email,
        name: user.name,
        role: user.role,
        passwordHash,
      },
    });
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
