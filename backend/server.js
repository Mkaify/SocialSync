// server.js
require('dotenv').config();

// Validate critical environment variables on startup
const requiredEnvVars = ['MONGO_URI', 'JWT_SECRET'];
const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);

if (missingVars.length > 0) {
  console.error('❌ Missing required environment variables:', missingVars.join(', '));
  console.error('💡 Copy .env.example to .env and fill in your values');
  process.exit(1);
}

if (process.env.JWT_SECRET && process.env.JWT_SECRET.length < 32) {
  console.error('❌ JWT_SECRET must be at least 32 characters long for security');
  process.exit(1);
}

const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

const authRoutes = require('./routes/authRoutes');
const socialRoutes = require('./routes/socialRoutes');
const postRoutes = require('./routes/postRoutes');
const legalRoutes = require('./routes/legalRoutes');

const setupSwagger = require('./utils/swagger');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());

// In production, set process.env.CORS_ORIGIN to restrict CORS
app.use(cors({
  origin: process.env.CORS_ORIGIN || '*',
}));

// DB, Routes, Swagger, and Server startup
connectDB()
  .then(() => {
    // Routes
    app.use('/api/auth', authRoutes);
    app.use('/api/social', socialRoutes);
    app.use('/api/posts', postRoutes);
    app.use('/legal', legalRoutes);

    // API Documentation
    setupSwagger(app);

    // Root route
    app.get('/', (req, res) => {
      res.json({
        message: 'SocialSync API Server',
        status: 'running',
        version: '1.0.0',
        endpoints: {
          health: '/api/health',
          posts: '/api/posts',
          auth: '/api/auth',
          social: '/api/social',
          privacy: '/legal/privacy',
          terms: '/legal/terms'
        },
        frontend: 'http://localhost:3000',
        legal: {
          privacy_policy: 'http://localhost:5000/legal/privacy',
          terms_of_service: 'http://localhost:5000/legal/terms',
          data_deletion_callback: 'http://localhost:5000/legal/data-deletion',
          data_deletion_instructions: 'http://localhost:5000/legal/data-deletion'
        }
      });
    });

    // Health check route
    app.get('/api/health', (req, res) => {
      res.status(200).json({ status: 'ok' });
    });

    // Error handling middleware
    app.use((err, req, res, next) => {
      console.error(err);
      res.status(err.status || 500).json({
        success: false,
        message: err.message || 'Internal Server Error',
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
      });
    });

    // Start server
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Failed to connect to database:', err);
    process.exit(1);
  });