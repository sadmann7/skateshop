import { pgTable } from "@/db/utils"
import { relations } from "drizzle-orm"
import { index, text, varchar } from "drizzle-orm/pg-core"

import { dbPrefix } from "@/lib/constants"
import { generateId } from "@/lib/id"

import { categories } from "./categories"
import { lifecycleDates } from "./utils"

export const subcategories = pgTable(
  "subcategories",
  {
    id: varchar("id", { length: 30 })
      .$defaultFn(() => generateId())
      .primaryKey(), // prefix_ + nanoid (12)
    name: varchar("name", { length: 256 }).notNull().unique(),
    slug: varchar("slug", { length: 256 }).unique().notNull(),
    description: text("description"),
    categoryId: varchar("category_id", { length: 30 })
      .references(() => categories.id, { onDelete: "cascade" })
      .notNull(),
    ...lifecycleDates,
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
