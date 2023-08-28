import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { db } from "@/db"
import { stores } from "@/db/schema"
import { env } from "@/env.mjs"
import { ArrowLeftIcon } from "@radix-ui/react-icons"
import { eq } from "drizzle-orm"

import { cn, formatPrice } from "@/lib/utils"
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

  const total = cartLineItems.reduce(
    (total, item) => total + item.quantity * Number(item.price),
    0
  )

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
    <section className="relative flex flex-col items-start justify-center overflow-hidden lg:h-[100dvh] lg:flex-row">
      <div className="w-full space-y-12 py-8 lg:pt-16">
        <div className="fixed top-0 z-40 h-16 w-full bg-zinc-950 py-4 lg:static lg:top-auto lg:z-0 lg:h-0 lg:py-0">
          <div className="container flex max-w-xl items-center space-x-2 lg:ml-auto lg:mr-0 lg:pr-[4.5rem]">
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
              className="pointer-events-none text-[0.65rem]"
            >
              TEST MODE
            </Badge>
          </div>
        </div>
        <div className="container max-w-xl space-y-1 lg:ml-auto lg:mr-0 lg:pr-[4.5rem]">
          <div className="font-semibold text-muted-foreground">
            Pay Skateshop
          </div>
          <div className="text-3xl font-bold">{formatPrice(total)}</div>
        </div>
        <CartLineItems
          cartLineItems={cartLineItems}
          isEditable={false}
          className="container max-h-[180px] w-full max-w-xl lg:ml-auto lg:mr-0 lg:max-h-[580px] lg:pr-[4.5rem]"
        />
      </div>
      <div className="h-full w-full bg-white pb-12 pt-10 lg:pl-12 lg:pt-16">
        <CheckoutShell
          paymentIntent={paymentIntent}
          storeStripeAccountId={store.stripeAccountId}
          className="container min-h-[420px] max-w-xl lg:ml-0 lg:mr-auto"
        >
          <CheckoutForm storeId={store.id} />
        </CheckoutShell>
      </div>
    </section>
  )
}
