"use client"

import * as React from "react"
import { env } from "@/env.mjs"
import { Elements } from "@stripe/react-stripe-js"
import { loadStripe, type StripeElementsOptions } from "@stripe/stripe-js"

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
  const [clientSecret, setClientSecret] = React.useState("")
  const stripePromise = React.useMemo(
    () =>
      loadStripe(env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY, {
        stripeAccount: storeStripeAccountId,
      }),
    [storeStripeAccountId]
  )

  React.useEffect(() => {
    let error
    void paymentIntent.then((data) => {
      if (!data || !data.clientSecret) {
        error = true
        return
      }
      setClientSecret(data.clientSecret)
    })
    if (error) throw new Error("Payment intent not found")
  }, [paymentIntent])

  // if (!clientSecret) return null

  const options: StripeElementsOptions = {
    appearance: {
      theme: "stripe",
    },
    clientSecret: clientSecret,
  }

  return (
    <section className={cn("h-full w-full", className)} {...props}>
      <Elements options={options} stripe={stripePromise}>
        {children}
      </Elements>
    </section>
  )
}
