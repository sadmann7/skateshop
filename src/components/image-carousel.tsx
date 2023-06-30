"use client"

import * as React from "react"
import Image from "next/image"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Icons } from "@/components/icons"

interface ImageCarouselProps
  extends React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLDivElement>,
    HTMLDivElement
  > {
  data: { name: string; url: string }[]
}

export function ImageCarousel({
  data,
  className,
  ...props
}: ImageCarouselProps) {
  const imagesRef = React.useRef<HTMLDivElement>(null)
  const [currentImage, setCurrentImage] = React.useState(0)

  const slideTo = React.useCallback((index: number) => {
    if (!imagesRef.current) return

    const imageWidth = imagesRef.current.children[0]?.clientWidth ?? 0
    imagesRef.current.style.transform = `translateX(-${imageWidth * index}px)`
    setCurrentImage(index)
  }, [])

  return (
    <div className={cn(className)} {...props}>
      {data.length > 0 ? (
        <div className="flex flex-col gap-2">
          <div className="relative overflow-hidden">
            <div
              ref={imagesRef}
              className="flex transition-transform duration-300 ease-in-out"
            >
              {data.map((image, index) => (
                <Image
                  key={index}
                  src={image.url}
                  alt={image.name}
                  width={500}
                  height={500}
                  className="aspect-square w-full object-cover shadow"
                />
              ))}
            </div>
          </div>
          <div className="flex w-full items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              className="aspect-square h-8 w-8 rounded-none"
              onClick={() => slideTo(currentImage - 1)}
              disabled={currentImage === 0}
            >
              <Icons.chevronLeft className="h-4 w-4" aria-hidden="true" />
              <span className="sr-only">Previous slide</span>
            </Button>
            {data.map((image, i) => (
              <Button
                key={i}
                variant="outline"
                size="icon"
                className={cn(
                  "group relative aspect-square h-auto w-full rounded-none shadow-sm hover:bg-transparent focus-visible:ring-foreground",
                  i === currentImage && "ring-1 ring-foreground"
                )}
                tabIndex={0}
                onClick={() => slideTo(i)}
              >
                <div className="absolute inset-0 z-10 bg-zinc-950/20 group-hover:bg-zinc-950/40" />
                <Image src={image.url} alt={image.name} fill />
                <span className="sr-only">
                  Slide {i + 1} of {data.length}
                </span>
              </Button>
            ))}
            <Button
              variant="outline"
              size="icon"
              className="aspect-square h-8 w-8 rounded-none"
              onClick={() => slideTo(currentImage + 1)}
              disabled={currentImage === data.length - 1}
            >
              <Icons.chevronRight className="h-4 w-4" aria-hidden="true" />
              <span className="sr-only">Next slide</span>
            </Button>
          </div>
        </div>
      ) : (
        <div className="flex aspect-square h-full flex-1 items-center justify-center bg-secondary">
          <Icons.placeholder
            className="h-9 w-9 text-muted-foreground"
            aria-hidden="true"
          />
        </div>
      )}
    </div>
  )
}
