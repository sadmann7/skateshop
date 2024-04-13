"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { SignOutButton } from "@clerk/nextjs"

import { cn } from "@/lib/utils"
import { useMounted } from "@/hooks/use-mounted"
import { Button, buttonVariants } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Icons } from "@/components/icons"

export function LogOutButtons() {
  const router = useRouter()
  const mounted = useMounted()
  const [isPending, startTransition] = React.useTransition()

  return (
    <div className="flex w-full flex-col-reverse items-center gap-2 sm:flex-row">
      <Button
        variant="secondary"
        size="sm"
        className="w-full"
        onClick={() => router.back()}
        disabled={isPending}
      >
        Go back
        <span className="sr-only">Previous page</span>
      </Button>
      {mounted ? (
        <SignOutButton
          signOutCallback={() =>
            startTransition(() => {
              router.push(`${window.location.origin}/?redirect=false`)
            })
          }
        >
          <Button size="sm" className="w-full" disabled={isPending}>
            {isPending && (
              <Icons.spinner className="mr-2 size-4 animate-spin" />
            )}
            Log out
            <span className="sr-only">Log out</span>
          </Button>
        </SignOutButton>
      ) : (
        <Skeleton
          className={cn(
            buttonVariants({ size: "sm" }),
            "w-full bg-muted text-muted-foreground"
          )}
        >
          Log out
        </Skeleton>
      )}
    </div>
  )
}
