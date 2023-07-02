"use server"

import { db } from "@/db"
import { products } from "@/db/schema"
import { faker } from "@faker-js/faker"

import {
  getSubcategories,
  productCategories,
  productTags,
} from "@/config/products"

export async function generateProducts() {
  await db.delete(products)

  for (let i = 0; i < 100; i++) {
    const category =
      faker.helpers.shuffle(productCategories)[0]?.title ?? "skateboards"
    const subcategories = getSubcategories(category).map((s) => s.value)

    await db.insert(products).values({
      name: faker.commerce.productName(),
      price: faker.commerce.price({ min: 1, max: 100 }),
      description: faker.commerce.productDescription(),
      images: null,
      category: category,
      subcategory: faker.helpers.shuffle(subcategories)[0] ?? null,
      inventory: faker.number.int({ min: 0, max: 100 }),
      rating: faker.number.int({ min: 1, max: 5 }),
      tags: faker.helpers.shuffle(productTags).slice(0, 3),
      storeId: 1,
      createdAt: new Date(),
    })
  }
}
