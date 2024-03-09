import productsJson from "@/assets/data/products.json"
import { db } from "@/db"
import {
  categories,
  products,
  subcategories,
  type Product,
  type Subcategory,
} from "@/db/schema"
import { createId } from "@/db/utils"
import { faker } from "@faker-js/faker"
import { eq } from "drizzle-orm"

import { getSubcategories, productConfig } from "@/config/product"
import { slugify } from "@/lib/utils"

export async function seedCategories() {
  const data = productConfig.categories.map((category) => ({
    id: createId(),
    name: category.name,
    slug: slugify(category.name),
    description: category.description,
  }))

  await db.delete(categories)
  console.log(`📝 Inserting ${data.length} categories`)
  await db.insert(categories).values(data)
}

export async function seedSubcategories() {
  const data: Subcategory[] = []

  const allCategories = await db.select().from(categories).execute()

  allCategories.forEach((category) => {
    const subcategories = productConfig.categories.find(
      (c) => c.name === category.name
    )?.subcategories

    if (subcategories) {
      subcategories.forEach((subcategory) => {
        data.push({
          id: createId(),
          name: subcategory.name,
          slug: slugify(subcategory.name),
          categoryId: category.id,
          description: subcategory.description,
          updatedAt: new Date(),
          createdAt: new Date(),
        })
      })
    }
  })

  await db.delete(subcategories)
  console.log(`📝 Inserting ${data.length} subcategories`)
  await db.insert(subcategories).values(data)
}

export async function seedProducts({
  storeId,
  count,
}: {
  storeId: string
  count?: number
}) {
  const productCount = count ?? 10

  const data: Product[] = []

  const categories = productConfig.categories.map((category) => category.name)

  for (let i = 0; i < productCount; i++) {
    const category = faker.helpers.shuffle(categories)[0] ?? "skateboards"

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
      categoryId: category,
      subcategoryId: subcategories[0]?.value ?? "decks",
      storeId,
      inventory: faker.number.float({ min: 50, max: 100 }),
      rating: faker.number.float({ min: 0, max: 5 }),
      tags: productConfig.tags.slice(0, faker.number.float({ min: 0, max: 5 })),
      createdAt: faker.date.past(),
      updatedAt: faker.date.past(),
    })
  }

  await db.delete(products).where(eq(products.storeId, storeId))
  console.log(`📝 Inserting ${data.length} products`)
  await db.insert(products).values(data)
}

export async function seedCozyProducts({ storeId }: { storeId: string }) {
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
    categoryId: product.category,
    subcategoryId: product.subcategory,
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
