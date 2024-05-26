import { relations } from "drizzle-orm"
import { index, pgTable, varchar } from "drizzle-orm/pg-core"

import { generateId } from "@/lib/id"

import { products } from "./products"
import { stores } from "./stores"

export const tags = pgTable(
  "tags",
  {
    id: varchar("id", { length: 30 })
      .$defaultFn(() => generateId())
      .primaryKey(),
    name: varchar("name", { length: 50 }).notNull(),
    color: varchar("color", { length: 50 }).notNull().default("#000000"),
    storeId: varchar("store_id", { length: 30 })
      .references(() => stores.id, { onDelete: "cascade" })
      .notNull(),
  },
  (table) => ({
    storeIdIdx: index("tags_store_id_idx").on(table.storeId),
  })
)

export const tagsRelations = relations(tags, ({ one, many }) => ({
  store: one(stores, { fields: [tags.storeId], references: [stores.id] }),
  products: many(products, {
    relationName: "productTags",
  }),
}))

export type Tag = typeof tags.$inferSelect
export type NewTag = typeof tags.$inferInsert
