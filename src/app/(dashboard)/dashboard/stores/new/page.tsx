import type { Metadata } from "next"
import Link from "next/link"
import { redirect } from "next/navigation"
import { currentUser } from "@clerk/nextjs"

import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"
import { AddStoreForm } from "@/components/forms/add-store-form"
import { Icons } from "@/components/icons"

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
    <section className="container grid items-center gap-6 pb-8 pt-6 md:py-8">
      <Link aria-label="Back to dashboard" href="/dashboard">
        <div
          className={cn(
            buttonVariants({
              size: "sm",
              variant: "ghost",
            })
          )}
        >
          <Icons.chevronLeft className="mr-2 h-4 w-4" />
          Back
        </div>
      </Link>
      <AddStoreForm userId={user.id} />
    </section>
  )
}
