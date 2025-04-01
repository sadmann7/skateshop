import * as z from "zod";

export const emailSchema = z.object({
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
});

export const joinNewsletterSchema = z.object({
  email: emailSchema.shape.email,
  token: z.string(),
  subject: z.string().optional(),
});

export const updateNotificationSchema = z.object({
  token: z.string(),
  communication: z.boolean().default(false).optional(),
  newsletter: z.boolean().default(false).optional(),
  marketing: z.boolean().default(false).optional(),
});

export type EmailSchema = z.infer<typeof emailSchema>;
export type JoinNewsletterSchema = z.infer<typeof joinNewsletterSchema>;
export type UpdateNotificationSchema = z.infer<typeof updateNotificationSchema>;
