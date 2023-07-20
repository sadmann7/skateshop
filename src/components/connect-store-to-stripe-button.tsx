"use client"

import * as React from "react"

import { catchError } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { createAccountLinkAction } from "@/app/[locale]/_actions/stripe"

import { Icons } from "./icons"

interface ConnectToStripeButtonProps {
  storeId: number
}

export function ConnectStoreToStripeButton({
  storeId,
}: ConnectToStripeButtonProps) {
  const [isPending, startTransaction] = React.useTransition()

  return (
    <Button
      onClick={() => {
        startTransaction(async () => {
          try {
            const connection = await createAccountLinkAction({ storeId })
            window.location.href = connection.url
          } catch (err) {
            catchError(err)
          }
        })
      }}
      disabled={isPending}
    >
      {isPending && <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />}
      Connect to Stripe
    </Button>
  )
}
