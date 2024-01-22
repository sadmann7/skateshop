import Image from "next/image"
import type { CartLineItem } from "@/types"
import { Slot } from "@radix-ui/react-slot"

import { cn, formatPrice } from "@/lib/utils"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { UpdateCart } from "@/components/checkout/update-cart"
import { Icons } from "@/components/icons"

interface CartLineItemsProps extends React.HTMLAttributes<HTMLDivElement> {
  items: CartLineItem[]
  isScrollable?: boolean
  isEditable?: boolean
  variant?: "default" | "minimal"
}

export function CartLineItems({
  items,
  isScrollable = true,
  isEditable = true,
  variant = "default",
  className,
  ...props
}: CartLineItemsProps) {
  const Comp = isScrollable ? ScrollArea : Slot

  return (
    <Comp className="h-full">
      <div
        className={cn(
          "flex w-full flex-col gap-5",
          isScrollable && "pr-6",
          className
        )}
        {...props}
      >
        {items.map((item) => (
          <div key={item.id} className="space-y-3">
            <div
              className={cn(
                "flex items-start justify-between gap-4",
                isEditable && "flex-col xs:flex-row"
              )}
            >
              <div className="flex items-center space-x-4">
                {variant === "default" ? (
                  <div className="relative aspect-square size-16 min-w-fit overflow-hidden rounded">
                    {item?.images?.length ? (
                      <Image
                        src={
                          item.images[0]?.url ??
                          "/images/product-placeholder.webp"
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
                          className="size-4 text-muted-foreground"
                          aria-hidden="true"
                        />
                      </div>
                    )}
                  </div>
                ) : null}
                <div className="flex flex-col space-y-1 self-start">
                  <span className="line-clamp-1 text-sm font-medium">
                    {item.name}
                  </span>
                  {isEditable ? (
                    <span className="line-clamp-1 text-xs text-muted-foreground">
                      {formatPrice(item.price)} x {item.quantity} ={" "}
                      {formatPrice(
                        (Number(item.price) * Number(item.quantity)).toFixed(2)
                      )}
                    </span>
                  ) : (
                    <span className="line-clamp-1 text-xs text-muted-foreground">
                      Qty {item.quantity}
                    </span>
                  )}
                  {variant === "default" ? (
                    <span className="line-clamp-1 text-xs capitalize text-muted-foreground">
                      {`${item.category} ${
                        item.subcategory ? `/ ${item.subcategory}` : ""
                      }`}
                    </span>
                  ) : null}
                </div>
              </div>
              {isEditable ? (
                <UpdateCart cartLineItem={item} />
              ) : (
                <div className="flex flex-col space-y-1 font-medium">
                  <span className="ml-auto line-clamp-1 text-sm">
                    {formatPrice(
                      (Number(item.price) * item.quantity).toFixed(2)
                    )}
                  </span>
                  <span className="line-clamp-1 text-xs text-muted-foreground">
                    {formatPrice(item.price)} each
                  </span>
                </div>
              )}
            </div>
            {variant === "default" ? <Separator /> : null}
          </div>
        ))}
      </div>
    </Comp>
  )
}
