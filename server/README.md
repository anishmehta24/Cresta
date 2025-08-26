# Driving App Server API Documentation

This is the backend API for the Driving App, built with Node.js and Express. The app provides ride booking and car rental services for a private company.

## Table of Contents
- [Getting Started](#getting-started)
- [Authentication](#authentication)
- [API Endpoints](#api-endpoints)
  - [User Management](#user-management)
  - [Car Management](#car-management)
  - [Driver Management](#driver-management)
  - [Ride Booking](#ride-booking)
  - [Car Rentals](#car-rentals)
  - [Payments](#payments)
  - [Dashboard](#dashboard)
- [Error Handling](#error-handling)

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

2. Set up environment variables in `.env` file:
```
JWT_SECRET=your_jwt_secret_key
MONGODB_URI=your_mongodb_connection_string
PORT=3000
```

3. Start the server:
```bash
npm start
```

## Authentication

The API uses JSON Web Tokens (JWT) for authentication. Include the token in the Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

### Roles
- **user**: Regular users who can book rides and rent cars
- **driver**: Drivers who can manage ride bookings
- **admin**: Full access to all resources

---

## API Endpoints

### Base URL
```
http://localhost:3000/api
```

---

## User Management

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

This project is licensed under the MIT License.

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

2. Set up environment variables in `.env` file

3. Start the server:
```bash
npm start
```

## API Endpoints

### Base URL
```
http://localhost:3000/api
```

---

## User Registration

### POST `/api/users/register`

Creates a new user account.

#### Description
This endpoint allows new users to register for the driving app. It validates the user input, hashes the password, checks for existing users, and creates a new user account.

#### Request Body
```json
{
  "fullname": {
    "firstname": "string",
    "lastname": "string"
  },
  "email": "string",
  "phone": "string",
  "password": "string"
}
```

#### Request Body Validation
- `email`: Must be a valid email address
- `fullname.firstname`: Must be at least 2 characters long
- `password`: Must be at least 6 characters long
- `phone`: Required field
- `fullname.lastname`: Optional field

#### Example Request
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

#### Success Response (201 Created)
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
    "createdAt": "2023-06-25T10:30:00.000Z",
    "updatedAt": "2023-06-25T10:30:00.000Z"
  }
}
```


---

## User Login

### POST `/api/users/login`

Authenticates an existing user.

#### Description
This endpoint allows existing users to log in to the driving app. It validates the credentials and returns a JWT token for authentication.

#### Request Body
```json
{
  "email": "string",
  "password": "string"
}
```

#### Request Body Validation
- `email`: Must be a valid email address
- `password`: Must be at least 6 characters long

#### Example Request
```json
{
  "email": "john.doe@example.com",
  "password": "securepassword123"
}
```

#### Success Response (200 OK)
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
    "createdAt": "2023-06-25T10:30:00.000Z",
    "updatedAt": "2023-06-25T10:30:00.000Z"
  }
}
```


---

## Error Handling

The API uses standard HTTP status codes to indicate the success or failure of requests:

- **200 OK**: The request was successful
- **201 Created**: The resource was created successfully
- **400 Bad Request**: The request was invalid or cannot be served
- **401 Unauthorized**: Authentication is required
- **404 Not Found**: The requested resource was not found
- **500 Internal Server Error**: The server encountered an unexpected condition

### Error Response Format

All error responses follow a consistent format:

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

## Authentication

The API uses JSON Web Tokens (JWT) for authentication. After successful login or registration, you'll receive a token that should be included in subsequent requests.

### Using the Token

Include the token in the Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

---


---

## License

This project is licensed under the MIT License.
