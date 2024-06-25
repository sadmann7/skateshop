import { db } from "@/db"
import {
  categories,
  products,
  subcategories,
  type Category,
  type Product,
  type Subcategory,
} from "@/db/schema"
import { faker } from "@faker-js/faker"
import { eq } from "drizzle-orm"

import { productConfig } from "@/config/product"
import { generateId } from "@/lib/id"
import { absoluteUrl, slugify } from "@/lib/utils"

export async function revalidateItems() {
  console.log("🔄 Revalidating...")
  await fetch(absoluteUrl("/api/revalidate"))
}

export async function seedCategories() {
  const data: Omit<Category, "createdAt" | "updatedAt">[] =
    productConfig.categories.map((category) => ({
      id: category.id,
      name: category.name,
      slug: slugify(category.name),
      description: category.description,
      image: category.image,
    }))

  await db.delete(categories)
  console.log(`📝 Inserting ${data.length} categories`)
  await db.insert(categories).values(data)
}

export async function seedSubcategories() {
  const data: Omit<Subcategory, "createdAt" | "updatedAt">[] = []

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
          id: subcategory.id,
          name: subcategory.name,
          slug: slugify(subcategory.name),
          categoryId: category.id,
          description: subcategory.description,
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
  const data: Omit<Product, "createdAt" | "updatedAt">[] = []

  const categoryIds = productConfig.categories.map((category) => category.id)

  for (let i = 0; i < (count ?? 10); i++) {
    const categoryId = faker.helpers.shuffle(categoryIds)[0]

    if (!categoryId) {
      throw new Error(`${categoryId} category not found`)
    }

    const allSubcategories = await db
      .select({
        id: subcategories.id,
      })
      .from(subcategories)
      .where(eq(subcategories.categoryId, categoryId))
      .execute()

    data.push({
      id: generateId(),
      name: faker.commerce.productName(),
      description: faker.commerce.productDescription(),
      price: faker.commerce.price(),
      originalPrice: faker.commerce.price(),
      status: faker.helpers.shuffle(products.status.enumValues)[0] ?? "active",
      images: null,
      categoryId,
      subcategoryId: faker.helpers.shuffle(allSubcategories)[0]?.id ?? null,
      storeId,
      inventory: faker.number.int({ min: 50, max: 100 }),
      rating: faker.number.int({ min: 0, max: 5 }),
    })
  }

  await db.delete(products).where(eq(products.storeId, storeId))
  console.log(`📝 Inserting ${data.length} products`)
  await db.insert(products).values(data)
}
