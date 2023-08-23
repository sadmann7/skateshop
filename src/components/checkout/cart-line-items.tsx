import Image from "next/image"
import type { CartLineItem } from "@/types"

import { cn, formatPrice } from "@/lib/utils"
import { Separator } from "@/components/ui/separator"
import { UpdateCart } from "@/components/checkout/update-cart"
import { Icons } from "@/components/icons"

interface CartLineItemsProps extends React.HTMLAttributes<HTMLDivElement> {
  cartLineItems: CartLineItem[]
}

export function CartLineItems({
  cartLineItems,
  className,
  ...props
}: CartLineItemsProps) {
  return (
    <div className={cn("flex flex-col gap-5", className)} {...props}>
      {cartLineItems.map((item) => (
        <div key={item.id} className="space-y-3">
          <div className="flex flex-col items-start justify-between gap-4 xs:flex-row">
            <div className="flex items-center space-x-4">
              <div className="relative h-16 w-16 overflow-hidden rounded">
                {item?.images?.length ? (
                  <Image
                    src={
                      item.images[0]?.url ?? "/images/product-placeholder.webp"
                    }
                    alt={item.images[0]?.name ?? item.name}
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    fill
                    className="absolute object-cover"
                    loading="lazy"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center bg-secondary">
                    <Icons.placeholder
                      className="h-4 w-4 text-muted-foreground"
                      aria-hidden="true"
                    />
                  </div>
                )}
              </div>
              <div className="flex flex-col gap-1 self-start text-sm">
                <span className="line-clamp-1">{item.name}</span>
                <span className="line-clamp-1 text-muted-foreground">
                  {formatPrice(item.price)} x {item.quantity} ={" "}
                  {formatPrice(
                    (Number(item.price) * Number(item.quantity)).toFixed(2)
                  )}
                </span>
                <span className="line-clamp-1 text-xs capitalize text-muted-foreground">
                  {`${item.category} ${
                    item.subcategory ? `/ ${item.subcategory}` : ""
                  }`}
                </span>
              </div>
            </div>
            <UpdateCart cartLineItem={item} />
          </div>
          <Separator />
        </div>
      ))}
    </div>
  )
}
