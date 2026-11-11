const express = require('express');
const http = require('http');
const path = require('path');
const cors = require('cors');
const morgan = require('morgan');
const dotenv = require('dotenv');
const { Server } = require('socket.io');

// Load environment variables
dotenv.config();

const connectDB = require('./config/db');
const { initSocket } = require('./sockets/socketHandler');
const errorHandler = require('./middleware/errorMiddleware');

// Route imports
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const charityRoutes = require('./routes/charityRoutes');
const donationRoutes = require('./routes/donationRoutes');
const recommendationRoutes = require('./routes/recommendationRoutes');
const foodQuantityRoutes = require('./routes/foodQuantityRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const analyticsRoutes = require('./routes/analyticsRoutes');
const publicPlaceRoutes = require('./routes/publicPlaceRoutes');

// Connect to Database
connectDB();

const app = express();
const server = http.createServer(app);

// Initialize Socket.io
const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173';
const io = new Server(server, {
  cors: {
    origin: [clientUrl, 'http://localhost:5173', 'http://127.0.0.1:5173'],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
  }
});

initSocket(io);

// Middleware
app.use(
  cors({
    origin: [clientUrl, 'http://localhost:5173', 'http://127.0.0.1:5173'],
    credentials: true
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
}

// Serve static uploaded files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// API Health Check
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'online',
    system: 'Waste2Worth - Food Waste Management System API',
    timestamp: new Date().toISOString()
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/charities', charityRoutes);
app.use('/api/donations', donationRoutes);
app.use('/api/recommendations', recommendationRoutes);
app.use('/api/food-quantity', foodQuantityRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/public-places', publicPlaceRoutes);

// 404 handler for unknown routes
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    message: `API route not found: ${req.originalUrl}`
  });
});

// Centralized Error Handling Middleware
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`🚀 Waste2Worth Server running on port ${PORT}`);
});
