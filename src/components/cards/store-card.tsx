import Link from "next/link"
import { type CuratedStore } from "@/types"

import { getRandomPatternStyle } from "@/lib/generate-pattern"
import { cn } from "@/lib/utils"
import { AspectRatio } from "@/components/ui/aspect-ratio"
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

interface StoreCardProps {
  store: CuratedStore
  href: string
}

export function StoreCard({ store, href }: StoreCardProps) {
  return (
    <Link aria-label={store.name} href={href}>
      <Card className="h-full">
        <AspectRatio ratio={21 / 9}>
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-zinc-950/20" />
          <Badge
            className={cn(
              "pointer-events-none absolute right-2 top-2 text-white",
              store.stripeAccountId ? "bg-green-600" : "bg-red-600"
            )}
          >
            {store.stripeAccountId ? "Active" : "Inactive"}
          </Badge>
          <div
            className="h-full rounded-t-md"
            style={getRandomPatternStyle(String(store.id))}
          />
        </AspectRatio>
        <CardHeader>
          <CardTitle className="line-clamp-1 text-lg">{store.name}</CardTitle>
          {store.description ? (
            <CardDescription className="line-clamp-2">
              {store.description}
            </CardDescription>
          ) : null}
        </CardHeader>
      </Card>
    </Link>
  )
}
