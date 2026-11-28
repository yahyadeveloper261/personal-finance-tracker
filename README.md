# 💰 Personal Finance Tracker

A full-stack **Personal Finance Tracker** built with the MERN Stack. This application helps users manage their income, expenses, budgets, and savings while monitoring their financial activities through an interactive dashboard.

## 🚀 Features

- User Registration and Login
- JWT Authentication with Access and Refresh Tokens
- Secure User Authentication
- Interactive Financial Dashboard
- Income Management
- Expense Management
- Create, Update, and Delete Transactions
- Transaction History
- Budget Management
- Budget Notifications
- Financial Notifications
- Income and Expense Charts
- User Profile Management
- Profile Image Upload using Cloudinary
- Responsive UI for Mobile, Tablet, and Desktop

## 🌐 Live Demo

[**Visit Live Website**](https://personal-finance-tracker-eta-sable.vercel.app/)

## 📸 Application Screenshots

### Dashboard

![Dashboard](Screenshorts/Screenshot_24-11-2026_73431_personal-finance-tracker-eta-sable.vercel.app.jpeg)

### Expense Management

![Expense Management](Screenshorts/Screenshot_24-11-2026_74133_personal-finance-tracker-eta-sable.vercel.app.jpeg)

![Expense Management](Screenshorts/Screenshot_24-11-2026_73457_personal-finance-tracker-eta-sable.vercel.app.jpeg)

### Transactions

![Transactions](Screenshorts/Screenshot_24-11-2026_73755_personal-finance-tracker-eta-sable.vercel.app.jpeg)

### Budget Management

![Budget Management](Screenshorts/Screenshot_24-11-2026_73623_personal-finance-tracker-eta-sable.vercel.app.jpeg)

### Settings

![Settings](Screenshorts/Screenshot_24-11-2026_73852_personal-finance-tracker-eta-sable.vercel.app.jpeg)

## 📱 Responsive Design

The application is designed to provide a smooth experience across different screen sizes.

### 💻 Desktop

#### Dashboard

![Desktop Dashboard](Screenshorts/destok.dashboard.png)

#### Income

![Desktop Income](Screenshorts/destok.income.png)

#### Expense

![Desktop Expense](Screenshorts/destok.expense.png)

#### Budget

![Desktop Budget](Screenshorts/destok.budget.png)

#### Transactions

![Desktop Transactions](Screenshorts/destok.transaction.png)

#### Profile / Settings

![Desktop Settings](Screenshorts/destok.setting.png)

### 📱 Mobile

#### Dashboard

![Mobile Dashboard](Screenshorts/m.dashbaord.png)

#### Income

![Mobile Income](Screenshorts/m.income.png)

#### Expense

![Mobile Expense](Screenshorts/m.expense.png)

#### Budget

![Mobile Budget](Screenshorts/m.budget.png)

#### Transactions

![Mobile Transactions](Screenshorts/m.transaction.png)

#### Profile / Settings

![Mobile Profile](Screenshorts/m.profile,.png)

#### Notifications

![Mobile Notifications](Screenshorts/m.notification.png)

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
├── Screenshorts/
│   ├── destok.dashboard.png
│   ├── destok.income.png
│   ├── destok.expense.png
│   ├── destok.budget.png
│   ├── destok.transaction.png
│   ├── destok.setting.png
│   ├── m.dashbaord.png
│   ├── m.income.png
│   ├── m.expense.png
│   ├── m.budget.png
│   ├── m.transaction.png
│   ├── m.profile,.png
│   ├── m.notification.png
│   └── Application screenshots
│
├── .gitignore
└── README.md
```

## ⚙️ Installation & Setup

Follow these steps to run the project locally.

### 1. Clone Repository

```bash
git clone https://github.com/yahyadeveloper261/personal-finance-tracker.git
```

### 2. Navigate to Project Folder

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

Create a `.env` file inside the `server` folder using `.env.example` as a reference.

Add your own credentials:

```env
PORT=5000
HOST=0.0.0.0
MONGO_URI=your_mongodb_connection_string
FRONTED_URL=your_frontend_url
JWT_SECRET=your_access_token_secret
JWT_REFRESH=your_refresh_token_secret
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

**Required Services:**

- MongoDB: Database connection.
- Cloudinary: Profile image uploads.

### 6. Start Backend Server

```bash
npm run dev
```

## 💻 Frontend Setup

### 7. Open a New Terminal

Navigate to the project root and then open the client folder:

```bash
cd client
```

### 8. Install Dependencies

```bash
npm install
```

### 9. Configure Frontend Environment Variables

Create a `.env` file inside the `client` folder using `.env.example`.

```env
VITE_API_URL=http://localhost:5000/api
```

For production, add your deployed backend API URL.

### 10. Start Frontend

```bash
npm run dev
```

### 11. Open Application

Open the local URL provided by Vite, usually:

```text
http://localhost:5173
```

## 📡 API Documentation

The backend provides RESTful APIs for authentication, dashboard, transactions, budgets, profiles, and notifications.

### Postman Collection

Import the Postman collection to explore and test the API endpoints.

[**View / Download Postman Collection**](https://go.postman.co/workspace/496d4bc1-836a-4c81-841c-3311f8375caf/collection/51445128-810f6812-b642-410b-88d4-4b2a99e6ea7b)

### API Base URL

```text
http://localhost:5000/api
```

### Available API Modules

- Authentication
- Dashboard
- Transactions
- Budgets
- User Profile
- Notifications

## 🔐 Environment Variables & Security

The project uses environment variables to manage database connections, authentication secrets, frontend/backend communication, and image uploads.

- Never upload actual `.env` files or private credentials to GitHub.
- Use `.env.example` files as configuration templates.
- Keep database credentials and JWT secrets private.

## 🎥 Project Demo Video

[Watch Project Demo](YOUR_DEMO_VIDEO_URL)

## 👨‍💻 Author

**Muhammad Yahya**

MERN Stack Developer

- GitHub: [yahyadeveloper261](https://github.com/yahyadeveloper261)

## 📄 License

Copyright (c) 2026 Muhammad Yahya.

All rights reserved.

This project is proprietary software. Unauthorized copying, modification, distribution, or commercial use of this project's source code is prohibited without prior written permission from the copyright owner.