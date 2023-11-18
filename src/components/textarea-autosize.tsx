"use client"

import * as React from "react"
import ReactTextareaAutosize, {
  type TextareaAutosizeProps,
} from "react-textarea-autosize"

import { cn } from "@/lib/utils"

const TextareaAutosize = React.forwardRef<
  HTMLTextAreaElement,
  TextareaAutosizeProps
>(({ className, ...props }, ref) => {
  return (
    <ReactTextareaAutosize
      className={cn(
        "min-h-[60px] w-full bg-transparent px-4 py-[1.3rem] focus-within:outline-none sm:text-sm",
        className
      )}
      ref={ref}
      {...props}
    />
  )
})

TextareaAutosize.displayName = "TextareaAutosize"

export { TextareaAutosize }
