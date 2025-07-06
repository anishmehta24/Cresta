# Driving App Server API Documentation

This is the backend API for the Driving App, built with Node.js and Express.

## Table of Contents
- [Getting Started](#getting-started)
- [API Endpoints](#api-endpoints)
  - [User Registration](#user-registration)
  - [User Login](#user-login)
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
