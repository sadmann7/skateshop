"use client"

import * as React from "react"
import { Elements } from "@stripe/react-stripe-js"
import { type StripeElementsOptions } from "@stripe/stripe-js"

import { getStripe } from "@/lib/get-stripe"
import { cn } from "@/lib/utils"

// Docs: https://stripe.com/docs/payments/quickstart

interface CheckoutShellProps
  extends React.PropsWithChildren<React.HTMLAttributes<HTMLDivElement>> {
  storeStripeAccountId: string
  paymentIntentPromise: Promise<{
    clientSecret: string | null
  }>
}

export function CheckoutShell({
  children,
  storeStripeAccountId,
  paymentIntentPromise,
  className,
  ...props
}: CheckoutShellProps) {
  const stripePromise = React.useMemo(
    () => getStripe(storeStripeAccountId),
    [storeStripeAccountId]
  )

  // Calling createPaymentIntentAction at the client component to avoid stripe authentication error in server action
  const { clientSecret } = React.use(paymentIntentPromise)

  if (!clientSecret) {
    return (
      <section className={cn("h-full w-full", className)} {...props}>
        <div className="h-full w-full bg-white" />
      </section>
    )
  }

  const options: StripeElementsOptions = {
    clientSecret,
    appearance: {
      theme: "stripe",
    },
  }

  return (
    <section className={cn("h-full w-full", className)} {...props}>
      <Elements options={options} stripe={stripePromise}>
        {children}
      </Elements>
    </section>
  )
}
