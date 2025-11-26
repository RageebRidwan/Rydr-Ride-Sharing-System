# 🚗 Rydr - Ride Sharing Platform

A full-stack ride-sharing application with role-based dashboards for Riders, Drivers, and Admins. Built with modern web technologies for scalability and performance.

## 🌐 Live Demo

- **Frontend:** [https://rydr-ride-sharing-system.vercel.app](https://rydr-ride-sharing-system.vercel.app/)
- **Backend API:** [https://ride-booking-api-dltt.onrender.com](https://ride-booking-api-dltt.onrender.com/)

## 🔐 Demo Credentials

```
Rider:
Email: doerider@test.com
Password: rider123

Driver:
Email: driver@test.com
Password: driver123

Admin:
Email: admin@test.com
Password: admin1234
```

## ✨ Features

### 🚕 Rider Features
- Request rides with automatic location geocoding
- Track active rides in real-time with status updates
- Rate drivers and leave detailed feedback
- View complete ride history with filtering
- See estimated fares before booking
- Cancel requested rides

### 🚙 Driver Features
- Receive and accept ride requests
- Update ride status throughout journey
- Track earnings (daily/weekly/monthly)
- View ride history and ratings
- Toggle online/offline availability
- Cancel accepted rides before pickup

### 👨‍💼 Admin Features
- Manage users (block/suspend/activate)
- Approve or reject driver applications
- Monitor all rides across the platform
- View comprehensive analytics and statistics
- Track driver ratings and performance

## 🛠️ Tech Stack

### Backend
- **Framework:** Node.js + Express.js 5.1
- **Language:** TypeScript 5.9
- **Database:** MongoDB + Mongoose 8.18
- **Authentication:** JWT (jsonwebtoken)
- **Validation:** Zod 4.1
- **Security:** bcryptjs, CORS
- **Geocoding:** OpenStreetMap Nominatim API

### Frontend
- **Framework:** React 19 + TypeScript
- **Build Tool:** Vite 7
- **State Management:** Redux Toolkit + RTK Query
- **Styling:** Tailwind CSS 4 + shadcn/ui
- **Routing:** React Router v7
- **Forms:** React Hook Form + Zod
- **Charts:** Recharts
- **Notifications:** Sonner

## 🚀 Getting Started

### Prerequisites
- Node.js >= 18.x
- MongoDB (local or Atlas)
- npm or yarn

### Installation

#### 1. Clone the repository
```bash
git clone https://github.com/RageebRidwan/Rydr-Ride-Sharing-System.git
cd Rydr
```

#### 2. Backend Setup
```bash
cd server
npm install

# Create .env file with:
PORT=5000
MONGO_URI=<your-mongodb-uri>
JWT_SECRET=<your-jwt-secret>
JWT_EXPIRES_IN=1d
BCRYPT_SALT=10

# Start backend
npm run dev
```

#### 3. Frontend Setup
```bash
cd client
npm install

# Create .env.local file with:
VITE_API_URL=http://localhost:5000/api

# Start frontend
npm run dev
```

## 📁 Project Structure

```
Rydr/
├── server/              # Backend (Node.js + Express + MongoDB)
│   ├── src/
│   │   ├── modules/    # Feature modules (auth, user, ride, driver, admin)
│   │   ├── middleware/ # Authentication, authorization, validation
│   │   ├── utils/      # Helpers, error handling, geocoding
│   │   └── app.ts      # Express app configuration
│   └── package.json
│
├── client/              # Frontend (React + TypeScript)
│   ├── src/
│   │   ├── app/        # Redux store configuration
│   │   ├── features/   # RTK Query APIs & slices
│   │   ├── components/ # Reusable UI components
│   │   ├── pages/      # Page components (public, rider, driver, admin)
│   │   ├── lib/        # Utilities & helpers
│   │   └── types/      # TypeScript definitions
│   └── package.json
│
└── README.md
```

## 🎯 Key Highlights

- **31 RESTful API Endpoints** with role-based authorization
- **Geospatial Indexing** for efficient nearby driver queries
- **Real-time Updates** with 10-second auto-refresh on active rides
- **Automatic Fare Calculation** based on distance
- **Comprehensive Analytics** for admins and drivers
- **Responsive Design** supporting mobile, tablet, and desktop
- **Type-Safe** with full TypeScript coverage
- **Optimized Performance** with RTK Query caching and lazy loading

## 📊 Project Stats

- **Total Lines of Code:** ~13,776
  - Backend: 4,900 lines
  - Frontend: 8,876 lines
- **API Endpoints:** 31
- **Database Collections:** 2 (User, Ride)
- **Core Features:** 14+
- **UI Components:** 30+ reusable components

## 🔗 API Documentation

### Authentication Endpoints
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login and receive JWT
- `POST /api/auth/logout` - Logout user
- `POST /api/auth/request-reset` - Request password reset
- `POST /api/auth/reset-password/:token` - Reset password

### Ride Endpoints (Rider)
- `POST /api/rides/request` - Request a new ride
- `GET /api/rides/history` - Get ride history
- `PATCH /api/rides/:id/cancel` - Cancel a ride
- `PATCH /api/rides/:id/rate-driver` - Rate driver
- `POST /api/rides/drivers/nearby` - Find nearby drivers

### Driver Endpoints
- `PATCH /api/drivers/availability` - Set online/offline
- `GET /api/drivers/rides/pending` - Get pending requests
- `PATCH /api/drivers/rides/:id/accept` - Accept ride
- `PATCH /api/drivers/rides/:id/status` - Update ride status
- `GET /api/drivers/rides/earnings` - View earnings

### Admin Endpoints
- `GET /api/admin/users` - View all users
- `PATCH /api/admin/drivers/approve/:id` - Approve/reject driver
- `PATCH /api/admin/users/block/:id` - Block/unblock user
- `GET /api/admin/rides/stats` - View ride statistics

For complete API documentation, visit the [server README](./server/README.md).

## 🎥 Demo Video

[Watch Demo](https://drive.google.com/file/d/100u8RCVS3mtP-FXWMPmcxvxErlAUBzOe/view?usp=sharing)

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 👨‍💻 Author

**Rageeb Ridwan**
- GitHub: [@RageebRidwan](https://github.com/RageebRidwan)

---

Built with ❤️ using React, Node.js, and MongoDB
