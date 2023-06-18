"use client"

import * as React from "react"
import { useRouter } from "next/navigation"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Icons } from "@/components/icons"

interface DialogShellProps
  extends React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLDivElement>,
    HTMLDivElement
  > {
  children: React.ReactNode
}

export function DialogShell({
  children,
  className,
  ...props
}: DialogShellProps) {
  const router = useRouter()

  React.useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        router.back()
      }
    }
    window.addEventListener("keydown", handleEsc)
    return () => {
      window.removeEventListener("keydown", handleEsc)
    }
  }, [router])

  return (
    <div className={cn(className)} {...props}>
      <Button
        className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100"
        onClick={() => router.back()}
      >
        <Icons.close className="h-4 w-4" aria-hidden="true" />
        <span className="sr-only">Close</span>
      </Button>
      {children}
    </div>
  )
}
