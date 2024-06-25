import { boolean, pgTable, text, varchar } from "drizzle-orm/pg-core"

import { generateId } from "@/lib/id"

import { lifecycleDates } from "./utils"

export const notifications = pgTable("notifications", {
  id: varchar("id", { length: 30 })
    .$defaultFn(() => generateId())
    .primaryKey(), // prefix_ + nanoid (12)
  userId: varchar("user_id", { length: 36 }), // uuid v4
  email: text("email").notNull().unique(),
  token: text("token").notNull().unique(),
  referredBy: text("referred_by"),
  communication: boolean("communication").default(false).notNull(),
  newsletter: boolean("newsletter").default(false).notNull(),
  marketing: boolean("marketing").default(false).notNull(),
  ...lifecycleDates,
})

export type Notification = typeof notifications.$inferSelect
export type NewNotification = typeof notifications.$inferInsert
