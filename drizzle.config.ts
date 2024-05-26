import { env } from "@/env.js"
import { type Config } from "drizzle-kit"

export default {
  schema: "./src/db/schema/index.ts",
  dialect: "postgresql",
  out: "./drizzle",
  dbCredentials: {
    url: env.DATABASE_URL,
  },
} satisfies Config
