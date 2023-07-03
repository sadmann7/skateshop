import { env } from "@/env.mjs"
import type { Metadata } from "next"
import { redirect } from "next/navigation"
import { currentUser } from "@clerk/nextjs"

import { Header } from "@/components/header"
import { Shell } from "@/components/shell"

export const metadata: Metadata = {
  metadataBase: new URL(env.NEXT_PUBLIC_APP_URL),
  title: "Purchases",
  description: "Manage your purchases",
}

export default async function PurchasesPage() {
  const user = await currentUser()

  if (!user) {
    redirect("/signin")
  }

  return (
    <Shell layout="dashboard">
      <Header
        title="Purchases"
        description="Manage your purchases."
        size="sm"
      />
      <div>Purchases Table</div>
    </Shell>
  )
}
