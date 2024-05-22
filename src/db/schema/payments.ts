import { pgTable } from "@/db/utils"
import { relations } from "drizzle-orm"
import { boolean, index, integer, varchar } from "drizzle-orm/pg-core"

import { dbPrefix } from "@/lib/constants"
import { generateId } from "@/lib/id"

import { stores } from "./stores"
import { lifecycleDates } from "./utils"

// @see: https://github.com/jackblatch/OneStopShop/blob/main/db/schema.ts
export const payments = pgTable(
  "payments",
  {
    id: varchar("id", { length: 30 })
      .$defaultFn(() => generateId())
      .primaryKey(), // prefix_ + nanoid (12)
    storeId: varchar("store_id", { length: 30 })
      .references(() => stores.id, { onDelete: "cascade" })
      .notNull(),
    stripeAccountId: varchar("stripe_account_id", { length: 256 }).notNull(),
    stripeAccountCreatedAt: integer("stripe_account_created_at"),
    stripeAccountExpiresAt: integer("stripe_account_expires_at"),
    detailsSubmitted: boolean("details_submitted").notNull().default(false),
    ...lifecycleDates,
  },
  (table) => ({
    storeIdIdx: index(`${dbPrefix}_payments_store_id_idx`).on(table.storeId),
  })
)

export const paymentsRelations = relations(payments, ({ one }) => ({
  store: one(stores, { fields: [payments.storeId], references: [stores.id] }),
}))

export type Payment = typeof payments.$inferSelect
export type NewPayment = typeof payments.$inferInsert
