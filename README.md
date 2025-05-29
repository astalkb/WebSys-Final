# E-Commerce Platform

A modern e-commerce platform built with Next.js, TypeScript, and Tailwind CSS.

## System Architecture

### Frontend
- Next.js 15.2.4 (App Router)
- React 19
- TypeScript
- Tailwind CSS
- Radix UI Components
- React Hook Form
- Zod Validation
- NextAuth.js for Authentication

### Backend
- Next.js API Routes
- Prisma ORM
- MySQL Database
- JWT Authentication
- bcryptjs for Password Hashing

### Development Tools
- pnpm Package Manager
- ESLint for Linting
- Prettier for Code Formatting
- Git for Version Control

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
- Account Settings (Profile edit)

### Shopping and Checkout
- Cart Management
- Checkout Process
- Order Confirmation
- Thank You Page

### Admin Panel
- Admin Dashboard
- Product Management (Add/Edit/Delete)
- Category Management
- User Management
- Inventory Management

## Project Structure

```
project/
├── app/                    # Next.js app directory
│   ├── actions/           # Server actions
│   ├── api/              # API routes
│   ├── admin/            # Admin pages
│   └── [other pages]     # Public and user pages
├── components/            # Reusable React components
├── lib/                  # Utility functions and configurations
├── prisma/              # Database schema and migrations
├── public/              # Static assets
├── styles/              # Global styles
├── hooks/               # Custom React hooks
└── contexts/            # React context providers
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
   Required environment variables:
   ```env
   DATABASE_URL="mysql://user:password@localhost:3306/database"
   NEXTAUTH_SECRET="your-secret-key"
   NEXTAUTH_URL="http://localhost:3000"
   ```
4. Run database migrations:
   ```bash
   npx prisma migrate dev
   ```
5. Start the development server:
   ```bash
   pnpm dev
   ```

## Development

### Code Style
- ESLint for code linting
- Prettier for code formatting
- TypeScript for type safety

### Database Management
- Prisma ORM for database operations
- MySQL as the database
- Database migrations with Prisma

### Authentication
- NextAuth.js for authentication
- JWT tokens for API authentication
- Role-based access control

## Documentation

The project includes comprehensive documentation in the `docs` directory:

- `TECHNICAL.md`: System architecture and technical details
- `API.md`: API endpoints and usage
- `USER_FLOW.md`: User journeys and interactions
- `DATABASE.md`: Database schema and relationships

## Security Features

- Password hashing with bcryptjs
- JWT-based authentication
- Protected API routes
- Input validation with Zod
- CSRF protection
- Rate limiting on API routes

## Performance Optimizations

- Next.js server components
- Image optimization
- Code splitting
- Static page generation where possible
- Database query optimization with Prisma

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License. 