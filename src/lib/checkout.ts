import type { CartLineItem, StripePaymentStatus } from "@/types"

import { cn } from "@/lib/utils"

// Original source: https://github.com/jackblatch/OneStopShop/blob/main/server-actions/stripe/payment.ts
export function calculateOrderAmount(items: CartLineItem[]) {
  const total = items.reduce((acc, item) => {
    return acc + Number(item.price) * item.quantity
  }, 0)
  const fee = Math.round(total * 0.1)

  const totalInCents = Math.round(total * 100)
  const feeInCents = Math.round(fee * 100)

  return {
    total: totalInCents, // Converts to cents which stripe charges in
    fee: feeInCents,
  }
}

export const stripePaymentStatuses: StripePaymentStatus[] = [
  "canceled",
  "processing",
  "requires_action",
  "requires_capture",
  "requires_confirmation",
  "requires_payment_method",
  "succeeded",
]

export function getStripePaymentStatusColor({
  status,
  shade = 600,
}: {
  status: StripePaymentStatus
  shade?: 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900 | 950
}) {
  const bg = `bg-${shade}`

  return cn({
    [`${bg}-red`]: status === "canceled",
    [`${bg}-yellow`]: [
      "processing",
      "requires_action",
      "requires_capture",
      "requires_confirmation",
      "requires_payment_method",
    ].includes(status),
    [`bg-green-${shade}`]: status === "succeeded",
  })
}
