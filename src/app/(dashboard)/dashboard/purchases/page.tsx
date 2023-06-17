import type { Metadata } from "next"
import { redirect } from "next/navigation"
import { currentUser } from "@clerk/nextjs"

import { Header } from "@/components/header"
import { Shell } from "@/components/shell"

export const metadata: Metadata = {
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
