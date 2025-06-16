# 🚀 Exact Render Configuration

## 🔧 **Backend Web Service Settings**

### **Basic Settings:**
- **Name**: `socialsync-backend`
- **Environment**: `Node`
- **Region**: `Oregon (US West)`
- **Branch**: `main`
- **Root Directory**: Leave empty
- **Build Command**: `cd backend && npm install`
- **Start Command**: `cd backend && npm start`

### **Environment Variables (CRITICAL - MUST SET):**

```bash
# Core Settings
NODE_ENV=production
PORT=10000

# Database (Your MongoDB Atlas string)
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/socialsync

# Security (Generate 64-character secret)
JWT_SECRET=your-64-character-secure-secret-here

# CORS (Will update after frontend deployment)
CORS_ORIGIN=https://your-frontend-name.onrender.com

# OAuth Credentials (Copy from your local .env)
FACEBOOK_APP_ID=your_facebook_app_id
FACEBOOK_APP_SECRET=your_facebook_app_secret
TWITTER_CLIENT_ID=your_twitter_client_id
TWITTER_CLIENT_SECRET=your_twitter_client_secret
LINKEDIN_CLIENT_ID=your_linkedin_client_id
LINKEDIN_CLIENT_SECRET=your_linkedin_client_secret
INSTAGRAM_CLIENT_ID=your_instagram_client_id
INSTAGRAM_CLIENT_SECRET=your_instagram_client_secret

# OAuth Redirect URIs (Update with your backend URL)
FACEBOOK_REDIRECT_URI=https://your-backend-name.onrender.com/api/social/facebook/callback
TWITTER_REDIRECT_URI=https://your-backend-name.onrender.com/api/social/twitter/callback
LINKEDIN_REDIRECT_URI=https://your-backend-name.onrender.com/api/social/linkedin/callback
INSTAGRAM_REDIRECT_URI=https://your-backend-name.onrender.com/api/social/instagram/callback
```

---

## 🎨 **Frontend Static Site Settings**

### **Basic Settings:**
- **Name**: `socialsync-frontend`  
- **Environment**: `Static Site`
- **Root Directory**: Leave empty
- **Build Command**: `cd frontend && npm install && npm run build`
- **Publish Directory**: `frontend/build`

### **Environment Variables for Frontend:**
```bash
# API Endpoint (Set after backend is deployed)
REACT_APP_API_URL=https://your-backend-name.onrender.com
```

---

## 📋 **Step-by-Step Process:**

### **1. Deploy Backend First:**
1. Create Web Service
2. Set all environment variables above
3. Deploy and get backend URL: `https://your-backend-name.onrender.com`

### **2. Update CORS_ORIGIN:**
1. After frontend deployment, update backend's `CORS_ORIGIN`
2. Set it to your frontend URL: `https://your-frontend-name.onrender.com`

### **3. Deploy Frontend:**
1. Create Static Site
2. Set `REACT_APP_API_URL` to your backend URL
3. Deploy

### **4. Update OAuth Redirect URIs:**
Update these in each platform's developer console with your actual URLs.

---

## ⚠️ **Important Notes:**

1. **Environment Variables are MANDATORY** - Without them, your app won't work
2. **Copy exact values** from your local `backend/.env` file
3. **Update URLs** after deployment with actual Render URLs
4. **MongoDB Atlas string** should include database name at the end

**Example MongoDB URI format:**
```
mongodb+srv://username:password@cluster0.abc123.mongodb.net/socialsync?retryWrites=true&w=majority
``` 