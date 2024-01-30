"use client"

import * as React from "react"
import { Elements } from "@stripe/react-stripe-js"
import { type StripeElementsOptions } from "@stripe/stripe-js"

import { getStripe } from "@/lib/get-stripe"
import { cn } from "@/lib/utils"
import { Icons } from "@/components/icons"

// Docs: https://stripe.com/docs/payments/quickstart

interface CheckoutShellProps
  extends React.PropsWithChildren<React.HTMLAttributes<HTMLDivElement>> {
  storeStripeAccountId: string
  clientSecret: string | null
}

export function CheckoutShell({
  children,
  storeStripeAccountId,
  clientSecret,
  className,
  ...props
}: CheckoutShellProps) {
  const stripePromise = React.useMemo(
    () => getStripe(storeStripeAccountId),
    [storeStripeAccountId]
  )

  if (!clientSecret) {
    return (
      <section className={cn("size-full", className)} {...props}>
        <div className="size-full bg-white">
          <div className="flex h-full flex-col items-center justify-center">
            <Icons.spinner
              className="h-64 w-64 animate-spin text-nav"
              aria-hidden="true"
            />
          </div>
        </div>
      </section>
    )
  }

  const options: StripeElementsOptions = {
    clientSecret,
    appearance: {
      theme: "stripe",
    },
    loader: "auto",
  }

  return (
    <section className={cn("size-full", className)} {...props}>
        <Elements key={clientSecret} options={options} stripe={stripePromise}>
          {children}
        </Elements>
    </section>
  )
}
