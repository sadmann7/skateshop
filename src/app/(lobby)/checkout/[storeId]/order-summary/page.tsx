import type { Metadata } from "next"
import { env } from "@/env.mjs"

import {
  PageHeader,
  PageHeaderDescription,
  PageHeaderHeading,
} from "@/components/page-header"
import { Shell } from "@/components/shells/shell"

export const metadata: Metadata = {
  metadataBase: new URL(env.NEXT_PUBLIC_APP_URL),
  title: "Order Summary",
  description: "Order Summary for your purchase",
}

export default function OrderSummaryPage() {
  return (
    <Shell>
      <PageHeader>
        <PageHeaderHeading size="sm">Order Summary</PageHeaderHeading>
        <PageHeaderDescription size="sm">
          Order Summary for your purchase
        </PageHeaderDescription>
      </PageHeader>
    </Shell>
  )
}
