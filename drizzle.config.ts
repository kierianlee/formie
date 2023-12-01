import { Config } from "drizzle-kit";
import * as dotenv from "dotenv-flow";
dotenv.config();

if (!process.env.DATABASE_URI)
  throw new Error("DATABASE_HOST not set in environment");

export default {
  schema: "./src/db/schema.ts",
  out: "./drizzle",
  driver: "mysql2",
  dbCredentials: {
    uri: process.env.DATABASE_URI,
  },
} satisfies Config;
