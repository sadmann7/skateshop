"use server"

import { db } from "@/db"
import { products } from "@/db/schema"
import { faker } from "@faker-js/faker"

import { productCategories, productTags } from "@/config/products"

export async function generateProducts() {
  await db.delete(products)

  for (let i = 0; i < 100; i++) {
    const category =
      faker.helpers.shuffle(productCategories)[0]?.title ?? "skateboards"

    const subcategories =
      productCategories
        .find((c) => c.title === category)
        ?.subcategories.map((s) => s.title) ?? []

    await db.insert(products).values({
      name: faker.commerce.productName(),
      price: faker.commerce.price({ min: 1, max: 100 }),
      description: faker.commerce.productDescription(),
      images: null,
      category: category,
      subcategory: faker.helpers.shuffle(subcategories)[0] ?? null,
      inventory: faker.number.int({ min: 1, max: 100 }),
      rating: faker.number.int({ min: 1, max: 5 }),
      quantity: faker.number.int({ min: 1, max: 100 }),
      tags: faker.helpers.shuffle(productTags),
      storeId: 24,
      createdAt: new Date().toISOString().slice(0, 19).replace("T", " "),
    })
  }
}
