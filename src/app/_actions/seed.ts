"use server"

import { db } from "@/db"
import { products, type Product } from "@/db/schema"
import { faker } from "@faker-js/faker"

import { productCategories, productTags } from "@/config/products"

function getSubcategories(category?: string) {
  const subcategories =
    productCategories
      .find((c) => c.title === category)
      ?.subcategories.map((subcategory) => subcategory.title) ?? []

  return subcategories
}

const allProducts: Product[] = []

export async function seed() {
  await db.delete(products)

  for (let i = 0; i < 50; i++) {
    allProducts.push({
      id: i,
      name: faker.commerce.productName(),
      price: faker.commerce.price(),
      description: faker.commerce.productDescription(),
      images: [
        {
          id: faker.string.uuid(),
          url: "/images/deck-one.webp",
          name: faker.commerce.productName(),
        },
      ],
      category:
        faker.helpers.shuffle(
          productCategories.map((category) => category.title)
        )[0] ?? "skateboards",
      subcategories: faker.helpers.shuffle(
        getSubcategories(allProducts[i]?.category)
      ),
      inventory: faker.number.int({ min: 1, max: 100 }),
      rating: faker.number.int({ min: 1, max: 5 }),
      quantity: faker.number.int({ min: 1, max: 100 }),
      tags: faker.helpers.shuffle(productTags),
      storeId: 24,
      createdAt: new Date().toISOString().slice(0, 19).replace("T", " "),
    })
  }

  await db.insert(products).values(allProducts)

  console.log("Seeded successfully.")

  return allProducts
}
