"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { Cross2Icon } from "@radix-ui/react-icons"

import { cn } from "@/lib/utils"
import { useClickOutside } from "@/hooks/use-click-outside"
import { Button } from "@/components/ui/button"

interface DialogShellProps extends React.HTMLAttributes<HTMLDivElement> {}

export function DialogShell({
  children,
  className,
  ...props
}: DialogShellProps) {
  const router = useRouter()
  const shellRef = React.useRef<HTMLDivElement>(null)

  // Close the dialog when the user presses the escape key
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

  // Close the dialog when the user clicks outside of it
  useClickOutside({
    ref: shellRef,
    handler: () => router.back(),
  })

  return (
    <div ref={shellRef} className={cn(className)} {...props}>
      <Button
        variant="ghost"
        size="icon"
        className="absolute right-4 top-4 size-auto shrink-0 rounded-sm opacity-70 ring-offset-background transition-opacity hover:bg-transparent hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground"
        onClick={() => router.back()}
      >
        <Cross2Icon className="size-4" aria-hidden="true" />
        <span className="sr-only">Close</span>
      </Button>
      {children}
    </div>
  )
}
