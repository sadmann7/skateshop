"use client"

import * as React from "react"

import { generateProducts } from "@/lib/actions/generate"
import { Button } from "@/components/ui/button"
import { Icons } from "@/components/icons"

export function GenerateButton() {
  const [isPending, startTransition] = React.useTransition()

  return (
    <Button
      className="w-fit"
      onClick={() => {
        startTransition(async () => {
          await generateProducts()
        })
      }}
      disabled={isPending}
    >
      {isPending && (
        <Icons.spinner
          className="mr-2 h-4 w-4 animate-spin"
          aria-hidden="true"
        />
      )}
      Generate
      <span className="sr-only">Generate products</span>
    </Button>
  )
}
