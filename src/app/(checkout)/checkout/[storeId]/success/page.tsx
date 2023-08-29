import type { Metadata } from "next"
import Link from "next/link"
import { db } from "@/db"
import { stores } from "@/db/schema"
import { env } from "@/env.mjs"
import type { CheckoutItem } from "@/types"
import { eq } from "drizzle-orm"

import { cn, formatPrice } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"
import { CartLineItems } from "@/components/checkout/cart-line-items"
import {
  PageHeader,
  PageHeaderDescription,
  PageHeaderHeading,
} from "@/components/page-header"
import { Shell } from "@/components/shells/shell"
import { getOrderLineItems } from "@/app/_actions/order"
import { getPaymentIntentAction } from "@/app/_actions/stripe"

export const metadata: Metadata = {
  metadataBase: new URL(env.NEXT_PUBLIC_APP_URL),
  title: "Order Summary",
  description: "Order Summary for your purchase",
}

interface OrderSuccessPageProps {
  params: {
    storeId: string
  }
  searchParams: {
    [key: string]: string | string[] | undefined
  }
}

export default async function OrderSuccessPage({
  params,
  searchParams,
}: OrderSuccessPageProps) {
  const storeId = Number(params.storeId)
  const {
    payment_intent,
    payment_intent_client_secret,
    redirect_status,
    delivery_postal_code,
  } = searchParams ?? {}

  const store = await db.query.stores.findFirst({
    columns: {
      name: true,
    },
    where: eq(stores.id, storeId),
  })

  const { isVerified, paymentIntent } = await getPaymentIntentAction({
    storeId,
    paymentIntentId: typeof payment_intent === "string" ? payment_intent : "",
    deliveryPostalCode:
      typeof delivery_postal_code === "string" ? delivery_postal_code : "",
  })

  const checkoutItems = JSON.parse(
    paymentIntent?.metadata?.items ?? ""
  ) as unknown as CheckoutItem[]

  if (isVerified) {
    const lineItems = await getOrderLineItems({
      checkoutItems,
    })

    return (
      <div className="grid h-[100dvh] w-full gap-10 pb-8 pt-6 md:py-8">
        <PageHeader
          id="order-success-page-header"
          aria-labelledby="order-success-page-header-heading"
          className="container max-w-7xl"
        >
          <PageHeaderHeading>Thank you for your order</PageHeaderHeading>
          <PageHeaderDescription>
            {store?.name ?? "Store"} will be in touch with you shortly
          </PageHeaderDescription>
        </PageHeader>
        <div className="flex flex-col space-y-6 overflow-auto">
          <CartLineItems
            id="order-success-cart-line-items"
            aria-labelledby="order-success-cart-line-items-heading"
            cartLineItems={lineItems}
            isEditable={false}
            className="container max-w-7xl"
          />
          <div className="container flex max-w-7xl flex-col space-y-4">
            <div
              id="order-success-cart-line-items-total"
              aria-labelledby="order-success-cart-line-items-total-heading"
              className="flex items-center"
            >
              <span className="flex-1">
                {lineItems.reduce(
                  (acc, item) => acc + Number(item.quantity),
                  0
                )}{" "}
                items
              </span>
              <span>
                {formatPrice(
                  lineItems.reduce(
                    (acc, item) =>
                      acc + Number(item.price) * Number(item.quantity),
                    0
                  )
                )}
              </span>
            </div>
            <Link
              aria-label="Continue shopping"
              href="/products"
              className={cn(
                buttonVariants({
                  variant: "link",
                  size: "sm",
                })
              )}
            >
              Continue shopping
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <Shell>
      <PageHeader>
        <PageHeaderHeading size="sm">Order Summary</PageHeaderHeading>
        <PageHeaderDescription size="sm">
          Order Summary for your purchase
        </PageHeaderDescription>
      </PageHeader>
    </Shell>
  )
}
