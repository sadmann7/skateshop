import Image from "next/image"
import Link from "next/link"
import { products } from "@/db/schema"

import { AspectRatio } from "@/components/ui/aspect-ratio"
import { Card, CardContent, CardTitle } from "@/components/ui/card"
import { Header } from "@/components/header"
import { Hero } from "@/components/hero"
import { Shell } from "@/components/shell"

export const runtime = "edge"

export default function IndexPage() {
  return (
    <div>
      <Hero />
      <Shell>
        <Header
          className="place-items-center text-center"
          title="Buy rad skating goodies"
          description="We have a wide range of products to suit your needs"
        />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {Object.values(products.category.enumValues).map((category) => (
            <Link
              aria-label={`Go to ${category}`}
              key={category}
              href={`/categories/${category}`}
            >
              <Card className="group overflow-hidden">
                <CardContent className="p-0">
                  <AspectRatio ratio={1.85 / 1}>
                    <div className="absolute inset-0 z-10 bg-black/60 transition-colors group-hover:bg-black/70" />
                    <CardTitle className="absolute inset-0 z-10 flex items-center justify-center text-2xl capitalize">
                      {category}
                    </CardTitle>
                    <Image
                      src={`https://source.unsplash.com/featured/?${category}`}
                      alt={category}
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
    </div>
  )
}
