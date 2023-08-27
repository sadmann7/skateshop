"use client"

import * as React from "react"
import {
  LinkAuthenticationElement,
  PaymentElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js"

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
  const [message, setMessage] = React.useState<string | null>(null)
  const [isPending, startTransaction] = React.useTransition()

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

  function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    startTransaction(async () => {
      if (!stripe || !elements) {
        // Stripe.js hasn't yet loaded.
        // Make sure to disable form submission until Stripe.js has loaded.
        return
      }

      const { error } = await stripe.confirmPayment({
        //`Elements` instance that was used to create the Payment Element
        elements,
        confirmParams: {
          return_url: absoluteUrl(`/checkout/${storeId}/order-summary`),
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
    })
  }

  return (
    <form
      id={`${id}-checkout-form`}
      aria-labelledby={`${id}-checkout-form-heading`}
      className="grid gap-4"
      onSubmit={onSubmit}
    >
      <LinkAuthenticationElement
        id={`payment-element-${id}`}
        onChange={(e) => setEmail(e.value.email)}
      />
      <PaymentElement
        id={`payment-element-${id}`}
        options={{
          layout: "tabs",
        }}
      />
      <Button
        type="submit"
        aria-label="Pay"
        id={`${id}-checkout-form-submit`}
        className="w-full"
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
      {/* Show any error or success messages */}
      {message && (
        <div
          id={`${id}-checkout-form-message`}
          className="text-sm text-muted-foreground"
        >
          {message}
        </div>
      )}
    </form>
  )
}
