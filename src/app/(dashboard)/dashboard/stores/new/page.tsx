import type { Metadata } from "next"
import { redirect } from "next/navigation"
import { currentUser } from "@clerk/nextjs"

import { AddStoreForm } from "@/components/forms/add-store-form"
import { Header } from "@/components/header"

import { env } from "@/env.mjs"
import { Shell } from "@/components/shell"

export const metadata: Metadata = {
  metadataBase: new URL(env.NEXT_PUBLIC_APP_URL),
  title: "New Store",
  description: "Add a new store",
}

export default async function NewStorePage() {
  const user = await currentUser()

  if (!user) {
    redirect("/signin")
  }

  return (
    <Shell layout="dashboard">
      <Header
        title="New Store"
        description="New store for your account."
        size="sm"
      />
      <AddStoreForm userId={user.id} />
    </Shell>
  )
}
