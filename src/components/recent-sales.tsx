import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import type { Order } from "@/db/schema"

interface RecentSalesPageProps {
  sales: Order[]
}

export function RecentSales({ sales }: RecentSalesPageProps) {
  return (
    <div className="space-y-8">
      {sales?.map((sale, index) => (
        <div key={sale.id || index} className="flex items-center">
          <Avatar className="h-9 w-9">
            <AvatarImage src="/avatars/lofi-girl-yt.webp" alt="Avatar" />
            <AvatarFallback>OM</AvatarFallback>
          </Avatar>
          <div className="ml-4 space-y-1">
            <p className="text-sm font-medium leading-none">{sale.name}</p>
            <p className="text-sm text-muted-foreground">
              {sale.email}
            </p>
          </div>
          <div className="ml-auto font-medium">+${sale.total}</div>
        </div>
      )) || 'No Sales Yet'}
    </div>
  )
}
