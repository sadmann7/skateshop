"use client"

import * as React from "react"
import Image from "next/image"
import Link from "next/link"
import { type Product } from "@/db/schema"
import {
  CheckIcon,
  EyeOpenIcon,
  HeartIcon,
  PlusIcon,
} from "@radix-ui/react-icons"
import { toast } from "sonner"

import { addToCart } from "@/lib/actions/cart"
import { updateProductRating } from "@/lib/actions/product"
import { catchError, cn, formatPrice } from "@/lib/utils"
import { AspectRatio } from "@/components/ui/aspect-ratio"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Icons } from "@/components/icons"

import { Rating } from "../rating"

interface ProductCardProps extends React.HTMLAttributes<HTMLDivElement> {
  product: Pick<
    Product,
    "id" | "name" | "price" | "images" | "category" | "inventory" | "rating"
  >
  variant?: "default" | "switchable"
  isAddedToCart?: boolean
  onSwitch?: () => Promise<void>
}

export function ProductCard({
  product,
  variant = "default",
  isAddedToCart = false,
  onSwitch,
  className,
  ...props
}: ProductCardProps) {
  const [isAddingToCart, startAddingToCart] = React.useTransition()
  const [isFavoriting, startFavoriting] = React.useTransition()

  return (
    <Card
      className={cn("h-full overflow-hidden rounded-sm", className)}
      {...props}
    >
      <Link aria-label={product.name} href={`/product/${product.id}`}>
        <CardHeader className="border-b p-0">
          <AspectRatio ratio={4 / 3}>
            {product?.images?.length ? (
              <Image
                src={
                  product.images[0]?.url ?? "/images/product-placeholder.webp"
                }
                alt={product.images[0]?.name ?? product.name}
                className="object-cover"
                sizes="(min-width: 1024px) 20vw, (min-width: 768px) 25vw, (min-width: 640px) 33vw, (min-width: 475px) 50vw, 100vw"
                fill
                loading="lazy"
              />
            ) : (
              <div
                aria-label="Placeholder"
                role="img"
                aria-roledescription="placeholder"
                className="flex h-full w-full items-center justify-center bg-secondary"
              >
                <Icons.placeholder
                  className="h-9 w-9 text-muted-foreground"
                  aria-hidden="true"
                />
              </div>
            )}
          </AspectRatio>
        </CardHeader>
        <span className="sr-only">{product.name}</span>
      </Link>
      <Link href={`/product/${product.id}`} tabIndex={-1}>
        <CardContent className="space-y-1.5 p-4">
          <CardTitle className="line-clamp-1">{product.name}</CardTitle>
          <CardDescription className="line-clamp-1">
            {formatPrice(product.price)}
          </CardDescription>
          <Rating rating={Math.round(product.rating / 10)} />
        </CardContent>
      </Link>
      <CardFooter className="p-4 pt-2.5">
        {variant === "default" ? (
          <div className="flex w-full items-center space-x-2">
            <Button
              aria-label="Add to cart"
              size="sm"
              className="h-8 w-full rounded-sm"
              onClick={() => {
                startAddingToCart(async () => {
                  try {
                    await addToCart({
                      productId: product.id,
                      quantity: 1,
                    })
                    toast.success("Added to cart.")
                  } catch (err) {
                    catchError(err)
                  }
                })
              }}
              disabled={isAddingToCart}
            >
              {isAddingToCart && (
                <Icons.spinner
                  className="mr-2 h-4 w-4 animate-spin"
                  aria-hidden="true"
                />
              )}
              Add to cart
            </Button>
            <Button
              title="Favorite"
              variant="secondary"
              size="icon"
              className="h-8 w-8 shrink-0"
              onClick={() => {
                startFavoriting(async () => {
                  try {
                    await updateProductRating({
                      id: product.id,
                      rating: product.rating + 1,
                    })
                    toast.success("Favorited product.")
                  } catch (err) {
                    catchError(err)
                  }
                })
              }}
              disabled={isFavoriting}
            >
              {isFavoriting ? (
                <Icons.spinner
                  className="h-4 w-4 animate-spin"
                  aria-hidden="true"
                />
              ) : (
                <HeartIcon className="h-4 w-4" aria-hidden="true" />
              )}
              <span className="sr-only">Favorite</span>
            </Button>
            <Button
              title="Preview"
              variant="secondary"
              size="icon"
              className="h-8 w-8 shrink-0"
              disabled={isFavoriting}
            >
              <EyeOpenIcon className="h-4 w-4" aria-hidden="true" />
              <span className="sr-only">Preview</span>
            </Button>
          </div>
        ) : (
          <Button
            aria-label={isAddedToCart ? "Remove from cart" : "Add to cart"}
            size="sm"
            className="h-8 w-full rounded-sm"
            onClick={() => {
              startAddingToCart(async () => {
                await onSwitch?.()
              })
            }}
            disabled={isAddingToCart}
          >
            {isAddingToCart ? (
              <Icons.spinner
                className="mr-2 h-4 w-4 animate-spin"
                aria-hidden="true"
              />
            ) : isAddedToCart ? (
              <CheckIcon className="mr-2 h-4 w-4" aria-hidden="true" />
            ) : (
              <PlusIcon className="mr-2 h-4 w-4" aria-hidden="true" />
            )}
            {isAddedToCart ? "Added" : "Add to cart"}
          </Button>
        )}
      </CardFooter>
    </Card>
  )
}
