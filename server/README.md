# Driving App Server API Documentation

Backend API for the Driving App (Node.js + Express + MongoDB). Provides user management, ride booking, car rentals, payments, drivers, cars, and admin dashboard statistics.

## Table of Contents
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Authentication & Roles](#authentication--roles)
- [Validation](#validation)
- [API Conventions](#api-conventions)
- [Resources](#api-endpoints)
  - [Users](#user-management)
  - [Cars](#car-management)
  - [Drivers](#driver-management)
  - [Rides](#ride-booking)
  - [Rentals](#car-rentals)
  - [Payments](#payments)
  - [Dashboard](#dashboard)
- [Error Handling](#error-handling)
- [Project Structure](#project-structure)
- [License](#license)

## Getting Started

### Prerequisites
- Node.js
- MongoDB
- npm or yarn

### Installation
1. Install dependencies:
```bash
npm install
```
2. Create `.env` (see below)
3. Start the server:
```bash
npm start
```

## Environment Variables
Required `.env` keys:
```
PORT=3000
MONGODB_URI=mongodb://localhost:27017/driving_app
JWT_SECRET=replace_with_strong_secret
```
Optional: add any logging / feature flags as needed.

## Authentication & Roles

JWT-based authentication. Supply the token in every protected request:
```
Authorization: Bearer <token>
```

Roles:
- `user`: Can manage own profile, create rides/rentals, view their bookings & payments.
- `driver`: (Assumed mapped from a user with an associated driver record) Can update ride statuses where assigned (middleware `authDriver`).
- `admin`: Full administrative actions (create/update/delete cars, drivers, manage statuses, dashboard overview, payment status, etc.).

Middleware used in routes:
- `authUser`: Requires a valid token.
- `authAdmin`: Requires authenticated user to have admin privileges; placed after `authUser`.
- `authDriver`: Allows ride status changes for drivers (or admin). Usually combined with `authUser` before it.

## Validation
Input validation implemented with `express-validator`. Validation errors respond with HTTP 400 and an `errors` array. See specific field rules per endpoint below.

## API Conventions
- Base URL prefix: `http://localhost:3000/api`
- All IDs are MongoDB ObjectIds.
- Timestamps are ISO8601 strings (UTC) unless stated otherwise.
- Soft deletes: resources may have status/state changed instead of being physically removed.
- Status enumerations are strictly validated; invalid values return 400.

---

## API Endpoints

### Base URL
```
http://localhost:3000/api
```

---

## User Management

Base Path: `/api/users`

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | /register | Public | Create user & return JWT |
| POST | /login | Public | Authenticate & return JWT |
| GET | /:id | User/Admin | Get user profile (self or admin) |
| PUT | /:id | User/Admin | Update profile (self or admin) |
| DELETE | /:id | User/Admin | Soft delete user (self or admin) |

### Validation (Register)
| Field | Rules |
|-------|-------|
| email | valid email, required |
| fullname.firstname | min length 2, required |
| fullname.lastname | optional |
| password | min length 6, required |
| phone | min length 10, required |

### Validation (Login)
| Field | Rules |
|-------|-------|
| email | valid email, required |
| password | min length 6, required |

### POST `/api/users/register`
Creates a new user account.

#### Request Body
```json
{
  "fullname": {
    "firstname": "John",
    "lastname": "Doe"
  },
  "email": "john.doe@example.com",
  "phone": "+1234567890",
  "password": "securepassword123"
}
```

#### Success Response (201)
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "_id": "60d5ec49f1a2c8b1f8e4e1a1",
    "fullname": {
      "firstname": "John",
      "lastname": "Doe"
    },
    "email": "john.doe@example.com",
    "phone": "+1234567890",
    "role": "user",
    "createdAt": "2023-06-25T10:30:00.000Z"
  }
}
```

### POST `/api/users/login`
Authenticates an existing user.

#### Request Body
```json
{
  "email": "john.doe@example.com",
  "password": "securepassword123"
}
```

#### Success Response (200)
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "_id": "60d5ec49f1a2c8b1f8e4e1a1",
    "fullname": {
      "firstname": "John",
      "lastname": "Doe"
    },
    "email": "john.doe@example.com",
    "phone": "+1234567890",
    "role": "user"
  }
}
```

### GET `/api/users/:id`
Get user profile. Users can only access their own profile unless they're admin.

**Authentication**: Required

### PUT `/api/users/:id`
Update user profile. Users can only update their own profile unless they're admin.

**Authentication**: Required

### DELETE `/api/users/:id`
Soft delete user account. Users can only delete their own account unless they're admin.

**Authentication**: Required

---

## Car Management

Base Path: `/api/cars`

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | / | Admin | Create car |
| GET | / | User | List cars (filterable) |
| GET | /:id | User | Get car by id |
| PUT | /:id | Admin | Update car |
| DELETE | /:id | Admin | Soft delete (set status MAINTENANCE) |

### Query Filters (GET /api/cars)
| Param | Description |
|-------|-------------|
| status | AVAILABLE, ON_RIDE, RENTED, MAINTENANCE |
| capacity | Minimum capacity (integer) |

### Validation (Create / Update)
| Field | Rules |
|-------|-------|
| model | required (create) / optional non-empty (update) |
| licensePlate | required (create) / optional non-empty (update) |
| capacity | int >=1 |
| pricePerKm | optional float >=0 |
| pricePerDay | optional float >=0 |
| status (update) | one of AVAILABLE, ON_RIDE, RENTED, MAINTENANCE |

### POST `/api/cars`
Add a new car. **Admin only**.

**Authentication**: Required (Admin)

#### Request Body
```json
{
  "model": "Toyota Camry",
  "licensePlate": "ABC123",
  "capacity": 4,
  "pricePerKm": 2.5,
  "pricePerDay": 80
}
```

#### Success Response (201)
```json
{
  "car": {
    "_id": "60d5ec49f1a2c8b1f8e4e1a2",
    "model": "Toyota Camry",
    "licensePlate": "ABC123",
    "capacity": 4,
    "status": "AVAILABLE",
    "pricePerKm": 2.5,
    "pricePerDay": 80,
    "createdAt": "2023-06-25T10:30:00.000Z"
  }
}
```

### GET `/api/cars`
Get all cars with optional filters.

**Authentication**: Required

#### Query Parameters
- `status`: Filter by car status (AVAILABLE, ON_RIDE, RENTED, MAINTENANCE)
- `capacity`: Minimum capacity required

### GET `/api/cars/:id`
Get single car details.

**Authentication**: Required

### PUT `/api/cars/:id`
Update car details. **Admin only**.

**Authentication**: Required (Admin)

### DELETE `/api/cars/:id`
Soft delete a car (marks as MAINTENANCE). **Admin only**.

**Authentication**: Required (Admin)

---

## Driver Management

Base Path: `/api/drivers`

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | / | Admin | Create driver (attach to existing user) |
| GET | / | User | List drivers |
| GET | /:id | User | Get driver by id |
| PUT | /:id | Admin | Update driver (license/status/currentCarId) |
| DELETE | /:id | Admin | Soft delete (set OFFLINE) |

### Validation (Create / Update)
| Field | Rules |
|-------|-------|
| userId (create) | MongoId required |
| licenseNumber | required (create) / optional non-empty (update) |
| status (update) | AVAILABLE, ON_RIDE, OFFLINE |
| currentCarId (update) | optional MongoId |

### POST `/api/drivers`
Add a new driver. **Admin only**.

**Authentication**: Required (Admin)

#### Request Body
```json
{
  "userId": "60d5ec49f1a2c8b1f8e4e1a1",
  "licenseNumber": "DL123456789"
}
```

### GET `/api/drivers`
Get all drivers with optional filters.

**Authentication**: Required

### GET `/api/drivers/:id`
Get single driver details.

**Authentication**: Required

### PUT `/api/drivers/:id`
Update driver info. **Admin only**.

**Authentication**: Required (Admin)

### DELETE `/api/drivers/:id`
Soft delete driver (marks as OFFLINE). **Admin only**.

**Authentication**: Required (Admin)

---

## Ride Booking

Base Path: `/api/rides`

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | / | User | Create ride booking |
| GET | /:id | User | Get ride booking by id |
| GET | /user/:userId | User/Admin | List rides for a user |
| PUT | /:id/status | Driver/Admin | Update ride booking status |

### Validation (Create Ride)
| Field | Rules |
|-------|-------|
| startTime | ISO8601 required |
| pickupLocation.address | required |
| pickupLocation.coordinates | array length 2 [lng, lat] |
| dropoffLocation.address | required |
| dropoffLocation.coordinates | array length 2 [lng, lat] |
| cars | array min 1 |
| cars[].carId | MongoId required |

### Validation (Status Update)
| Field | Rules |
|-------|-------|
| status | PENDING, CONFIRMED, ONGOING, COMPLETED, CANCELLED |

### POST `/api/rides`
Create a new ride booking.

**Authentication**: Required

#### Request Body
```json
{
  "startTime": "2023-06-25T14:00:00.000Z",
  "pickupLocation": {
    "address": "123 Main St, City",
    "coordinates": [-73.935242, 40.730610]
  },
  "dropoffLocation": {
    "address": "456 Oak Ave, City",
    "coordinates": [-73.925242, 40.735610]
  },
  "cars": [
    {
      "carId": "60d5ec49f1a2c8b1f8e4e1a2"
    }
  ]
}
```

### GET `/api/rides/:id`
Get ride details.

**Authentication**: Required

### GET `/api/rides/user/:userId`
Get all rides for a user.

**Authentication**: Required (Own rides or Admin)

### PUT `/api/rides/:id/status`
Update ride status. **Driver or Admin only**.

**Authentication**: Required (Driver/Admin)

**Valid statuses**: PENDING, CONFIRMED, ONGOING, COMPLETED, CANCELLED

---

## Car Rentals

Base Path: `/api/rentals`

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | / | User | Create rental booking |
| GET | /:id | User | Get rental by id |
| GET | /user/:userId | User/Admin | List rentals for a user |
| PUT | /:id/status | Admin | Update rental status |

### Validation (Create Rental)
| Field | Rules |
|-------|-------|
| startTime | ISO8601 required |
| endTime | ISO8601 required |
| pickupLocation.address | required |
| pickupLocation.coordinates | array length 2 [lng, lat] |
| cars | array min 1 |
| cars[].carId | MongoId required |

### Validation (Status Update)
| Field | Rules |
|-------|-------|
| status | PENDING, CONFIRMED, ONGOING, COMPLETED, CANCELLED |

### POST `/api/rentals`
Create a new rental booking (multiple cars possible).

**Authentication**: Required

#### Request Body
```json
{
  "startTime": "2023-06-25T09:00:00.000Z",
  "endTime": "2023-06-27T18:00:00.000Z",
  "pickupLocation": {
    "address": "123 Main St, City",
    "coordinates": [-73.935242, 40.730610]
  },
  "cars": [
    {
      "carId": "60d5ec49f1a2c8b1f8e4e1a2"
    },
    {
      "carId": "60d5ec49f1a2c8b1f8e4e1a5"
    }
  ]
}
```

### GET `/api/rentals/:id`
Get rental details.

**Authentication**: Required

### GET `/api/rentals/user/:userId`
Get all rentals for a user.

**Authentication**: Required (Own rentals or Admin)

### PUT `/api/rentals/:id/status`
Update rental status. **Admin only**.

**Authentication**: Required (Admin)

---

## Payments

Base Path: `/api/payments`

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | / | User | Create payment for booking (ride or rental) |
| GET | /:id | User | Get payment by id |
| GET | /user/:userId | User/Admin | List payments for a user |
| PUT | /:id/status | Admin | Update payment status |

### Validation (Create Payment)
| Field | Rules |
|-------|-------|
| bookingId | MongoId required |
| amount | float >=0 |
| method | CASH, CARD, WALLET, UPI |

### Validation (Status Update)
| Field | Rules |
|-------|-------|
| status | PENDING, PAID, FAILED |

### POST `/api/payments`
Create a payment for a ride or rental.

**Authentication**: Required

#### Request Body
```json
{
  "bookingId": "60d5ec49f1a2c8b1f8e4e1a4",
  "amount": 100,
  "method": "CARD"
}
```

**Valid methods**: CASH, CARD, WALLET, UPI

### GET `/api/payments/:id`
Get payment details.

**Authentication**: Required

### GET `/api/payments/user/:userId`
Get all payments for a user.

**Authentication**: Required (Own payments or Admin)

### PUT `/api/payments/:id/status`
Update payment status. **Admin only**.

**Authentication**: Required (Admin)

**Valid statuses**: PENDING, PAID, FAILED

---

## Dashboard

Base Path: `/api/dashboard`

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | /overview | Admin | Aggregate stats overview |

### GET `/api/dashboard/overview`
Get summary statistics. **Admin only**.

**Authentication**: Required (Admin)

#### Success Response (200)
```json
{
  "overview": {
    "stats": {
      "totalUsers": 150,
      "totalCars": 25,
      "totalDrivers": 30,
      "totalBookings": 500,
      "totalPayments": 450,
      "activeRides": 5,
      "activeRentals": 3,
      "availableCars": 15,
      "availableDrivers": 20,
      "totalRevenue": 25000
    },
    "recentBookings": [...]
  }
}
```

---

## Error Handling

The API uses standard HTTP status codes:

- **200 OK**: Success
- **201 Created**: Resource created successfully
- **400 Bad Request**: Invalid request
- **401 Unauthorized**: Authentication required
- **403 Forbidden**: Access denied
- **404 Not Found**: Resource not found
- **500 Internal Server Error**: Server error

### Error Response Format

```json
{
  "error": "Error message description"
}
```

For validation errors:
```json
{
  "errors": [
    {
      "msg": "Error message",
      "param": "field_name",
      "location": "body"
    }
  ]
}
```

---

## Project Structure

```
server/
├── app.js                    # Express app configuration
├── server.js                # Server entry point
├── package.json             # Dependencies and scripts
├── controllers/             # Route handlers
├── db/                      # Database configuration
├── middleware/              # Custom middleware
├── models/                  # Database models
├── routes/                  # API routes
└── services/               # Business logic
```

---

## License

MIT License.
