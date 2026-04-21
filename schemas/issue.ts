import { z } from "zod";
import { startOfDay } from "date-fns";

export const issueSchema = z
  .object({
    serialNo: z.string().min(1, "Book name is required"),
    bookName: z.string().min(1, "Book name is required"),
    author: z.string().min(1, "Author is required"),
    memberId: z.string().min(1, "Member is required"),
    issueDate: z.string().min(1, "Issue date is required"),
    returnDate: z.string().min(1, "Return date is required"),
    remarks: z.string().optional(),
  })
  .refine(
    (v) => {
      const d = new Date(v.issueDate);
      return d >= startOfDay(new Date());
    },
    {
      path: ["issueDate"],
      message: "Issue date cannot be earlier than today.",
    },
  )
  .refine(
    (v) => new Date(v.returnDate) >= new Date(v.issueDate),
    {
      path: ["returnDate"],
      message: "Return date must be on or after issue date.",
    },
  )
  .refine(
    (v) => {
      const issued = new Date(v.issueDate);
      const ret = new Date(v.returnDate);
      const diff =
        (ret.getTime() - issued.getTime()) / (1000 * 60 * 60 * 24);
      return diff <= 15;
    },
    {
      path: ["returnDate"],
      message: "Return date cannot be more than 15 days from issue date.",
    },
  );

export type IssueValues = z.infer<typeof issueSchema>;
