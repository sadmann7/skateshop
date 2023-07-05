"use client"

import * as React from "react"
import { toast } from "sonner"
import { type z } from "zod"

import { type manageSubscriptionSchema } from "@/lib/validations/stripe"
import { Button } from "@/components/ui/button"
import { Icons } from "@/components/icons"
import { manageSubscriptionAction } from "@/app/_actions/stripe"

type ManageSubscriptionFormProps = z.infer<typeof manageSubscriptionSchema> & {
  isCurrentPlan: boolean
}

export function ManageSubscriptionForm({
  userId,
  email,
  isCurrentPlan,
  isPro,
  stripeCustomerId,
  stripePriceId,
}: ManageSubscriptionFormProps) {
  const [isPending, startTransition] = React.useTransition()

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()

    startTransition(async () => {
      try {
        const session = await manageSubscriptionAction({
          email,
          userId,
          isPro,
          stripeCustomerId,
          stripePriceId,
        })
        if (session) {
          window.location.href = session.url ?? "/dashboard/billing"
        }
      } catch (error) {
        error instanceof Error
          ? toast.error(error.message)
          : toast.error("Something went wrong, please try again.")
      }
    })
  }

  return (
    <form className="w-full" onSubmit={(e) => onSubmit(e)}>
      <Button className="w-full" disabled={isPending || isCurrentPlan}>
        {isPending && (
          <Icons.spinner
            className="mr-2 h-4 w-4 animate-spin"
            aria-hidden="true"
          />
        )}
        {isCurrentPlan ? "Current plan" : "Subscribe"}
      </Button>
    </form>
  )
}
