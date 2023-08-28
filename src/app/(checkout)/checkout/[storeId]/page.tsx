import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { db } from "@/db"
import { stores } from "@/db/schema"
import { env } from "@/env.mjs"
import { ArrowLeftIcon } from "@radix-ui/react-icons"
import { eq } from "drizzle-orm"

import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
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

  if (!(isConnected && store.stripeAccountId)) {
    return (
      <Shell
        id="checkout-not-connected"
        aria-labelledby="checkout-not-connected-heading"
        variant="centered"
      >
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
      </Shell>
    )
  }

  return (
    <section className="flex h-[100dvh] flex-col items-start justify-center overflow-hidden lg:flex-row">
      <div className="w-full pb-10 pt-8 lg:h-full lg:pt-20">
        <div className="container flex w-full max-w-xl flex-col gap-8">
          <div className="flex items-center space-x-2">
            <Link
              aria-label="Back to cart"
              href="/cart"
              className="group flex w-28 items-center space-x-2"
            >
              <ArrowLeftIcon
                className="h-5 w-5 text-muted-foreground transition-colors group-hover:text-primary"
                aria-hidden="true"
              />
              <div className="block font-medium transition group-hover:hidden">
                Skateshop
              </div>
              <div className="hidden font-medium transition group-hover:block">
                Back
              </div>
            </Link>
            <Badge
              variant="secondary"
              className="pointer-events-none z-10 text-[0.65rem]"
            >
              TEST MODE
            </Badge>
          </div>
          <CartLineItems
            cartLineItems={cartLineItems}
            isEditable={false}
            className="max-h-[180px] lg:max-h-[640px]"
          />
        </div>
      </div>
      <div className="h-full w-full bg-white py-10 lg:pb-10 lg:pt-20">
        <CheckoutShell
          paymentIntent={paymentIntent}
          storeStripeAccountId={store.stripeAccountId}
          className="container max-w-xl"
        >
          <CheckoutForm storeId={store.id} />
        </CheckoutShell>
      </div>
    </section>
  )
}
