import { pgTable } from "@/db/utils"
import { boolean, varchar } from "drizzle-orm/pg-core"

import { generateId } from "@/lib/id"

import { lifecycleDates } from "./utils"

export const notifications = pgTable("notifications", {
  id: varchar("id", { length: 30 })
    .$defaultFn(() => generateId())
    .primaryKey(), // prefix_ + nanoid (12)
  userId: varchar("user_id", { length: 36 }), // uuid v4
  email: varchar("email", { length: 256 }).notNull().unique(),
  token: varchar("token", { length: 256 }).notNull().unique(),
  referredBy: varchar("referred_by", { length: 256 }),
  communication: boolean("communication").default(false).notNull(),
  newsletter: boolean("newsletter").default(false).notNull(),
  marketing: boolean("marketing").default(false).notNull(),
  ...lifecycleDates,
})

export type Notification = typeof notifications.$inferSelect
export type NewNotification = typeof notifications.$inferInsert
