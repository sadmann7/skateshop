"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { SignOutButton } from "@clerk/nextjs"

import { Button } from "@/components/ui/button"

import { Icons } from "../icons"

export function LogOutButton() {
  const router = useRouter()
  const [isPending, startTransition] = React.useTransition()

  return (
    <SignOutButton
      signOutCallback={() =>
        startTransition(() => {
          router.push(`${window.location.origin}/?redirect=false`)
        })
      }
    >
      <Button disabled={isPending}>
        {isPending && <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />}
        Log Out
      </Button>
    </SignOutButton>
  )
}
