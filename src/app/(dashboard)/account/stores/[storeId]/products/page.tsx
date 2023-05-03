import type { Metadata } from "next"
import Link from "next/link"
import { notFound, redirect } from "next/navigation"

import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/db"
import { getCurrentUser } from "@/lib/session"
import { Skeleton } from "@/components/ui/skeleton"
import { Header } from "@/components/header"
import { Icons } from "@/components/icons"

export const metadata: Metadata = {
  title: "Products",
  description: "Manage your products.",
}

interface ProductsPageProps {
  params: {
    storeId: string
  }
}

export default async function ProductsPage({ params }: ProductsPageProps) {
  const { storeId } = params

  const user = await getCurrentUser()

  if (!user) {
    redirect(authOptions.pages?.signIn || "/login")
  }

  const products = await prisma.product.findMany({
    where: {
      storeId,
    },
    select: {
      id: true,
      name: true,
      description: true,
      category: true,
      price: true,
      quantity: true,
      inventory: true,
    },
  })

  console.log(storeId)

  return (
    <section className="container grid w-full items-center gap-6 space-y-5 pb-20 pt-6 md:py-10">
      <Header title="Your Products" description="Manage your products." />
    </section>
  )
}
