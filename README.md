# 🛍️ AeroStore — Modern MERN E-Commerce Platform

![React](https://img.shields.io/badge/React-18-61DAFB?style=flat&logo=react) ![Vite](https://img.shields.io/badge/Vite-Fast-646CFF?style=flat&logo=vite) ![Node.js](https://img.shields.io/badge/Node.js-Express-339933?style=flat&logo=node.js) ![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose-47A248?style=flat&logo=mongodb) ![JWT](https://img.shields.io/badge/Auth-HTTP--Only%20JWT-000000?style=flat&logo=jsonwebtokens) ![Design](https://img.shields.io/badge/UI-Glassmorphism%20Dark-9333EA?style=flat)

A production-ready, full-stack e-commerce web application featuring a modern glassmorphic dark-mode interface, real-time database-persisted shopping cart, multi-step checkout with stock deduction, multi-role RBAC (Customer & Administrator), and secure cookie-based JWT sessions. Built for the CodeAlpha Software Architecture Internship.

The platform allows users to:
- Browse, search, filter by category, and sort products with instant client-side responsiveness
- Manage an authenticated, database-persisted shopping cart with quantity controls and inventory checks
- Execute checkout with simulated multi-step address capture and instant inventory decrement
- Access a dedicated Admin Dashboard to create, edit, manage inventory, and delete catalog listings
- Authenticate securely via HTTP-only cookie-stored JSON Web Tokens

---

## 📌 Table of Contents

- [Overview](#overview)
- [Core Features](#core-features)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Project Structure](#project-structure)
- [API Endpoints](#api-endpoints)
- [Setup & Installation](#setup--installation)
- [Environment Variables](#environment-variables)
- [Application Workflow](#application-workflow)
- [Pre-Seeded Test Accounts](#pre-seeded-test-accounts)
- [Future Improvements](#future-improvements)
- [Contributing](#contributing)
- [Author](#author)

---

## 📖 Overview

AeroStore provides a complete, modern e-commerce lifecycle engineered without excessive external framework bloat. It features custom, high-density glassmorphic dark-mode CSS tokens, smooth animations, and a decoupled REST API backend:

- **Customer Journey:** Shoppers can browse items, filter by categories, review stock availability, add products to an authenticated cart that persists across devices, and simulate orders.
- **Merchant Management:** Administrators enjoy dedicated catalog management portals with granular control over product pricing, imagery, descriptions, and warehouse stock units.
- **Enterprise Security:** Implements HTTP-only cookie JWT delivery, preventing Cross-Site Scripting (XSS) token exfiltration, with role-validation middleware separating customers from privileged catalog mutations.

---

## ✨ Core Features

### 🛒 Product Discovery & Catalog
- Live instant keyword search with debounced filtering
- Category navigation tabs (Electronics, Apparel, Accessories, etc.)
- Dynamic price sorting (Price: Low to High, High to Low, Newest arrivals)
- Detailed product view with stock counter and instant add-to-cart feedback

### 📦 Persistent Cart & Checkout
- Authenticated shopping cart synced in real time to MongoDB
- Quantity adjustment with real-time stock ceiling validation
- Automatic calculation of subtotal, sales tax, and shipping thresholds
- Multi-step checkout with delivery address capture and order history logs

### 🛠️ Administrator Catalog Suite
- Role-gated Admin Panel accessible only to authorized accounts (`role: "admin"`)
- Create new catalog items with image URLs, pricing, and category tags
- Inline stock updates and instant catalog removal

### 🔐 Security & Architecture
- Stateless JWT authentication delivered via HTTP-only, secure cookies
- Bcrypt password hashing (10 salt rounds)
- Role-based authorization middleware guarding `/api/admin/*` routes
- Centralized Axios client with automatic credential propagation

---

## 🛠 Tech Stack

### Frontend Architecture
| Technology | Version | Purpose |
|---|---|---|
| React | 18.x | Declarative Single Page Application UI |
| Vite | Latest | High-speed frontend build tool and hot module replacement |
| React Router | v6 | Client-side declarative routing and protected routes |
| Context API | Native | Centralized Auth, Cart, and Toast notification state |
| Custom CSS | Pure Tokens | High-performance dark-mode glassmorphic styling |
| Lucide React | Latest | Crisp vector icons |

### Backend & API
| Technology | Version | Purpose |
|---|---|---|
| Node.js | 18+ / 20+ | Server-side JavaScript execution environment |
| Express.js | 4.x | RESTful API server and route handling |
| Mongoose | Latest | Object Data Modeling (ODM) for MongoDB |
| jsonwebtoken | Latest | Cryptographic stateless session generation |
| bcryptjs | Latest | One-way password hashing |
| cookie-parser | Latest | Secure HTTP-only cookie parsing |

### Database & Storage
| Technology | Type | Purpose |
|---|---|---|
| MongoDB | Document DB | User accounts, product catalog, active carts, and order ledgers |

---

## 🧠 Architecture

```
┌─────────────────────────────────┐
│     React 18 SPA (Port 5173)    │
│  ├── AuthContext / CartContext  │
│  └── Glassmorphic UI & Router   │
└────────────────┬────────────────┘
                 │
                 │ Axios HTTP + Credentials (Cookies)
                 ▼
┌────────────────────────────────────────────────────────┐
│             Node.js / Express.js Backend Server        │
│  ├── CORS (Origin: http://localhost:5173)              │
│  ├── Cookie-Parser & JSON Body Parser                  │
│  │                                                     │
│  ├── Middleware Layer                                  │
│  │   ├── verifyToken (Checks HTTP-only cookie)         │
│  │   └── verifyAdmin (Enforces administrative role)    │
│  │                                                     │
│  └── Controllers Layer                                 │
│      ├── authController (/api/auth)                    │
│      ├── productController (/api/products)             │
│      ├── cartController (/api/cart)                    │
│      └── orderController (/api/orders)                 │
└────────────────┬───────────────────────────────────────┘
                 │
                 ▼ Mongoose ODM
┌─────────────────────────────────┐
│         MongoDB Database        │
│  ├── users collection           │
│  ├── products collection        │
│  ├── carts collection           │
│  └── orders collection          │
└─────────────────────────────────┘
```

---

## 📂 Project Structure

```text
tasl1-ecommerce/
├── README.md                            # Comprehensive project documentation
│
├── backend/                             # Express REST API
│   ├── server.js                        # Server entry point & DB connection
│   ├── package.json
│   ├── .env                             # Environment secrets (ignored)
│   ├── config/
│   │   └── db.js                        # MongoDB Mongoose connection handler
│   ├── controllers/
│   │   ├── authController.js            # User registration, login, profile
│   │   ├── productController.js         # Catalog listing, creation, updates
│   │   ├── cartController.js            # Persistent cart management
│   │   └── orderController.js           # Checkout & order history
│   ├── middleware/
│   │   ├── authMiddleware.js            # JWT verification guard
│   │   └── adminMiddleware.js           # Admin privilege guard
│   ├── models/
│   │   ├── User.js                      # User schema with roles
│   │   ├── Product.js                   # Product schema with stock counters
│   │   ├── Cart.js                      # User shopping cart schema
│   │   └── Order.js                     # Order invoice schema
│   ├── routes/
│   │   ├── authRoutes.js                # Authentication endpoints
│   │   ├── productRoutes.js             # Catalog endpoints
│   │   ├── cartRoutes.js                # Cart management endpoints
│   │   └── orderRoutes.js               # Order processing endpoints
│   └── scripts/
│       └── seed.js                      # DB seeding script with mock data
│
└── frontend/                            # React 18 SPA
    ├── index.html                       # Application shell
    ├── vite.config.js                   # Vite configuration
    ├── package.json
    └── src/
        ├── App.jsx                      # Route declaration
        ├── main.jsx                     # React DOM bootstrap
        ├── index.css                    # Glassmorphism design tokens
        ├── components/
        │   ├── Navbar.jsx               # Header with search & cart badge
        │   ├── Footer.jsx               # Responsive footer
        │   ├── ProtectedRoute.jsx       # Route-level auth guard
        │   └── Toast.jsx                # Interactive feedback alerts
        ├── context/
        │   ├── AuthContext.jsx          # Session state
        │   ├── CartContext.jsx          # Real-time cart synchronization
        │   └── ToastContext.jsx         # Global notifications
        ├── services/
        │   └── api.js                   # Pre-configured Axios client
        └── pages/
            ├── Home.jsx                 # Product catalog & filters
            ├── Details.jsx              # Single item detail view
            ├── Cart.jsx                 # Interactive cart manager
            ├── Checkout.jsx             # Order placement view
            ├── Orders.jsx               # Order history ledger
            ├── Login.jsx                # User sign-in
            ├── Register.jsx             # User account creation
            └── Admin.jsx                # Catalog inventory administration
```

---

## 🔌 API Endpoints

### 1. Authentication Paths (`/api/auth`)
| Method | Route | Access | Description |
|---|---|---|---|
| `POST` | `/api/auth/register` | Public | Create new account & set JWT cookie |
| `POST` | `/api/auth/login` | Public | Authenticate user & set JWT cookie |
| `POST` | `/api/auth/logout` | Public | Clear authentication cookie |
| `GET` | `/api/auth/me` | Authenticated | Retrieve authenticated user profile |

### 2. Product Catalog Paths (`/api/products`)
| Method | Route | Access | Description |
|---|---|---|---|
| `GET` | `/api/products` | Public | Query catalog (search, category, sort) |
| `GET` | `/api/products/:id` | Public | Retrieve single product details |
| `POST` | `/api/products` | Admin | Create a new catalog product |
| `PUT` | `/api/products/:id` | Admin | Update product details & inventory |
| `DELETE` | `/api/products/:id` | Admin | Remove product from catalog |

### 3. Shopping Cart Paths (`/api/cart`)
| Method | Route | Access | Description |
|---|---|---|---|
| `GET` | `/api/cart` | Authenticated | Retrieve user's current persistent cart |
| `POST` | `/api/cart` | Authenticated | Add item or increment quantity |
| `DELETE` | `/api/cart/:productId` | Authenticated | Remove item from cart |

### 4. Orders Paths (`/api/orders`)
| Method | Route | Access | Description |
|---|---|---|---|
| `POST` | `/api/orders` | Authenticated | Submit checkout & decrement stock |
| `GET` | `/api/orders` | Authenticated | Retrieve user's past order invoices |

---

## ⚙️ Setup & Installation

### Prerequisites
- Node.js 18+ or 20+
- MongoDB instance running locally (`mongodb://localhost:27017`) or Atlas URI
- npm or yarn

### 1. Clone the Repository
```bash
git clone https://github.com/Mumuksh-Jain/Task1Code-Alpha.git
cd Task1Code-Alpha
```

### 2. Configure & Seed Backend
```bash
cd backend
npm install
```

Create a `.env` file inside `backend/` (see [Environment Variables](#environment-variables)):

```bash
# Seed default inventory and admin/user accounts
npm run seed

# Start Express server
npm run dev
# Server runs on: http://localhost:5000
```

### 3. Configure & Run Frontend
```bash
cd ../frontend
npm install
npm run dev
# Client runs on: http://localhost:5173
```

---

## 🔑 Environment Variables

Create `backend/.env`:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/alpha-ecommerce
JWT_SECRET=super_secret_codealpha_jwt_key_123
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
```

| Variable | Required | Description |
|---|---|---|
| `PORT` | No | Express server port (Default: `5000`) |
| `MONGO_URI` | **Yes** | MongoDB connection string |
| `JWT_SECRET` | **Yes** | Secret cryptographic key for signing tokens |
| `FRONTEND_URL` | **Yes** | Origin URL allowed by CORS policy |

---

## 👤 Pre-Seeded Test Accounts

The seeding script (`npm run seed`) populates the database with two ready-to-test credentials:

| Role | Email | Password | Privileges |
|---|---|---|---|
| **Standard User** | `user@alpha.com` | `userpassword` | Browse, Cart, Checkout, Order Tracking |
| **Administrator** | `admin@alpha.com` | `adminpassword` | Full User capabilities + Product creation/updating/deleting |

---

## 🔄 Application Workflow

1. **Catalog Exploration:** User browses products, filters by category tag, and inspects product cards.
2. **Cart Management:** User adds items to cart. The server validates stock availability before persisting the item to the user's `Cart` document.
3. **Checkout Execution:** User proceeds to `/checkout`, fills out shipping information, and confirms the purchase. The backend creates an `Order` record, reduces product stock counts, and clears the cart.
4. **Order History:** User inspects past transactions in `/orders` with real-time status tracking.

---

## 🚧 Future Improvements

- [ ] Stripe / PayPal live payment gateway integration
- [ ] Product customer ratings and written reviews
- [ ] Cloudinary integration for merchant image file uploads
- [ ] Email receipts and dispatch tracking via Nodemailer
- [ ] Wishlist feature for saving favorite items

---

## 🤝 Contributing

```bash
# 1. Fork the repository
git checkout -b feature/stripe-payment-gateway
git commit -m "feat(stripe): add checkout session integration"
git push origin feature/stripe-payment-gateway
# Open a Pull Request
```

---

## 👨‍💻 Author

Developed for the CodeAlpha Software Architecture Internship.

Developed by **Mumuksh Jain**

- **GitHub:** [@Mumuksh-Jain](https://github.com/Mumuksh-Jain)
- **Repository:** [https://github.com/Mumuksh-Jain/Task1Code-Alpha](https://github.com/Mumuksh-Jain/Task1Code-Alpha)

---

⭐ If you found this e-commerce architecture useful, please star the repository!
