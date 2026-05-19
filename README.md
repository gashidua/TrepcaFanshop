# KB Trepca Fanshop

KB Trepca Fanshop është aplikacion full stack për menaxhimin e fan-shopit dhe biletave të klubit KB Trepça. Projekti përfshin një frontend modern në React/Vite, një API në Node.js/Express me PostgreSQL, si dhe versionin fillestar C#/.NET të ruajtur si referencë.

## Funksionalitetet

- autentikim për admin dhe user
- katalog produktesh me foto, kategori, çmime dhe stok
- produkte pa stok shfaqen te useri si `Nuk ka në stok`, pa ekspozuar numrin e stokut
- fanella me variante sipas numrit dhe lojtarit
- shportë, checkout dhe porosi
- biletat për ndeshje, bileta sezonale dhe vjetore
- QR kode për biletat e gjeneruara
- njoftime për porosi, blerje biletash dhe skanime QR me datë dhe orë
- badge i notifications pastrohet pasi useri i hap njoftimet
- panel admin për produkte, stok, ndeshje, bileta dhe porosi
- ndeshjet renditen automatikisht sipas datës dhe orës

## Tech Stack

- React 19
- Vite
- CSS custom responsive UI
- Node.js
- Express
- PostgreSQL / Neon
- JWT authentication
- Zod validation
- C#/.NET reference project

## Struktura

```text
backend/
  db/schema.sql
  src/db.js
  src/server.js
  src/validation.js
  src/scripts/initDb.js
  src/scripts/resetDb.js

frontend/
  index.html
  public/
  src/App.jsx
  src/api.js
  src/main.jsx
  src/styles.css

docs/
  architecture.md
  implementation.md
  sprint-plan.md
  sprint-report.md
```

## Setup

Instalo dependencies nga root i projektit:

```bash
npm install
```

Krijo env file për backend:

```bash
copy backend\.env.example backend\.env
```

Vendos `DATABASE_URL` në `backend/.env`.

Shembull lokal:

```text
DATABASE_URL=postgres://postgres:postgres@localhost:5432/trepca_fanshop
```

Shembull Neon:

```text
DATABASE_URL=postgresql://USER:PASSWORD@HOST/DBNAME?sslmode=require
```

Inicializo databazën:

```bash
npm run db:init
```

Nëse duhet ta rifillosh databazën nga e para:

```bash
npm run db:reset
```

Nise backend-in dhe frontend-in bashkë:

```bash
npm run dev
```

Ose ndaras:

```bash
npm run dev:backend
npm run dev:frontend
```

URL-të default:

- Frontend: `http://localhost:5173`
- Backend API: `http://localhost:4000/api`

## Demo Logins

Pas inicializimit të databazës:

```text
Admin: admin@trepca.com / admin123
User: user@trepca.com / user123
```

Në versionin frontend/localStorage përdoren po të njëjtat llogari demo.

## API Endpoints

Auth:

- `POST /api/auth/login`
- `POST /api/auth/register`
- `GET /api/auth/me`

Products:

- `GET /api/products`
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

Health:

- `GET /api/health`

## Shënime

Frontend-i ruan disa rrjedha demo në `localStorage`, që e bën të lehtë testimin e shpejtë në browser. Backend-i është gati për ruajtje reale me PostgreSQL/Neon.

Branding-u është ndërtuar rreth KB Trepça, fan-shopit, ndeshjeve dhe eksperiencës së tifozëve në Minatori.
