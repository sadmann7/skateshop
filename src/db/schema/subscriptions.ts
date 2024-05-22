import { pgTable } from "@/db/utils"
import { timestamp, varchar } from "drizzle-orm/pg-core"

import { generateId } from "@/lib/id"

import { lifecycleDates } from "./utils"

export const subscriptions = pgTable("subscriptions", {
  id: varchar("id", { length: 30 })
    .$defaultFn(() => generateId())
    .primaryKey(), // prefix_ + nanoid (12)
  userId: varchar("user_id", { length: 36 }), // uuid v4
  stripeSubscriptionId: varchar("stripe_subscription_id", { length: 256 }),
  stripePriceId: varchar("stripe_price_id", { length: 256 }),
  stripeCustomerId: varchar("stripe_customer_id", { length: 256 }),
  stripeCurrentPeriodEnd: timestamp("stripe_current_period_end"),
  ...lifecycleDates,
})

export type Subscription = typeof subscriptions.$inferSelect
export type NewSubscription = typeof subscriptions.$inferInsert
