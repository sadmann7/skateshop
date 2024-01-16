import * as z from "zod"

export const ratesSchema = z.object({
  toAddress: z.object({
    street1: z.string(),
    street2: z.string().optional(),
    city: z.string(),
    state: z.string(),
    zip: z.string(),
    country: z.string(),
    company: z.string().optional(),
    phone: z.string().optional(),
    email: z.string().optional(),
  }),
  // fromAddress: z.object({
  //   street1: z.string(),
  //   street2: z.string().optional(),
  //   city: z.string(),
  //   state: z.string(),
  //   zip: z.string(),
  //   country: z.string(),
  //   company: z.string().optional(),
  //   phone: z.string().optional(),
  //   email: z.string().optional(),
  // }),
  storeId: z.number(),
  dimensions: z.object({
    length: z.number(),
    width: z.number(),
    height: z.number(),
    weight: z.number(),
  }),
})

