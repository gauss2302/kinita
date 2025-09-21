import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";
import { schema } from "./schema";

const connectionString =
  process.env.DATABASE_URL ||
  "postgresql://postgres:mypassword@localhost:5432/postgres";

export const client = postgres(connectionString, {
  max: 10,
  idle_timeout: 20,
  connect_timeout: 10,
});

export const db = drizzle(client, { schema });
