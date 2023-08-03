"use client"

import * as React from "react"
import Image from "next/image"
import { type StoredFile } from "@/types"
import { AspectRatio } from "@radix-ui/react-aspect-ratio"
import useEmblaCarousel, {
  type EmblaCarouselType,
  type EmblaOptionsType,
} from "embla-carousel-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Icons } from "@/components/icons"

interface ProductImageCarouselProps
  extends React.HTMLAttributes<HTMLDivElement> {
  images: StoredFile[]
  options?: EmblaOptionsType
}

export function ProductImageCarousel({
  images,
  className,
  options,
  ...props
}: ProductImageCarouselProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel(options)

  const [prevBtnDisabled, setPrevBtnDisabled] = React.useState(true)
  const [nextBtnDisabled, setNextBtnDisabled] = React.useState(true)
  const [selectedIndex, setSelectedIndex] = React.useState(0)

  const scrollPrev = React.useCallback(
    () => emblaApi && emblaApi.scrollPrev(),
    [emblaApi]
  )
  const scrollNext = React.useCallback(
    () => emblaApi && emblaApi.scrollNext(),
    [emblaApi]
  )

  const scrollTo = React.useCallback(
    (index: number) => emblaApi && emblaApi.scrollTo(index),
    [emblaApi]
  )

  const handleKeyDown = React.useCallback(
    (event: React.KeyboardEvent<HTMLButtonElement>) => {
      if (event.key === "ArrowLeft") {
        scrollPrev()
      } else if (event.key === "ArrowRight") {
        scrollNext()
      }
    },
    [scrollNext, scrollPrev]
  )

  const onSelect = React.useCallback((emblaApi: EmblaCarouselType) => {
    setSelectedIndex(emblaApi.selectedScrollSnap())
    setPrevBtnDisabled(!emblaApi.canScrollPrev())
    setNextBtnDisabled(!emblaApi.canScrollNext())
  }, [])

  React.useEffect(() => {
    if (!emblaApi) return

    onSelect(emblaApi)
    emblaApi.on("reInit", onSelect)
    emblaApi.on("select", onSelect)
  }, [emblaApi, onSelect])

  if (images.length === 0) {
    return (
      <div
        aria-label="Product Placeholder"
        role="img"
        aria-roledescription="placeholder"
        className="flex aspect-square h-full w-full flex-1 items-center justify-center bg-secondary"
      >
        <Icons.placeholder
          className="h-9 w-9 text-muted-foreground"
          aria-hidden="true"
        />
      </div>
    )
  }

  return (
    <div
      aria-label="Product image carousel"
      className={cn("flex flex-col gap-2", className)}
      {...props}
    >
      <div ref={emblaRef} className="overflow-hidden">
        <div
          className="-ml-4 flex touch-pan-y"
          style={{
            backfaceVisibility: "hidden",
          }}
        >
          {images.map((image, index) => (
            <div className="relative min-w-0 flex-full pl-4" key={index}>
              <AspectRatio ratio={1}>
                <Image
                  aria-label={`Slide ${index + 1} of ${images.length}`}
                  role="group"
                  key={index}
                  aria-roledescription="slide"
                  src={image.url}
                  alt={image.name}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="object-cover"
                  priority={index === 0}
                />
              </AspectRatio>
            </div>
          ))}
        </div>
      </div>
      {images.length > 1 ? (
        <div className="flex w-full items-center justify-center gap-2">
          <Button
            variant="outline"
            size="icon"
            className="mr-0.5 aspect-square h-7 w-7 rounded-none sm:mr-2 sm:h-8 sm:w-8"
            disabled={prevBtnDisabled}
            onClick={scrollPrev}
          >
            <Icons.chevronLeft
              className="h-3 w-3 sm:h-4 sm:w-4"
              aria-hidden="true"
            />
            <span className="sr-only">Previous slide</span>
          </Button>
          {images.map((image, i) => (
            <Button
              key={i}
              variant="outline"
              size="icon"
              className={cn(
                "group relative aspect-square h-full w-full max-w-[100px] rounded-none shadow-sm hover:bg-transparent focus-visible:ring-foreground",
                i === selectedIndex && "ring-1 ring-foreground"
              )}
              onClick={() => scrollTo(i)}
              onKeyDown={handleKeyDown}
            >
              <div className="absolute inset-0 z-10 bg-zinc-950/20 group-hover:bg-zinc-950/40" />
              <Image
                src={image.url}
                alt={image.name}
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                fill
              />
              <span className="sr-only">
                Slide {i + 1} of {images.length}
              </span>
            </Button>
          ))}
          <Button
            variant="outline"
            size="icon"
            className="ml-0.5 aspect-square h-7 w-7 rounded-none sm:ml-2 sm:h-8 sm:w-8"
            disabled={nextBtnDisabled}
            onClick={scrollNext}
          >
            <Icons.chevronRight
              className="h-3 w-3 sm:h-4 sm:w-4"
              aria-hidden="true"
            />
            <span className="sr-only">Next slide</span>
          </Button>
        </div>
      ) : null}
    </div>
  )
}
