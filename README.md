# E-Commerce Platform

A modern e-commerce platform built with Next.js, TypeScript, and Tailwind CSS.

## System Architecture

### Frontend
- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- Radix UI Components
- React Hook Form
- Zod Validation

### Backend
- Next.js API Routes
- Prisma ORM
- PostgreSQL Database
- JWT Authentication

### Third-Party Services
- Stripe Payment Processing
- AWS S3 for Image Storage
- SendGrid for Email Notifications

## Features

### Public Pages
- Homepage
- Shop / Product Listing
- Product Detail Page
- About Us
- Contact Us

### User Account Pages
- Login Page
- Register / Signup Page
- User Dashboard
- My Orders
- Account Settings

### Shopping and Checkout
- Cart
- Checkout
- Thank You Page

### Admin Panel
- Admin Dashboard
- Product Management
- Category Management
- User Management
- Inventory Management

## API Documentation

### Authentication Endpoints
```typescript
POST /api/auth/register
POST /api/auth/login
POST /api/auth/logout
GET /api/auth/me
```

### Product Endpoints
```typescript
GET /api/products
GET /api/products/:id
POST /api/products
PUT /api/products/:id
DELETE /api/products/:id
```

### Cart Endpoints
```typescript
GET /api/cart
POST /api/cart
PUT /api/cart/:id
DELETE /api/cart/:id
```

### Order Endpoints
```typescript
GET /api/orders
GET /api/orders/:id
POST /api/orders
PUT /api/orders/:id
```

### User Endpoints
```typescript
GET /api/users
GET /api/users/:id
PUT /api/users/:id
DELETE /api/users/:id
```

## Database Schema

### Users
```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role VARCHAR(50) DEFAULT 'customer',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Products
```sql
CREATE TABLE products (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  stock INTEGER NOT NULL,
  category_id INTEGER REFERENCES categories(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Categories
```sql
CREATE TABLE categories (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Orders
```sql
CREATE TABLE orders (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  total DECIMAL(10,2) NOT NULL,
  status VARCHAR(50) DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Order Items
```sql
CREATE TABLE order_items (
  id SERIAL PRIMARY KEY,
  order_id INTEGER REFERENCES orders(id),
  product_id INTEGER REFERENCES products(id),
  quantity INTEGER NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   pnpm install
   ```
3. Set up environment variables:
   ```bash
   cp .env.example .env
   ```
4. Run the development server:
   ```bash
   pnpm dev
   ```

## Development

### Code Style
- ESLint for code linting
- Prettier for code formatting
- TypeScript for type safety

### Testing
- Jest for unit testing
- React Testing Library for component testing
- Cypress for end-to-end testing

### Deployment
- Vercel for frontend deployment
- Railway for backend deployment
- GitHub Actions for CI/CD

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License. 