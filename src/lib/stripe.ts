import { env } from "@/env.js";
import Stripe from "stripe";

export const stripe = new Stripe(env.STRIPE_API_KEY, {
  apiVersion: "2025-02-24.acacia",
  typescript: true,
});
