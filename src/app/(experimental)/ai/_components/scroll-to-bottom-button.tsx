"use client"

import { ArrowDownIcon } from "@radix-ui/react-icons"

import { cn } from "@/lib/utils"
import { useAtBottom } from "@/hooks/use-at-bottom"
import { Button, type ButtonProps } from "@/components/ui/button"

export function ScrollToBottomButton({ className, ...props }: ButtonProps) {
  const isAtBottom = useAtBottom()

  function scrollToBottom(behavior: ScrollBehavior = "auto") {
    window.scrollTo({
      top: document.body.offsetHeight,
      behavior: behavior,
    })
  }

  return (
    <Button
      aria-label="Scroll to bottom"
      variant="outline"
      size="icon"
      className={cn(
        "absolute right-4 top-1 z-10 bg-background transition-opacity duration-300 sm:right-8 md:top-2",
        isAtBottom ? "opacity-0" : "opacity-100",
        className
      )}
      onClick={() => scrollToBottom("smooth")}
      {...props}
    >
      <ArrowDownIcon className="size-4" aria-hidden="true" />
    </Button>
  )
}
