"use client"

import { env } from "process"
import * as React from "react"

import { catchError } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Icons } from "@/components/icons"
import { generateProducts } from "@/app/_actions/generate"

export function GenerateButton() {
  const [isPending, startTransition] = React.useTransition()

  if (env.NODE_ENV === "production") return null

  return (
    <Button
      className="h-8 px-2 lg:px-3"
      onClick={() => {
        startTransition(async () => {
          try {
            await generateProducts({ storeId: 1, count: 10 })
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
