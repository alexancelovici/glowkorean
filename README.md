# 🌸 GlowKorean – Full-Stack E-Commerce Platform

Full-stack e-commerce application for Korean skincare products.  
Built with a **React + Vite frontend** and a **Node.js + Express backend**, featuring JWT authentication, product management, cart persistence, and a simulated checkout flow.

🔗 Live demo (frontend): https://glowkorean.netlify.app/

---

## 🧠 Overview

GlowKorean models a real online store workflow:

- Users can browse products, register, and log in securely
- Authenticated users manage a persistent shopping cart
- Admin users can create and manage products
- The system exposes a REST API consumed by the frontend

The project focuses on **full-stack architecture, authentication, and clean API design**.

---

## 🛠 Tech Stack

### Frontend
- React
- Vite
- TailwindCSS
- React Router DOM
- Axios

### Backend
- Node.js
- Express.js
- MongoDB + Mongoose
- JSON Web Tokens (JWT)
- HTTP-only cookies
- cookie-parser
- dotenv

---

## ✨ Features

- Product catalog with image, price, and description
- User registration and login
- JWT authentication using HTTP-only cookies
- Protected routes (profile, cart, admin actions)
- Persistent shopping cart with quantity updates
- Simulated checkout flow
- Admin panel for product creation
- Error handling for authentication, validation, and 404 routes
- Responsive UI with TailwindCSS

---

## 🔐 Authentication & Security

- JWT stored in **HTTP-only cookies**
- Protected backend routes enforced via middleware
- Session persistence across refreshes
- Environment variables used for secrets and configuration
- CORS configured to allow only trusted frontend origins

---

## 📦 Project Structure

frontend/
├── components/ # Reusable UI components
├── contexts/ # Global state (auth, cart, products)
├── routes/ # Protected and public views
├── utils/ # Helper functions
├── Router.jsx # Routing configuration
└── main.jsx # Entry point
backend/
├── controllers/ # Business logic
├── middleware/ # Auth & security middleware
├── models/ # Mongoose models
├── routes/ # Express routes
└── index.js # Server entry point


---

## ⚙️ Environment Variables

### Backend (`backend/.env`)
PORT=3000
MONGODB_URI=<your_mongodb_connection>
JWT_SECRET=<your_jwt_secret>
NODE_ENV=development
FRONTEND_URL_DEV=http://localhost:5173
FRONTEND_URL_PROD=<your_frontend_url>


### Frontend (`frontend/.env`)
VITE_BACKEND_URL=http://localhost:3000/api

Example files are provided via `.env.example`.

---

## ▶️ Run Locally

### Backend
```bash
cd backend
npm install
npm run dev
Frontend
cd frontend
npm install
npm run dev
🧪 Seed Sample Products (Optional)
cd backend
node insert_products.js
This will populate the database with example products.
🗺️ Roadmap
Real Stripe payment integration
Order history and admin order management
Product search and advanced filtering
Wishlist / favorites
Notification system
📄 License
MIT License
👨‍💻 Author
Alex Ancelovici
Full-Stack Developer (Node.js, Express, React, REST APIs)
