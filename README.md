# Personal Finance Tracker 💰

A full-stack Personal Finance Tracker built with the MERN stack. This application helps users manage their income, expenses, budgets, savings, and monitor their financial activities through an interactive dashboard.

## 🚀 Features

- User Registration and Login
- JWT Authentication with Access and Refresh Tokens
- Secure User Authentication
- Dashboard with Financial Summary
- Income Management
- Expense Management
- Create, Update and Delete Transactions
- Transaction History
- Budget Management
- Budget Notifications
- Financial Notifications
- Income and Expense Charts
- User Profile Management
- Profile Image Upload using Cloudinary
- Responsive UI for Mobile, Tablet and Desktop

## 🛠️ Tech Stack

### Frontend
- React.js
- React Router DOM
- Tailwind CSS
- Recharts
- Lucide React
- JavaScript

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT Authentication
- Bcrypt
- Multer
- Cloudinary

## 📂 Project Structure

```text
personal-finance-tracker/
│
├── client/
│   ├── src/
│   ├── public/
│   ├── .env.example
│   └── package.json
│
├── server/
│   ├── config/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   ├── utils/
│   ├── .env.example
│   └── package.json
│
└── README.md
```

## ⚙️ Installation & Setup

### 1. Clone Repository

```bash
git clone YOUR_GITHUB_REPOSITORY_URL
```

### 2. Navigate to Project

```bash
cd personal-finance-tracker
```

## 🖥️ Backend Setup

### 3. Navigate to Server Folder

```bash
cd server
```

### 4. Install Dependencies

```bash
npm install
```

### 5. Configure Environment Variables

Create a `.env` file inside the server folder by copying `.env.example`.

Add your own credentials:

```env
PORT=
HOST=
MONGO_URI=
FRONTED_URL=
JWT_SECRET=
JWT_REFRESH=
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
```

**Required Services:**
- MongoDB: For database connection.
- Cloudinary: For profile image uploads.

### 6. Start Backend Server

```bash
npm run dev
```

## 💻 Frontend Setup

### 7. Open a New Terminal

Navigate to the frontend folder:

```bash
cd client
```

### 8. Install Dependencies

```bash
npm install
```

### 9. Configure Frontend Environment Variables

Create a `.env` file inside the frontend folder using `.env.example`.

```env
VITE_API_URL=
```

Add your backend API base URL.

For local development, it may look like:

```env
VITE_API_URL=http://localhost:5000/api
```

### 10. Start Frontend

```bash
npm run dev
```

### 11. Open Application

Open the local URL provided by Vite, usually:

```text
http://localhost:5173
```

## 🔐 Environment Variables

The project requires environment variables for database connection, authentication, frontend/backend communication, and image uploads.

Never upload your actual `.env` files or private credentials to GitHub.

Use the provided `.env.example` files as templates.

## 📱 Responsive Design

The application is designed to work across:

- Desktop
- Laptop
- Tablet
- Mobile Devices

## 👨‍💻 Author

**Muhammad Yahya**

MERN Stack Developer

GitHub: https://github.com/yahyadeveloper261


## 📄 License

Copyright (c) 2026 Muhammad Yahya.

All rights reserved.

This project is proprietary software. Unauthorized copying,
modification, distribution, or commercial use of this project's
source code is prohibited without prior written permission
from the copyright owner.