"use client"

import Image from "next/image"
import Link from "next/link"
import { type Product } from "@/db/schema"

import { formatPrice } from "@/lib/utils"
import { AspectRatio } from "@/components/ui/aspect-ratio"
import { Button, buttonVariants } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Icons } from "@/components/icons"

interface ProductCardProps {
  product: Product
  isPending?: boolean
  variant?: "default" | "selectable"
  onSelect?: () => void
}

export function ProductCard({
  product,
  isPending = false,
  variant = "default",
  onSelect,
}: ProductCardProps) {
  return (
    <Card className="h-full overflow-hidden rounded-sm">
      <Link
        aria-label={`View ${product.name} details`}
        href={`/product/${product.id}`}
      >
        <CardHeader className="border-b p-0">
          <AspectRatio ratio={4 / 3}>
            {product?.images?.length ? (
              <Image
                src={
                  product.images[0]?.url ?? "/images/product-placeholder.webp"
                }
                alt={product.images[0]?.name ?? "Product image"}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="object-cover"
                loading="lazy"
              />
            ) : (
              <div className="flex h-full items-center justify-center bg-secondary">
                <Icons.placeholder
                  className="h-9 w-9 text-muted-foreground"
                  aria-hidden="true"
                />
              </div>
            )}
          </AspectRatio>
        </CardHeader>
      </Link>
      <Link
        aria-label={`View ${product.name} details`}
        href={`/products/${product.id}`}
      >
        <CardContent className="grid gap-2.5 p-4">
          <CardTitle className="line-clamp-1">{product.name}</CardTitle>
          <CardDescription className="line-clamp-2">
            {formatPrice(product.price)}
          </CardDescription>
        </CardContent>
      </Link>
      <CardFooter className="p-4">
        {variant === "default" ? (
          <div className="flex w-full flex-col items-center gap-2 sm:flex-row sm:justify-between">
            <Link
              aria-label="Quick view"
              href={`/quickview/product/${product.id}`}
              className={buttonVariants({
                variant: "outline",
                size: "sm",
                className: "h-8 w-full rounded-sm",
              })}
            >
              Quick view
            </Link>
            <Button
              aria-label="Add to cart"
              size="sm"
              className="h-8 w-full rounded-sm"
              disabled={isPending}
            >
              Add to cart
            </Button>
          </div>
        ) : (
          <Button
            aria-label="Select product"
            size="sm"
            className="h-8 w-full rounded-sm"
            onClick={onSelect}
            disabled={isPending}
          >
            {isPending && (
              <Icons.spinner
                className="mr-2 h-5 w-5 animate-spin"
                aria-hidden="true"
              />
            )}
            Select
          </Button>
        )}
      </CardFooter>
    </Card>
  )
}
