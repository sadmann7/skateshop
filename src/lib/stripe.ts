import { env } from "@/env.js"
import Stripe from "stripe"

export const stripe = new Stripe(env.STRIPE_API_KEY, {
  apiVersion: "2023-10-16",
  typescript: true,
})
