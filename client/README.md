# 🚗 Ride Booking Platform - Frontend

A modern, full-stack ride booking application built with React 19, Redux Toolkit, and Tailwind CSS. Features role-based dashboards for Riders, Drivers, and Admins.

## 🌐 Live Demo

- **Frontend:** [(https://rydr-ride-sharing-system.vercel.app/)]
- **Backend API:** [(ride-booking-api-dltt.onrender.com)]

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

### For Riders
- 🚕 Request rides with automatic location geocoding
- 📍 Track active rides in real-time
- ⭐ Rate drivers and leave feedback
- 📊 View ride history with filters
- 💳 See estimated fares before booking

### For Drivers
- 🔔 Receive and accept ride requests
- 🗺️ Update ride status (Picked Up → In Transit → Completed)
- 💰 Track earnings (daily/weekly/monthly)
- 📈 View ride history and ratings
- 🔄 Toggle online/offline status

### For Admins
- 👥 Manage users (block/suspend/activate)
- ✅ Approve/reject driver applications
- 🚗 Monitor all rides across platform
- 📊 View analytics and statistics
- ⭐ Track driver ratings

## 🛠️ Tech Stack

- **Framework:** React 19 + TypeScript
- **Build Tool:** Vite 6
- **State Management:** Redux Toolkit + RTK Query
- **Styling:** Tailwind CSS 4 + shadcn/ui
- **Routing:** React Router v7
- **Forms:** React Hook Form + Zod
- **Charts:** Recharts
- **Notifications:** Sonner

## 🚀 Getting Started

### Prerequisites
- Node.js >= 18.x
- npm or yarn

### Installation

```bash
# Clone the repository
git clone [https://github.com/RageebRidwan/Rydr-Ride-Sharing-System.git]
cd client

# Install dependencies
npm install

# Create environment file
cp .env.example .env.local
```

### Environment Variables

Create a `.env.local` file:

```env
VITE_API_URL=https://ride-booking-api-dltt.onrender.com/api
```

### Development

```bash
npm run dev
# App runs on http://localhost:3000
```

### Build for Production

```bash
npm run build
npm run preview
```

## 📁 Project Structure

```
src/
├── app/              # Redux store configuration
├── features/         # Redux slices & RTK Query APIs
├── components/       # Reusable UI components
│   ├── ui/          # shadcn/ui components
│   ├── layout/      # Navbar, Footer, Sidebar
│   └── common/      # Shared components
├── pages/           # Page components by role
│   ├── public/      # Landing, About, Contact, etc.
│   ├── rider/       # Rider dashboard & features
│   ├── driver/      # Driver dashboard & features
│   └── admin/       # Admin dashboard & features
├── lib/             # Utilities & helpers
└── types/           # TypeScript type definitions
```

## 🎯 Key Features Implemented

- ✅ Role-based authentication & authorization
- ✅ Real-time ride tracking with auto-refresh
- ✅ Automatic geocoding (address → coordinates)
- ✅ Pagination & filtering on all list pages
- ✅ Responsive design (mobile/tablet/desktop)
- ✅ Toast notifications for user feedback
- ✅ Form validation with Zod
- ✅ Error handling & loading states
- ✅ Dark mode support
- ✅ Driver can cancel accepted rides before pickup

## 📦 Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
```

## 🌟 Highlights

- **Modern Stack:** Built with latest React 19, Vite 6, and Tailwind CSS 4
- **Type-Safe:** Full TypeScript coverage
- **Performance:** Lazy-loaded routes, optimized bundle size
- **UX:** Smooth animations, skeleton loaders, instant feedback
- **Maintainable:** Clean architecture, modular components

## 📝 Notes

- Riders can only cancel rides with "requested" status
- Drivers can cancel accepted rides before picking up the rider
- All location searches use OpenStreetMap Nominatim API
- Real-time updates refresh every 10 seconds on active ride pages

MIT License

---

Built with ❤️ using React, Redux Toolkit, Tailwind CSS, and shadcn/ui
