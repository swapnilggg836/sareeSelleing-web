# 🌺 Dwarkadish Crimson Paithani Emporium - Complete Website Documentation

Welcome to the official documentation for **Dwarkadish Crimson Paithani Emporium**, an exquisite e-commerce web platform for authentic, handwoven Paithani silk sarees and traditional ethnic couture.

---

## 📌 1. Overview & Store Information

* **Store Name**: Dwarkadish Crimson Paithani Emporium
* **Tagline**: *Experience the timeless elegance of traditional Paithani sarees.*
* **Store Address**: At Post Dhulgaon, Yeola, Nashik, Maharashtra - **423401**
* **Primary Phone / WhatsApp Support**: **+91 86058 87561**
* **Primary Email**: `swapnilg836@gmail.com`
* **Live Deployment URL**: [https://saree-selleing-web-zeta.vercel.app](https://saree-selleing-web-zeta.vercel.app)
* **GitHub Repository**: [https://github.com/swapnilggg836/sareeSelleing-web.git](https://github.com/swapnilggg836/sareeSelleing-web.git)

---

## 🛍️ 2. Key Features & Services Offered

### 📱 A. Customer-Facing Features & Services
1. **Product Catalog & Category Filtering**:
   - Browse authentic Paithani sarees categorized by weave, fabric, occasion, and collection (Wedding, Festival, Traditional, Designer).
   - Real-time search dialog for instant product discovery.
   - Filter by New Arrivals, Trending, Featured, and Special Sales.

2. **Direct WhatsApp Inquiry & Quick Ordering**:
   - Floating WhatsApp support widget connected directly to the store owner's number (**+91 86058 87561**).
   - Direct *"Order via WhatsApp"* button on every product detail page with pre-filled product name, price, and URL.

3. **Shopping Cart & Checkout System**:
   - Dynamic popover shopping cart with instant quantity updates.
   - Seamless multi-step checkout workflow with customer address details and payment confirmation.

4. **User Authentication & Customer Accounts**:
   - Secure registration and login powered by JSON Web Tokens (JWT) and Bcrypt password hashing.
   - Personalized user profile management with profile image uploading.
   - Saved order history and order tracking status.

5. **Wishlist & Customer Reviews**:
   - One-click wishlist toggle to save favorite Paithani sarees.
   - Verified customer ratings, star reviews, and feedback submissions.

6. **Order Tracking**:
   - Dedicated order tracking page searchable by Order Number and Email.

7. **Promotional Banners & Festival Sales**:
   - Dynamic promotional banners, discount tags, and countdown sales event pages.

8. **Blog & Heritage Articles**:
   - Informative blog posts sharing Paithani weaving history, care guides, and styling tips.

9. **Interactive Store Location Map**:
   - Embedded Google Maps location showing the physical store address in **Dhulgaon (Pincode: 423401)**.

10. **Newsletter Subscription**:
    - Subscription form for customers to receive exclusive offers and seasonal collection releases.

---

### 🛡️ B. Admin Portal & Management Services
1. **Dashboard Analytics**:
   - Real-time summary statistics, sales reports, product performance metrics, and customer growth data.

2. **Inventory & Product Management**:
   - Complete CRUD (Create, Read, Update, Delete) operations for products with multi-image upload support.
   - Stock management, price updates, and featured status toggles.

3. **Collection, Category & Banner Management**:
   - Create and organize collections (e.g. Maharani Collection, Peacock Border Special).
   - Manage promotional hero banners for the storefront.

4. **Order & Customer Management**:
   - View all customer orders, update delivery statuses (Pending, Processing, Shipped, Delivered), and manage customer accounts.

5. **Automated One-Click Admin Seeding**:
   - Automated backend route (`/api/seed-admin?key=swapnil2024`) to initialize and upgrade admin accounts instantly on production hosting.

---

## 🏗️ 3. Technology Stack & Architecture

### **Frontend**
* **Framework**: React 18 with TypeScript
* **Build Tool**: Vite 5
* **Styling**: TailwindCSS with Custom Crimson & Gold Color Palette
* **UI Components**: Radix UI Primitives, Lucide React Icons
* **Notifications**: Sonner & Custom Toast System
* **Routing**: React Router DOM v6

### **Backend**
* **Runtime**: Node.js (v18+ / v20+)
* **Server Framework**: Express.js
* **Database**: MongoDB Atlas Cluster (`adminpaith` database) with Mongoose ORM
* **Security & Auth**: JWT (`jsonwebtoken`) & `bcryptjs`
* **File Uploads**: Multer storage middleware

### **Hosting & Deployment**
* **Deployment Platform**: Vercel Serverless Architecture
* **Frontend CDN**: Vercel Static Build
* **Serverless Functions**: Vercel `@vercel/node` rewrites (`api/index.js` $\rightarrow$ `/api/*`)

---

## ⚡ 4. API Endpoints Quick Reference

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Register new user account |
| `POST` | `/api/auth/login` | Log in user and receive JWT token |
| `GET` | `/api/auth/me` | Fetch logged-in user profile |
| `GET` | `/api/products` | Fetch all products |
| `GET` | `/api/products/:id` | Fetch single product details |
| `GET` | `/api/collections` | Fetch store collections |
| `GET` | `/api/cart` | Get user shopping cart |
| `POST` | `/api/cart/add` | Add product to shopping cart |
| `POST` | `/api/orders` | Create new purchase order |
| `POST` | `/api/orders/track` | Track order status |
| `GET` | `/api/seed-admin` | One-time admin account seed route |

---

## 🚀 5. Local Development Setup

1. **Clone Repository**:
   ```bash
   git clone https://github.com/swapnilggg836/sareeSelleing-web.git
   cd sareeSelleing-web
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   Create a `.env` file or `backend/config/config.env` with:
   ```env
   MONGODB_URI=mongodb+srv://swapnil:UaJfkMdnZtHq.62@cluster0.6obrx.mongodb.net/adminpaith?retryWrites=true&w=majority&appName=Cluster0
   PORT=5000
   JWT_SECRET=MySuperSecretKey123!@#JWT987654321
   JWT_EXPIRE=30d
   ```

4. **Run Development Mode**:
   - Run backend server: `node backend/server.js`
   - Run frontend app: `npm run dev`

5. **Build Production Bundle**:
   ```bash
   npm run build
   ```

---

*Documentation created for Dwarkadish Crimson Paithani Emporium.*
