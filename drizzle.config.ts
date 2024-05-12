import { env } from "@/env.js"
import { type Config } from "drizzle-kit"

import { dbPrefix } from "@/lib/constants"

export default {
  schema: "./src/db/schema/index.ts",
  dialect: "postgresql",
  out: "./drizzle",
  dbCredentials: {
    url: env.DATABASE_URL,
  },
  tablesFilter: [`${dbPrefix}_*`],
} satisfies Config
