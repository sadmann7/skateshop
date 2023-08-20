import Link from "next/link"
import { type Store } from "@/db/schema"

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
import { checkStripeConnectionAction } from "@/app/_actions/stripe/account"

interface StoreCardProps {
  href: string
  store: Pick<Store, "id" | "name"> &
    Partial<Pick<Store, "description">> & {
      productCount: number
    }
}

export async function StoreCard({ store, href }: StoreCardProps) {
  const { isConnected } = await checkStripeConnectionAction({
    storeId: store.id,
  })

  return (
    <Link aria-label={store?.name} href={href}>
      <Card className="flex h-full flex-col">
        <AspectRatio ratio={21 / 9}>
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-zinc-950/20" />
          <Badge
            className={cn(
              "pointer-events-none absolute right-2 top-2 z-20 text-foreground",
              isConnected ? "bg-green-600" : "bg-red-600"
            )}
          >
            {isConnected ? "Connected" : "Disconnected"}
          </Badge>
          <div
            className="h-full rounded-t-md"
            style={getRandomPatternStyle(
              String(store?.id ?? crypto.randomUUID())
            )}
          />
        </AspectRatio>
        <CardHeader className="flex-1">
          <CardTitle className="line-clamp-1 text-lg">{store?.name}</CardTitle>
          {store?.description && (
            <CardDescription className="line-clamp-2">
              {store.description}
            </CardDescription>
          )}
        </CardHeader>
      </Card>
    </Link>
  )
}
