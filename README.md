# SocialSync 🚀

A comprehensive social media management platform that allows users to connect multiple social media accounts and post to them simultaneously. Built with Node.js, Express, React, and MongoDB.

## ✨ Features

- **Multi-Platform Support**: Connect and post to Facebook, Twitter, LinkedIn, and Instagram
- **OAuth Authentication**: Secure connection to social media platforms
- **Simultaneous Posting**: Post to multiple platforms at once
- **User Authentication**: JWT-based user registration and login
- **Real-time Status**: Visual indicators for connected platforms
- **Legal Compliance**: Privacy policy and terms of service pages for OAuth app registration

## 🏗️ Tech Stack

**Backend:**
- Node.js & Express.js
- MongoDB with Mongoose
- JWT Authentication
- OAuth 2.0 Integration
- bcryptjs for password hashing

**Frontend:**
- React (Single Page Application)
- Modern ES6+ JavaScript
- Responsive CSS design
- Real-time platform connection indicators

## 🚀 Quick Start

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or cloud instance)
- Social media developer accounts for OAuth credentials

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd SocialSync
```

### 2. Environment Setup

```bash
# Copy the example environment file
cp .env.example backend/.env

# Edit the .env file with your actual credentials
# See OAUTH_SETUP.md for detailed instructions on obtaining OAuth credentials
```

### 3. Install Dependencies

```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### 4. Start the Application

```bash
# Start the backend server (from backend directory)
npm start

# In a new terminal, start the frontend (from frontend directory)
npm start
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

## 🔐 Security & Environment Variables

### Critical Security Notes

⚠️ **NEVER commit your `.env` file to Git!**

The `.env.example` file contains placeholder values that are safe to commit. Always:

1. Copy `.env.example` to `backend/.env`
2. Fill in your actual credentials in the `.env` file
3. Ensure `.env` is in your `.gitignore` (it already is!)

### Required Environment Variables

```bash
# Server Configuration
PORT=5000
NODE_ENV=development
CORS_ORIGIN=http://localhost:3000

# Database
MONGO_URI=mongodb://localhost:27017/socialsync

# JWT Secret (Use a strong random string!)
JWT_SECRET=your-super-secret-jwt-key-min-32-characters

# OAuth Credentials (Get these from each platform's developer portal)
FACEBOOK_APP_ID=your_facebook_app_id
FACEBOOK_APP_SECRET=your_facebook_app_secret
TWITTER_CLIENT_ID=your_twitter_client_id
TWITTER_CLIENT_SECRET=your_twitter_client_secret
LINKEDIN_CLIENT_ID=your_linkedin_client_id
LINKEDIN_CLIENT_SECRET=your_linkedin_client_secret
INSTAGRAM_CLIENT_ID=your_instagram_client_id
INSTAGRAM_CLIENT_SECRET=your_instagram_client_secret
```

## 🔗 OAuth Setup

For detailed instructions on setting up OAuth credentials for each platform, see:

📖 **[OAUTH_SETUP.md](OAUTH_SETUP.md)**

This guide includes step-by-step instructions for:
- Facebook Developer Console
- Twitter Developer Portal
- LinkedIn Developer Platform
- Instagram Basic Display API

## 📁 Project Structure

```
SocialSync/
├── backend/
│   ├── controllers/
│   │   ├── authController.js       # User authentication
│   │   ├── oauthController.js      # OAuth flow handling
│   │   └── postController.js       # Post management
│   ├── middleware/
│   │   └── authMiddleware.js       # JWT authentication
│   ├── models/
│   │   └── User.js                 # User & social account models
│   ├── routes/
│   │   ├── authRoutes.js          # Authentication endpoints
│   │   ├── legalRoutes.js         # Legal compliance pages
│   │   ├── oauthRoutes.js         # OAuth endpoints
│   │   └── postRoutes.js          # Post endpoints
│   ├── services/
│   │   └── socialMediaService.js  # Social media API integration
│   ├── views/
│   │   ├── privacy.html           # Privacy policy page
│   │   └── terms.html             # Terms of service page
│   ├── .env                       # Environment variables (DO NOT COMMIT!)
│   ├── package.json
│   └── server.js                  # Main server file
├── frontend/
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   └── App.js                 # Main React component
│   └── package.json
├── .env.example                   # Safe environment template
├── .gitignore                     # Git ignore rules
├── OAUTH_SETUP.md                 # OAuth setup guide
└── README.md                      # This file
```

## 🌐 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile (protected)

### OAuth Integration
- `GET /api/social/{platform}/connect` - Initiate OAuth flow
- `GET /api/social/{platform}/callback` - OAuth callback
- `DELETE /api/social/{platform}/disconnect` - Disconnect platform

### Posts
- `POST /api/posts/create` - Create and publish post
- `GET /api/posts/user` - Get user's posts (protected)

### Legal (Required for OAuth)
- `GET /legal/privacy` - Privacy policy page
- `GET /legal/terms` - Terms of service page
- `POST /legal/data-deletion` - Data deletion callback

## 🔧 Development

### Running in Development Mode

```bash
# Backend with auto-restart
cd backend
npm run dev

# Frontend with hot reload
cd frontend
npm start
```

### Testing Social Media Integration

1. Set up OAuth credentials for at least one platform
2. Register a user account
3. Connect a social media account via OAuth
4. Create a test post
5. Verify the post appears on the connected platform

## 🚀 Production Deployment

### Environment Configuration

1. Set `NODE_ENV=production` in your environment
2. Use a strong, randomly generated JWT secret (min 32 characters)
3. Configure MongoDB Atlas or production database
4. Set up proper CORS origins for your domain
5. Use HTTPS for OAuth redirects

### Security Checklist

- [ ] All OAuth redirect URIs use HTTPS in production
- [ ] JWT secret is strong and randomly generated
- [ ] Database connection uses authentication
- [ ] Environment variables are properly secured
- [ ] Legal pages are accessible for OAuth compliance

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Troubleshooting

### Common Issues

1. **OAuth Callback Errors**: Ensure redirect URIs in developer consoles match your environment
2. **CORS Issues**: Check that `CORS_ORIGIN` matches your frontend URL
3. **Database Connection**: Verify MongoDB is running and connection string is correct
4. **Missing Environment Variables**: Copy `.env.example` to `backend/.env` and fill in values

### Getting Help

- Check the [OAUTH_SETUP.md](OAUTH_SETUP.md) for platform-specific setup issues
- Ensure all environment variables are properly configured
- Verify your MongoDB connection
- Check that all OAuth redirect URIs are correctly configured

---

**Made with ❤️ for social media management**

