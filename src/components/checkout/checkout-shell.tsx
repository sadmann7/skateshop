"use client"

import * as React from "react"
import { Elements } from "@stripe/react-stripe-js"
import { type StripeElementsOptions } from "@stripe/stripe-js"
import { useTheme } from "next-themes"

import { getStripe } from "@/lib/get-stripe"
import { cn } from "@/lib/utils"

interface CheckoutShellProps extends React.HTMLAttributes<HTMLDivElement> {
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
  className,
  ...props
}: CheckoutShellProps) {
  const stripePromise = React.useMemo(
    () => getStripe(storeStripeAccountId),
    [storeStripeAccountId]
  )
  const { clientSecret } = React.use(paymentIntent)
  const { theme } = useTheme()

  if (!clientSecret) return null

  const options: StripeElementsOptions = {
    appearance: {
      theme: theme === "dark" ? "night" : "stripe",
    },
    clientSecret: clientSecret,
  }

  return (
    <section className={cn("w-full", className)} {...props}>
      <Elements options={options} stripe={stripePromise}>
        {children}
      </Elements>
    </section>
  )
}
