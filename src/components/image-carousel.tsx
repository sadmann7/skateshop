"use client"

import * as React from "react"
import Image from "next/image"
import { Slot } from "@radix-ui/react-slot"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Icons } from "@/components/icons"

interface ImageCarouselProps extends React.HTMLAttributes<HTMLDivElement> {
  data: { name: string; url: string }[]
  asChild?: boolean
}

const ImageCarousel = React.forwardRef<HTMLDivElement, ImageCarouselProps>(
  ({ className, data, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "div"
    const imagesRef = React.useRef<HTMLDivElement>(null)
    const [currentImage, setCurrentImage] = React.useState(0)

    const goToSlide = React.useCallback((index: number) => {
      if (!imagesRef.current) return

      const imageWidth = imagesRef.current.children[0]?.clientWidth ?? 0
      imagesRef.current.style.transform = `translateX(-${imageWidth * index}px)`
      setCurrentImage(index)
    }, [])

    const getNextSlide = React.useCallback(() => {
      if (currentImage === data.length - 1) {
        goToSlide(0)
        return
      }
      goToSlide(currentImage + 1)
    }, [currentImage, data.length, goToSlide])

    const getPrevSlide = React.useCallback(() => {
      if (currentImage === 0) {
        goToSlide(data.length - 1)
        return
      }
      goToSlide(currentImage - 1)
    }, [currentImage, data.length, goToSlide])

    const handleKeyDown = React.useCallback(
      (event: React.KeyboardEvent<HTMLButtonElement>) => {
        if (event.key === "ArrowLeft") {
          getPrevSlide()
        } else if (event.key === "ArrowRight") {
          getNextSlide()
        }
      },
      [getNextSlide, getPrevSlide]
    )

    return (
      <Comp
        aria-label="Image carousel"
        className={cn(className)}
        ref={ref}
        {...props}
      >
        {data.length > 0 ? (
          <div className="flex flex-col gap-2">
            <div className="relative overflow-hidden">
              <div
                aria-live="polite"
                className="flex transition-transform duration-500 ease-in-out"
                ref={imagesRef}
              >
                {data.map((image, index) => (
                  <Image
                    aria-label={`Slide ${index + 1} of ${data.length}`}
                    role="group"
                    aria-roledescription="slide"
                    key={index}
                    src={image.url}
                    alt={image.name}
                    width={500}
                    height={500}
                    className="aspect-square w-full object-cover"
                  />
                ))}
              </div>
            </div>
            {data.length > 1 ? (
              <div className="flex w-full items-center justify-center gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  className="mr-0.5 aspect-square h-7 w-7 rounded-none sm:mr-2 sm:h-8 sm:w-8"
                  onClick={getPrevSlide}
                >
                  <Icons.chevronLeft
                    className="h-3 w-3 sm:h-4 sm:w-4"
                    aria-hidden="true"
                  />
                  <span className="sr-only">Previous slide</span>
                </Button>
                {data.map((image, i) => (
                  <Button
                    key={i}
                    variant="outline"
                    size="icon"
                    className={cn(
                      "group relative aspect-square h-full w-full max-w-[100px] rounded-none shadow-sm hover:bg-transparent focus-visible:ring-foreground",
                      i === currentImage && "ring-1 ring-foreground"
                    )}
                    onClick={() => goToSlide(i)}
                    onKeyDown={handleKeyDown}
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
                  className="ml-0.5 aspect-square h-7 w-7 rounded-none sm:ml-2 sm:h-8 sm:w-8"
                  onClick={getNextSlide}
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
        ) : (
          <div
            aria-label="Placeholder"
            role="img"
            aria-roledescription="placeholder"
            className="flex aspect-square h-full flex-1 items-center justify-center bg-secondary"
          >
            <Icons.placeholder
              className="h-9 w-9 text-muted-foreground"
              aria-hidden="true"
            />
          </div>
        )}
      </Comp>
    )
  }
)

ImageCarousel.displayName = "ImageCarousel"

export { ImageCarousel }
