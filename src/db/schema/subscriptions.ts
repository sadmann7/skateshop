import { createId, pgTable } from "@/db/utils"
import { sql } from "drizzle-orm"
import { timestamp, varchar } from "drizzle-orm/pg-core"

export const subscriptions = pgTable("subscriptions", {
  id: varchar("id", { length: 30 })
    .$defaultFn(() => createId())
    .primaryKey(), // prefix_ (if ocd kicks in) + nanoid (16)
  userId: varchar("user_id", { length: 36 }), // uuid v4
  stripeSubscriptionId: varchar("stripe_subscription_id", { length: 256 }),
  stripePriceId: varchar("stripe_price_id", { length: 256 }),
  stripeCustomerId: varchar("stripe_customer_id", { length: 256 }),
  stripeCurrentPeriodEnd: timestamp("stripe_current_period_end"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").default(sql`current_timestamp`),
})

export type Subscription = typeof subscriptions.$inferSelect
export type NewSubscription = typeof subscriptions.$inferInsert
