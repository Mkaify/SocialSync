// routes/socialRoutes.js
const express = require('express');
const router = express.Router();
const socialController = require('../controllers/socialController');
const authMiddleware = require('../middleware/authMiddleware');

// OAuth routes
router.get('/:platform/auth', authMiddleware, socialController.getAuthUrl);
router.get('/:platform/callback', socialController.handleCallback);

// Account management routes
router.get('/accounts', authMiddleware, socialController.getConnectedAccounts);
router.delete('/:platform', authMiddleware, socialController.disconnectAccount);

// OAuth status check
router.get('/oauth/status', socialController.getOAuthStatus);

module.exports = router;