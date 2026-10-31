import type { PlanInterval } from "@prisma/client";
import { addDays, addMonths, addWeeks, addYears } from "date-fns";

export function addInterval(date: Date, interval: PlanInterval): Date {
  switch (interval) {
    case "DAILY":
      return addDays(date, 1);
    case "WEEKLY":
      return addWeeks(date, 1);
    case "MONTHLY":
      return addMonths(date, 1);
    case "YEARLY":
      return addYears(date, 1);
    default:
      return addMonths(date, 1);
  }
}
