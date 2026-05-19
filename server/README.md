# Ranny's Clothing Backend API

Production-ready Express and MongoDB API for Ranny's Clothing.

## Scripts

```bash
npm run server
npm run server:dev
```

## Environment

Copy `server/.env.example` to `server/.env` and set MongoDB Atlas, Cloudinary, JWT, CORS, and WhatsApp values.

## Core Routes

Public storefront:

```http
GET /api/products
GET /api/products?category=Dresses&minPrice=100&maxPrice=500&sort=price-low&page=1&limit=12
GET /api/products/search?keyword=dress
GET /api/products/featured
GET /api/products/trending
GET /api/products/new-arrivals
GET /api/products/:idOrSlug
POST /api/orders
GET /api/banners?placement=home-hero
POST /api/subscribers
```

Admin:

```http
POST /api/auth/login
GET /api/auth/me
POST /api/products
PATCH /api/products/:id
PATCH /api/products/:id/inventory
DELETE /api/products/:id
GET /api/orders
PATCH /api/orders/:id/status
POST /api/uploads
DELETE /api/uploads
POST /api/banners
PATCH /api/banners/:id
DELETE /api/banners/:id
GET /api/subscribers
DELETE /api/subscribers/:id
```

Admin routes require:

```http
Authorization: Bearer <jwt>
```

## Product Example

```json
{
  "name": "Silk Evening Dress",
  "description": "Elegant imported dress for confident evenings.",
  "category": "Dresses",
  "subcategory": "Evening",
  "price": 450,
  "discountPrice": 399,
  "images": [
    {
      "url": "https://res.cloudinary.com/example/image/upload/v1/dress.jpg",
      "optimizedUrl": "https://res.cloudinary.com/example/image/upload/f_auto,q_auto/v1/dress.jpg",
      "publicId": "rannys-clothing/products/dress"
    }
  ],
  "sizes": ["S", "M", "L"],
  "colors": ["Black", "Gold"],
  "stock": 12,
  "isFeatured": true,
  "isTrending": true,
  "tags": ["new", "china-drop"]
}
```

## Order Example

```json
{
  "customer": {
    "name": "Ama Mensah",
    "phone": "+233555000000",
    "address": "East Legon",
    "city": "Accra",
    "deliveryNotes": "Call before delivery"
  },
  "products": [
    {
      "product": "665000000000000000000000",
      "quantity": 1,
      "size": "M",
      "color": "Black"
    }
  ],
  "shippingFee": 30,
  "paymentMethod": "Mobile Money"
}
```

`createdAt` on products powers the frontend drop engine for `JUST DROPPED` and `NEW ARRIVAL` badges.
