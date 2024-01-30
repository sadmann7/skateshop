import * as React from "react"
import Link from "next/link"
import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { db } from "@/db"
import { stores } from "@/db/schema"
import { env } from "@/env.mjs"
import { currentUser } from "@clerk/nextjs"
import { eq } from "drizzle-orm"

import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"
// import { createPaymentIntent } from "@/lib/actions/stripe"
import { getCart } from "@/lib/fetchers/cart"
import { getStripeAccount } from "@/lib/fetchers/stripe"
import CheckoutContent from "@/components/checkout/checkout-content"
import { Shell } from "@/components/shells/shell"

export const metadata: Metadata = {
  metadataBase: new URL(env.NEXT_PUBLIC_APP_URL),
  title: "Checkout",
  description: "Checkout with store items",
}

interface CheckoutPageProps {
  params: {
    storeId: string
  }
}

export default async function CheckoutPage({ params }: CheckoutPageProps) {
  const user = await currentUser()
  if (!user) {
    notFound()
  }

  const storeId = Number(params.storeId)

  const store = await db
    .select({
      id: stores.id,
      name: stores.name,
      stripeAccountId: stores.stripeAccountId,
    })
    .from(stores)
    .where(eq(stores.id, storeId))
    .execute()
    .then((rows) => rows[0])

  if (!store) {
    notFound()
  }

  const { isConnected } = await getStripeAccount({
    storeId,
  })

  const cartLineItems = await getCart({ storeId })

  // const paymentIntentPromise = createPaymentIntent({
  //   storeId: storeId,
  //   items: cartLineItems,
  // })

  const clientUser = {
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.emailAddresses.find(
      (emailObj) => emailObj.id === user.primaryEmailAddressId
    )!.emailAddress
  }

  const clientStore = {
    id: store.id,
    name: store.name,
    stripeAccountId: store.stripeAccountId ?? "",
  }

  if (!(isConnected && store.stripeAccountId)) {
    return (
      <Shell variant="centered">
        <div className="flex flex-col items-center justify-center gap-2 pt-20">
          <div className="text-center text-2xl font-bold">
            Store is not connected to Stripe
          </div>
          <div className="text-center text-muted-foreground">
            Store owner needs to connect their store to Stripe to accept
            payments
          </div>
          <Link
            aria-label="Back to cart"
            href="/cart"
            className={cn(
              buttonVariants({
                size: "sm",
              })
            )}
          >
            Back to cart
          </Link>
        </div>
      </Shell>
    )
  }

  return (
    <CheckoutContent 
      user={clientUser}
      store={clientStore}
      cartLineItems={cartLineItems} 
      // paymentIntentPromise={paymentIntentPromise}
    />
  )
}
