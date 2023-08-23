import type { Metadata } from "next"
import { env } from "@/env.mjs"

import {
  PageHeader,
  PageHeaderDescription,
  PageHeaderHeading,
} from "@/components/page-header"
import { Shell } from "@/components/shells/shell"
import { getCartAction } from "@/app/_actions/cart"

export const metadata: Metadata = {
  metadataBase: new URL(env.NEXT_PUBLIC_APP_URL),
  title: "Checkout",
  description: "Checkout with store items",
}

interface StoreCheckoutPageProps {
  storeId: string
}

export default async function StoreCheckoutPage({
  storeId,
}: StoreCheckoutPageProps) {
  const cartLineItems = await getCartAction()

  return (
    <Shell>
      <PageHeader>
        <PageHeaderHeading size="sm">Checkout</PageHeaderHeading>
        <PageHeaderDescription size="sm">
          Checkout with store items
        </PageHeaderDescription>
      </PageHeader>
    </Shell>
  )
}
