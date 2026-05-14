# KB Trepca Fanshop

KB Trepca Fanshop is now structured as a full stack application for the basketball club's supporter shop:

- `backend/` - Node.js, Express, PostgreSQL/Neon API
- `frontend/` - React + Vite user interface
- existing C#/.NET files - kept as the original project/reference implementation

The new full stack version supports login, role-based access, basketball merchandise, tickets, product and stock management, cart checkout, orders, and PostgreSQL persistence.

## Tech Stack

- Node.js
- Express
- PostgreSQL locally or Neon in the cloud
- React
- Vite
- CSS responsive layout

## Project Structure

```text
backend/
  db/schema.sql
  src/db.js
  src/server.js
  src/validation.js
  src/scripts/initDb.js

frontend/
  index.html
  src/App.jsx
  src/api.js
  src/main.jsx
  src/styles.css
```

## Setup

Install dependencies from the repository root:

```bash
npm install
```

Create backend environment file:

```bash
copy backend\.env.example backend\.env
```

Set `DATABASE_URL` in `backend/.env`.

Local PostgreSQL example:

```text
DATABASE_URL=postgres://postgres:postgres@localhost:5432/trepca_fanshop
```

Neon example:

```text
DATABASE_URL=postgresql://USER:PASSWORD@HOST/DBNAME?sslmode=require
```

Create frontend environment file:

```bash
copy frontend\.env.example frontend\.env
```

Initialize database tables and seed products:

```bash
npm run db:init
```

If you already initialized an older database version, reset it to create users, orders, and the new cart structure:

```bash
npm run db:reset
```

Run backend and frontend together:

```bash
npm run dev
```

Or run them separately:

```bash
npm run dev:backend
npm run dev:frontend
```

Default URLs:

- Frontend: `http://localhost:5173`
- Backend API: `http://localhost:4000/api`

## API Endpoints

Auth:

- `POST /api/auth/login`
- `POST /api/auth/register`
- `GET /api/auth/me`

Products:

- `GET /api/products`
- `GET /api/products?search=jersey`
- `GET /api/products?category=Jerseys`
- `GET /api/products?minPrice=20`
- `GET /api/products/stats`
- `GET /api/products/:id`
- `POST /api/products`
- `PUT /api/products/:id`
- `DELETE /api/products/:id`

Cart:

- `GET /api/cart`
- `POST /api/cart`
- `PUT /api/cart/:id`
- `DELETE /api/cart/:id`

Orders:

- `GET /api/orders`
- `POST /api/orders`
- `PUT /api/orders/:id/status`

Health check:

- `GET /api/health`

## Demo Logins

After running `npm run db:init` or `npm run db:reset`, you can use:

```text
Admin: admin@trepca.com / admin123
User: user@trepca.com / user123
```

Admin can add, edit, and delete products, see stock stats, and manage all orders.

User can browse tickets, jerseys, merchandise, add items to basket, place orders, and see personal orders.

## Notes

The old ASP.NET Core Swagger project is still in the repository, but the full stack app is the Node/React/PostgreSQL version inside `backend/` and `frontend/`.

The branding is aligned with KB Trepca as a basketball club from Mitrovica and its official website: `https://kbtrepca.com/`.
