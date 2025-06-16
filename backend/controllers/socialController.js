// controllers/socialController.js
const axios = require('axios');
const User = require('../models/User');

// OAuth Configuration
const OAUTH_CONFIGS = {
  facebook: {
    clientId: process.env.FACEBOOK_APP_ID,
    clientSecret: process.env.FACEBOOK_APP_SECRET,
    redirectUri: process.env.FACEBOOK_REDIRECT_URI || 'http://localhost:5000/api/social/facebook/callback',
    scope: 'pages_manage_posts,pages_read_engagement,publish_video',
    tokenUrl: 'https://graph.facebook.com/v18.0/oauth/access_token',
    userInfoUrl: 'https://graph.facebook.com/me',
    postUrl: 'https://graph.facebook.com/me/feed'
  },
  twitter: {
    clientId: process.env.TWITTER_CLIENT_ID,
    clientSecret: process.env.TWITTER_CLIENT_SECRET,
    redirectUri: process.env.TWITTER_REDIRECT_URI || 'http://localhost:5000/api/social/twitter/callback',
    scope: 'tweet.read,tweet.write,users.read',
    tokenUrl: 'https://api.twitter.com/2/oauth2/token',
    userInfoUrl: 'https://api.twitter.com/2/users/me',
    postUrl: 'https://api.twitter.com/2/tweets'
  },
  linkedin: {
    clientId: process.env.LINKEDIN_CLIENT_ID,
    clientSecret: process.env.LINKEDIN_CLIENT_SECRET,
    redirectUri: process.env.LINKEDIN_REDIRECT_URI || 'http://localhost:5000/api/social/linkedin/callback',
    scope: 'w_member_social,r_liteprofile,r_emailaddress',
    tokenUrl: 'https://www.linkedin.com/oauth/v2/accessToken',
    userInfoUrl: 'https://api.linkedin.com/v2/people/~',
    postUrl: 'https://api.linkedin.com/v2/ugcPosts'
  },
  instagram: {
    clientId: process.env.INSTAGRAM_CLIENT_ID,
    clientSecret: process.env.INSTAGRAM_CLIENT_SECRET,
    redirectUri: process.env.INSTAGRAM_REDIRECT_URI || 'http://localhost:5000/api/social/instagram/callback',
    scope: 'user_profile,user_media',
    tokenUrl: 'https://api.instagram.com/oauth/access_token',
    userInfoUrl: 'https://graph.instagram.com/me',
    postUrl: 'https://graph.instagram.com/me/media'
  }
};

// Generate OAuth URL
exports.getAuthUrl = async (req, res) => {
  try {
    const { platform } = req.params;
    const config = OAUTH_CONFIGS[platform];
    
    if (!config) {
      return res.status(400).json({
        success: false,
        message: 'Unsupported platform'
      });
    }

    // Check if OAuth credentials are configured
    if (!config.clientId || !config.clientSecret) {
      return res.status(400).json({
        success: false,
        message: `${platform} OAuth not configured. Please add ${platform.toUpperCase()}_CLIENT_ID and ${platform.toUpperCase()}_CLIENT_SECRET to environment variables.`,
        setup_required: true
      });
    }

    const state = `${req.user.id}-${Date.now()}`;
    
    let authUrl;
    switch (platform) {
      case 'facebook':
        authUrl = `https://www.facebook.com/v18.0/dialog/oauth?client_id=${config.clientId}&redirect_uri=${encodeURIComponent(config.redirectUri)}&scope=${config.scope}&state=${state}`;
        break;
      case 'twitter':
        authUrl = `https://twitter.com/i/oauth2/authorize?response_type=code&client_id=${config.clientId}&redirect_uri=${encodeURIComponent(config.redirectUri)}&scope=${config.scope}&state=${state}&code_challenge=challenge&code_challenge_method=plain`;
        break;
      case 'linkedin':
        authUrl = `https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=${config.clientId}&redirect_uri=${encodeURIComponent(config.redirectUri)}&scope=${config.scope}&state=${state}`;
        break;
      case 'instagram':
        authUrl = `https://api.instagram.com/oauth/authorize?client_id=${config.clientId}&redirect_uri=${encodeURIComponent(config.redirectUri)}&scope=${config.scope}&response_type=code&state=${state}`;
        break;
      default:
        return res.status(400).json({
          success: false,
          message: 'Unsupported platform'
        });
    }

    res.json({
      success: true,
      authUrl,
      platform,
      message: `Visit this URL to connect your ${platform} account`
    });
  } catch (error) {
    console.error('OAuth URL generation error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate OAuth URL'
    });
  }
};

// Handle OAuth callback
exports.handleCallback = async (req, res) => {
  try {
    const { platform } = req.params;
    const { code, state, error } = req.query;
    
    if (error) {
      return res.redirect(`http://localhost:3000?error=${encodeURIComponent(error)}`);
    }

    const config = OAUTH_CONFIGS[platform];
    if (!config) {
      return res.redirect('http://localhost:3000?error=unsupported_platform');
    }

    // Extract user ID from state
    const userId = state.split('-')[0];
    const user = await User.findById(userId);
    
    if (!user) {
      return res.redirect('http://localhost:3000?error=user_not_found');
    }

    // Exchange code for access token
    let tokenData;
    try {
      const tokenResponse = await axios.post(config.tokenUrl, {
        client_id: config.clientId,
        client_secret: config.clientSecret,
        code,
        redirect_uri: config.redirectUri,
        grant_type: 'authorization_code'
      }, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      });
      
      tokenData = tokenResponse.data;
    } catch (tokenError) {
      console.error('Token exchange error:', tokenError.response?.data || tokenError.message);
      return res.redirect('http://localhost:3000?error=token_exchange_failed');
    }

    // Get user info from the platform
    let platformUserInfo;
    try {
      const userInfoResponse = await axios.get(config.userInfoUrl, {
        headers: {
          'Authorization': `Bearer ${tokenData.access_token}`
        }
      });
      platformUserInfo = userInfoResponse.data;
    } catch (userInfoError) {
      console.error('User info error:', userInfoError.response?.data || userInfoError.message);
      // Continue anyway, we have the token
      platformUserInfo = { id: 'unknown', name: 'Unknown User' };
    }

    // Store the social account
    user.addSocialAccount({
      platform,
      platformUserId: platformUserInfo.id || platformUserInfo.sub,
      username: platformUserInfo.name || platformUserInfo.username,
      accessToken: tokenData.access_token,
      refreshToken: tokenData.refresh_token,
      tokenExpiry: tokenData.expires_in ? new Date(Date.now() + tokenData.expires_in * 1000) : null
    });

    await user.save();

    res.redirect(`http://localhost:3000?success=${platform}_connected`);
  } catch (error) {
    console.error('OAuth callback error:', error);
    res.redirect('http://localhost:3000?error=callback_failed');
  }
};

// Get connected accounts
exports.getConnectedAccounts = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const connectedAccounts = user.socialAccounts.filter(account => account.isActive);
    
    res.json({
      success: true,
      accounts: connectedAccounts.map(account => ({
        platform: account.platform,
        username: account.username,
        connectedAt: account.connectedAt,
        lastUsed: account.lastUsed
      }))
    });
  } catch (error) {
    console.error('Get connected accounts error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch connected accounts'
    });
  }
};

// Disconnect account
exports.disconnectAccount = async (req, res) => {
  try {
    const { platform } = req.params;
    const user = await User.findById(req.user.id);
    
    user.socialAccounts = user.socialAccounts.filter(
      account => account.platform !== platform
    );
    
    await user.save();
    
    res.json({
      success: true,
      message: `${platform} account disconnected successfully`
    });
  } catch (error) {
    console.error('Disconnect account error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to disconnect account'
    });
  }
};

// Get OAuth configuration status
exports.getOAuthStatus = async (req, res) => {
  const platforms = ['facebook', 'twitter', 'linkedin', 'instagram'];
  const status = {};
  
  platforms.forEach(platform => {
    const config = OAUTH_CONFIGS[platform];
    status[platform] = {
      configured: !!(config.clientId && config.clientSecret),
      clientId: config.clientId ? `${config.clientId.substring(0, 8)}...` : 'Not set',
      redirectUri: config.redirectUri
    };
  });
  
  res.json({
    success: true,
    oauth_status: status,
    note: 'Set environment variables for each platform you want to use'
  });
};