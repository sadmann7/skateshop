"use client"

import * as React from "react"
import Link from "next/link"
import type { Dimensions } from "@/types"
import { ArrowLeftIcon } from "@radix-ui/react-icons"

import { formatPrice } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import ShippingLineItem from "@/components/checkout/shipping-line-item"
import { CartLineItems } from "@/components/checkout/cart-line-items"
import { CheckoutForm } from "@/components/checkout/checkout-form"
import { CheckoutShell } from "@/components/checkout/checkout-shell"

import type { CartLineItem } from "@/types"

interface CheckoutContentProps {
  user: {
    firstName: string | null
    lastName: string | null
    email: string
  }
  store: {
    id: number
    name: string
    stripeAccountId: string
  }
  cartLineItems: CartLineItem[]
  paymentIntentPromise: Promise<{
    clientSecret: string | null
  }>
}

export default function CheckoutContent({
  user,
  store,
  cartLineItems,
  paymentIntentPromise,
}: CheckoutContentProps) {
  const name = `${user.firstName || ""} ${user.lastName || ""}`.trim()

  const total = cartLineItems.reduce(
    (total, item) => total + item.quantity * Number(item.price),
    0
  )

  // TODO: Add support for dimension packing algorithm to calculate shipping rates
  const dimensions = cartLineItems.reduce(
    (dimensions, item) => {
      const { width, height, length, weight } = item
      if (width) dimensions.width += Number(width)
      if (height) dimensions.height += Number(height)
      if (length) dimensions.length += Number(length)
      if (weight) dimensions.weight += Number(weight)
      return dimensions
    },
    {
      width: 10,
      height: 10,
      length: 10,
      weight: 10,
    }
  ) as Dimensions

  const [rate, setRate] = React.useState<number>(0)

  return (
    <section className="relative flex h-full min-h-[100dvh] flex-col items-start justify-center lg:h-[100dvh] lg:flex-row lg:overflow-hidden">
      <div className="w-full space-y-12 pt-8 lg:pt-16">
        <div className="fixed top-0 z-40 h-16 w-full bg-[#09090b] py-4 lg:static lg:top-auto lg:z-0 lg:h-0 lg:py-0">
          <div className="container flex max-w-xl items-center justify-between space-x-2 lg:ml-auto lg:mr-0 lg:pr-[4.5rem]">
            <Link
              aria-label="Back to cart"
              href="/cart"
              className="group flex w-28 items-center space-x-2 lg:flex-auto"
            >
              <ArrowLeftIcon
                className="h-5 w-5 text-muted-foreground transition-colors group-hover:text-primary"
                aria-hidden="true"
              />
              <div className="block font-medium transition group-hover:hidden">
                OhGoody
              </div>
              <div className="hidden font-medium transition group-hover:block">
                Back
              </div>
            </Link>
            <Drawer>
              <DrawerTrigger asChild>
                <Button variant="outline" size="sm">
                  Details
                </Button>
              </DrawerTrigger>
              <DrawerContent className="mx-auto flex h-[82%] w-full max-w-4xl flex-col space-y-6 border pb-6 pt-8">
                <CartLineItems
                  items={cartLineItems}
                  variant="minimal"
                  isEditable={false}
                  className="container h-full flex-1 pr-8"
                />
                <ShippingLineItem
                  shipping={(rate === 0) ? "Calculcated after shipping address confirmed" : rate}
                  variant="minimal"
                  className="container h-full flex-1 pr-8"
                />
                <div className="container space-y-4 pr-8">
                  <Separator />
                  <div className="flex font-medium">
                    <div className="flex-1">
                      Total (
                      {cartLineItems.reduce(
                        (acc, item) => acc + item.quantity,
                        0
                      )}
                      )
                    </div>
                    <div>{formatPrice(total + rate)}</div>
                  </div>
                </div>
              </DrawerContent>
            </Drawer>
          </div>
        </div>
        <div className="container flex max-w-xl flex-col items-center space-y-1 lg:ml-auto lg:mr-0 lg:items-start lg:pr-[4.5rem]">
          <div className="line-clamp-1 font-semibold text-muted-foreground">
            Pay {store.name}
          </div>
          <div className="text-3xl font-bold">{formatPrice(total + rate)}</div>
        </div>
        <CartLineItems
          items={cartLineItems}
          isEditable={false}
          className="container hidden w-full max-w-xl lg:ml-auto lg:mr-0 lg:flex lg:max-h-[580px] lg:pr-[4.5rem]"
        />
        <ShippingLineItem
          shipping={(rate === 0) ? "Calculcated after shipping address confirmed" : rate}
          variant="minimal"
          className="container hidden w-full max-w-xl lg:ml-auto lg:mr-0 lg:flex lg:max-h-[580px] lg:pr-[4.5rem]"
        />
      </div>
      <CheckoutShell
        paymentIntentPromise={paymentIntentPromise}
        storeStripeAccountId={store.stripeAccountId}
        className="h-full w-full flex-1 bg-white pb-12 pt-10 lg:flex-initial lg:pl-12 lg:pt-16"
      >
        <ScrollArea className="h-full">
          <CheckoutForm
            storeId={store.id}
            userFullName={ name }
            userEmail={user.email}
            dimensions={dimensions}
            onRateChange={(shippingRate: number): void => {
              setRate(shippingRate)
            }}
            className="container max-w-xl pr-6 lg:ml-0 lg:mr-auto"
          />
        </ScrollArea>
      </CheckoutShell>
    </section>
  )
}

