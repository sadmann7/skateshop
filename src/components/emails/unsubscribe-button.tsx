"use client"

import * as React from "react"
import { toast } from "sonner"

import { cn } from "@/lib/utils"
import { Button, type ButtonProps } from "@/components/ui/button"
import { Icons } from "@/components/icons"
import { unsubscribeFromNewsletterAction } from "@/app/_actions/email"

interface UnsubscribeButtonProps extends ButtonProps {
  token: string
}

export function UnsubscribeButton({
  token,
  className,
  ...props
}: UnsubscribeButtonProps) {
  const [isPending, startTransition] = React.useTransition()

  return (
    <Button
      className={cn(className)}
      onClick={() => {
        startTransition(async () => {
          try {
            await unsubscribeFromNewsletterAction({
              token,
            })
          } catch (error) {
            error instanceof Error
              ? toast.error(error.message)
              : toast.error("Something went wrong, please try again.")
          }
        })
      }}
      disabled={isPending ?? props.disabled}
      {...props}
    >
      {isPending && (
        <Icons.spinner
          className="mr-2 h-4 w-4 animate-spin"
          aria-hidden="true"
        />
      )}
      Unsubscribe
    </Button>
  )
}
