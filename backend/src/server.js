import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import { query } from "./db.js";
import { cartItemSchema, productSchema } from "./validation.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 4000;

app.use(helmet());
app.use(cors({ origin: process.env.CLIENT_ORIGIN || "http://localhost:5173" }));
app.use(express.json());
app.use(morgan("dev"));

const toProduct = (row) => ({
  id: row.id,
  name: row.name,
  price: Number(row.price),
  category: row.category,
  type: row.type,
  size: row.size,
  stock: row.stock,
  imageUrl: row.image_url,
  createdAt: row.created_at,
  updatedAt: row.updated_at
});

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", service: "Trepca Fanshop API" });
});

app.get("/api/products", async (req, res, next) => {
  try {
    const { search = "", category = "", minPrice = "" } = req.query;
    const where = [];
    const params = [];

    if (search) {
      params.push(search);
      where.push(`(LOWER(name) LIKE LOWER('%' || $${params.length} || '%') OR LOWER(category) LIKE LOWER('%' || $${params.length} || '%'))`);
    }

    if (category) {
      params.push(category);
      where.push(`category = $${params.length}`);
    }

    if (minPrice) {
      params.push(Number(minPrice));
      where.push(`price >= $${params.length}`);
    }

    const result = await query(
      `SELECT *
       FROM products
       ${where.length ? `WHERE ${where.join(" AND ")}` : ""}
       ORDER BY id DESC`,
      params
    );

    res.json(result.rows.map(toProduct));
  } catch (error) {
    next(error);
  }
});

app.get("/api/products/stats", async (_req, res, next) => {
  try {
    const result = await query(
      `SELECT
        COUNT(*)::int AS count,
        COALESCE(SUM(price), 0)::numeric AS total,
        COALESCE(AVG(price), 0)::numeric AS average,
        COALESCE(MIN(price), 0)::numeric AS min,
        COALESCE(MAX(price), 0)::numeric AS max
       FROM products`
    );
    const stats = result.rows[0];
    res.json({
      count: stats.count,
      total: Number(stats.total),
      average: Number(stats.average),
      min: Number(stats.min),
      max: Number(stats.max)
    });
  } catch (error) {
    next(error);
  }
});

app.get("/api/products/:id", async (req, res, next) => {
  try {
    const result = await query("SELECT * FROM products WHERE id = $1", [req.params.id]);
    if (!result.rowCount) return res.status(404).json({ message: "Product not found" });
    return res.json(toProduct(result.rows[0]));
  } catch (error) {
    return next(error);
  }
});

app.post("/api/products", async (req, res, next) => {
  try {
    const product = productSchema.parse(req.body);
    const result = await query(
      `INSERT INTO products (name, price, category, type, size, stock, image_url)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
      [product.name, product.price, product.category, product.type, product.size, product.stock, product.imageUrl]
    );
    res.status(201).json(toProduct(result.rows[0]));
  } catch (error) {
    next(error);
  }
});

app.put("/api/products/:id", async (req, res, next) => {
  try {
    const product = productSchema.parse(req.body);
    const result = await query(
      `UPDATE products
       SET name = $1, price = $2, category = $3, type = $4, size = $5, stock = $6, image_url = $7, updated_at = NOW()
       WHERE id = $8
       RETURNING *`,
      [product.name, product.price, product.category, product.type, product.size, product.stock, product.imageUrl, req.params.id]
    );
    if (!result.rowCount) return res.status(404).json({ message: "Product not found" });
    return res.json(toProduct(result.rows[0]));
  } catch (error) {
    return next(error);
  }
});

app.delete("/api/products/:id", async (req, res, next) => {
  try {
    const result = await query("DELETE FROM products WHERE id = $1 RETURNING id", [req.params.id]);
    if (!result.rowCount) return res.status(404).json({ message: "Product not found" });
    return res.status(204).send();
  } catch (error) {
    return next(error);
  }
});

app.get("/api/cart", async (_req, res, next) => {
  try {
    const result = await query(
      `SELECT
         ci.id AS cart_item_id,
         ci.quantity,
         p.id AS product_id,
         p.name,
         p.price,
         p.category,
         p.type,
         p.size,
         p.stock,
         p.image_url,
         p.created_at,
         p.updated_at
       FROM cart_items ci
       JOIN products p ON p.id = ci.product_id
       ORDER BY ci.id DESC`
    );
    const items = result.rows.map((row) => ({
      id: row.cart_item_id,
      quantity: row.quantity,
      product: toProduct({ ...row, id: row.product_id })
    }));
    const total = items.reduce((sum, item) => sum + item.quantity * item.product.price, 0);
    res.json({ items, total });
  } catch (error) {
    next(error);
  }
});

app.post("/api/cart", async (req, res, next) => {
  try {
    const item = cartItemSchema.parse(req.body);
    const result = await query(
      `INSERT INTO cart_items (product_id, quantity)
       VALUES ($1, $2)
       ON CONFLICT (product_id)
       DO UPDATE SET quantity = cart_items.quantity + EXCLUDED.quantity, updated_at = NOW()
       RETURNING *`,
      [item.productId, item.quantity]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    next(error);
  }
});

app.put("/api/cart/:id", async (req, res, next) => {
  try {
    const quantity = Number(req.body.quantity);
    if (!Number.isInteger(quantity) || quantity <= 0) {
      return res.status(400).json({ message: "Quantity must be a positive integer" });
    }
    const result = await query("UPDATE cart_items SET quantity = $1, updated_at = NOW() WHERE id = $2 RETURNING *", [
      quantity,
      req.params.id
    ]);
    if (!result.rowCount) return res.status(404).json({ message: "Cart item not found" });
    return res.json(result.rows[0]);
  } catch (error) {
    return next(error);
  }
});

app.delete("/api/cart/:id", async (req, res, next) => {
  try {
    const result = await query("DELETE FROM cart_items WHERE id = $1 RETURNING id", [req.params.id]);
    if (!result.rowCount) return res.status(404).json({ message: "Cart item not found" });
    return res.status(204).send();
  } catch (error) {
    return next(error);
  }
});

app.use((error, _req, res, _next) => {
  if (error?.name === "ZodError") {
    return res.status(400).json({ message: "Validation failed", errors: error.errors });
  }

  console.error(error);
  return res.status(500).json({ message: "Something went wrong" });
});

app.listen(port, () => {
  console.log(`Trepca Fanshop API running on http://localhost:${port}`);
});
