import type { StripePaymentStatus } from "@/types"

import { cn } from "@/lib/utils"

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
