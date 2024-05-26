import { relations } from "drizzle-orm"
import {
  decimal,
  index,
  pgTable,
  primaryKey,
  text,
  unique,
  varchar,
} from "drizzle-orm/pg-core"

import { generateId } from "@/lib/id"

import { products } from "./products"
import { stocks } from "./stocks"
import { stores } from "./stores"
import { lifecycleDates } from "./utils"

// store variants
export const variants = pgTable(
  "variants",
  {
    id: varchar("id", { length: 30 })
      .$defaultFn(() => generateId())
      .primaryKey(),
    storeId: varchar("store_id", { length: 30 })
      .references(() => stores.id, { onDelete: "cascade" })
      .notNull(),
    name: text("name").notNull(),
    ...lifecycleDates,
  },
  (table) => ({
    variantsNameUnique: unique("variants_name_store_id_unique")
      .on(table.name, table.storeId)
      .nullsNotDistinct(),
    storeIdIdx: index("variants_store_id_idx").on(table.storeId),
  })
)

export const variantsRelations = relations(variants, ({ one }) => ({
  store: one(stores, { fields: [variants.storeId], references: [stores.id] }),
}))

export type Variant = typeof variants.$inferSelect
export type NewVariant = typeof variants.$inferInsert

export const productVariants = pgTable(
  "product_variants",
  {
    id: varchar("id", { length: 30 })
      .$defaultFn(() => generateId())
      .primaryKey(),
    productId: varchar("product_id", { length: 30 })
      .references(() => products.id, { onDelete: "cascade" })
      .notNull(),
    variantId: varchar("variant_id", { length: 30 })
      .references(() => variants.id, { onDelete: "cascade" })
      .notNull(),
    ...lifecycleDates,
  },
  (table) => ({
    productIdIdx: index("product_variants_product_id_idx").on(table.productId),
    variantIdIdx: index("product_variants_variant_id_idx").on(table.variantId),
  })
)

export const productVariantsRelations = relations(
  productVariants,
  ({ one, many }) => ({
    product: one(products, {
      fields: [productVariants.productId],
      references: [products.id],
    }),
    variant: one(variants, {
      fields: [productVariants.variantId],
      references: [variants.id],
    }),
    productVariantValues: many(productVariantValues),
  })
)

export type ProductVariant = typeof productVariants.$inferSelect
export type NewProductVariant = typeof productVariants.$inferInsert

export const productVariantValues = pgTable(
  "product_variant_values",
  {
    productVariantId: varchar("product_variant_id", { length: 30 })
      .references(() => productVariants.id, { onDelete: "cascade" })
      .notNull(),
    value: text("value").notNull(),
    price: decimal("price", { precision: 10, scale: 2 }).notNull(),
    stockId: varchar("stock_id", { length: 30 })
      .references(() => stocks.id, { onDelete: "cascade" })
      .notNull(),
    ...lifecycleDates,
  },
  (table) => ({
    pk: primaryKey({
      name: "product_variant_values_pk",
      columns: [table.productVariantId, table.value],
    }),
    productVariantIdIdx: index("variant_values_product_variant_id_idx").on(
      table.productVariantId
    ),
    stockIdIdx: index("variant_values_stock_id_idx").on(table.stockId),
  })
)

export const productVariantValuesRelations = relations(
  productVariantValues,
  ({ one }) => ({
    productVariant: one(productVariants, {
      fields: [productVariantValues.productVariantId],
      references: [productVariants.productId],
    }),
  })
)

export type ProductVariantValue = typeof productVariantValues.$inferSelect
export type NewProductVariantValue = typeof productVariantValues.$inferInsert
