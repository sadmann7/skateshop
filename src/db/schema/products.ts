import { createId, pgTable } from "@/db/utils"
import type { StoredFile } from "@/types"
import { relations, sql } from "drizzle-orm"
import {
  decimal,
  index,
  integer,
  json,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core"

import { dbPrefix } from "@/lib/constants"

import { categories } from "./categories"
import { stores } from "./stores"
import { subcategories } from "./subcategories"

export const products = pgTable(
  "products",
  {
    id: varchar("id", { length: 30 })
      .$defaultFn(() => createId())
      .primaryKey(), // prefix_ (if ocd kicks in) + nanoid (16)
    name: varchar("name", { length: 256 }).notNull(),
    description: text("description"),
    images: json("images").$type<StoredFile[] | null>().default(null),
    categoryId: varchar("category_id", { length: 30 }).notNull(),
    subcategoryId: varchar("subcategory_id", { length: 30 }).references(
      () => subcategories.id,
      { onDelete: "cascade" }
    ),
    price: decimal("price", { precision: 10, scale: 2 }).notNull().default("0"),
    inventory: integer("inventory").notNull().default(0),
    rating: integer("rating").notNull().default(0),
    tags: json("tags").$type<string[] | null>().default(null),
    storeId: varchar("store_id", { length: 30 })
      .references(() => stores.id, { onDelete: "cascade" })
      .notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").default(sql`current_timestamp`),
  },
  (table) => ({
    storeIdIdx: index(`${dbPrefix}_products_store_id_idx`).on(table.storeId),
    categoryIdIdx: index(`${dbPrefix}_products_category_id_idx`).on(
      table.categoryId
    ),
    subcategoryIdIdx: index(`${dbPrefix}_products_subcategory_id_idx`).on(
      table.subcategoryId
    ),
  })
)

export const productsRelations = relations(products, ({ one }) => ({
  store: one(stores, { fields: [products.storeId], references: [stores.id] }),
  category: one(categories, {
    fields: [products.categoryId],
    references: [categories.id],
  }),
  subcategory: one(subcategories, {
    fields: [products.subcategoryId],
    references: [subcategories.id],
  }),
}))

export type Product = typeof products.$inferSelect
export type NewProduct = typeof products.$inferInsert
