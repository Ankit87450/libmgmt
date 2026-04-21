import { z } from "zod";

export const addBookSchema = z.object({
  kind: z.enum(["book", "movie"]),
  name: z.string().min(1, "Name required"),
  author: z.string().min(1, "Author required"),
  category: z.enum([
    "Science",
    "Economics",
    "Fiction",
    "Children",
    "Personal Development",
  ]),
  procurementDate: z.string().min(1, "Procurement date required"),
  quantity: z.coerce.number().int().min(1, "Must be at least 1"),
  cost: z.coerce.number().min(0).optional(),
});
export type AddBookValues = z.infer<typeof addBookSchema>;

export const updateBookSchema = z.object({
  kind: z.enum(["book", "movie"]),
  serialNo: z.string().min(1, "Serial No required"),
  status: z.enum([
    "Available",
    "Unavailable",
    "Removed",
    "On Repair",
    "To Replace",
  ]),
  statusChangeDate: z.string().min(1, "Status change date required"),
});
export type UpdateBookValues = z.infer<typeof updateBookSchema>;
