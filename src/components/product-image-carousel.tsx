"use client"

import * as React from "react"
import Image from "next/image"
import { type StoredFile } from "@/types"
import { ChevronLeftIcon, ChevronRightIcon } from "@radix-ui/react-icons"
import useEmblaCarousel, {
  type UseEmblaCarouselType,
} from "embla-carousel-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Icons } from "@/components/icons"

type CarouselApi = UseEmblaCarouselType["1"]
type UseCarouselParameters = Parameters<typeof useEmblaCarousel>
type CarouselOptions = UseCarouselParameters["0"]

interface ProductImageCarouselProps
  extends React.HTMLAttributes<HTMLDivElement> {
  images: StoredFile[]
  options?: CarouselOptions
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

  const onSelect = React.useCallback((emblaApi: CarouselApi) => {
    if (!emblaApi) return

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
        className="flex aspect-square size-full flex-1 items-center justify-center bg-secondary"
      >
        <Icons.placeholder
          className="size-9 text-muted-foreground"
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
            <div
              className="relative aspect-square min-w-0 flex-[0_0_100%] pl-4"
              key={index}
            >
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
            </div>
          ))}
        </div>
      </div>
      {images.length > 1 ? (
        <div className="flex w-full items-center justify-center gap-2">
          <Button
            variant="outline"
            size="icon"
            className="mr-0.5 aspect-square size-7 rounded-none sm:mr-2 sm:size-8"
            disabled={prevBtnDisabled}
            onClick={scrollPrev}
          >
            <ChevronLeftIcon className="size-3 sm:size-4" aria-hidden="true" />
            <span className="sr-only">Previous slide</span>
          </Button>
          {images.map((image, i) => (
            <Button
              key={i}
              variant="outline"
              size="icon"
              className={cn(
                "group relative aspect-square size-full max-w-[100px] rounded-none shadow-sm hover:bg-transparent focus-visible:ring-foreground",
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
            className="ml-0.5 aspect-square size-7 rounded-none sm:ml-2 sm:size-8"
            disabled={nextBtnDisabled}
            onClick={scrollNext}
          >
            <ChevronRightIcon className="size-3 sm:size-4" aria-hidden="true" />
            <span className="sr-only">Next slide</span>
          </Button>
        </div>
      ) : null}
    </div>
  )
}
