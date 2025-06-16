// routes/postRoutes.js
const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController');
const authMiddleware = require('../middleware/authMiddleware');

// Make auth optional for testing purposes
const optionalAuth = (req, res, next) => {
  const authHeader = req.headers.authorization;
  
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];
    try {
      const jwt = require('jsonwebtoken');
      if (!process.env.JWT_SECRET) {
    return res.status(500).json({ error: 'JWT_SECRET environment variable is required' });
  }
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded;
    } catch (err) {
      console.log('Invalid token provided, proceeding without auth');
    }
  }
  next();
};

// GET route for testing/info
router.get('/', (req, res) => {
  res.json({
    message: 'SocialSync Posts API',
    description: 'Use POST method to create posts',
    usage: {
      method: 'POST',
      url: '/api/posts',
      body: {
        text: 'Your post content here',
        imageUrl: 'https://example.com/image.jpg (optional)',
        platforms: ['facebook', 'twitter', 'instagram', 'linkedin']
      }
    },
    example: 'curl -X POST http://localhost:5000/api/posts -H "Content-Type: application/json" -d \'{"text":"Hello world!","platforms":["facebook","twitter"]}\''
  });
});

// Test route to verify POST functionality works
router.get('/test', (req, res) => {
  res.json({
    message: 'Posts API is working!',
    timestamp: new Date().toISOString(),
    available_platforms: ['facebook', 'twitter', 'instagram', 'linkedin'],
    status: 'ready'
  });
});

router.post('/', optionalAuth, postController.createPost);

module.exports = router;   