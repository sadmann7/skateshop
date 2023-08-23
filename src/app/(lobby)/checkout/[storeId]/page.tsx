import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { db } from "@/db"
import { stores } from "@/db/schema"
import { env } from "@/env.mjs"
import { eq } from "drizzle-orm"

import {
  PageHeader,
  PageHeaderDescription,
  PageHeaderHeading,
} from "@/components/page-header"
import { Shell } from "@/components/shells/shell"
import { getCartAction } from "@/app/_actions/cart"
import { getStripeAccountAction } from "@/app/_actions/stripe"

export const metadata: Metadata = {
  metadataBase: new URL(env.NEXT_PUBLIC_APP_URL),
  title: "Checkout",
  description: "Checkout with store items",
}

interface StoreCheckoutPageProps {
  params: {
    storeId: string
  }
}

export default async function StoreCheckoutPage({
  params,
}: StoreCheckoutPageProps) {
  const storeId = Number(params.storeId)

  const store = await db.query.stores.findFirst({
    where: eq(stores.id, storeId),
    columns: {
      id: true,
    },
    with: {
      payments: {
        columns: {
          stripeAccountId: true,
        },
      },
    },
  })

  if (!store) {
    notFound()
  }

  const { isConnected, payment } = await getStripeAccountAction({
    storeId,
    retrieveAccount: false,
  })

  const cartLineItems = await getCartAction()

  console.log({
    store,
    isConnected,
    payment,
    cartLineItems,
  })

  return (
    <Shell>
      <PageHeader>
        <PageHeaderHeading size="sm">Store Checkout</PageHeaderHeading>
        <PageHeaderDescription size="sm">
          Checkout with store items
        </PageHeaderDescription>
      </PageHeader>
      {isConnected ? (
        <div className="flex flex-col items-center justify-center gap-2 pt-20">
          <div className="text-center text-2xl font-bold">
            Under construction
          </div>
          <div className="text-center text-muted-foreground">
            Please check back later
          </div>
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
        </div>
      )}
    </Shell>
  )
}
