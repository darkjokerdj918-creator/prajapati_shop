# 🏺 Prajapati Store — Fullstack E-Commerce

A premium pottery e-commerce website with a **FastAPI Python backend** and **HTML/CSS/JS frontend**.

---

## 📁 Project Structure

```
prajapati_store/
├── backend/                     ← FastAPI Python API
│   ├── app/
│   │   ├── api/v1/endpoints/   ← Route handlers (thin)
│   │   ├── core/               ← Config, DB, Security (JWT)
│   │   ├── models/             ← SQLAlchemy ORM models
│   │   ├── schemas/            ← Pydantic request/response schemas
│   │   ├── services/           ← Business logic layer
│   │   ├── repositories/       ← Database query layer
│   │   ├── seed_data.py        ← DB seed script
│   │   └── main.py             ← FastAPI app entry point
│   ├── .env                    ← Environment variables
│   └── requirements.txt        ← Python dependencies
│
├── frontend/                    ← Static HTML/CSS/JS
│   ├── index.html              ← Main shop page (API-driven)
│   ├── pages/
│   │   ├── login.html          ← Login / Register page
│   │   └── orders.html         ← Order history page
│   ├── css/
│   │   ├── style.css           ← Main design system
│   │   └── auth.css            ← Auth & orders styles
│   ├── js/
│   │   ├── api.js              ← API client (all fetch calls)
│   │   ├── app.js              ← Main app logic
│   │   ├── auth.js             ← Login/register logic
│   │   └── cart.js             ← Cart & checkout logic
│   └── images/                 ← Product images
│
└── README.md
```

---

## 🚀 Quick Start

### 1. Install Python dependencies

```bash
cd backend
pip install -r requirements.txt
```

### 2. Start the backend server

```bash
cd backend
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

The server will:
- Create SQLite database (`prajapati_store.db`) automatically
- Seed all 12 products on first run
- Serve the frontend at `http://localhost:8000`

### 3. Open the website

Visit: **http://localhost:8000**

---

## 📖 API Documentation

Auto-generated Swagger UI: **http://localhost:8000/docs**
ReDoc: **http://localhost:8000/redoc**

---

## 🔌 REST API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/products` | List products (filter: category, subcat, search, badge) |
| GET | `/api/v1/products/featured` | Featured/bestselling products |
| GET | `/api/v1/products/{id}` | Product detail with features |
| POST | `/api/v1/auth/register` | Register new user account |
| POST | `/api/v1/auth/login` | Login → JWT token |
| GET | `/api/v1/auth/me` | Get current user profile |
| PUT | `/api/v1/auth/me` | Update user profile |
| GET | `/api/v1/cart` | Get current cart |
| POST | `/api/v1/cart/add` | Add item to cart |
| PUT | `/api/v1/cart/update/{item_id}` | Update item quantity |
| DELETE | `/api/v1/cart/remove/{item_id}` | Remove cart item |
| DELETE | `/api/v1/cart/clear` | Clear entire cart |
| POST | `/api/v1/orders` | Place order from cart |
| GET | `/api/v1/orders` | Get user order history |
| GET | `/api/v1/orders/{id}` | Get single order |
| POST | `/api/v1/newsletter/subscribe` | Subscribe to newsletter |
| DELETE | `/api/v1/newsletter/unsubscribe` | Unsubscribe |
| POST | `/api/v1/contact` | Send contact message |
| GET | `/health` | API health check |

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Backend | FastAPI (Python 3.11+) |
| Database | SQLite via SQLAlchemy ORM |
| Auth | JWT (python-jose) + bcrypt |
| Validation | Pydantic v2 |
| ASGI Server | Uvicorn |
| Frontend | HTML5 + CSS3 + Vanilla JS |
| API Client | Fetch API |
| CORS | FastAPI CORSMiddleware |

---

## 🔐 Authentication Flow

1. User registers → `POST /api/v1/auth/register` → JWT returned
2. JWT stored in `localStorage` as `ps_token`
3. All protected API calls send `Authorization: Bearer <token>` header
4. Cart supports both guests (session cookie) and logged-in users

---

## 💡 Notes

- **Guest cart**: Uses browser cookie (`session_id`) — works without login
- **Free shipping**: Automatically applied on orders ≥ ₹999
- **Swagger UI**: Full API exploration at `/docs`
- **Database**: `prajapati_store.db` created in `backend/` directory
