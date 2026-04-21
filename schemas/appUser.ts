import { z } from "zod";

export const addUserSchema = z.object({
  mode: z.enum(["new", "existing"]),
  existingId: z.string().optional(),
  name: z.string().min(1, "Name is required"),
  active: z.boolean(),
  isAdmin: z.boolean(),
});
export type AddUserValues = z.infer<typeof addUserSchema>;

export const updateUserSchema = z.object({
  existingId: z.string().min(1, "Pick an existing user"),
  name: z.string().min(1, "Name is required"),
  active: z.boolean(),
  isAdmin: z.boolean(),
});
export type UpdateUserValues = z.infer<typeof updateUserSchema>;
