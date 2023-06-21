"use client"

import * as React from "react"

import { Button } from "@/components/ui/button"
import { Icons } from "@/components/icons"
import { seed } from "@/app/_actions/seed"

export function SeedButton() {
  const [isPending, startTransition] = React.useTransition()

  return (
    <Button
      className="w-fit"
      onClick={() => {
        startTransition(async () => {
          await seed()
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
      Seed
      <span className="sr-only">Seed database</span>
    </Button>
  )
}
