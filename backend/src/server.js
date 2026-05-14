import bcrypt from "bcryptjs";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import helmet from "helmet";
import jwt from "jsonwebtoken";
import morgan from "morgan";
import { pool, query } from "./db.js";
import { cartItemSchema, loginSchema, orderStatusSchema, productSchema, registerSchema } from "./validation.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 4000;
const jwtSecret = process.env.JWT_SECRET || "dev-secret";

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

const toUser = (row) => ({
  id: row.id,
  name: row.name,
  email: row.email,
  role: row.role
});

function signToken(user) {
  return jwt.sign(toUser(user), jwtSecret, { expiresIn: "7d" });
}

function requireAuth(req, res, next) {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : "";

  if (!token) return res.status(401).json({ message: "Login required" });

  try {
    req.user = jwt.verify(token, jwtSecret);
    return next();
  } catch {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
}

function requireAdmin(req, res, next) {
  if (req.user?.role !== "admin") return res.status(403).json({ message: "Admin access required" });
  return next();
}

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", service: "KB Trepca Fanshop API" });
});

app.post("/api/auth/login", async (req, res, next) => {
  try {
    const credentials = loginSchema.parse(req.body);
    const result = await query("SELECT * FROM users WHERE email = $1", [credentials.email]);
    const user = result.rows[0];

    if (!user || !(await bcrypt.compare(credentials.password, user.password_hash))) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    return res.json({ token: signToken(user), user: toUser(user) });
  } catch (error) {
    return next(error);
  }
});

app.post("/api/auth/register", async (req, res, next) => {
  try {
    const payload = registerSchema.parse(req.body);
    const passwordHash = await bcrypt.hash(payload.password, 10);
    const result = await query(
      `INSERT INTO users (name, email, password_hash, role)
       VALUES ($1, $2, $3, 'user')
       RETURNING id, name, email, role`,
      [payload.name, payload.email, passwordHash]
    );
    const user = result.rows[0];
    return res.status(201).json({ token: signToken(user), user });
  } catch (error) {
    if (error?.code === "23505") return res.status(409).json({ message: "Email already exists" });
    return next(error);
  }
});

app.get("/api/auth/me", requireAuth, (req, res) => {
  res.json({ user: req.user });
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

app.get("/api/products/stats", requireAuth, requireAdmin, async (_req, res, next) => {
  try {
    const result = await query(
      `SELECT
        COUNT(*)::int AS count,
        COALESCE(SUM(price * stock), 0)::numeric AS inventory_value,
        COALESCE(AVG(price), 0)::numeric AS average,
        COALESCE(MIN(price), 0)::numeric AS min,
        COALESCE(MAX(price), 0)::numeric AS max
       FROM products`
    );
    const stats = result.rows[0];
    res.json({
      count: stats.count,
      inventoryValue: Number(stats.inventory_value),
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

app.post("/api/products", requireAuth, requireAdmin, async (req, res, next) => {
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

app.put("/api/products/:id", requireAuth, requireAdmin, async (req, res, next) => {
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

app.delete("/api/products/:id", requireAuth, requireAdmin, async (req, res, next) => {
  try {
    const result = await query("DELETE FROM products WHERE id = $1 RETURNING id", [req.params.id]);
    if (!result.rowCount) return res.status(404).json({ message: "Product not found" });
    return res.status(204).send();
  } catch (error) {
    return next(error);
  }
});

app.get("/api/cart", requireAuth, async (req, res, next) => {
  try {
    const cart = await getCart(req.user.id);
    res.json(cart);
  } catch (error) {
    next(error);
  }
});

app.post("/api/cart", requireAuth, async (req, res, next) => {
  try {
    const item = cartItemSchema.parse(req.body);
    const product = await query("SELECT stock FROM products WHERE id = $1", [item.productId]);
    if (!product.rowCount) return res.status(404).json({ message: "Product not found" });
    if (product.rows[0].stock < item.quantity) return res.status(400).json({ message: "Not enough stock" });

    const result = await query(
      `INSERT INTO cart_items (user_id, product_id, quantity)
       VALUES ($1, $2, $3)
       ON CONFLICT (user_id, product_id)
       DO UPDATE SET quantity = cart_items.quantity + EXCLUDED.quantity, updated_at = NOW()
       RETURNING *`,
      [req.user.id, item.productId, item.quantity]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    next(error);
  }
});

app.put("/api/cart/:id", requireAuth, async (req, res, next) => {
  try {
    const quantity = Number(req.body.quantity);
    if (!Number.isInteger(quantity) || quantity <= 0) {
      return res.status(400).json({ message: "Quantity must be a positive integer" });
    }

    const result = await query(
      `UPDATE cart_items
       SET quantity = $1, updated_at = NOW()
       WHERE id = $2 AND user_id = $3
       RETURNING *`,
      [quantity, req.params.id, req.user.id]
    );
    if (!result.rowCount) return res.status(404).json({ message: "Cart item not found" });
    return res.json(result.rows[0]);
  } catch (error) {
    return next(error);
  }
});

app.delete("/api/cart/:id", requireAuth, async (req, res, next) => {
  try {
    const result = await query("DELETE FROM cart_items WHERE id = $1 AND user_id = $2 RETURNING id", [
      req.params.id,
      req.user.id
    ]);
    if (!result.rowCount) return res.status(404).json({ message: "Cart item not found" });
    return res.status(204).send();
  } catch (error) {
    return next(error);
  }
});

app.post("/api/orders", requireAuth, async (req, res, next) => {
  const connection = await pool.connect();

  try {
    await connection.query("BEGIN");
    const cartResult = await connection.query(
      `SELECT ci.quantity, p.id AS product_id, p.name, p.price, p.stock
       FROM cart_items ci
       JOIN products p ON p.id = ci.product_id
       WHERE ci.user_id = $1
       ORDER BY ci.id`,
      [req.user.id]
    );

    if (!cartResult.rowCount) {
      await connection.query("ROLLBACK");
      return res.status(400).json({ message: "Cart is empty" });
    }

    for (const item of cartResult.rows) {
      if (item.stock < item.quantity) {
        await connection.query("ROLLBACK");
        return res.status(400).json({ message: `${item.name} does not have enough stock` });
      }
    }

    const total = cartResult.rows.reduce((sum, item) => sum + Number(item.price) * item.quantity, 0);
    const orderResult = await connection.query(
      `INSERT INTO orders (user_id, customer_name, customer_email, total)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [req.user.id, req.user.name, req.user.email, total]
    );
    const order = orderResult.rows[0];

    for (const item of cartResult.rows) {
      await connection.query(
        `INSERT INTO order_items (order_id, product_id, product_name, quantity, unit_price)
         VALUES ($1, $2, $3, $4, $5)`,
        [order.id, item.product_id, item.name, item.quantity, item.price]
      );
      await connection.query("UPDATE products SET stock = stock - $1, updated_at = NOW() WHERE id = $2", [
        item.quantity,
        item.product_id
      ]);
    }

    await connection.query("DELETE FROM cart_items WHERE user_id = $1", [req.user.id]);
    await connection.query("COMMIT");

    return res.status(201).json(await getOrder(order.id));
  } catch (error) {
    await connection.query("ROLLBACK");
    return next(error);
  } finally {
    connection.release();
  }
});

app.get("/api/orders", requireAuth, async (req, res, next) => {
  try {
    const orders = req.user.role === "admin" ? await getOrders() : await getOrders(req.user.id);
    res.json(orders);
  } catch (error) {
    next(error);
  }
});

app.put("/api/orders/:id/status", requireAuth, requireAdmin, async (req, res, next) => {
  try {
    const { status } = orderStatusSchema.parse(req.body);
    const result = await query("UPDATE orders SET status = $1 WHERE id = $2 RETURNING id", [status, req.params.id]);
    if (!result.rowCount) return res.status(404).json({ message: "Order not found" });
    return res.json(await getOrder(req.params.id));
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

async function getCart(userId) {
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
     WHERE ci.user_id = $1
     ORDER BY ci.id DESC`,
    [userId]
  );
  const items = result.rows.map((row) => ({
    id: row.cart_item_id,
    quantity: row.quantity,
    product: toProduct({ ...row, id: row.product_id })
  }));
  const total = items.reduce((sum, item) => sum + item.quantity * item.product.price, 0);
  return { items, total };
}

async function getOrders(userId) {
  const orderResult = await query(
    `SELECT *
     FROM orders
     ${userId ? "WHERE user_id = $1" : ""}
     ORDER BY created_at DESC`,
    userId ? [userId] : []
  );

  return Promise.all(orderResult.rows.map((order) => getOrder(order.id)));
}

async function getOrder(orderId) {
  const orderResult = await query("SELECT * FROM orders WHERE id = $1", [orderId]);
  const order = orderResult.rows[0];
  const itemResult = await query("SELECT * FROM order_items WHERE order_id = $1 ORDER BY id", [orderId]);

  return {
    id: order.id,
    customerName: order.customer_name,
    customerEmail: order.customer_email,
    status: order.status,
    total: Number(order.total),
    createdAt: order.created_at,
    items: itemResult.rows.map((item) => ({
      id: item.id,
      productId: item.product_id,
      productName: item.product_name,
      quantity: item.quantity,
      unitPrice: Number(item.unit_price)
    }))
  };
}

app.listen(port, () => {
  console.log(`KB Trepca Fanshop API running on http://localhost:${port}`);
});
