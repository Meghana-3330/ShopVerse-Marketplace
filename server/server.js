const http = require('http');
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/errorHandler');
const { initSocket } = require('./socket');

// Load environment variables
dotenv.config();

// Connect to Database
connectDB();

const app = express();
const server = http.createServer(app);

// Initialize Socket.IO with server
initSocket(server);

// Security & Utility Middleware
app.use(
  cors({
    origin: ['http://localhost:5173', 'http://127.0.0.1:5173', 'http://localhost:3000'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('dev'));
}

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'ShopVerse Multi-Vendor Marketplace API is healthy and operational.',
    timestamp: new Date().toISOString()
  });
});

// API Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/products', require('./routes/productRoutes'));
app.use('/api/orders', require('./routes/orderRoutes'));
app.use('/api/vendor', require('./routes/vendorRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));
app.use('/api/categories', require('./routes/categoryRoutes'));
app.use('/api/notifications', require('./routes/notificationRoutes'));

// 404 Route Handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: `API endpoint '${req.originalUrl}' not found.`
  });
});

// Centralized Error Handling Middleware
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`=======================================================`);
  console.log(` ShopVerse Multi-Vendor Server running on port ${PORT}`);
  console.log(` Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(` API Endpoint: http://localhost:${PORT}/api`);
  console.log(` Real-time Socket.IO: Activated`);
  console.log(`=======================================================`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error(`Unhandled Rejection Error: ${err.message}`);
});

module.exports = { app, server };
