import { pgTable, text, varchar } from "drizzle-orm/pg-core"

import { generateId } from "@/lib/id"

import { lifecycleDates } from "./utils"

// @see: https://github.com/jackblatch/OneStopShop/blob/main/db/schema.ts
export const addresses = pgTable("addresses", {
  id: varchar("id", { length: 30 })
    .$defaultFn(() => generateId())
    .primaryKey(), // prefix_ + nanoid (12)
  line1: text("line1"),
  line2: text("line2"),
  city: text("city"),
  state: text("state"),
  postalCode: text("postal_code"),
  country: text("country"),
  ...lifecycleDates,
})

export type Address = typeof addresses.$inferSelect
export type NewAddress = typeof addresses.$inferInsert
