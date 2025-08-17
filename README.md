#Leave & Shift Management System

A full-stack web application for managing employee shifts, leave requests, overtime rules, and shift swaps.  
Built with Node.js, Express, MongoDB (Mongoose)** on the backend and React.js on the frontend.  

##Key Features
Authentication & Profiles – JWT-based login, registration, and profile management  
Shift Management – Create, assign, update, delete, and view employee shifts  
Leave Management – Submit leave requests and manager approval/rejection workflow  
Overtime Management – Define overtime rules, submit OT requests, and handle approvals  
Shift Swaps – Request and approve/reject employee shift swaps  
User-Friendly Frontend – React UI with pages for Shifts, Leaves, Overtime, and Swaps 

/backend
/config/db.js # MongoDB connection
/middleware/authMiddleware.js# JWT middleware
/models/ # User, Shift, Leave, OvertimeRule, OvertimeRequest, Swap
/controllers/ # Business logic
/routes/ # API routes
server.js # Express entry point

/frontend
/src
/components/Navbar.jsx
/context/AuthContext.js
/pages/{Login,Register,Profile,Shifts,Leaves,Overtime,Swaps}.jsx
axiosConfig.js
App.js, index.js


---

##1. Prerequisites
- [Node.js 18+](https://nodejs.org/)
- [MongoDB](https://www.mongodb.com/) (local or Atlas)

##2. Backend Setup
```bash
cd backend
cp .env.example .env
# Edit .env:
# MONGO_URI=mongodb://localhost:27017/lsms
# JWT_SECRET=yourSecretKey
# PORT=5001

npm install
npm run dev   # Runs server on http://localhost:5001



