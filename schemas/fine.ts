import { z } from "zod";

export const fineSchema = z
  .object({
    issueId: z.string().min(1, "Issue is required"),
    finePaid: z.boolean(),
    remarks: z.string().optional(),
    fineCalculated: z.number(),
  })
  .refine((v) => v.fineCalculated === 0 || v.finePaid, {
    path: ["finePaid"],
    message: "Tick 'Fine Paid' to complete the return.",
  });

export type FineValues = z.infer<typeof fineSchema>;
