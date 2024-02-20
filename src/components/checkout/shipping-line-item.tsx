import { Slot } from "@radix-ui/react-slot"

import { cn, formatPrice } from "@/lib/utils"

interface ShippingLineItemProps extends React.HTMLAttributes<HTMLDivElement> {
  shipping: string | number
  variant?: "default" | "minimal"
}

export default function ShippingLineItem({
  shipping,
  variant = "default",
  className,
  ...props
}: ShippingLineItemProps) {
  const Comp = Slot
  return (
    <Comp className={cn("h-full", variant === "minimal" && "h-1/6")}>
      <div className="table min-w-full">
        <div
          className={cn("flex w-full flex-col gap-5 pr-6 pt-6", className)}
          {...props}
        >
          <div className="space-y-3">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center space-x-4">
                <div className="flex flex-col space-y-1 self-start">
                  <span className="line-clamp-1 text-sm font-medium">
                    Shipping
                  </span>
                </div>
              </div>
              <div className="flex flex-col space-y-1 font-medium">
                <span className="ml-auto line-clamp-1 text-sm">
                  {typeof shipping === "string"
                    ? shipping
                    : formatPrice(Number(shipping).toFixed(2))}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Comp>
  )
}
