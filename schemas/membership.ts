import { z } from "zod";

export const addMembershipSchema = z.object({
  firstName: z.string().min(1, "First name required"),
  lastName: z.string().min(1, "Last name required"),
  contactNumber: z.string().min(1, "Contact number required"),
  contactAddress: z.string().min(1, "Contact address required"),
  aadhaar: z.string().min(1, "Aadhaar required"),
  startDate: z.string().min(1, "Start date required"),
  duration: z.enum(["6m", "1y", "2y"]),
});
export type AddMembershipValues = z.infer<typeof addMembershipSchema>;

export const updateMembershipSchema = z
  .object({
    membershipId: z.string().min(1, "Membership number required"),
    action: z.enum(["extend", "cancel"]),
    extension: z.enum(["6m", "1y", "2y"]).optional(),
  })
  .refine((v) => v.action !== "extend" || !!v.extension, {
    path: ["extension"],
    message: "Pick an extension duration.",
  });
export type UpdateMembershipValues = z.infer<typeof updateMembershipSchema>;
