"use client"

import Link from "next/link"
import { type Store } from "@/db/schema"

import { getRandomPatternStyle } from "@/lib/generate-pattern"
import { cn } from "@/lib/utils"
import { AspectRatio } from "@/components/ui/aspect-ratio"
import { buttonVariants } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

interface StoreCardProps {
  store: Pick<Store, "id" | "name"> &
    Partial<Pick<Store, "description">> & {
      productCount: number
    }
}

export function StoreCard({ store }: StoreCardProps) {
  return (
    <Card key={store.id} className="flex h-full flex-col">
      <Link
        aria-label={`${store.name} store products`}
        href={`/products?store_ids=${store.id}`}
      >
        <AspectRatio ratio={21 / 9}>
          <div
            className="h-full rounded-t-md"
            style={getRandomPatternStyle(String(store.id))}
          />
        </AspectRatio>
      </Link>
      <CardHeader className="flex-1">
        <CardTitle as="h2" className="line-clamp-1">
          {store.name}
        </CardTitle>
        {store.description && (
          <CardDescription className="line-clamp-2">
            {store.description}
          </CardDescription>
        )}
      </CardHeader>
      <CardContent>
        <Link
          aria-label={`${store.name} store products`}
          href={`/products?store_ids=${store.id}`}
        >
          <div
            className={cn(
              buttonVariants({
                size: "sm",
                className: "h-8 w-full",
              })
            )}
          >
            View products ({store.productCount})
          </div>
        </Link>
      </CardContent>
    </Card>
  )
}
