import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

import * as schema from "@repo/database/schemas";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL!,
  ssl:
    process.env.NODE_ENV === "production"
      ? { rejectUnauthorized: false }
      : false,
  // Vercel serverless optimization
  max: 1,
  idleTimeoutMillis: 0,
  connectionTimeoutMillis: 0
});

export const db = drizzle({ client: pool, schema });
