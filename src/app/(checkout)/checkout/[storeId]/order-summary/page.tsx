import type { Metadata } from "next"
import { db } from "@/db"
import { stores } from "@/db/schema"
import { env } from "@/env.mjs"
import type { CheckoutItem } from "@/types"
import { eq } from "drizzle-orm"

import {
  PageHeader,
  PageHeaderDescription,
  PageHeaderHeading,
} from "@/components/page-header"
import { Shell } from "@/components/shells/shell"
import { getOrderedProducts } from "@/app/_actions/order"
import { getPaymentIntentAction } from "@/app/_actions/stripe"

export const metadata: Metadata = {
  metadataBase: new URL(env.NEXT_PUBLIC_APP_URL),
  title: "Order Summary",
  description: "Order Summary for your purchase",
}

interface OrderSummaryPageProps {
  params: {
    storeId: string
  }
  searchParams: {
    [key: string]: string | string[] | undefined
  }
}

export default async function OrderSummaryPage({
  params,
  searchParams,
}: OrderSummaryPageProps) {
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
    const products = await getOrderedProducts({
      checkoutItems,
    })

    return (
      <Shell>
        <PageHeader>
          <PageHeaderHeading size="sm">Order Summary</PageHeaderHeading>
          <PageHeaderDescription size="sm">
            Order Summary for your purchase
          </PageHeaderDescription>
        </PageHeader>
        <div>
          <h2>Order Summary</h2>
          {store?.name && <h3>{store.name}</h3>}
          <ul>
            {products.map((product) => (
              <li key={product.id}>
                <h4>{product.name}</h4>
                <p>{product.price}</p>
                <p>{product.quantity}</p>
              </li>
            ))}
          </ul>
        </div>
      </Shell>
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
