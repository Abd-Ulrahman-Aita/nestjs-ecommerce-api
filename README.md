# 🛒 E-Commerce API

This is a RESTful API for a simple e-commerce platform built with **NestJS**, **PostgreSQL**, and **JWT Authentication**. The API supports product management, user authentication, order creation, and more.

---

## 📦 Features

- User registration, login, and email verification
- JWT authentication and role-based access control (Guards)
- Product management (CRUD)
- Order creation with stock deduction using PostgreSQL transactions
- Forgot/reset password functionality
- Swagger documentation
- Multilingual support using i18n
- Prisma ORM integration

---

## 🚀 Technologies Used

- **NestJS** (with Modules, Controllers, Services)
- **PostgreSQL** with **Prisma ORM**
- **JWT** for authentication
- **Swagger** for API documentation
- **TypeScript**
- **i18n** for multilingual support

---

## 🧾 Installation

```bash
git clone https://github.com/Abd-Ulrahman-Aita/nestjs-ecommerce-api.git
cd nestjs-ecommerce-api
yarn install
```

---

## ⚙️ Configuration

Create a `.env` file based on `.env.example`:

```env
PORT=3000

DATABASE_URL=postgresql://USER:PASSWORD@localhost:5432/ecommerce

JWT_SECRET=supersecretkey
JWT_EXPIRES_IN=1d

MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USER=your_smtp_user
MAIL_PASSWORD=your_smtp_password
MAIL_FROM="Ecommerce App" <your@email.com>
```

---

## 📂 Project Structure

```
src/
├── prisma/
├── auth/
├── products/
├── orders/
├── common/
├── i18n/
├── mail/
├── utils/
├── main.ts
└── app.module.ts
```

---

## 🧪 Running the Server

```bash
yarn run start:dev   # development
yarn run build       # build
yarn run start:prod  # production
```

---

## 🔐 Authentication

- Uses JWT in `Authorization` header (Bearer token)
- Role-based access control using Guards

---

## 🛠 API Endpoints Overview

### ✅ Auth

| Method | Endpoint              | Description                      |
|--------|-----------------------|----------------------------------|
| POST   | /auth/register        | Register a new user              |
| POST   | /auth/verify-email    | Verify user email                |
| POST   | /auth/login           | Login and receive token          |
| POST   | /auth/forgot-password | Send reset link                  |
| POST   | /auth/reset-password  | Reset password                   |
| GET    | /auth/profile         | Get logged-in user profile       |

### 📦 Products

| Method | Endpoint       | Description                      |
|--------|----------------|----------------------------------|
| GET    | /products      | Get all products (public)        |
| GET    | /products/:id  | Get product details              |
| POST   | /products      | Create product (authenticated)   |
| PATCH  | /products/:id  | Update product (admin only)      |
| DELETE | /products/:id  | Delete product (admin only)      |

### 📬 Orders

| Method | Endpoint       | Description                      |
|--------|----------------|----------------------------------|
| POST   | /orders        | Create new order (protected)     |
| GET    | /orders        | Get current user's orders        |
| GET    | /orders/all    | Get all orders (admin only)      |
| DELETE | /orders/:id    | Delete order (admin only)        |

---

## 📘 API Documentation (Swagger)

Once the server is running, open your browser:

```
http://localhost:3000/api-docs
```

Swagger UI will allow you to explore and test all endpoints directly.

---

## 💾 PostgreSQL Transaction Support

Order creation uses PostgreSQL **transactions** via Prisma to ensure that product stock and order creation are atomic. If anything fails, everything rolls back.

---

## 🧑‍💻 Roles

- `USER` – can view products, place orders
- `ADMIN` – can manage products and view/delete all orders

---

## 🗣️ Localization

Supports multiple languages (e.g., Arabic/English) via `nestjs-i18n`.

---

## 🌱 Prisma Seeders

To run the seed script:

```bash
yarn seed
```

don't miss to add seed script to package.json
```bash
"seed": "ts-node prisma/seed.ts"
```

This creates an admin user (`admin@example.com` / `admin123`) and adds sample products if they don't already exist.

---

## 📄 License

This project is licensed under the MIT License.

---

## 👨‍💻 Author

Made with ❤️ by Abd Ulrahman Aita