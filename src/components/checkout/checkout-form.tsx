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

import { absoluteUrl } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Icons } from "@/components/icons"

interface CheckoutFormProps {
  storeId: number
}

export default function CheckoutForm({ storeId }: CheckoutFormProps) {
  const stripe = useStripe()
  const elements = useElements()
  const id = React.useId()
  const [email, setEmail] = React.useState("")
  const [message, setMessage] = React.useState("")
  const [isPending, startTransaction] = React.useTransition()

  React.useEffect(() => {
    if (!stripe) {
      return
    }

    const clientSecret = new URLSearchParams(window.location.search).get(
      "payment_intent_client_secret"
    )

    if (!clientSecret) return

    void stripe
      .retrievePaymentIntent(clientSecret)
      .then(({ paymentIntent }) => {
        switch (paymentIntent?.status) {
          case "succeeded":
            setMessage("Your payment was successful!")
            break
          case "processing":
            setMessage("Your payment is processing.")
            break
          case "requires_payment_method":
            setMessage("Your payment was not successful, please try again.")
            break
          default:
            setMessage("Something went wrong, please try again.")
            break
        }
      })
  }, [stripe])

  function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    startTransaction(async () => {
      // We don't want to let default form submission happen here,
      // which would refresh the page.

      if (!stripe || !elements) {
        // Stripe.js hasn't yet loaded.
        // Make sure to disable form submission until Stripe.js has loaded.
        return
      }

      const result = await stripe.confirmPayment({
        //`Elements` instance that was used to create the Payment Element
        elements,
        confirmParams: {
          return_url: absoluteUrl(`/checkout/${storeId}/order-summary`),
          receipt_email: email,
        },
      })

      if (result.error) {
        // Show error to your customer (for example, payment details incomplete)
        setMessage(
          result.error.message ?? "Something went wrong, please try again."
        )
        console.error(result.error.message)
        toast.error(result.error.message)
      } else {
        // Your customer will be redirected to your `return_url`. For some payment
        // methods like iDEAL, your customer will be redirected to an intermediate
        // site first to authorize the payment, then redirected to the `return_url`.
      }
    })
  }

  return (
    <form
      id={`checkout-form-${id}`}
      aria-labelledby={`checkout-form-${id}-heading`}
      onSubmit={onSubmit}
    >
      {message && (
        <div
          id={`checkout-form-${id}-message`}
          className="text-sm text-muted-foreground"
        >
          {message}
        </div>
      )}
      <AddressElement
        id={`address-element-${id}`}
        options={{
          mode: "shipping",
        }}
      />
      <PaymentElement
        id={`payment-element-${id}`}
        options={{
          layout: "tabs",
        }}
        onChange={(event) => {
          console.log("PaymentElement onChange", event)
        }}
      />
      <LinkAuthenticationElement
        id={`link-authentication-element-${id}`}
        onChange={(event) => {
          console.log("LinkAuthenticationElement onChange", event)
          setEmail(event.value.email)
        }}
      />
      <Button
        aria-label="Pay"
        id={`checkout-form-${id}-submit`}
        type="submit"
        className="mt-4 w-full"
        disabled={!stripe || !elements || isPending}
      >
        {isPending && (
          <Icons.spinner
            className="mr-2 h-4 w-4 animate-spin"
            aria-hidden="true"
          />
        )}
        Pay
      </Button>
    </form>
  )
}
