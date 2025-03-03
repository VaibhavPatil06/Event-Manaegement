# Event Management System

## 📌 Overview
The **Event Management System** is a full-stack web application that enables users to create, manage, and participate in events. The project includes both a **backend** (Node.js, Express, MongoDB) and a **frontend** (React, TypeScript, Vite.js, Tailwind CSS) with session-based authentication and encryption for security.

---

## 📂 Folder Structure

```
└── 📁Event-Management
    ├── 📁Backend
    │   ├── .env
    │   ├── .gitignore
    │   ├── index.js
    │   ├── package-lock.json
    │   ├── package.json
    │   ├── 📁src
    │   │   ├── 📁database
    │   │   │   ├── mongoDB.js
    │   │   ├── 📁modules
    │   │   │   ├── 📁adminUser
    │   │   │   │   ├── 📁controllers
    │   │   │   │   │   ├── adminUser.controller.js
    │   │   │   │   ├── 📁routes
    │   │   │   │   │   ├── adminUser.route.js
    │   │   │   │   ├── 📁schema
    │   │   │   │   │   ├── admin-user.schema.js
    │   │   │   ├── 📁events
    │   │   │   │   ├── 📁controllers
    │   │   │   │   │   ├── event.controller.js
    │   │   │   │   ├── 📁routes
    │   │   │   │   │   ├── event.route.js
    │   │   │   │   ├── 📁schema
    │   │   │   │   │   ├── event.schema.js
    │   │   │   ├── 📁middleware
    │   │   │   │   ├── auth.js
    │   │   ├── 📁utils
    │   │   │   ├── auth.js
    │   │   │   ├── decryptPassword.js
    │   ├── 📁uploads
    │   │   ├── 📁events
    │   │   │   ├── 📁67c5294217cf6c1160d8b65c
    │   │   │   │   ├── 📁img
    │   │   │   │   │   ├── unsubscribe.png
    │
    ├── 📁Frontend
    │   ├── .env
    │   ├── .gitignore
    │   ├── eslint.config.js
    │   ├── index.html
    │   ├── package-lock.json
    │   ├── package.json
    │   ├── postcss.config.js
    │   ├── 📁src
    │   │   ├── App.tsx
    │   │   ├── 📁components
    │   │   │   ├── AddEventModal.tsx
    │   │   │   ├── AuthForm.tsx
    │   │   │   ├── EventCard.tsx
    │   │   │   ├── EventModal.tsx
    │   │   │   ├── Navbar.tsx
    │   │   ├── 📁helper
    │   │   │   ├── encryptPassword.ts
    │   │   ├── index.css
    │   │   ├── main.tsx
    │   │   ├── 📁pages
    │   │   │   ├── Auth.tsx
    │   │   │   ├── Home.tsx
    │   │   ├── 📁store
    │   │   │   ├── index.ts
    │   │   │   ├── 📁slices
    │   │   │   │   ├── authSlice.ts
    │   │   │   │   ├── eventsSlice.ts
    │   │   ├── 📁types
    │   │   │   ├── index.ts
    │   │   ├── vite-env.d.ts
    │   ├── tailwind.config.js
    │   ├── tsconfig.app.json
    │   ├── tsconfig.json
    │   ├── tsconfig.node.json
    │   ├── vite.config.ts
```

---

## 🔒 Authentication & Security

- **Encryption & Decryption**: Passwords are encrypted using bcrypt before storing in the database.
- **Session-Based Login**: Users authenticate using session tokens for secure access.
- **JWT Tokens**: Used for API authentication and session management.

---

## 🛠 Features

Admin & User Management (Login, Signup, Secure Session Token)
✅ CRUD Operations (Create, Read, Update, Delete Events)
✅ Event Upload & Image Storage
✅ User Authentication with Secure Password Hashing
✅ Redux Toolkit for Global State Management
✅ Search & Filtering (Search events by title, location, description, and date)
✅ Responsive Frontend with React & Tailwind CSS
✅ Bookmarking & Favorite Events
✅ Real-Time Notifications for Event Update
---

## 🚀 Environment Variables

### 📌 Frontend (`.env`)
```
VITE_BACKEND_URL=<your_backend_url>
VITE_SECRET_KEY=<your_secret_key>
```

### 📌 Backend (`.env`)
```
MONGO_URI=<your_mongo_db_uri>
PORT=5000
PUBLIC_KEY=<your_public_key>
SECRET_KEY=<your_secret_key>
IMAGE_PATH=<path_to_image_storage>
PRIVATE_KEY=<your_private_key>
```

---

## 🛠 Installation & Setup

### 1️⃣ Backend Setup
```sh
cd Backend
npm install
npm start
```

### 2️⃣ Frontend Setup
```sh
cd Frontend
npm install
npm run dev
```

---

## 📬 API Endpoints

### **Authentication**
- `POST /auth/register` → Register User/Admin
- `POST /auth/login` → Login with Encryption & Session Token
- `GET /auth/logout` → Logout & Destroy Session

### **Events**
- `POST /events/create` → Create Event
- `GET /events/` → Get All Events
- `PUT /events/:id` → Update Event
- `DELETE /events/:id` → Delete Event

---

## 🏗 Built With

- **Backend:** Node.js, Express.js, MongoDB
- **Frontend:** React.js, TypeScript, Tailwind CSS, Redux Toolkit
- **Security:** JWT, bcrypt, crypto

---



