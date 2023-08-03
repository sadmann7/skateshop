"use server"

import { db } from "@/db"
import { products, type Product } from "@/db/schema"
import { faker } from "@faker-js/faker"

import {
  getSubcategories,
  productCategories,
  productTags,
} from "@/config/products"

export async function generateProducts({
  storeId,
  count = 10,
}: {
  storeId: number
  count?: number
}) {
  const allProducts: Product[] = []

  const categories = productCategories.map((category) => category.title)

  const category = faker.helpers.shuffle(categories)[0] ?? "skateboards"

  const subcategories = getSubcategories(category).map((s) => s.value)
  const subcategory = faker.helpers.shuffle(subcategories)[0] ?? "decks"

  for (let i = 0; i < count; i++) {
    allProducts.push({
      id: faker.number.int({ min: 100000, max: 999999 }),
      name: faker.commerce.productName(),
      description: faker.commerce.productDescription(),
      price: faker.commerce.price(),
      rating: faker.number.float({ min: 0, max: 5, precision: 0.1 }),
      category,
      subcategory,
      images: null,
      createdAt: faker.date.past(),
      inventory: faker.number.int({ min: 0, max: 100 }),
      storeId,
      tags: faker.helpers.shuffle(productTags).slice(0, 3),
    })
  }
  await db.insert(products).values(allProducts)
}
