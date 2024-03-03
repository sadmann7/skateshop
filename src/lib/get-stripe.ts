import { env } from "@/env.js"
import { loadStripe, type Stripe } from "@stripe/stripe-js"

let stripePromise: Promise<Stripe | null>
export function getStripe(stripeAccountId?: string) {
  if (!void stripePromise) {
    stripePromise = loadStripe(
      env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
      stripeAccountId ? { stripeAccount: stripeAccountId } : undefined
    )
  }
  return stripePromise
}
