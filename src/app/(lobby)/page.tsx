import Image from "next/image"
import Link from "next/link"
import { products } from "@/db/schema"

import { AspectRatio } from "@/components/ui/aspect-ratio"
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
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {Object.values(products.category.enumValues).map((category) => (
            <Link
              aria-label={`Go to ${category}`}
              key={category}
              href={`/categories/${category}`}
            >
              <AspectRatio
                ratio={16 / 9}
                className="relative overflow-hidden rounded-lg"
              >
                <h2 className="absolute left-1/2 top-1/2 z-20 -translate-x-1/2 -translate-y-1/2 text-xl font-semibold capitalize">
                  {category}
                </h2>
                <div className="absolute inset-0 z-10 bg-black/60" />
                <Image
                  src={`https://source.unsplash.com/featured/?${category}`}
                  alt={category}
                  fill
                  className="object-cover"
                  loading="lazy"
                />
              </AspectRatio>
            </Link>
          ))}
        </div>
      </Shell>
    </div>
  )
}
