# API Documentation

## Authentication

### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "string",
  "email": "string",
  "password": "string"
}
```

#### Response
```json
{
  "id": "string",
  "name": "string",
  "email": "string",
  "role": "string",
  "created_at": "string"
}
```

### Login User
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "string",
  "password": "string"
}
```

#### Response
```json
{
  "token": "string",
  "user": {
    "id": "string",
    "name": "string",
    "email": "string",
    "role": "string"
  }
}
```

## Products

### List Products
```http
GET /api/products
```

#### Query Parameters
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 10)
- `category`: Category ID
- `search`: Search term
- `sort`: Sort field (price, name, created_at)
- `order`: Sort order (asc, desc)

#### Response
```json
{
  "data": [
    {
      "id": "string",
      "name": "string",
      "description": "string",
      "price": "number",
      "stock": "number",
      "category": {
        "id": "string",
        "name": "string"
      },
      "created_at": "string"
    }
  ],
  "meta": {
    "total": "number",
    "page": "number",
    "limit": "number",
    "total_pages": "number"
  }
}
```

### Get Product
```http
GET /api/products/{id}
```

#### Response
```json
{
  "id": "string",
  "name": "string",
  "description": "string",
  "price": "number",
  "stock": "number",
  "category": {
    "id": "string",
    "name": "string"
  },
  "reviews": [
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
  ],
  "created_at": "string"
}
```

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

## Cart

### Get Cart
```http
GET /api/cart
```

#### Response
```json
{
  "items": [
    {
      "id": "string",
      "product": {
        "id": "string",
        "name": "string",
        "price": "number"
      },
      "quantity": "number",
      "price": "number"
    }
  ],
  "total": "number"
}
```

### Add to Cart
```http
POST /api/cart
Content-Type: application/json

{
  "product_id": "string",
  "quantity": "number"
}
```

#### Response
```json
{
  "id": "string",
  "product": {
    "id": "string",
    "name": "string",
    "price": "number"
  },
  "quantity": "number",
  "price": "number"
}
```

### Update Cart Item
```http
PUT /api/cart/{id}
Content-Type: application/json

{
  "quantity": "number"
}
```

#### Response
```json
{
  "id": "string",
  "product": {
    "id": "string",
    "name": "string",
    "price": "number"
  },
  "quantity": "number",
  "price": "number"
}
```

### Remove from Cart
```http
DELETE /api/cart/{id}
```

## Orders

### Create Order
```http
POST /api/orders
Content-Type: application/json

{
  "address_id": "string",
  "payment_method_id": "string"
}
```

#### Response
```json
{
  "id": "string",
  "total": "number",
  "status": "string",
  "items": [
    {
      "id": "string",
      "product": {
        "id": "string",
        "name": "string",
        "price": "number"
      },
      "quantity": "number",
      "price": "number"
    }
  ],
  "address": {
    "street": "string",
    "city": "string",
    "state": "string",
    "zip": "string",
    "country": "string"
  },
  "created_at": "string"
}
```

### List Orders
```http
GET /api/orders
```

#### Query Parameters
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 10)
- `status`: Order status

#### Response
```json
{
  "data": [
    {
      "id": "string",
      "total": "number",
      "status": "string",
      "created_at": "string"
    }
  ],
  "meta": {
    "total": "number",
    "page": "number",
    "limit": "number",
    "total_pages": "number"
  }
}
```

### Get Order
```http
GET /api/orders/{id}
```

#### Response
```json
{
  "id": "string",
  "total": "number",
  "status": "string",
  "items": [
    {
      "id": "string",
      "product": {
        "id": "string",
        "name": "string",
        "price": "number"
      },
      "quantity": "number",
      "price": "number"
    }
  ],
  "address": {
    "street": "string",
    "city": "string",
    "state": "string",
    "zip": "string",
    "country": "string"
  },
  "payment_method": {
    "type": "string",
    "last_four": "string"
  },
  "created_at": "string"
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

## Error Responses

### Validation Error
```json
{
  "error": "Validation Error",
  "message": "Invalid input data",
  "details": [
    {
      "field": "string",
      "message": "string"
    }
  ]
}
```

### Authentication Error
```json
{
  "error": "Authentication Error",
  "message": "Invalid credentials"
}
```

### Authorization Error
```json
{
  "error": "Authorization Error",
  "message": "Insufficient permissions"
}
```

### Not Found Error
```json
{
  "error": "Not Found",
  "message": "Resource not found"
}
```

### Server Error
```json
{
  "error": "Server Error",
  "message": "Internal server error"
}
```

## Rate Limiting

- 100 requests per minute for authenticated users
- 20 requests per minute for unauthenticated users
- Rate limit headers included in response:
  - `X-RateLimit-Limit`
  - `X-RateLimit-Remaining`
  - `X-RateLimit-Reset`

## Authentication

- JWT token required for authenticated endpoints
- Token included in Authorization header:
  ```
  Authorization: Bearer <token>
  ```
- Token expiration: 24 hours
- Refresh token available for extending session

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