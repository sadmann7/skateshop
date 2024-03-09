import type { Metadata } from "next"
import Link from "next/link"
import { env } from "@/env.js"

import { getUniqueStoreIds } from "@/lib/actions/cart"
import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"
import { CheckoutCard } from "@/components/checkout/checkout-card"
import { Icons } from "@/components/icons"
import {
  PageHeader,
  PageHeaderDescription,
  PageHeaderHeading,
} from "@/components/page-header"
import { Shell } from "@/components/shell"

export const metadata: Metadata = {
  metadataBase: new URL(env.NEXT_PUBLIC_APP_URL),
  title: "Cart",
  description: "Checkout with your cart items",
}

export default async function CartPage() {
  const uniqueStoreIds = await getUniqueStoreIds()

  return (
    <Shell>
      <PageHeader
        id="cart-page-header"
        aria-labelledby="cart-page-header-heading"
      >
        <PageHeaderHeading size="sm">Checkout</PageHeaderHeading>
        <PageHeaderDescription size="sm">
          Checkout with your cart items
        </PageHeaderDescription>
      </PageHeader>
      {uniqueStoreIds.length > 0 ? (
        uniqueStoreIds.map((storeId) => (
          <CheckoutCard key={storeId} storeId={storeId} />
        ))
      ) : (
        <section
          id="cart-page-empty-cart"
          aria-labelledby="cart-page-empty-cart-heading"
          className="flex h-full flex-col items-center justify-center space-y-1 pt-16"
        >
          <Icons.cart
            className="mb-4 size-16 text-muted-foreground"
            aria-hidden="true"
          />
          <div className="text-xl font-medium text-muted-foreground">
            Your cart is empty
          </div>
          <Link
            aria-label="Add items to your cart to checkout"
            href="/products"
            className={cn(
              buttonVariants({
                variant: "link",
                size: "sm",
                className: "text-sm text-muted-foreground",
              })
            )}
          >
            Add items to your cart to checkout
          </Link>
        </section>
      )}
    </Shell>
  )
}
