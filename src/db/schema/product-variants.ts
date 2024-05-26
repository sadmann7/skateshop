import { relations } from "drizzle-orm"
import { decimal, index, integer, pgTable, varchar } from "drizzle-orm/pg-core"

import { generateId } from "@/lib/id"

import { products } from "./products"
import { lifecycleDates } from "./utils"

export const productVariants = pgTable(
  "product_variants",
  {
    id: varchar("id", { length: 30 })
      .$defaultFn(() => generateId())
      .primaryKey(),
    productId: varchar("product_id", { length: 30 })
      .references(() => products.id, { onDelete: "cascade" })
      .notNull(),
    name: varchar("name", { length: 256 }).notNull(),
    price: decimal("price", { precision: 10, scale: 2 }).notNull().default("0"),
    quantity: integer("quantity").notNull().default(0),
    ...lifecycleDates,
  },
  (table) => ({
    productIdIdx: index("product_variants_product_id_idx").on(table.productId),
  })
)

export const productVariantsRelations = relations(
  productVariants,
  ({ one }) => ({
    product: one(products, {
      fields: [productVariants.productId],
      references: [products.id],
    }),
  })
)

export type ProductVariant = typeof productVariants.$inferSelect
export type NewProductVariant = typeof productVariants.$inferInsert
