CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('admin', 'user')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS products (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  price NUMERIC(10, 2) NOT NULL CHECK (price > 0),
  category TEXT NOT NULL,
  type TEXT DEFAULT '',
  size TEXT DEFAULT '',
  stock INTEGER NOT NULL DEFAULT 0 CHECK (stock >= 0),
  image_url TEXT DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS cart_items (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  product_id INTEGER NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (user_id, product_id)
);

CREATE TABLE IF NOT EXISTS orders (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'completed', 'cancelled')),
  total NUMERIC(10, 2) NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS order_items (
  id SERIAL PRIMARY KEY,
  order_id INTEGER NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id INTEGER NOT NULL REFERENCES products(id),
  product_name TEXT NOT NULL,
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  unit_price NUMERIC(10, 2) NOT NULL CHECK (unit_price > 0)
);

INSERT INTO products (name, price, category, type, size, stock, image_url)
SELECT *
FROM (
  VALUES
    ('KB Trepca Home Jersey', 44.99, 'Jerseys', 'Home', 'M', 20, 'https://images.unsplash.com/photo-1519861531473-9200262188bf?auto=format&fit=crop&w=900&q=80'),
    ('KB Trepca Away Jersey', 44.99, 'Jerseys', 'Away', 'L', 16, 'https://images.unsplash.com/photo-1546519638-68e109498ffc?auto=format&fit=crop&w=900&q=80'),
    ('Minatori Arena Hoodie', 36.90, 'Hoodies', 'Supporter', 'XL', 18, 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&w=900&q=80'),
    ('KB Trepca Fan Scarf', 14.99, 'Accessories', 'Matchday', 'One size', 45, 'https://images.unsplash.com/photo-1520903920243-00d872a2d1c9?auto=format&fit=crop&w=900&q=80'),
    ('Trepca Basketball', 24.99, 'Equipment', 'Training', '7', 12, 'https://images.unsplash.com/photo-1546519638-68e109498ffc?auto=format&fit=crop&w=900&q=80'),
    ('Season Ticket', 59.99, 'Tickets', 'Regular season', 'Adult', 80, 'https://images.unsplash.com/photo-1574623452334-1e0ac2b3ccb4?auto=format&fit=crop&w=900&q=80'),
    ('Matchday Ticket', 5.00, 'Tickets', 'Single game', 'Adult', 120, 'https://images.unsplash.com/photo-1518063319789-7217e6706b04?auto=format&fit=crop&w=900&q=80')
) AS seed(name, price, category, type, size, stock, image_url)
WHERE NOT EXISTS (SELECT 1 FROM products);
