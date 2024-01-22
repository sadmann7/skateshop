"use client"

// Original source: https://github.com/vercel/platforms/blob/main/components/blur-image.tsx
import type { ComponentProps } from "react"
import * as React from "react"
import Image from "next/image"

import { cn } from "@/lib/utils"

interface BlurImageProps extends ComponentProps<typeof Image> {}

export function BlurImage({ className, alt, ...props }: BlurImageProps) {
  const [isLoading, setLoading] = React.useState(true)

  return (
    <Image
      alt={alt}
      className={cn(
        className,
        "duration-700 ease-in-out",
        isLoading ? "scale-105 blur-lg" : "scale-100 blur-0"
      )}
      onLoad={() => setLoading(false)}
      {...props}
    />
  )
}
