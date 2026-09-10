# DawoStock — Pharmacy Inventory Management System (Somalia)

Enterprise-grade inventory, sales, expiry, and reporting platform for pharmacies in Somalia. Built with React, Express, MongoDB, JWT, and role-based access.

**Stack:** React.js + Vite · Node.js + Express · MongoDB Atlas + Mongoose · JWT · Tailwind CSS · Context API · Recharts · Lucide React

---

## Folder structure

```
pharmacy/
├── backend/
│   ├── config/              # DB connection, app config
│   ├── controllers/         # HTTP handlers
│   ├── middleware/          # Auth, RBAC, validation, uploads, errors
│   ├── models/              # Mongoose schemas
│   ├── routes/              # REST routers
│   ├── services/            # Stock, notifications, reports
│   ├── utils/               # JWT, pagination, CSV/Excel/PDF export
│   ├── uploads/logos
│   ├── uploads/reports
│   ├── server.js
│   ├── seed.js
│   └── .env
├── frontend/
│   └── src/
│       ├── components/
│       ├── pages/
│       ├── layouts/
│       ├── services/
│       ├── hooks/
│       ├── context/
│       ├── routes/
│       ├── assets/
│       └── App.jsx
└── README.md
```

---

## Database relationships

```
User ──────── performs ──────► InventoryLog
  │                                  │
  │ soldBy                           │ medicine
  ▼                                  ▼
Sale ──1:1── Invoice            Medicine ──N:1── Supplier
  │                                  │
  └── items.medicine ────────────────┘

Notification ──► Medicine | Sale
Settings (singleton)
```

| Collection       | Purpose                                      |
|------------------|----------------------------------------------|
| Users            | Admin, pharmacist, staff accounts            |
| Medicines        | Lots (batch, expiry, qty, prices)            |
| Suppliers        | Wholesalers                                  |
| InventoryLogs    | Stock in/out/transfer/sale audit trail       |
| Sales            | POS transactions                             |
| Invoices         | Printable invoice snapshot per sale          |
| Notifications    | Low stock, expiry, sales alerts              |
| Settings         | Pharmacy profile, tax, currency, alerts      |

---

## MongoDB / Mongoose schemas (summary)

**User:** name, email (unique), password (bcrypt, hidden), role (`admin` | `pharmacist` | `staff`), phone, isActive, lastLogin

**Medicine:** name, genericName, brandName, category, batchNumber, supplier (ObjectId), purchasePrice, sellingPrice, quantity, minStockLevel, expiryDate, manufacturingDate, barcode, description, location, status

**Supplier:** name, phone, email, address, city, notes, isActive

**Sale:** invoiceNumber, customerName, customerPhone, items[], subtotal, tax, discount, totalAmount, paymentMethod (`cash` | `card` | `evc_plus` | `zaad` | `sahal` | `bank_transfer`), soldBy, date

**Invoice:** invoiceNumber, sale, customer, line items, totals, pharmacy snapshot, currency, date

**Notification:** type, title, message, severity, isRead, relatedMedicine, relatedSale

**InventoryLog:** medicine, type (`in` | `out` | `transfer` | `adjustment` | `sale` | `return`), quantities, locations, performedBy

**Settings:** pharmacyName, logo, address, taxRate, currency (`USD` | `SOS`), expiryAlertDays `[30, 60, 90]`

---

## Quick start

### 1. Prerequisites

- Node.js 18+
- MongoDB Atlas cluster **or** local MongoDB (`mongodb://127.0.0.1:27017`)

### 2. Configure environment

```bash
cd backend
copy .env.example .env
```

Set `MONGO_URI` to your Atlas string, for example:

```
MONGO_URI=mongodb+srv://USER:PASS@cluster0.xxxxx.mongodb.net/dawostock?retryWrites=true&w=majority
JWT_SECRET=<long random string>
CLIENT_URL=http://localhost:5173
PORT=5000
```

### 3. Install and seed

```bash
cd backend && npm install && npm run seed
cd ../frontend && npm install
```

Demo accounts (after seed):

| Role        | Email                     | Password    |
|-------------|---------------------------|-------------|
| Admin       | admin@pharmacy.so         | Admin@123   |
| Pharmacist  | pharmacist@pharmacy.so    | Pharma@123  |
| Staff       | staff@pharmacy.so         | Staff@123   |

### 4. Run

```bash
# terminal 1
cd backend && npm run dev

# terminal 2
cd frontend && npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

---

## REST API

Base URL: `http://localhost:5000/api`  
Auth header: `Authorization: Bearer <JWT>`

### Authentication

| Method | Path | Access | Description |
|--------|------|--------|-------------|
| POST | `/auth/login` | Public | Login, returns JWT + user |
| POST | `/auth/register` | Admin | Create user |
| GET | `/auth/me` | Auth | Current user |

Login body: `{ "email", "password" }`

### Medicines

| Method | Path | Access |
|--------|------|--------|
| GET | `/medicines` | Auth — query: `search`, `category`, `stock=low\|out`, `expiry=30\|60\|90\|expired`, `page`, `limit` |
| GET | `/medicines/:id` | Auth |
| POST | `/medicines` | Admin, Pharmacist |
| PUT | `/medicines/:id` | Admin, Pharmacist |
| DELETE | `/medicines/:id` | Admin |
| GET | `/medicines/export/csv` | Admin, Pharmacist |

### Suppliers

| Method | Path | Access |
|--------|------|--------|
| GET | `/suppliers` | Auth |
| GET | `/suppliers/:id` | Auth |
| POST | `/suppliers` | Admin, Pharmacist |
| PUT | `/suppliers/:id` | Admin, Pharmacist |
| DELETE | `/suppliers/:id` | Admin |

### Sales

| Method | Path | Access |
|--------|------|--------|
| GET | `/sales` | Auth |
| GET | `/sales/:id` | Auth |
| GET | `/sales/customer?q=` | Auth — customer history |
| POST | `/sales` | Admin, Pharmacist, Staff — creates sale **and** invoice, decrements stock |

Sale body:

```json
{
  "customerName": "Farah Yusuf",
  "customerPhone": "+252 61 8881001",
  "paymentMethod": "evc_plus",
  "discount": 0,
  "items": [{ "medicine": "<id>", "quantity": 2, "unitPrice": 0.35 }]
}
```

### Inventory

| Method | Path | Access |
|--------|------|--------|
| POST | `/inventory/in` | Admin, Pharmacist |
| POST | `/inventory/out` | Admin, Pharmacist |
| POST | `/inventory/transfer` | Admin, Pharmacist |
| GET | `/inventory/history` | Auth |

### Reports

Query `format=csv|excel|pdf` on inventory, sales, suppliers, expiry.

| Method | Path |
|--------|------|
| GET | `/reports/inventory` |
| GET | `/reports/sales?from=&to=` |
| GET | `/reports/revenue?from=&to=` |
| GET | `/reports/suppliers` |
| GET | `/reports/expiry?days=90` |

Reports: Admin, Pharmacist.

### Other

| Method | Path |
|--------|------|
| GET | `/dashboard` |
| GET | `/notifications` |
| PATCH | `/notifications/:id/read` |
| PATCH | `/notifications/read-all` |
| POST | `/notifications/scan` |
| GET | `/settings` |
| PUT | `/settings` (Admin) |
| POST | `/settings/logo` (Admin, multipart `logo`) |
| GET/POST/PUT/DELETE | `/users` (Admin) |

---

## Role-based access

| Capability | Admin | Pharmacist | Staff |
|------------|:-----:|:----------:|:-----:|
| Dashboard, view medicines/sales | ✓ | ✓ | ✓ |
| Create/update medicines & suppliers | ✓ | ✓ | |
| Delete medicines/suppliers/users | ✓ | | |
| Stock in/out/transfer | ✓ | ✓ | |
| Create sales / print invoices | ✓ | ✓ | ✓ |
| Reports | ✓ | ✓ | |
| Settings & user management | ✓ | | |

---

## Dashboard

Cards: total medicines, low stock, out of stock, expiring in 30 days, expired lots, daily sales, monthly sales, unread alerts.  
Charts: 14-day revenue area chart, monthly payment mix (Cash, EVC Plus, Zaad, Sahal, Card, Bank).  
Table: recent invoices.

---

## Features mapped to requirements

1. **Auth** — JWT, protected routes, admin / pharmacist / staff  
2. **Dashboard** — KPIs, analytics, recent transactions  
3. **Medicines** — CRUD, search, filters, pagination, CSV, print  
4. **Inventory** — stock in/out/transfer, auto qty, history, audit logs  
5. **Suppliers** — CRUD + supplier report  
6. **Sales** — POS, invoice, print receipt, customer history, daily/monthly via reports  
7. **Expiry** — 30/60/90 day windows, expired list, dashboard widget, scan alerts  
8. **Reports** — inventory, sales, suppliers, revenue, expiry → PDF / Excel / CSV  
9. **Notifications** — low stock, out of stock, expiry, sales  
10. **Settings** — pharmacy info, logo upload, tax, USD/SOS, users  

Somalia-specific: USD/SOS, EVC Plus / Zaad / Sahal, Mogadishu defaults, Somali demo data.

---

## Security best practices

- Passwords hashed with bcrypt (cost 12); never returned in APIs  
- JWT with expiry; `Authorization: Bearer` only  
- Helmet, CORS allowlist, rate limiting, compression  
- Express-validator on auth/medicine/supplier/sale payloads  
- Role middleware on mutating and report routes  
- Staff cannot delete medicines or manage users/settings  
- Expired medicines cannot be sold; stock checks inside a MongoDB transaction  
- Duplicate key / CastError mapped to safe client messages  
- File upload: image MIME filter + size cap  
- `.env` is gitignored; rotate `JWT_SECRET` in production  
- `trust proxy` enabled for correct rate-limit IPs behind nginx  

**Production checklist**

- Use a strong `JWT_SECRET` (32+ random bytes)  
- Atlas: IP allowlist + least-privilege DB user  
- HTTPS only; set `NODE_ENV=production`  
- Restrict CORS `CLIENT_URL` to your real domain  
- Serve `/uploads` behind auth or object storage if logos are sensitive  

---

## Deployment

### Backend (Render / Railway / Fly)

1. Create a MongoDB Atlas cluster (region close to East Africa, e.g. `eu-west` or `me-central` if available).  
2. Set env vars: `MONGO_URI`, `JWT_SECRET`, `JWT_EXPIRES_IN`, `CLIENT_URL`, `NODE_ENV=production`, `PORT`.  
3. Build: `cd backend && npm install && npm start`  
4. Persist `uploads/` or switch logo storage to S3/Cloudinary.

### Frontend (Vercel / Netlify)

1. Root: `frontend`  
2. Build: `npm run build`  
3. Output: `dist`  
4. Env: if the API is on another origin, set Vite `server` proxy in production to a reverse proxy **or** change `frontend/src/services/api.js` `baseURL` to `https://api.yourdomain.com/api`.

### Nginx example

```
location /api/ { proxy_pass http://127.0.0.1:5000; }
location /uploads/ { proxy_pass http://127.0.0.1:5000; }
location / { root /var/www/dawostock; try_files $uri /index.html; }
```

---

## License

Proprietary — built for Somali pharmacy operations. Customize pharmacy name in Settings.
