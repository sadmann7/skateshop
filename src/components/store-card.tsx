import Link from "next/link"

import { type getStoresByUserId } from "@/lib/queries/store"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { Icons } from "@/components/icons"

type Store = Awaited<ReturnType<typeof getStoresByUserId>>[number]

interface StoreCardProps {
  store: Omit<Store, "orderCount" | "customerCount"> &
    Partial<Pick<Store, "orderCount" | "customerCount">>
  href: string
}

export function StoreCard({ store, href }: StoreCardProps) {
  const isUserStore = href.includes("dashboard")

  return (
    <Link href={href}>
      <Card className="relative h-full rounded-lg transition-colors hover:bg-muted/25">
        {isUserStore ? (
          <Tooltip>
            <TooltipTrigger asChild>
              <Badge
                className={cn(
                  "absolute right-4 top-4 rounded-sm px-2 py-0.5 font-semibold",
                  store.stripeAccountId
                    ? "border-green-600/20 bg-green-100 text-green-700"
                    : "border-red-600/10 bg-red-100 text-red-700"
                )}
              >
                {store.stripeAccountId ? "Active" : "Inactive"}
              </Badge>
            </TooltipTrigger>
            <TooltipContent
              align="start"
              className="w-52 border border-input bg-background text-foreground shadow-sm"
            >
              Connect your Stripe account to activate your store
            </TooltipContent>
          </Tooltip>
        ) : (
          <Badge
            className={cn(
              "pointer-events-none absolute right-4 top-4 rounded-sm px-2 py-0.5 font-semibold",
              store.stripeAccountId
                ? "border-green-600/20 bg-green-100 text-green-700"
                : "border-red-600/10 bg-red-100 text-red-700"
            )}
          >
            {store.stripeAccountId ? "Active" : "Inactive"}
          </Badge>
        )}
        <CardHeader>
          <CardTitle className="line-clamp-1">{store.name}</CardTitle>
          <CardDescription className="line-clamp-1">
            {store.description?.length
              ? store.description
              : `Explore ${store.name} products`}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap items-center gap-4 pt-4 text-[0.8rem] text-muted-foreground">
          <div className="flex items-center">
            <Icons.product className="mr-1.5 size-3.5" aria-hidden="true" />
            {store.productCount} products
          </div>
          {isUserStore ? (
            <>
              <div className="flex items-center">
                <Icons.cart className="mr-1.5 size-3.5" aria-hidden="true" />
                {store.orderCount} orders
              </div>
              <div className="flex items-center">
                <Icons.users className="mr-1.5 size-3.5" aria-hidden="true" />
                {store.customerCount} customers
              </div>
            </>
          ) : null}
        </CardContent>
      </Card>
    </Link>
  )
}
