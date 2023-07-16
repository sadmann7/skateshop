"use client"

import * as React from "react"
import { toast } from "sonner"

import { catchError } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Icons } from "@/components/icons"
import { generateProducts } from "@/app/_actions/generate"

interface GenerateButtonProps {
  storeId: number
}

export function GenerateButton({ storeId }: GenerateButtonProps) {
  const [isPending, startTransition] = React.useTransition()

  return (
    <Button
      className="h-8 px-2 lg:px-3"
      onClick={() => {
        startTransition(async () => {
          try {
            await generateProducts({ storeId, count: 10 })
            toast.success("Products generated successfully.")
          } catch (err) {
            catchError(err)
          }
        })
      }}
    >
      {isPending && (
        <Icons.spinner
          className="mr-2 h-4 w-4 animate-spin"
          aria-hidden="true"
        />
      )}
      Generate
    </Button>
  )
}
