import type { Metadata } from "next"
import { redirect } from "next/navigation"

import { authOptions } from "@/lib/auth"
import { getCurrentUser } from "@/lib/session"
import { AddStoreForm } from "@/components/forms/add-store-form"
import { Header } from "@/components/header"

export const metadata: Metadata = {
  title: "Add Store",
  description: "Add a new store.",
}

export default async function AddStorePage() {
  const user = await getCurrentUser()

  if (!user) {
    redirect(authOptions.pages?.signIn || "/api/auth/signin")
  }

  return (
    <section className="container grid w-full items-center gap-14 pb-8 pt-6 md:py-10">
      <Header title="Add Store" description="Add a new store." />
      <AddStoreForm userId={user.id} />
    </section>
  )
}
