# OAuth Setup Guide for SocialSync

This guide will help you set up OAuth credentials for Facebook, Twitter, Instagram, and LinkedIn to enable real social media posting.

## Required Environment Variables

Create a `.env` file in the `backend` directory with the following variables:

```env
# Server Configuration
PORT=5000
MONGO_URI=mongodb://localhost:27017/socialsync
JWT_SECRET=your-super-secret-jwt-key-here
NODE_ENV=development
CORS_ORIGIN=http://localhost:3000

# Facebook OAuth
FACEBOOK_APP_ID=your_facebook_app_id
FACEBOOK_APP_SECRET=your_facebook_app_secret
FACEBOOK_REDIRECT_URI=http://localhost:5000/api/social/facebook/callback

# Twitter OAuth
TWITTER_CLIENT_ID=your_twitter_client_id
TWITTER_CLIENT_SECRET=your_twitter_client_secret
TWITTER_REDIRECT_URI=http://localhost:5000/api/social/twitter/callback

# LinkedIn OAuth
LINKEDIN_CLIENT_ID=your_linkedin_client_id
LINKEDIN_CLIENT_SECRET=your_linkedin_client_secret
LINKEDIN_REDIRECT_URI=http://localhost:5000/api/social/linkedin/callback

# Instagram OAuth
INSTAGRAM_CLIENT_ID=your_instagram_client_id
INSTAGRAM_CLIENT_SECRET=your_instagram_client_secret
INSTAGRAM_REDIRECT_URI=http://localhost:5000/api/social/instagram/callback
```

## Platform Setup Instructions

### 1. Facebook Developer Setup

1. Go to [Facebook for Developers](https://developers.facebook.com/)
2. Click "Create App" > "Business" > "Create App"
3. Fill in app details and create the app
4. In the left sidebar, click "Add Product" and add "Facebook Login"
5. In Facebook Login settings:
   - Add redirect URI: `http://localhost:5000/api/social/facebook/callback`
   - Add domain: `localhost`
6. Go to App Settings > Basic:
   - Copy "App ID" → `FACEBOOK_APP_ID`
   - Copy "App Secret" → `FACEBOOK_APP_SECRET`
7. Required permissions: `pages_manage_posts`, `pages_read_engagement`, `publish_video`

### 2. Twitter Developer Setup

1. Go to [Twitter Developer Portal](https://developer.twitter.com/)
2. Apply for a developer account (if needed)
3. Create a new project and app
4. In app settings:
   - Set app type to "Web App"
   - Add callback URL: `http://localhost:5000/api/social/twitter/callback`
   - Add website URL: `http://localhost:3000`
5. In "Keys and Tokens":
   - Copy "Client ID" → `TWITTER_CLIENT_ID`
   - Copy "Client Secret" → `TWITTER_CLIENT_SECRET`
6. Required scopes: `tweet.read`, `tweet.write`, `users.read`

### 3. LinkedIn Developer Setup

1. Go to [LinkedIn Developer](https://www.linkedin.com/developers/)
2. Create a new app
3. Fill in app details and verify with LinkedIn page
4. In "Auth" tab:
   - Add redirect URL: `http://localhost:5000/api/social/linkedin/callback`
5. In "Products" tab, request access to:
   - "Share on LinkedIn"
   - "Sign In with LinkedIn"
6. In app credentials:
   - Copy "Client ID" → `LINKEDIN_CLIENT_ID`
   - Copy "Client Secret" → `LINKEDIN_CLIENT_SECRET`

### 4. Instagram Developer Setup

1. Go to [Facebook for Developers](https://developers.facebook.com/) (Instagram uses Facebook)
2. Create/use existing Facebook app
3. Add "Instagram Basic Display" product
4. In Instagram Basic Display settings:
   - Add redirect URI: `http://localhost:5000/api/social/instagram/callback`
   - Add deauthorize callback URL: `http://localhost:5000/api/social/instagram/deauth`
5. Use the same Facebook App ID and Secret:
   - `INSTAGRAM_CLIENT_ID` = Facebook App ID
   - `INSTAGRAM_CLIENT_SECRET` = Facebook App Secret

## Testing Setup

After setting up the credentials, you can test if everything is configured correctly:

1. Start your backend server: `npm run dev`
2. Visit: `http://localhost:5000/api/social/oauth/status`
3. This will show which platforms are properly configured

## Important Notes

### Security
- **Never commit `.env` files to version control**
- Use strong, unique secrets for production
- Regularly rotate your OAuth secrets

### Platform Limitations
- **Instagram**: Requires business account and Facebook approval for advanced features
- **Twitter**: API v2 has rate limits and requires approval for elevated access
- **LinkedIn**: Requires company page verification for posting
- **Facebook**: Requires app review for advanced permissions

### Development vs Production
- For development: Use `localhost` URLs
- For production: Update all redirect URIs to your production domain
- Set `NODE_ENV=production` and update CORS origins

## Troubleshooting

### Common Issues

1. **"Invalid redirect URI"**
   - Ensure redirect URIs exactly match in OAuth settings
   - Check for trailing slashes or http vs https

2. **"Token expired" errors**
   - Tokens have different lifespans per platform
   - Implement token refresh logic for production

3. **"Scope not granted"**
   - Check if your app has the required permissions
   - Some platforms require app review for certain scopes

4. **CORS errors**
   - Verify CORS_ORIGIN matches your frontend URL
   - Check if domain is whitelisted in OAuth settings

### Getting Help
- Check platform-specific developer documentation
- Most platforms have developer forums and support
- Enable debug logging in development to see detailed error messages

## Production Deployment

When deploying to production:

1. Update all redirect URIs to use your production domain
2. Set secure environment variables (not in code)
3. Enable HTTPS for all OAuth callbacks
4. Review and submit apps for platform approval if needed
5. Implement proper error handling and user notifications
6. Set up monitoring for OAuth failures

Remember: Each platform has its own approval process and requirements for production use. 