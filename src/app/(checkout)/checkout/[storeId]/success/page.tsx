import type { Metadata } from "next"
import Link from "next/link"
import { db } from "@/db"
import { stores } from "@/db/schema"
import { env } from "@/env.js"
import { eq } from "drizzle-orm"

import { getOrderLineItems } from "@/lib/actions/order"
import { getPaymentIntent } from "@/lib/actions/stripe"
import { cn, formatPrice } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"
import { CartLineItems } from "@/components/checkout/cart-line-items"
import { VerifyOderForm } from "@/components/checkout/verify-order-form"
import {
  PageHeader,
  PageHeaderDescription,
  PageHeaderHeading,
} from "@/components/page-header"

export const metadata: Metadata = {
  metadataBase: new URL(env.NEXT_PUBLIC_APP_URL),
  title: "Order Success",
  description: "Order summary for your purchase",
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
  const storeId = decodeURIComponent(params.storeId)
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

  const { isVerified, paymentIntent } = await getPaymentIntent({
    storeId,
    paymentIntentId: typeof payment_intent === "string" ? payment_intent : "",
    deliveryPostalCode:
      typeof delivery_postal_code === "string" ? delivery_postal_code : "",
  })

  const lineItems =
    isVerified && paymentIntent
      ? await getOrderLineItems({
          storeId,
          items: paymentIntent?.metadata?.items,
          paymentIntent,
        })
      : []

  return (
    <div className="flex size-full max-h-[100dvh] flex-col gap-10 overflow-hidden pb-8 pt-6 md:py-8">
      {isVerified ? (
        <div className="grid gap-10 overflow-auto">
          <PageHeader
            id="order-success-page-header"
            aria-labelledby="order-success-page-header-heading"
            className="container flex max-w-7xl flex-col"
          >
            <PageHeaderHeading>Thank you for your order</PageHeaderHeading>
            <PageHeaderDescription>
              {store?.name ?? "Store"} will be in touch with you shortly
            </PageHeaderDescription>
          </PageHeader>
          <section
            id="order-success-cart-line-items"
            aria-labelledby="order-success-cart-line-items-heading"
            className="flex flex-col space-y-6 overflow-auto"
          >
            <CartLineItems
              items={lineItems}
              isEditable={false}
              className="container max-w-7xl"
            />
            <div className="container flex w-full max-w-7xl items-center">
              <span className="flex-1">
                Total (
                {lineItems.reduce(
                  (acc, item) => acc + Number(item.quantity),
                  0
                )}
                )
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
          </section>
          <section
            id="order-success-actions"
            aria-labelledby="order-success-actions-heading"
            className="container flex max-w-7xl items-center justify-center space-x-2.5"
          >
            <Link
              aria-label="Continue shopping"
              href="/products"
              className={cn(
                buttonVariants({
                  size: "sm",
                  className: "text-center",
                })
              )}
            >
              Continue shopping
            </Link>
            <Link
              aria-label="Back to cart"
              href="/cart"
              className={cn(
                buttonVariants({
                  variant: "outline",
                  size: "sm",
                  className: "text-center",
                })
              )}
            >
              Back to cart
            </Link>
          </section>
        </div>
      ) : (
        <div className="container grid max-w-7xl gap-10">
          <PageHeader
            id="order-success-page-header"
            aria-labelledby="order-success-page-header-heading"
          >
            <PageHeaderHeading>Thank you for your order</PageHeaderHeading>
            <PageHeaderDescription>
              Please enter your delivery postal code to verify your order
            </PageHeaderDescription>
          </PageHeader>
          <VerifyOderForm
            id="order-success-verify-order-form"
            aria-labelledby="order-success-verify-order-form-heading"
            className="mx-auto w-full max-w-md pt-40"
          />
        </div>
      )}
    </div>
  )
}
