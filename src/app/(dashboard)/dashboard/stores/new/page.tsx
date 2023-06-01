import type { Metadata } from "next"
import { redirect } from "next/navigation"
import { currentUser } from "@clerk/nextjs"

import { AddStoreForm } from "@/components/forms/add-store-form"
import { Header } from "@/components/header"

export const metadata: Metadata = {
  title: "New Store",
  description: "Add a new store.",
}

export default async function NewStorePage() {
  const user = await currentUser()

  if (!user) {
    redirect("/sign-in")
  }

  return (
    <section className="container grid w-full items-center space-y-10 pb-10 pt-6 md:py-10">
      <Header title="New Store" description="Add a new store." />
      <AddStoreForm userId={user.id} />
    </section>
  )
}
