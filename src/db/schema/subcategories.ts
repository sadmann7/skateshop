import { createId, pgTable } from "@/db/utils"
import { relations, sql } from "drizzle-orm"
import { index, text, timestamp, varchar } from "drizzle-orm/pg-core"

import { dbPrefix } from "@/lib/constants"

import { categories } from "./categories"

export const subcategories = pgTable(
  "subcategories",
  {
    id: varchar("id", { length: 30 })
      .$defaultFn(() => createId())
      .primaryKey(),
    name: varchar("name", { length: 256 }).notNull().unique(),
    slug: varchar("slug", { length: 256 }).unique().notNull(),
    description: text("description"),
    categoryId: varchar("category_id", { length: 30 })
      .references(() => categories.id, { onDelete: "cascade" })
      .notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").default(sql`current_timestamp`),
  },
  (table) => ({
    subcategoriesCategoryIdIdx: index(
      `${dbPrefix}_subcategories_category_id_idx`
    ).on(table.categoryId),
  })
)

export const subcategoriesRelations = relations(subcategories, ({ one }) => ({
  category: one(categories, {
    fields: [subcategories.categoryId],
    references: [categories.id],
  }),
}))

export type Subcategory = typeof subcategories.$inferSelect
export type NewSubcategory = typeof subcategories.$inferInsert
