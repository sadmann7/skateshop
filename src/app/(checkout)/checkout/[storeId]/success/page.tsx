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
import { VerifyOderForm } from "@/components/checkout/verify-order-form"
import {
  PageHeader,
  PageHeaderDescription,
  PageHeaderHeading,
} from "@/components/page-header"
import { getOrderLineItems } from "@/app/_actions/order"
import { getPaymentIntentAction } from "@/app/_actions/stripe"

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

  const lineItems =
    isVerified && paymentIntent
      ? await getOrderLineItems({
          storeId,
        })
      : []

  return (
    <div className="flex h-full max-h-[100dvh] w-full flex-col gap-10 overflow-hidden pb-8 pt-6 md:py-8">
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
              cartLineItems={lineItems}
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
          <Link
            aria-label="Continue shopping"
            href="/products"
            className={cn(
              buttonVariants({
                variant: "link",
                size: "sm",
                className: "container max-w-7xl",
              })
            )}
          >
            Continue shopping
          </Link>
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
