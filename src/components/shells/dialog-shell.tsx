"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { Cross2Icon } from "@radix-ui/react-icons"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

interface DialogShellProps extends React.HTMLAttributes<HTMLDivElement> {}

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
        variant="ghost"
        size="icon"
        className="absolute right-4 top-4 h-auto w-auto shrink-0 rounded-sm opacity-70 ring-offset-background transition-opacity hover:bg-transparent hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground"
        onClick={() => router.back()}
      >
        <Cross2Icon className="h-4 w-4" aria-hidden="true" />
        <span className="sr-only">Close</span>
      </Button>
      {children}
    </div>
  )
}
