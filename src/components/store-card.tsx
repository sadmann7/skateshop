"use client"

import * as React from "react"
import Image from "next/image"
import Link from "next/link"
import { type Store } from "@/db/schema"

import { AspectRatio } from "@/components/ui/aspect-ratio"
import { buttonVariants } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Icons } from "@/components/icons"

import { reducedStore } from "@/components/stores"

interface StoreCardProps {
  store: reducedStore
  variant?: "default" | "switchable"
}

export function StoreCard({
  store,
  variant = "default",
}: StoreCardProps) {
  return (
    <Card className="h-full overflow-hidden rounded-sm">
      <Link
        aria-label={`View ${store.name} details`}
        href={`/store/${store.id}`}
      >
        <CardHeader className="border-b p-0">
          <AspectRatio ratio={4 / 3}>
            <div className="flex h-full items-center justify-center bg-secondary">
              <Icons.placeholder
                className="h-9 w-9 text-muted-foreground"
                aria-hidden="true"
              />
            </div>
          </AspectRatio>
        </CardHeader>
      </Link>
      <Link
        aria-label={`View ${store.name} details`}
        href={`/stores/${store.id}`}
      >
        <CardContent className="grid gap-2.5 p-4">
          <CardTitle className="line-clamp-1">{store.name}</CardTitle>
          <CardDescription className="line-clamp-2">
            {store.description}
          </CardDescription>
        </CardContent>
      </Link>
      <CardFooter className="p-4">
        {variant === "default" ? (
          <div className="flex w-full flex-col items-center gap-2 sm:flex-row sm:justify-between">
            <Link
              aria-label="Visit"
              href={`/store/${store.id}`}
              className={buttonVariants({
                variant: "outline",
                size: "sm",
                className: "h-8 w-full rounded-sm",
              })}
            >
              Visit
            </Link>
          </div>
        ) : (
            <Link
            aria-label="Visit"
            href={`/store/${store.id}`}
            className={buttonVariants({
              variant: "outline",
              size: "sm",
              className: "h-8 w-full rounded-sm",
            })}
          >
            Visit
          </Link>
        )}
      </CardFooter>
    </Card>
  )
}