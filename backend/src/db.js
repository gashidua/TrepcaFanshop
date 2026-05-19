import dotenv from "dotenv";
import pg from "pg";

dotenv.config();

const { Pool } = pg;

if (!process.env.DATABASE_URL) {
  console.warn("DATABASE_URL is not set. Copy backend/.env.example to backend/.env and add PostgreSQL or Neon connection string.");
}

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_URL?.includes("neon.tech")
    ? { rejectUnauthorized: false }
    : undefined
});

export async function query(text, params) {
  const result = await pool.query(text, params);
  return result;
}
