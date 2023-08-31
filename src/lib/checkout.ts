import type { StripePaymentStatus } from "@/types"

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
  switch (status) {
    case "canceled":
      return `${bg}-red`
    case "processing":
      return `${bg}-yellow`
    case "requires_action":
      return `${bg}-yellow`
    case "requires_capture":
      return `${bg}-yellow`
    case "requires_confirmation":
      return `${bg}-yellow`
    case "requires_payment_method":
      return `${bg}-yellow`
    case "succeeded":
      return `bg-green-${shade}`
  }
}
