"use client"

import * as React from "react"
import Image from "next/image"

import { cn } from "@/lib/utils"
import { AspectRatio } from "@/components/ui/aspect-ratio"
import { Button } from "@/components/ui/button"
import { Icons } from "@/components/icons"

interface ImageCarouselProps
  extends React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLDivElement>,
    HTMLDivElement
  > {
  images: { name: string; url: string }[] | null
}

export function ImageCarousel({
  images,
  className,
  ...props
}: ImageCarouselProps) {
  const [currentImage, setCurrentImage] = React.useState(0)

  function getNextImage() {
    if (images === null) return null

    if (currentImage === images.length - 1) {
      setCurrentImage(0)
    } else {
      setCurrentImage(currentImage + 1)
    }
  }

  function getPreviousImage() {
    if (images === null) return null

    if (currentImage === 0) {
      setCurrentImage(images.length - 1)
    } else {
      setCurrentImage(currentImage - 1)
    }
  }

  return (
    <div className={cn("flex flex-col space-y-4", className)} {...props}>
      <div className="relative h-full w-full">
        <div className="relative h-full w-full">
          <AspectRatio ratio={16 / 9}>
            <div className="absolute inset-0 z-10 bg-black/40" />
            {images ? (
              <Image
                src={
                  images[currentImage]?.url ??
                  "/images/product-placeholder.webp"
                }
                alt={images[currentImage]?.name ?? "Carousel image"}
                fill
                className="object-cover"
              />
            ) : (
              <div className="flex h-full flex-1 items-center justify-center bg-secondary">
                <Icons.placeholder
                  className="h-9 w-9 text-muted-foreground"
                  aria-hidden="true"
                />
              </div>
            )}
          </AspectRatio>
        </div>
        {images ? (
          <div className="absolute left-0 top-0 z-20 h-full w-full px-4">
            <div className="flex h-full w-full items-center justify-between">
              <Button
                variant="ghost"
                size="icon"
                className="text-zinc-100 transition-transform hover:scale-110 hover:bg-transparent active:scale-95"
                onClick={getPreviousImage}
              >
                <Icons.chevronLeft
                  className="h-10 w-10 scale-125"
                  aria-hidden="true"
                />
                <span className="sr-only">Previous</span>
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="text-zinc-100 transition-transform hover:scale-110 hover:bg-transparent active:scale-95"
                onClick={getNextImage}
              >
                <Icons.chevronRight
                  className="h-10 w-10 scale-125"
                  aria-hidden="true"
                />
                <span className="sr-only">Next</span>
              </Button>
            </div>
          </div>
        ) : null}
      </div>
      {images ? (
        <div className="flex items-center space-x-2.5">
          {images.map((image, index) => (
            <PaginationCard
              key={image.name}
              index={index}
              image={image}
              currentImage={currentImage}
              setCurrentImage={setCurrentImage}
              getNextImage={getNextImage}
              getPreviousImage={getPreviousImage}
            />
          ))}
        </div>
      ) : null}
    </div>
  )
}

interface PaginationCardProps {
  index: number
  image: { name: string; url: string }
  currentImage: number
  setCurrentImage: React.Dispatch<React.SetStateAction<number>>
  getNextImage: () => void
  getPreviousImage: () => void
}

function PaginationCard({
  index,
  image,
  currentImage,
  setCurrentImage,
  getNextImage,
  getPreviousImage,
}: PaginationCardProps) {
  const [isHovered, setIsHovered] = React.useState(false)

  return (
    <Button
      variant="outline"
      size="icon"
      className="h-28 w-28 rounded-none shadow-sm hover:bg-transparent"
      onClick={() => setCurrentImage(index)}
      onKeyDown={(e) => {
        if (e.key === "ArrowLeft") {
          getPreviousImage()
        } else if (e.key === "ArrowRight") {
          getNextImage()
        }
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      // This is needed to make the first image focusable
      tabIndex={index === 0 ? 0 : -1}
    >
      <AspectRatio ratio={1 / 1}>
        <div className="absolute inset-0 z-10 bg-black/50" />
        <Image
          src={image.url}
          alt={image.name}
          fill
          className={cn(
            "object-cover",
            (currentImage === index || isHovered) && "ring-1 ring-primary"
          )}
        />
      </AspectRatio>
      <span className="sr-only">{image.name}</span>
    </Button>
  )
}
