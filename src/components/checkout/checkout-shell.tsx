"use client"

import * as React from "react"
import { Elements } from "@stripe/react-stripe-js"
import { type StripeElementsOptions } from "@stripe/stripe-js"
import { useTheme } from "next-themes"

import { getStripe } from "@/lib/get-stripe"

interface CheckoutShellProps {
  children: React.ReactNode
  storeStripeAccountId: string
  paymentIntent: Promise<{
    clientSecret: string | null
  }>
}

export function CheckoutShell({
  children,
  storeStripeAccountId,
  paymentIntent,
}: CheckoutShellProps) {
  const stripePromise = React.useMemo(
    () => getStripe(storeStripeAccountId),
    [storeStripeAccountId]
  )
  const { clientSecret } = React.use(paymentIntent)
  const { theme } = useTheme()

  const options: StripeElementsOptions = {
    appearance: {
      theme: theme === "dark" ? "night" : "stripe",
    },
    clientSecret: clientSecret ?? undefined,
  }

  return (
    <Elements options={options} stripe={stripePromise}>
      {children}
    </Elements>
  )
}
