import { db } from "@/db"
import {
  categories,
  products,
  subcategories,
  type Product,
  type Subcategory,
} from "@/db/schema"
import { auth } from "@clerk/nextjs/server"
import { faker } from "@faker-js/faker"
import { eq } from "drizzle-orm"

import { productConfig } from "@/config/product"
import { generateId } from "@/lib/id"
import { slugify } from "@/lib/utils"

export async function seedCategories() {
  const data = productConfig.categories.map((category) => ({
    id: generateId(),
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

  const allCategories = await db
    .select({
      id: categories.id,
      name: categories.name,
    })
    .from(categories)
    .execute()

  allCategories.forEach((category) => {
    const subcategories = productConfig.categories.find(
      (c) => c.name === category.name
    )?.subcategories

    if (subcategories) {
      subcategories.forEach((subcategory) => {
        data.push({
          id: generateId(),
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
  const { userId } = auth()

  if (!userId) {
    throw new Error("User not found")
  }

  const productCount = count ?? 10

  const data: Product[] = []

  const categories = productConfig.categories.map((category) => category.name)

  for (let i = 0; i < productCount; i++) {
    const category = faker.helpers.shuffle(categories)[0] ?? "skateboards"

    const allSubcategories = await db
      .select({
        id: subcategories.id,
      })
      .from(subcategories)
      .where(eq(subcategories.categoryId, category))
      .execute()

    data.push({
      id: generateId(),
      name: faker.commerce.productName(),
      description: faker.commerce.productDescription(),
      price: faker.commerce.price(),
      originalPrice: faker.commerce.price(),
      status: faker.helpers.shuffle(products.status.enumValues)[0] ?? "active",
      images: null,
      categoryId: category,
      subcategoryId: faker.helpers.shuffle(allSubcategories)[0]?.id ?? null,
      storeId,
      inventory: faker.number.float({ min: 50, max: 100 }),
      rating: faker.number.float({ min: 0, max: 5 }),
      createdAt: faker.date.past(),
      updatedAt: faker.date.past(),
    })
  }

  await db.delete(products).where(eq(products.storeId, storeId))
  console.log(`📝 Inserting ${data.length} products`)
  await db.insert(products).values(data)
}
