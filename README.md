# Expense Tracker

A full-stack expense tracking application built with the MERN stack (MongoDB, Express.js, React.js, Node.js).

## Features

- User authentication (Register/Login)
- Add, edit, and delete expenses
- Real-time updates with animations
- Secure API with JWT authentication
- Responsive design
- Particle effects and confetti animations

## Project Structure

```
.
├── backend/           # Express.js server
│   ├── models/       # MongoDB models
│   ├── routes/       # API routes
│   ├── conn.js       # Database connection
│   └── index.js      # Server entry point
└── frontend/         # React.js client
    ├── public/       # Static files
    └── src/          # React source code
        └── components/ # React components
```

## Setup Instructions

1. Clone the repository:
   ```bash
   git clone https://github.com/Amit-coder-98/Expense_Tracker.git
   cd Expense_Tracker
   ```

2. Install dependencies:
   ```bash
   # Install backend dependencies
   cd backend
   npm install

   # Install frontend dependencies
   cd ../frontend
   npm install
   ```

3. Set up environment variables:
   - Create `.env` in the backend directory
   - Add your MongoDB connection string and JWT secret

4. Run the application:
   ```bash
   # Start backend server (from backend directory)
   npm start

   # Start frontend development server (from frontend directory)
   npm start
   ```

## Technologies Used

- **Frontend:**
  - React.js
  - React Router
  - Formik & Yup
  - Axios
  - React Confetti
  - tsParticles

- **Backend:**
  - Node.js
  - Express.js
  - MongoDB
  - JWT Authentication
  - Bcrypt.js

## Deployment

- Frontend is configured for Netlify deployment
- Backend can be deployed to platforms like Render or Heroku