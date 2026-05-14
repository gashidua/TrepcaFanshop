import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import bcrypt from "bcryptjs";
import { pool } from "../db.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const resetPath = path.resolve(__dirname, "../../db/reset.sql");
const schemaPath = path.resolve(__dirname, "../../db/schema.sql");

try {
  await pool.query(await fs.readFile(resetPath, "utf8"));
  await pool.query(await fs.readFile(schemaPath, "utf8"));

  const adminHash = await bcrypt.hash("admin123", 10);
  const userHash = await bcrypt.hash("user123", 10);

  await pool.query(
    `INSERT INTO users (name, email, password_hash, role)
     VALUES
       ('Admin', 'admin@trepca.com', $1, 'admin'),
       ('User', 'user@trepca.com', $2, 'user')`,
    [adminHash, userHash]
  );

  console.log("Database reset, seeded products, and demo users created.");
  console.log("Admin login: admin@trepca.com / admin123");
  console.log("User login: user@trepca.com / user123");
} finally {
  await pool.end();
}
