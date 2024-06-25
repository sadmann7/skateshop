import type { StoredFile } from "@/types"
import { relations } from "drizzle-orm"
import {
  decimal,
  index,
  integer,
  json,
  pgEnum,
  pgTable,
  text,
  varchar,
} from "drizzle-orm/pg-core"

import { generateId } from "@/lib/id"

import { categories } from "./categories"
import { stores } from "./stores"
import { subcategories } from "./subcategories"
import { productTags } from "./tags"
import { lifecycleDates } from "./utils"
import { productVariants } from "./variants"

export const productStatusEnum = pgEnum("product_status", [
  "active",
  "draft",
  "archived",
])

export const products = pgTable(
  "products",
  {
    id: varchar("id", { length: 30 })
      .$defaultFn(() => generateId())
      .primaryKey(), // prefix_ + nanoid (12)
    name: text("name").notNull(),
    description: text("description"),
    images: json("images").$type<StoredFile[] | null>().default(null),
    categoryId: varchar("category_id", { length: 30 })
      .references(() => categories.id, { onDelete: "cascade" })
      .notNull(),
    subcategoryId: varchar("subcategory_id", { length: 30 }).references(
      () => subcategories.id,
      { onDelete: "cascade" }
    ),
    /**
     * postgresql docs suggest using numeric for money
     * @see https://www.postgresql.org/docs/current/datatype-money.html#:~:text=Values%20of%20the%20numeric%2C%20int%2C%20and%20bigint%20data%20types%20can%20be%20cast%20to%20money.
     * numeric and decimal are the same in postgresql
     * @see https://www.postgresql.org/docs/current/datatype-numeric.html#:~:text=9223372036854775808%20to%20%2B9223372036854775807-,decimal,the%20decimal%20point%3B%20up%20to%2016383%20digits%20after%20the%20decimal%20point,-real
     */
    price: decimal("price", { precision: 10, scale: 2 }).notNull().default("0"),
    originalPrice: decimal("original_price", {
      precision: 10,
      scale: 2,
    }).default("0"),
    inventory: integer("inventory").notNull().default(0),
    rating: integer("rating").notNull().default(0),
    status: productStatusEnum("status").notNull().default("active"),
    storeId: varchar("store_id", { length: 30 })
      .references(() => stores.id, { onDelete: "cascade" })
      .notNull(),
    ...lifecycleDates,
  },
  (table) => ({
    storeIdIdx: index("products_store_id_idx").on(table.storeId),
    categoryIdIdx: index("products_category_id_idx").on(table.categoryId),
    subcategoryIdIdx: index("products_subcategory_id_idx").on(
      table.subcategoryId
    ),
  })
)

export const productsRelations = relations(products, ({ one, many }) => ({
  store: one(stores, { fields: [products.storeId], references: [stores.id] }),
  category: one(categories, {
    fields: [products.categoryId],
    references: [categories.id],
  }),
  subcategory: one(subcategories, {
    fields: [products.subcategoryId],
    references: [subcategories.id],
  }),
  variants: many(productVariants, { relationName: "productVariants" }),
  tags: many(productTags, { relationName: "productTags" }),
}))

export type Product = typeof products.$inferSelect
export type NewProduct = typeof products.$inferInsert
