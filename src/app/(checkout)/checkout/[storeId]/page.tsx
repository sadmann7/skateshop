import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { db } from "@/db"
import { stores } from "@/db/schema"
import { env } from "@/env.mjs"
import { eq } from "drizzle-orm"

import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"
import { CartLineItems } from "@/components/checkout/cart-line-items"
import CheckoutForm from "@/components/checkout/checkout-form"
import { CheckoutShell } from "@/components/checkout/checkout-shell"
import { Shell } from "@/components/shells/shell"
import { getCartAction } from "@/app/_actions/cart"
import {
  createPaymentIntentAction,
  getStripeAccountAction,
} from "@/app/_actions/stripe"

export const metadata: Metadata = {
  metadataBase: new URL(env.NEXT_PUBLIC_APP_URL),
  title: "Checkout",
  description: "Checkout with store items",
}

interface IndieCheckoutPageProps {
  params: {
    storeId: string
  }
}

export default async function IndieCheckoutPage({
  params,
}: IndieCheckoutPageProps) {
  const storeId = Number(params.storeId)

  const store = await db
    .select({
      id: stores.id,
      stripeAccountId: stores.stripeAccountId,
    })
    .from(stores)
    .where(eq(stores.id, storeId))
    .execute()
    .then((rows) => rows[0])

  if (!store) {
    notFound()
  }

  const { isConnected } = await getStripeAccountAction({
    storeId,
  })

  const cartLineItems = await getCartAction(storeId)

  const paymentIntent = createPaymentIntentAction({
    storeId: store.id,
    items: cartLineItems,
  })

  return (
    <Shell>
      {isConnected && store.stripeAccountId ? (
        <div className="flex gap-20">
          <CartLineItems cartLineItems={cartLineItems} className="w-full" />
          <CheckoutShell
            paymentIntent={paymentIntent}
            storeStripeAccountId={store.stripeAccountId}
          >
            <CheckoutForm storeId={store.id} />
          </CheckoutShell>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center gap-2 pt-20">
          <div className="text-center text-2xl font-bold">
            Store is not connected to Stripe
          </div>
          <div className="text-center text-muted-foreground">
            Store owner needs to connect their store to Stripe to accept
            payments
          </div>
          <Link
            aria-label="Back to checkout"
            href="/checkout"
            className={cn(
              buttonVariants({
                size: "sm",
              })
            )}
          >
            Back to checkout
          </Link>
        </div>
      )}
    </Shell>
  )
}
