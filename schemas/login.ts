import { z } from "zod";

export const loginSchema = z.object({
  username: z.string().min(1, "User ID is required"),
  password: z.string().min(1, "Password is required"),
});

export type LoginValues = z.infer<typeof loginSchema>;
