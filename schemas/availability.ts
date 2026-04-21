import { z } from "zod";

export const availabilitySchema = z
  .object({
    bookName: z.string().optional(),
    author: z.string().optional(),
    categoryBook: z.string().optional(),
    categoryMovie: z.string().optional(),
  })
  .refine(
    (v) =>
      !!(v.bookName || v.author || v.categoryBook || v.categoryMovie),
    {
      message:
        "Please make a valid selection — fill at least one text box or drop-down.",
      path: ["bookName"],
    },
  );

export type AvailabilityValues = z.infer<typeof availabilitySchema>;
