import { z } from "zod";

export const checkUserTypeSchema = z.object({
  userType: z.enum(["user", "hotelOwner", "systemAdmin"])
});

export const testEmailSchema = z.object({
  to: z.string().email(),
  type: z
    .enum(["welcome", "reset", "verification"])
    .optional()
    .default("welcome")
});

export const testEmailResponseSchema = z.object({
  success: z.boolean(),
  message: z.string()
});
