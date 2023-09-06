"use client"

import * as React from "react"
import { Elements } from "@stripe/react-stripe-js"
import { type StripeElementsOptions } from "@stripe/stripe-js"

import { getStripe } from "@/lib/get-stripe"
import { cn } from "@/lib/utils"

// Docs: https://stripe.com/docs/payments/quickstart

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
    () => getStripe(storeStripeAccountId),
    [storeStripeAccountId]
  )

  React.useEffect(() => {
    void paymentIntent.then(({ clientSecret }) => {
      if (!clientSecret) return

      setClientSecret(clientSecret)
    })
  }, [paymentIntent])

  const options: StripeElementsOptions = {
    clientSecret,
    appearance: {
      theme: "stripe",
    },
  }

  return (
    <section className={cn("h-full w-full", className)} {...props}>
      {clientSecret ? (
        <Elements options={options} stripe={stripePromise}>
          {children}
        </Elements>
      ) : (
        <div className="h-full w-full bg-white" />
      )}
    </section>
  )
}
