// controllers/postController.js
const User = require('../models/User');
const socialMediaService = require('../services/socialMediaService');

exports.createPost = async (req, res) => {
  try {
    const { text, imageUrl, platforms } = req.body;

    // Validate input
    if (!text || !platforms || platforms.length === 0) {
      return res.status(400).json({ 
        success: false, 
        message: 'Text and at least one platform are required' 
      });
    }

    const results = [];
    const errors = [];

    // If user is authenticated, use their real social accounts
    if (req.user && req.user.id) {
      try {
        const user = await User.findById(req.user.id);
        
        if (user && user.socialAccounts && user.socialAccounts.length > 0) {
          // Filter user's connected accounts for the requested platforms
          const connectedAccounts = user.socialAccounts.filter(
            (acc) => platforms.includes(acc.platform) && acc.isActive
          );

          if (connectedAccounts.length === 0) {
            return res.status(400).json({
              success: false,
              message: 'No connected accounts found for the selected platforms. Please connect your social media accounts first.',
              available_platforms: user.socialAccounts.map(acc => acc.platform),
              requested_platforms: platforms
            });
          }

          // Post to each connected platform
          for (const account of connectedAccounts) {
            try {
              // Validate token before posting
              const isTokenValid = await socialMediaService.validateToken(
                account.platform, 
                account.accessToken
              );

              if (!isTokenValid) {
                errors.push({
                  platform: account.platform,
                  error: 'Access token expired. Please reconnect your account.',
                  code: 'TOKEN_EXPIRED'
                });
                continue;
              }

              // Attempt to post
              const result = await socialMediaService.postToPlatform(
                account.platform,
                account.accessToken,
                { text, imageUrl }
              );

              results.push(result);

              // Update last used timestamp
              account.lastUsed = new Date();
              
              console.log(`✅ Successfully posted to ${account.platform}:`, { text, imageUrl });
            } catch (platformError) {
              console.error(`❌ Failed to post to ${account.platform}:`, platformError.message);
              errors.push({
                platform: account.platform,
                error: platformError.message,
                code: 'POST_FAILED'
              });
            }
          }

          // Save updated user data
          await user.save();

          // Check for platforms that weren't connected
          const connectedPlatforms = connectedAccounts.map(acc => acc.platform);
          const unconnectedPlatforms = platforms.filter(p => !connectedPlatforms.includes(p));
          
          if (unconnectedPlatforms.length > 0) {
            unconnectedPlatforms.forEach(platform => {
              errors.push({
                platform,
                error: `${platform} account not connected`,
                code: 'NOT_CONNECTED'
              });
            });
          }

        } else {
          // User has no connected accounts
          return res.status(400).json({
            success: false,
            message: 'No social media accounts connected. Please connect your accounts first to post.',
            connect_url: '/api/social/:platform/auth'
          });
        }
      } catch (userError) {
        console.error('Error fetching user data:', userError);
        return res.status(500).json({
          success: false,
          message: 'Failed to fetch user social accounts'
        });
      }
    } else {
      // Demo mode for unauthenticated users
      platforms.forEach((platform) => {
        console.log(`📝 Demo: Would post to ${platform}:`, { text, imageUrl });
        results.push({
          success: true,
          platform,
          id: `demo-${Date.now()}`,
          mode: 'demo'
        });
      });
    }

    // Prepare response
    const successfulPosts = results.filter(r => r.success);
    const hasSuccesses = successfulPosts.length > 0;
    const hasErrors = errors.length > 0;

    let message;
    if (hasSuccesses && !hasErrors) {
      message = `Posted successfully to ${successfulPosts.map(r => r.platform).join(', ')}!`;
    } else if (hasSuccesses && hasErrors) {
      message = `Partially successful. Posted to ${successfulPosts.map(r => r.platform).join(', ')}, but failed for ${errors.map(e => e.platform).join(', ')}.`;
    } else if (!hasSuccesses && hasErrors) {
      message = 'All posts failed. Please check your connections and try again.';
    } else {
      message = 'No posts were attempted.';
    }

    const statusCode = hasSuccesses ? 200 : (hasErrors ? 400 : 500);

    res.status(statusCode).json({ 
      success: hasSuccesses,
      message,
      results: successfulPosts,
      errors: hasErrors ? errors : undefined,
      posted_to: successfulPosts.map(r => r.platform),
      failed_platforms: errors.map(e => e.platform)
    });

  } catch (error) {
    console.error('Error in createPost:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Internal server error',
      error: error.message
    });
  }
};