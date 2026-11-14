# ShopVerse — Multi-Vendor E-Commerce Marketplace

A modern, professional, responsive, full-stack **Multi-Vendor E-Commerce Marketplace** platform built using the MERN stack (**MongoDB**, **Express.js**, **React.js**, and **Node.js**).

---

## 🚀 Key Features

### 🏬 True Multi-Vendor Architecture
- **Unified Multi-Vendor Cart**: Customers can seamlessly add products from different independent sellers into a single shopping cart.
- **Server-Side Pricing & Stock Recalculation**: Prices and inventory quantities are strictly re-verified against MongoDB during checkout to prevent client tampering.
- **Atomic Multi-Vendor Orders**: At checkout, a master order is generated with each item tied directly to its seller (`vendorId`).
- **Vendor-Isolated Order Management**: Sellers can inspect only order items that belong to their store and manage fulfillment status (`pending` ➔ `confirmed` ➔ `processing` ➔ `shipped` ➔ `delivered` ➔ `cancelled`).
- **Omniscient Administrator Overview**: Administrators have global visibility across all vendor items, stores, customers, and order lifecycles.

---

### 🛍️ Customer Experience
- **Dynamic Homepage**: Hero promotion banner, category explorer, flash clearance banner with countdown timer, featured collections, trending picks, best sellers, and top verified seller showcases.
- **Rich Product Catalog**: Multi-faceted filtering by category, price range, in-stock availability, and sorting (price low-high, high-low, newest, rating, biggest discount).
- **Product Details & Reviews**: Multi-image preview, SKU, brand details, stock availability indicator, quantity selector, "Add to Cart", instant "Buy Now" flow, and verified customer review submission.
- **Persistent Shopping Cart**: Real-time quantity controls, item removal, free delivery progress tracker (Free delivery over ₹1,000), and state persistence across page refreshes.
- **Simulated Demonstration Checkout**: Safe simulation of online payments (Simulated Card with autofill, Simulated UPI / QR Code, Cash on Delivery).
- **Customer Account Dashboard**: Real-time metrics (total orders, wishlist count, saved addresses), full order tracking stepper, itemized receipts, and profile management.

---

### 🏢 Vendor Portal
- **Vendor Self-Registration**: Store applications are registered with an initial **Pending Approval** status.
- **Dedicated Dashboard**: Real-time stats calculated directly from database records (store revenue, orders received, active products, low-stock alerts, and sales trajectory area charts via Recharts).
- **Product & Inventory Management**: Add new products, upload images, specify pricing & discount, set inventory quantities, edit listings, and delete products with strict ownership verification.
- **Storefront Profile Customization**: Manage store name, bio, brand logo, support contact details, and warehouse dispatch address.

---

### 🛡️ Administrator Operations
- **System-Wide Dashboard**: Real-time platform revenue volume, total orders, customer count, vendor count, and pending approval alerts.
- **Vendor Moderation**: Review vendor applications with one-click **Approve**, **Reject**, or **Suspend** capabilities.
- **User Directory**: Search and inspect customer & merchant accounts with account suspension toggles.
- **Catalog Moderation**: Deactivate inappropriate products from the public marketplace.
- **Order Oversight**: Inspect and update master statuses across all multi-vendor orders.

---

## 🛠️ Technology Stack

| Layer | Technologies |
|---|---|
| **Frontend** | React.js (v18), Vite, React Router DOM (v6), Axios, Lucide React icons, Recharts |
| **Backend** | Node.js, Express.js, JWT (`jsonwebtoken`), bcrypt password hashing (`bcryptjs`), Morgan, CORS, express-rate-limit |
| **Database** | MongoDB & Mongoose ODM (includes embedded MongoMemoryServer fallback for standalone zero-config execution) |
| **Styling** | Custom CSS3 Design System with CSS Variables, responsive mobile-first layouts |

---

## 📂 Project Architecture

```
ecommerce-marketplace/
│
├── client/                      # React + Vite Frontend
│   ├── src/
│   │   ├── components/
│   │   │   ├── common/          # Navbar, Footer, ProductCard, QuickViewModal, ProtectedRoute, Pagination
│   │   │   ├── home/            # HeroBanner, CategorySection, SpecialOffersBanner, VendorHighlights, Newsletter
│   │   │   └── dashboard/       # AdminSidebar, VendorSidebar, CustomerSidebar
│   │   ├── pages/
│   │   │   ├── public/          # Home, Products, Product Details, Categories, About, Contact, Login, Register
│   │   │   ├── customer/        # Customer Dashboard, Cart, Checkout, My Orders, Order Details, Wishlist, Profile
│   │   │   ├── vendor/          # Vendor Dashboard, Add Product, Manage Inventory, Edit Product, Vendor Orders, Store Profile
│   │   │   └── admin/           # Admin Dashboard, Manage Users, Manage Vendors, Manage Catalog, Manage Orders
│   │   ├── context/             # AuthContext (JWT session), CartContext (local persistence)
│   │   ├── services/            # Axios API wrappers (auth, product, order, vendor, admin)
│   │   ├── App.jsx              # Main routing and layout wrapper
│   │   ├── main.jsx             # React DOM root with context providers
│   │   └── index.css            # Unified marketplace design system
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
│
├── server/                      # Node.js + Express REST API
│   ├── config/
│   │   └── db.js                # Resilient MongoDB connection with embedded fallback
│   ├── controllers/
│   │   ├── authController.js    # Register, login, profile, wishlist, simulated password reset
│   │   ├── productController.js # Search, filtering, collections, reviews
│   │   ├── orderController.js   # Multi-vendor order creation & ownership-scoped views
│   │   ├── vendorController.js  # Vendor statistics, products, order item fulfillment
│   │   ├── adminController.js   # Global analytics, user/vendor moderation, order status
│   │   └── categoryController.js# Category counts and catalog categories
│   ├── middleware/
│   │   ├── auth.js              # JWT verification, role authorization, vendor approval guard
│   │   ├── errorHandler.js      # Centralized error handler
│   │   └── rateLimiter.js       # Auth brute-force protection
│   ├── models/
│   │   ├── User.js              # User & Vendor profile schema
│   │   ├── Product.js           # Product, SKU, inventory schema
│   │   ├── Order.js             # Multi-vendor itemized order schema
│   │   ├── Category.js          # Marketplace categories schema
│   │   └── Review.js            # Customer rating & feedback schema
│   ├── routes/                  # Express REST routes
│   ├── utils/
│   │   └── seedData.js          # Comprehensive marketplace seed generator
│   ├── seed.js                  # Standalone CLI seed script
│   ├── server.js                # Express server entry point
│   └── package.json
│
├── .gitignore
└── README.md
```

---

## ⚡ Quick Start & Installation

### Prerequisites
- Node.js (v18 or newer recommended, v20+ supported)
- npm or pnpm
- MongoDB (optional — an embedded database engine is included for standalone operation)

### 1. Backend Setup
```bash
# Navigate to the server folder
cd server

# Install backend dependencies
npm install

# Start the backend server (starts on http://localhost:5000)
npm run dev
# or: npm start
```

### 2. Frontend Setup
In a new terminal:
```bash
# Navigate to the client folder
cd client

# Install frontend dependencies
npm install

# Start the Vite development server (starts on http://localhost:5173)
npm run dev
```

Open your browser and navigate to: **`http://localhost:5173`**

---

## 🔑 Demo Accounts for Evaluation

You can click any demo account pill on the **Login Page** or manually enter these credentials:

| Role | Email | Password | Details |
|---|---|---|---|
| **Administrator** | `admin@marketplace.com` | `admin123` | Full administrative control, vendor approvals & platform analytics |
| **Vendor 1 (Approved)** | `vendor1@marketplace.com` | `vendor123` | Store: *Fashion Aura & Apparels* (Kurtis, Handbags, Accessories) |
| **Vendor 2 (Approved)** | `vendor2@marketplace.com` | `vendor123` | Store: *ElectroTech Gadgets* (Headphones, Smart Watches, Chargers) |
| **Vendor 3 (Approved)** | `vendor3@marketplace.com` | `vendor123` | Store: *Luxe Home & Living* (Air Fryers, Ceramics, Home decor) |
| **Vendor 4 (Pending)** | `pending@marketplace.com` | `vendor123` | Store: *Organic Oasis Ayurveda* (Pending admin verification demo) |
| **Customer** | `customer@marketplace.com` | `customer123` | Customer with pre-loaded addresses & multi-vendor order history |

---

## 📡 API Reference Summary

### Authentication (`/api/auth`)
- `POST /api/auth/register` — Create customer or vendor account
- `POST /api/auth/login` — Login user & return JWT
- `GET  /api/auth/me` — Get authenticated user details
- `PUT  /api/auth/profile` — Update name, phone, saved addresses, password
- `POST /api/auth/wishlist/:productId` — Toggle product in customer wishlist

### Products (`/api/products`)
- `GET  /api/products` — Filter products by category, search, price, stock, and sort
- `GET  /api/products/:id` — Get single product details, reviews, and related items
- `GET  /api/products/collections/highlights` — Fetch featured, trending, and best-selling collections
- `POST /api/products/:id/reviews` — Submit verified customer review

### Orders (`/api/orders`)
- `POST /api/orders` — Create multi-vendor order with server stock & price recalculation
- `GET  /api/orders/my-orders` — Get customer's orders
- `GET  /api/orders/:id` — Role-scoped order details

### Vendor Operations (`/api/vendor`)
- `GET   /api/vendor/dashboard` — Vendor statistics, revenue, and sales chart
- `GET   /api/vendor/products` — View products owned by authenticated vendor
- `POST  /api/vendor/products` — Add product (approved vendors only)
- `PUT   /api/vendor/products/:id` — Edit vendor product
- `DELETE/api/vendor/products/:id` — Delete vendor product
- `GET   /api/vendor/orders` — Orders containing vendor's items
- `PATCH /api/vendor/orders/:orderId/items/:itemId/status` — Update item fulfillment status
- `GET   /api/vendor/profile` — Get store profile
- `PUT   /api/vendor/profile` — Update store info, logo, and contacts

### Administrator Operations (`/api/admin`)
- `GET   /api/admin/dashboard` — Platform overview analytics & revenue charts
- `GET   /api/admin/users` — Directory of all customers and vendors
- `PATCH /api/admin/users/:id/suspend` — Suspend or reactivate user accounts
- `GET   /api/admin/vendors` — List vendor applications
- `PATCH /api/admin/vendors/:id/status` — Approve, reject, or suspend vendor store
- `GET   /api/admin/products` — List all products across marketplace
- `PATCH /api/admin/products/:id/status` — Deactivate / reactivate product
- `GET   /api/admin/orders` — Master order list
- `PATCH /api/admin/orders/:id/status` — Update global order status

---

## 🔒 Security Best Practices Implemented
- **Password Hashing**: Encrypted using `bcryptjs` with salt rounds.
- **Stateless Authentication**: Signed JWT tokens stored securely in client authorization headers.
- **Role-Based Access Control**: Strict middleware verification for `customer`, `vendor`, and `admin`.
- **Privilege Escalation Protection**: Public registration endpoint rejects any request requesting the `admin` role.
- **Ownership Verification**: Sellers can only edit or delete their own inventory, and can only inspect order items that belong to their store.
- **Server-Side Price Recalculation**: Prices sent from frontend are ignored during checkout; prices are calculated directly from MongoDB product records.
