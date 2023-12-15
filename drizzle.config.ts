import { Config } from "drizzle-kit";
import * as dotenv from "dotenv-flow";
dotenv.config();

if (!process.env.DATABASE_URL)
  throw new Error("DATABASE_URL not set in environment");

export default {
  schema: "./src/db/schema.ts",
  out: "./drizzle",
  driver: "pg",
  dbCredentials: {
    connectionString: process.env.DATABASE_URL,
  },
} satisfies Config;
