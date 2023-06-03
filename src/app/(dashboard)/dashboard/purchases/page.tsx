import type { Metadata } from "next"
import { redirect } from "next/navigation"
import { currentUser } from "@clerk/nextjs"

import { Header } from "@/components/header"

export const metadata: Metadata = {
  title: "Purchases",
  description: "Manage your purchases.",
}

export default async function PurchasesPage() {
  const user = await currentUser()

  if (!user) {
    redirect("/sign-in")
  }

  return (
    <section className="grid items-center gap-8 pb-8 pt-6 md:py-8">
      <Header
        title="Purchases"
        description="Manage your purchases."
        size="sm"
      />
      <div>Purchases Table</div>
    </section>
  )
}
