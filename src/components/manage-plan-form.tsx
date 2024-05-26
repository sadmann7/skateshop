"use client"

import * as React from "react"
import { toast } from "sonner"
import { type z } from "zod"

import { managePlan } from "@/lib/actions/stripe"
import { type managePlanSchema } from "@/lib/validations/stripe"
import { Button } from "@/components/ui/button"
import { Icons } from "@/components/icons"

type ManagePlanFormProps = z.infer<typeof managePlanSchema>

export function ManagePlanForm({
  isCurrentPlan,
  isSubscribed,
  stripeCustomerId,
  stripeSubscriptionId,
  stripePriceId,
}: ManagePlanFormProps) {
  const [loading, setLoading] = React.useState(false)

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()

    setLoading(true)

    const { data, error } = await managePlan({
      isSubscribed,
      isCurrentPlan,
      stripeCustomerId,
      stripeSubscriptionId,
      stripePriceId,
    })

    if (data?.url) {
      window.location.href = data.url
      return
    }

    if (error) {
      toast.error(error)
      return
    }

    setLoading(false)
  }

  return (
    <form className="w-full" onSubmit={(e) => onSubmit(e)}>
      <Button className="w-full" disabled={loading}>
        {loading && (
          <Icons.spinner
            className="mr-2 size-4 animate-spin"
            aria-hidden="true"
          />
        )}
        {isCurrentPlan ? "Manage plan" : "Subscribe now"}
      </Button>
    </form>
  )
}
