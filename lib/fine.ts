import { differenceInCalendarDays } from "date-fns";

export const FINE_PER_DAY = 10;

export function computeFine(dueDate: string, actualReturnDate: string): number {
  const days = differenceInCalendarDays(
    new Date(actualReturnDate),
    new Date(dueDate),
  );
  return Math.max(0, days) * FINE_PER_DAY;
}
