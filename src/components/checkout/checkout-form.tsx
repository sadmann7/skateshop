"use client"

import * as React from "react"
import {
  AddressElement,
  LinkAuthenticationElement,
  PaymentElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js"
import { toast } from "sonner"

import type {
  Dimensions,
  EasyPostAddress,
  GetRateProps,
  StripeAddress,
} from "@/types/index"
import { getShippingRate } from "@/lib/actions/easypost"
import { absoluteUrl, cn } from "@/lib/utils"
import { useDebounce } from "@/hooks/use-debounce"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Icons } from "@/components/icons"

// Docs: https://stripe.com/docs/payments/quickstart

interface CheckoutFormProps extends Omit<React.ComponentPropsWithoutRef<"form">, 'onRateChange'> {
  storeId: number
  userFullName: string
  userEmail: string
  dimensions: Dimensions
  onRateChange: (rate: number) => void
}

const transformAddress = (
  address: StripeAddress,
  additionalFields?: object
): EasyPostAddress => {
  const {
    line1: street1,
    line2: street2,
    postal_code: zip,
    ...restOfAddressData
  } = address
  const transformedAddress = {
    street1,
    zip,
    ...restOfAddressData,
    ...additionalFields,
  } as EasyPostAddress
  if (street2) transformedAddress.street2 = street2
  return transformedAddress
}

export function CheckoutForm({
  storeId,
  userFullName,
  userEmail,
  dimensions,
  onRateChange,
  className,
  ...props
}: CheckoutFormProps) {
  const id = React.useId()
  const stripe = useStripe()
  const elements = useElements()
  const [email, setEmail] = React.useState("")
  const [message, setMessage] = React.useState<string | null>(null)
  const [address, setAddress] = React.useState<StripeAddress | null>(null)
  const [isLoading, setIsLoading] = React.useState(false)

  const debouncedAddress = useDebounce(address, 500)
  const [isPending, startTransition] = React.useTransition()

  const [confirmed, setConfirmed] = React.useState(false)
  const handleConfirmedSwitchChange = (checked: boolean) => {
    startTransition(async () => {
      if (debouncedAddress) {
        const shippingAddress = transformAddress(debouncedAddress)
        const shippingRate = await getShippingRate({
          toAddress: shippingAddress,
          storeId: storeId,
          dimensions: dimensions,
        } as GetRateProps)

        if (typeof shippingRate.rate === "number") {
          onRateChange(shippingRate.rate)
          setConfirmed(checked)
        } else {
          toast.error("Something went wrong with the address, please update it and try again.")
        }
      }
    })
  }

  React.useEffect(() => {
    setConfirmed(false)

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedAddress])

  React.useEffect(() => {
    if (!stripe) return

    const clientSecret = new URLSearchParams(window.location.search).get(
      "payment_intent_client_secret"
    )

    if (!clientSecret) return

    void stripe
      .retrievePaymentIntent(clientSecret)
      .then(({ paymentIntent }) => {
        switch (paymentIntent?.status) {
          case "succeeded":
            setMessage("Payment succeeded!")
            break
          case "processing":
            setMessage("Your payment is processing.")
            break
          case "requires_payment_method":
            setMessage("Your payment was not successful, please try again.")
            break
          default:
            setMessage("Something went wrong.")
            break
        }
      })
  }, [stripe])

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (!stripe || !elements || !debouncedAddress) {
      // Stripe.js hasn't yet loaded.
      // Make sure to disable form submission until Stripe.js has loaded.
      return
    }

    setIsLoading(true)
    setMessage(null)

    const { error } = await stripe.confirmPayment({
      //`Elements` instance that was used to create the Payment Element
      elements,
      confirmParams: {
        return_url: absoluteUrl(`/checkout/${storeId}/success`),
        receipt_email: email,
      },
    })

    // This point will only be reached if there is an immediate error when
    // confirming the payment. Otherwise, your customer will be redirected to
    // your `return_url`. For some payment methods like iDEAL, your customer will
    // be redirected to an intermediate site first to authorize the payment, then
    // redirected to the `return_url`.
    if (error.type === "card_error" || error.type === "validation_error") {
      setMessage(error.message ?? "Something went wrong, please try again.")
    } else {
      setMessage("Something went wrong, please try again.")
    }

    toast.error(message)

    setIsLoading(false)
  }

  return (
    <form
      id={`${id}-checkout-form`}
      aria-labelledby={`${id}-checkout-form-heading`}
      className={cn("grid gap-4", className)}
      onSubmit={(...args) => void onSubmit(...args)}
      {...props}
    >
      <LinkAuthenticationElement
        id={`${id}-link-authentication-element`}
        options={{ defaultValues: { email: userEmail } }}
        onChange={(e) => setEmail(e.value.email)}
      />
      <AddressElement
        id={`${id}-address-element`}
        options={{
          mode: "shipping",
          defaultValues: { name: userFullName },
        }}
        onChange={(e) => {
          if (e.complete) setAddress(e.value.address)
        }}
      />
      <PaymentElement
        id={`${id}-payment-element`}
        options={{
          layout: "tabs",
        }}
      />
      <div className="grid gap-2.5">
        <Label htmlFor="confirm-shipping-address" className="text-slate-950">
          Confirm Shipping Address
        </Label>
        <Switch
          id="confirm-shipping-address"
          aria-describedby="confirm-shipping-address-description"
          name="completed"
          checked={confirmed}
          onCheckedChange={handleConfirmedSwitchChange}
          className="data-[state=checked]:bg-accent"
        />
      </div>
      <Button
        type="submit"
        aria-label="Pay"
        id={`${id}-checkout-form-submit`}
        variant="secondary"
        className="w-full bg-blue-600 hover:bg-blue-500 hover:shadow-md"
        disabled={!stripe || !elements || isLoading || isPending || !confirmed}
      >
        {isLoading ||
          (isPending && (
            <Icons.spinner
              className="mr-2 h-4 w-4 animate-spin"
              aria-hidden="true"
            />
          ))}
        Pay
      </Button>
    </form>
  )
}

