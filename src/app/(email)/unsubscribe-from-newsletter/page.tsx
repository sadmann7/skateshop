import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { db } from "@/db"
import { newsletterSubscriptions, products } from "@/db/schema"
import { eq } from "drizzle-orm"

import { AspectRatio } from "@/components/ui/aspect-ratio"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Header } from "@/components/header"
import { Icons } from "@/components/icons"
import { ImageCarousel } from "@/components/image-carousel"
import { Shell } from "@/components/shell"

export const metadata: Metadata = {
  title: "Unsubscribe from newsletter",
  description: "Unsubscribe from newsletter to stop receiving emails from us.",
}

interface UnsubscribeFromNewsletterPageProps {
  params: {
    token: string
  }
}

export default function UnsubscribeFormNewsletterPage({
  params,
}: UnsubscribeFromNewsletterPageProps) {
  const { token } = params

  return (
    <Shell>
      <Header
        title="Unsubscribe from newsletter"
        description="Stop receiving emails from us."
      />
      <Card>
        <CardHeader className="space-y-1.5">
          <CardTitle>Do you want to unsubscribe from our newsletter?</CardTitle>
          <CardDescription>
            You will no longer receive emails from us.
          </CardDescription>
        </CardHeader>
        <CardContent></CardContent>
      </Card>
    </Shell>
  )
}
