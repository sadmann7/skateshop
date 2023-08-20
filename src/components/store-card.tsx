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
  store?: Pick<Store, "id" | "name"> &
    Partial<Pick<Store, "description">> & {
      productCount: number
    }
  cardTitle?: string
  cardDescription?: string
  route: string
  buttonText?: string
}

export function StoreCard({
  cardTitle,
  cardDescription,
  store,
  route,
  buttonText = `View products (${store?.productCount})`,
}: StoreCardProps) {
  return (
    <Card className="flex h-full flex-col">
      <Link aria-label={buttonText ?? store?.name} href={route}>
        <AspectRatio ratio={21 / 9}>
          <div
            className="h-full rounded-t-md"
            style={getRandomPatternStyle(
              String(store?.id ?? crypto.randomUUID())
            )}
          />
        </AspectRatio>
      </Link>
      <CardHeader className="flex-1">
        <CardTitle className="line-clamp-1">
          {cardTitle ?? store?.name}
        </CardTitle>
        {(cardDescription || store?.description) && (
          <CardDescription className="line-clamp-2">
            {cardDescription ?? store?.description}
          </CardDescription>
        )}
      </CardHeader>
      <CardContent>
        <Link
          aria-label={buttonText ?? store?.name}
          href={route}
          className={cn(
            buttonVariants({
              size: "sm",
              className: "h-8 w-full",
            })
          )}
        >
          {buttonText}
        </Link>
      </CardContent>
    </Card>
  )
}
