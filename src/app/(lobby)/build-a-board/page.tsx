import { type Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { db } from "@/db"

import { productCategories } from "@/config/products"
import { AspectRatio } from "@/components/ui/aspect-ratio"
import { Card, CardContent, CardTitle } from "@/components/ui/card"
import { GenerateButton } from "@/components/generate-button"
import { Header } from "@/components/header"
import { Shell } from "@/components/shell"

export const runtime = "edge"

export const metadata: Metadata = {
  title: "Build a Board",
  description: "Select the components for your board",
}

export default async function BuildABoadPage() {
  const products = await db.query.products.findMany()
  console.log(products)

  return (
    <Shell>
      <Header
        title="Build a Board"
        description="Select the components for your board"
        size="sm"
      />
      <GenerateButton />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {productCategories[0]?.subcategories.map((subcategory) => (
          <Link
            aria-label={`Go to ${subcategory.title}`}
            key={subcategory.title}
            href={`/categories/skateboards/${subcategory.title}`}
          >
            <Card className="group overflow-hidden">
              <CardContent className="p-0">
                <AspectRatio ratio={1 / 1}>
                  <div className="absolute inset-0 z-10 bg-black/60 transition-colors group-hover:bg-black/70" />
                  <CardTitle className="absolute inset-0 z-10 flex items-center justify-center text-2xl capitalize">
                    {subcategory.title}
                  </CardTitle>
                  <Image
                    src={
                      subcategory.image ?? "/images/product-placeholder.webp"
                    }
                    alt={subcategory.title}
                    fill
                    className="object-cover"
                    loading="lazy"
                  />
                </AspectRatio>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </Shell>
  )
}
