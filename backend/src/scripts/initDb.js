import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import bcrypt from "bcryptjs";
import { pool } from "../db.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const schemaPath = path.resolve(__dirname, "../../db/schema.sql");

try {
  const schema = await fs.readFile(schemaPath, "utf8");
  await pool.query(schema);
  await seedUsers();
  console.log("Database schema initialized.");
} finally {
  await pool.end();
}

async function seedUsers() {
  const adminHash = await bcrypt.hash("admin123", 10);
  const userHash = await bcrypt.hash("user123", 10);

  await pool.query(
    `INSERT INTO users (name, email, password_hash, role)
     VALUES
       ('Admin', 'admin@trepca.com', $1, 'admin'),
       ('User', 'user@trepca.com', $2, 'user')
     ON CONFLICT (email) DO NOTHING`,
    [adminHash, userHash]
  );
}
