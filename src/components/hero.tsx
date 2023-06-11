"use client"

import * as React from "react"
import Image from "next/image"

import { cn } from "@/lib/utils"
import { AspectRatio } from "@/components/ui/aspect-ratio"
import { Button } from "@/components/ui/button"
import { Icons } from "@/components/icons"

const heroImages = [
  {
    title: "Hero Image One",
    src: "/images/hero-image-one.webp",
  },
  {
    title: "Hero Image Two",
    src: "/images/hero-image-two.webp",
  },
  {
    title: "Hero Image Three",
    src: "/images/hero-image-three.webp",
  },
]

export function Hero() {
  // hero carousel with pagination
  const [currentImage, setCurrentImage] = React.useState(0)

  function nextImage() {
    if (currentImage === heroImages.length - 1) {
      setCurrentImage(0)
    } else {
      setCurrentImage(currentImage + 1)
    }
  }

  function prevImage() {
    if (currentImage === 0) {
      setCurrentImage(heroImages.length - 1)
    } else {
      setCurrentImage(currentImage - 1)
    }
  }

  function goToImage(index: number) {
    setCurrentImage(index)
  }

  return (
    <div className="relative">
      <AspectRatio ratio={16 / 9}>
        <div className="absolute inset-0 z-10 bg-black/50" />
        <Image
          src={heroImages[currentImage]?.src ?? "/images/hero-image-one.webp"}
          alt={heroImages[currentImage]?.title ?? "Hero Image One"}
          fill
          className="object-cover"
        />
      </AspectRatio>
      <div className="absolute inset-x-0 bottom-2 z-20 flex justify-center gap-2 pb-2">
        {heroImages.map((image, index) => (
          <Button
            key={image.title}
            className={cn(
              "h-1.5 w-10 rounded-none p-0 hover:bg-white",
              index === currentImage ? "bg-white" : "bg-zinc-400"
            )}
            onClick={() => goToImage(index)}
          >
            <span className="sr-only">{image.title}</span>
          </Button>
        ))}
      </div>
      <div className="absolute inset-x-0 inset-y-1/2 z-20 flex justify-between px-4 py-2">
        <Button
          size="sm"
          className="w-9 rounded-full bg-zinc-500 p-0 text-white hover:bg-zinc-600"
          onClick={prevImage}
        >
          <Icons.chevronLeft className="h-6 w-6" aria-hidden="true" />
          <span className="sr-only">Previous image</span>
        </Button>
        <Button
          size="sm"
          className="w-9 rounded-full bg-zinc-500 p-0 text-white hover:bg-zinc-600"
          onClick={nextImage}
        >
          <Icons.chevronRight className="h-6 w-6" aria-hidden="true" />
          <span className="sr-only">Next image</span>
        </Button>
      </div>
    </div>
  )
}
