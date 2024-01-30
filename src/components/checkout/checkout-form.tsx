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

import { absoluteUrl, cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Icons } from "@/components/icons"
import type { StripeAddress } from "@/types/index"

// See the stripe playemnts docs: https://stripe.com/docs/payments/quickstart

interface CheckoutFormProps
  extends Omit<
    React.ComponentPropsWithoutRef<"form">,
    "updateEmail" | "updateAddress" | "toggleConfirmed" | "clearForm" | "updateLoading"
  > {
  storeId: number
  userFullName: string
  email: string
  address: StripeAddress | undefined
  debouncedAddress: StripeAddress | undefined
  confirmed: boolean
  updateEmail: (newEmail: string) => void
  updateAddress: (newAddress: StripeAddress | undefined) => void
  toggleConfirmed: (newConfirmed: boolean) => void
  clearForm: () => void
  isLoading: boolean
  updateLoading: (newLoading: boolean) => void
  isPending: boolean
}

export function CheckoutForm({
  storeId,
  userFullName,
  email,
  address,
  debouncedAddress,
  confirmed,
  updateEmail,
  updateAddress,
  toggleConfirmed,
  clearForm,
  isLoading,
  updateLoading,
  isPending,
  className,
  ...props
}: CheckoutFormProps) {
  //Stripe Elements variables
  const id = React.useId()
  const stripe = useStripe()
  const elements = useElements()

  const [message, setMessage] = React.useState<string | null>(null)

  // When the client secret changes, we need to update the payment intent
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

  // Payment submission
  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (!stripe || !elements || !debouncedAddress) {
      // Stripe.js hasn't yet loaded.
      // Make sure to disable form submission until Stripe.js has loaded.
      return
    }

    updateLoading(true)
    setMessage(null)
    toggleConfirmed(false)
    clearForm()

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

    updateLoading(false)
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
        options={{ defaultValues: { email: email } }}
        onChange={(e) => updateEmail(e.value.email)}
      />
      <AddressElement
        id={`${id}-address-element`}
        options={{
          mode: "shipping",
          defaultValues: {
            name: userFullName,
            address: address,
          },
        }}
        onChange={(e) => {
          if (e.complete) updateAddress(e.value.address)
        }}
        onFocus={(e) => {
          toggleConfirmed(false)
        }}
      />
      {confirmed && (
        <PaymentElement
          id={`${id}-payment-element`}
          options={{
            layout: "tabs",
          }}
        />
      )}
      {confirmed && (
        <Button
          type="submit"
          aria-label="Pay"
          id={`${id}-checkout-form-submit`}
          variant="secondary"
          className="w-full bg-blue-600 hover:bg-blue-500 hover:shadow-md"
          disabled={
            !stripe || !elements || isLoading || isPending || !confirmed
          }
        >
          {isLoading ||
            (isPending && (
              <Icons.spinner
                className="mr-2 size-4 animate-spin"
                aria-hidden="true"
              />
            ))}
          Pay
        </Button>
      )}
    </form>
  )
}
