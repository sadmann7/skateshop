import productsJson from "@/assets/data/products.json"
import { db } from "@/db"
import { products, type Product } from "@/db/schema"
import { faker } from "@faker-js/faker"
import { eq } from "drizzle-orm"

import { getSubcategories, productTags } from "@/config/products"
import { createId } from "@/lib/utils"

export async function seedProducts({
  storeId,
  count,
}: {
  storeId: string
  count?: number
}) {
  const productCount = count ?? 10

  const data: Product[] = []

  for (let i = 0; i < productCount; i++) {
    const category =
      faker.helpers.shuffle(products.category.enumValues)[0] ?? "skateboards"

    const subcategories = getSubcategories(category)

    data.push({
      id: createId(),
      name: faker.commerce.productName(),
      description: faker.commerce.productDescription(),
      price: faker.commerce.price(),
      images: Array.from({ length: 3 }).map(() => ({
        id: faker.string.uuid(),
        name: faker.system.fileName(),
        url: faker.image.urlLoremFlickr({
          category,
          width: 640,
          height: 480,
        }),
      })),
      category,
      subcategory:
        faker.helpers.shuffle(subcategories)[0]?.value ??
        subcategories[0]?.value ??
        "decks",
      storeId,
      inventory: faker.number.float({ min: 50, max: 100 }),
      rating: faker.number.float({ min: 0, max: 5 }),
      tags: productTags.slice(0, faker.number.float({ min: 0, max: 5 })),
      createdAt: faker.date.past(),
      updatedAt: faker.date.past(),
    })
  }

  await db.delete(products).where(eq(products.storeId, storeId))
  console.log(`📝 Inserting ${data.length} products`)
  await db.insert(products).values(data)
}

export async function seedRealProducts({ storeId }: { storeId: string }) {
  const data: Product[] = productsJson.map((product) => ({
    id: product.id,
    name: product.name,
    description: product.description,
    price: product.price,
    images: product.images.map((image) => ({
      id: image.id,
      name: image.name,
      url: image.url,
    })),
    category: product.category as Product["category"],
    subcategory: product.subcategory,
    storeId,
    inventory: product.inventory,
    rating: product.rating,
    tags: product.tags,
    createdAt: new Date(),
    updatedAt: new Date(),
  }))

  await db.delete(products).where(eq(products.storeId, storeId))
  console.log(`📝 Inserting ${data.length} products`)
  await db.insert(products).values(data)
}
