import type { Config } from "drizzle-kit"

export default {
  schema: "./src/db/schema.ts",
  connectionString:
    "mysql://3wbp4xqs1u46zvzytu87:pscale_pw_lUYuISXS7kqmigpmfW6bSMhnxb5lL8iNwcjXt4RN2Cz@aws.connect.psdb.cloud/skateshop?sslaccept=strict",
} satisfies Config
