"use client"

import * as React from "react"
import Link from "next/link"
import type { CartLineItem, GetShippingRateProps } from "@/types"
import { ArrowLeftIcon } from "@radix-ui/react-icons"
import { toast } from "sonner"

import { getShippingRate } from "@/lib/actions/easypost"
import {
  createPaymentIntent,
  updatePaymentIntentWithShipping,
} from "@/lib/actions/stripe"
import { formatPrice } from "@/lib/utils"
import { useCheckoutFormState } from "@/hooks/use-checkout-form-state"
import { useDebounce } from "@/hooks/use-debounce"
import {
  getDimensions,
  transformAddress,
  useShipping,
} from "@/hooks/use-shipping-rate-state"
import { Button } from "@/components/ui/button"
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { CartLineItems } from "@/components/checkout/cart-line-items"
import { CheckoutForm } from "@/components/checkout/checkout-form"
import { CheckoutShell } from "@/components/checkout/checkout-shell"
import ShippingLineItem from "@/components/checkout/shipping-line-item"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Icons } from "@/components/icons"

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
}

export default function CheckoutContent({
  user,
  store,
  cartLineItems,
}: CheckoutContentProps) {
  // clientSecret needs to be accessible to the Checkout Shell and Checkout Form below
  const [clientSecret, setClientSecret] = React.useState<string | null>(null)

  // State management for shipping related variables
  const name = `${user.firstName || ""} ${user.lastName || ""}`.trim()
  const { rate, setRate, total } = useShipping(cartLineItems)

  // Form data state management
  const {
    email,
    address,
    confirmed,
    isLoading,
    isPending,
    updateEmail,
    updateAddress,
    toggleConfirmed,
    updateLoading,
    startTransition,
    clearForm,
  } = useCheckoutFormState({
    email: user.email,
    address: undefined,
    confirmed: false,
  })
  const debouncedAddress = useDebounce(address, 500)

  // When Confirmed is toggled, we need to update the shipping rate and payment intent
  const handleShippingChange = (checked: boolean) => {
    startTransition(async () => {
      if (debouncedAddress) {
        const shippingAddress = transformAddress(debouncedAddress)
        const shippingRate = await getShippingRate({
          toAddress: shippingAddress,
          items: cartLineItems,
          storeId: store.id,
          // dimensions: dimensions,
        } as GetShippingRateProps)

        const dimensions = getDimensions(cartLineItems)

        if (typeof shippingRate.rate === "number") {
          const updatedIntent = await updatePaymentIntentWithShipping({
            toAddress: shippingAddress,
            storeId: store.id,
            dimensions: dimensions,
            items: cartLineItems,
          })
          if (updatedIntent.clientSecret) {
            toggleConfirmed(checked)
            setRate(shippingRate.rate)
            setClientSecret(updatedIntent.clientSecret)
          } else {
            toast.error(
              "Something went wrong with setting up the payment, please try again."
            )
          }
        } else {
          toast.error(
            "Something went wrong with the address, please update it and try again."
          )
        }
      }
    })
  }

  // On Setup make the paymentIntent and then store the clientSecret
  React.useEffect(() => {
    createPaymentIntent({
      storeId: store.id,
      items: cartLineItems,
    })
      .then((result) => {
        setClientSecret(result.clientSecret)
      })
      .catch((e) => {
        toast.error(
          "Something went wrong with setting up the payment, please try again."
        )
      })
  }, [store.id, cartLineItems])

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
                  shipping={
                    rate === 0
                      ? "Calculcated after shipping address confirmed"
                      : rate
                  }
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
          shipping={
            rate === 0 ? "Calculcated after shipping address confirmed" : rate
          }
          variant="minimal"
          className="container hidden w-full max-w-xl lg:ml-auto lg:mr-0 lg:flex lg:max-h-[580px] lg:pr-[4.5rem]"
        />
      </div>
      <CheckoutShell
        storeStripeAccountId={store.stripeAccountId}
        clientSecret={clientSecret}
        className="h-full w-full flex-1 bg-white pb-12 pt-10 lg:flex-initial lg:pl-12 lg:pt-16"
      >
        <ScrollArea className="h-full">
          <CheckoutForm
            storeId={store.id}
            userFullName={name}
            email={email}
            address={address}
            debouncedAddress={debouncedAddress}
            confirmed={confirmed}
            updateEmail={updateEmail}
            updateAddress={updateAddress}
            toggleConfirmed={toggleConfirmed}
            clearForm={clearForm}
            isLoading={isLoading}
            updateLoading={updateLoading}
            isPending={isPending}
            className="container max-w-xl pr-6 lg:ml-0 lg:mr-auto"
          />
          <div className="mt-6 grid gap-2.5 pl-6">
            <Label
              htmlFor="confirm-shipping-address"
              className="text-lg text-slate-950"
            >
              Confirm Shipping Address
            </Label>
            <div className="grid grid-cols-2 gap-2.5 lg:ml-0 lg:mr-auto">
              <Switch
                id="confirm-shipping-address"
                aria-describedby="confirm-shipping-address-description"
                name="completed"
                size="xl"
                checked={confirmed}
                onCheckedChange={handleShippingChange}
              />
              {isPending && (
                <Icons.spinner
                  className="mr-2 h-8 w-8 animate-spin text-nav"
                  aria-hidden="true"
                />
              )}
            </div>
          </div>
        </ScrollArea>
      </CheckoutShell>
    </section>
  )
}
