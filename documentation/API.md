# API Documentation

## Authentication Endpoints

### POST /api/auth/register
Register a new user.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123",
  "name": "John Doe"
}
```

**Response:**
```json
{
  "user": {
    "id": "user_id",
    "email": "user@example.com",
    "name": "John Doe"
  }
}
```

### POST /api/auth/login
Login user.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "token": "jwt_token",
  "user": {
    "id": "user_id",
    "email": "user@example.com",
    "name": "John Doe"
  }
}
```

## Product Endpoints

### GET /api/products
Get all products with optional filtering.

**Query Parameters:**
- `category`: Filter by category
- `search`: Search by name
- `page`: Page number
- `limit`: Items per page

**Response:**
```json
{
  "products": [
    {
      "id": "product_id",
      "name": "Product Name",
      "description": "Description",
      "price": 99.99,
      "images": ["url1", "url2"],
      "category": "Category Name",
      "stock": 100
    }
  ],
  "total": 50,
  "page": 1,
  "limit": 10
}
```

### GET /api/products/:id
Get single product details.

**Response:**
```json
{
  "id": "product_id",
  "name": "Product Name",
  "description": "Description",
  "price": 99.99,
  "images": ["url1", "url2"],
  "category": "Category Name",
  "stock": 100
}
```

## Cart Endpoints

### GET /api/cart
Get user's cart.

**Response:**
```json
{
  "items": [
    {
      "id": "cart_item_id",
      "product": {
        "id": "product_id",
        "name": "Product Name",
        "price": 99.99,
        "image": "url"
      },
      "quantity": 2
    }
  ],
  "total": 199.98
}
```

### POST /api/cart
Add item to cart.

**Request Body:**
```json
{
  "productId": "product_id",
  "quantity": 1
}
```

### PUT /api/cart/:itemId
Update cart item quantity.

**Request Body:**
```json
{
  "quantity": 2
}
```

### DELETE /api/cart/:itemId
Remove item from cart.

## Order Endpoints

### POST /api/orders
Create new order.

**Request Body:**
```json
{
  "shippingInfo": {
    "address": "123 Street",
    "city": "City",
    "postalCode": "12345",
    "country": "Country"
  },
  "paymentInfo": {
    "method": "card",
    "cardNumber": "****1234"
  }
}
```

### GET /api/orders
Get user's orders.

**Response:**
```json
{
  "orders": [
    {
      "id": "order_id",
      "status": "PENDING",
      "total": 199.98,
      "items": [
        {
          "product": {
            "name": "Product Name",
            "price": 99.99
          },
          "quantity": 2
        }
      ],
      "createdAt": "2024-03-20T10:00:00Z"
    }
  ]
}
```

## Admin Endpoints

### GET /api/admin/products
Get all products (admin only).

### POST /api/admin/products
Create new product (admin only).

**Request Body:**
```json
{
  "name": "Product Name",
  "description": "Description",
  "price": 99.99,
  "categoryId": "category_id",
  "stock": 100,
  "images": ["url1", "url2"]
}
```

### PUT /api/admin/products/:id
Update product (admin only).

### DELETE /api/admin/products/:id
Delete product (admin only).

## Error Responses

All endpoints may return the following error responses:

```json
{
  "error": "Error message",
  "status": 400
}
```

Common status codes:
- 200: Success
- 201: Created
- 400: Bad Request
- 401: Unauthorized
- 403: Forbidden
- 404: Not Found
- 500: Server Error

## Authentication

Most endpoints require authentication using JWT tokens. Include the token in the Authorization header:

```
Authorization: Bearer <token>
```

## Rate Limiting

API endpoints are rate-limited to prevent abuse:
- 100 requests per minute for authenticated users
- 20 requests per minute for unauthenticated users

## Categories

### List Categories
```http
GET /api/categories
```

#### Response
```json
{
  "data": [
    {
      "id": "string",
      "name": "string",
      "description": "string",
      "product_count": "number"
    }
  ]
}
```

### Get Category
```http
GET /api/categories/{id}
```

#### Response
```json
{
  "id": "string",
  "name": "string",
  "description": "string",
  "products": [
    {
      "id": "string",
      "name": "string",
      "price": "number",
      "stock": "number",
      "created_at": "string"
    }
  ]
}
```

## User Profile

### Get Profile
```http
GET /api/profile
```

#### Response
```json
{
  "id": "string",
  "name": "string",
  "email": "string",
  "addresses": [
    {
      "id": "string",
      "street": "string",
      "city": "string",
      "state": "string",
      "zip": "string",
      "country": "string",
      "is_default": "boolean"
    }
  ],
  "payment_methods": [
    {
      "id": "string",
      "type": "string",
      "last_four": "string",
      "is_default": "boolean"
    }
  ]
}
```

### Update Profile
```http
PUT /api/profile
Content-Type: application/json

{
  "name": "string",
  "email": "string"
}
```

#### Response
```json
{
  "id": "string",
  "name": "string",
  "email": "string",
  "updated_at": "string"
}
```

### Add Address
```http
POST /api/profile/addresses
Content-Type: application/json

{
  "street": "string",
  "city": "string",
  "state": "string",
  "zip": "string",
  "country": "string",
  "is_default": "boolean"
}
```

#### Response
```json
{
  "id": "string",
  "street": "string",
  "city": "string",
  "state": "string",
  "zip": "string",
  "country": "string",
  "is_default": "boolean",
  "created_at": "string"
}
```

### Add Payment Method
```http
POST /api/profile/payment-methods
Content-Type: application/json

{
  "type": "string",
  "number": "string",
  "expiry": "string",
  "cvv": "string",
  "is_default": "boolean"
}
```

#### Response
```json
{
  "id": "string",
  "type": "string",
  "last_four": "string",
  "is_default": "boolean",
  "created_at": "string"
}
```

## Reviews

### Create Review
```http
POST /api/products/{id}/reviews
Content-Type: application/json

{
  "rating": "number",
  "comment": "string"
}
```

#### Response
```json
{
  "id": "string",
  "rating": "number",
  "comment": "string",
  "user": {
    "id": "string",
    "name": "string"
  },
  "created_at": "string"
}
```

## Webhooks

### Order Status Update
```http
POST /api/webhooks/order-status
Content-Type: application/json

{
  "order_id": "string",
  "status": "string",
  "timestamp": "string"
}
```

### Payment Status Update
```http
POST /api/webhooks/payment-status
Content-Type: application/json

{
  "order_id": "string",
  "status": "string",
  "transaction_id": "string",
  "timestamp": "string"
}
```

## Versioning

- API version included in URL: `/api/v1/...`
- Version header also supported: `X-API-Version: 1`
- Breaking changes will increment major version
- Minor changes will increment minor version
- Documentation updated for each version 