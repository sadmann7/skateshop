import type { Metadata } from "next"
import { notFound } from "next/navigation"

import { siteConfig } from "@/config/site"
import { prisma } from "@/lib/db"
import { Header } from "@/components/header"

interface PrdouctPageProps {
  params: {
    productId: string
  }
}

export async function generateMetadata({
  params,
}: PrdouctPageProps): Promise<Metadata> {
  const { productId } = params

  const product = await prisma.product.findUnique({
    where: {
      id: productId,
    },
  })

  if (!product) {
    notFound()
  }

  return {
    title: {
      default: product.name,
      template: `%s - ${siteConfig.name}`,
    },
    description: product.description ?? "",
  }
}

export default async function ProductPage({ params }: PrdouctPageProps) {
  const { productId } = params

  const product = await prisma.product.findUnique({
    where: {
      id: productId,
    },
  })

  if (!product) {
    notFound()
  }

  return (
    <section className="container grid w-full items-center gap-6 pb-8 pt-6 md:py-10">
      <div className="flex max-w-[980px] flex-col items-start gap-2">
        <Header title={product.name} description={product.description ?? ""} />
      </div>
    </section>
  )
}
