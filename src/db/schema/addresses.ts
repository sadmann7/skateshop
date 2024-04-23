import { pgTable } from "@/db/utils"
import { sql } from "drizzle-orm"
import { timestamp, varchar } from "drizzle-orm/pg-core"

import { generateId } from "@/lib/id"

// @see: https://github.com/jackblatch/OneStopShop/blob/main/db/schema.ts
export const addresses = pgTable("addresses", {
  id: varchar("id", { length: 30 })
    .$defaultFn(() => generateId())
    .primaryKey(), // prefix_ (if ocd kicks in) + nanoid (16)
  line1: varchar("line1", { length: 256 }),
  line2: varchar("line2", { length: 256 }),
  city: varchar("city", { length: 256 }),
  state: varchar("state", { length: 256 }),
  postalCode: varchar("postal_code", { length: 256 }),
  country: varchar("country", { length: 256 }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").default(sql`current_timestamp`),
})

export type Address = typeof addresses.$inferSelect
export type NewAddress = typeof addresses.$inferInsert
