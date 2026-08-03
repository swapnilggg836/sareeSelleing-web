
# Dwarkadish Backend API

Backend API for the Dwarkadish Pithani Saree Store e-commerce website.

## Setup Instructions

1. Install dependencies:
   ```
   npm install
   ```

2. Create a `.env` file in the backend root directory with the following variables:
   ```
   PORT=27017
   MONGODB_URI=mongodb://localhost:27017/dwarkadish
   JWT_SECRET=your_jwt_secret_key
   JWT_EXPIRE=30d
   ```

3. Start the development server:
   ```
   npm run dev
   ```

## API Endpoints

### Authentication
- `POST /auth/register` - Register a new user
- `POST /auth/login` - Login user
- `GET /auth/me` - Get current user (protected)
- `PUT /auth/profile` - Update user profile (protected)

### Products
- `GET /products` - Get all products
- `GET /products/:id` - Get single product
- `GET /products/category/:category` - Get products by category
- `POST /products` - Create new product (admin only)
- `PUT /products/:id` - Update product (admin only)
- `DELETE /products/:id` - Delete product (admin only)

### Collections
- `GET /collections` - Get all collections
- `GET /collections/:id` - Get single collection
- `POST /collections` - Create new collection (admin only)
- `PUT /collections/:id` - Update collection (admin only)
- `DELETE /collections/:id` - Delete collection (admin only)

### Cart
- `GET /cart` - Get user's cart (protected)
- `POST /cart/add` - Add item to cart (protected)
- `PUT /cart/:itemId` - Update cart item (protected)
- `DELETE /cart/:itemId` - Remove cart item (protected)

### Contact
- `POST /contact` - Submit contact form
- `GET /contact` - Get all contact submissions (admin only)
- `PUT /contact/:id` - Update contact status (admin only)

## Authentication

API uses JWT authentication. To access protected routes, include an Authorization header:
```
Authorization: Bearer <your_jwt_token>
```
