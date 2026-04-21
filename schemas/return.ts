import { z } from "zod";

export const returnSchema = z.object({
  issueId: z.string().min(1, "Active issue is required"),
  bookName: z.string().min(1, "Book name is required"),
  author: z.string().min(1, "Author required"),
  serialNo: z.string().min(1, "Serial No is required"),
  issueDate: z.string().min(1, "Issue date required"),
  returnDate: z.string().min(1, "Return date required"),
  remarks: z.string().optional(),
});

export type ReturnValues = z.infer<typeof returnSchema>;
