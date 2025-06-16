# 🚀 Vercel + Railway Deployment Guide

## 🎯 **Deployment Strategy**
- **Frontend**: Vercel (React App) - FREE
- **Backend**: Railway (Node.js API) - FREE ($5 credit)
- **Database**: MongoDB Atlas - FREE

---

## 📋 **Step-by-Step Process**

### **1. Deploy Backend to Railway First**

1. **Go to [railway.app](https://railway.app)**
2. **Login with GitHub**
3. **New Project** → **Deploy from GitHub repo**
4. **Select your SocialSync repository**
5. **Railway will auto-detect Node.js backend**

#### **Set Environment Variables in Railway:**
```bash
NODE_ENV=production
MONGO_URI=your-mongodb-atlas-connection-string
JWT_SECRET=your-jwt-secret
CORS_ORIGIN=https://your-vercel-domain.vercel.app

# OAuth Credentials
FACEBOOK_APP_ID=your_facebook_app_id
FACEBOOK_APP_SECRET=your_facebook_app_secret
TWITTER_CLIENT_ID=your_twitter_client_id
TWITTER_CLIENT_SECRET=your_twitter_client_secret
LINKEDIN_CLIENT_ID=your_linkedin_client_id
LINKEDIN_CLIENT_SECRET=your_linkedin_client_secret
INSTAGRAM_CLIENT_ID=your_instagram_client_id
INSTAGRAM_CLIENT_SECRET=your_instagram_client_secret
```

6. **Deploy and get your Railway backend URL**: `https://your-app.railway.app`

---

### **2. Deploy Frontend to Vercel**

1. **Go to [vercel.com](https://vercel.com)**
2. **Import your GitHub repository**
3. **Configure Project:**
   - **Project Name**: `socialsync-frontend`
   - **Framework Preset**: `Create React App`
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `build`

#### **Set Environment Variable in Vercel:**
```bash
REACT_APP_API_URL=https://your-railway-backend-url.railway.app
```

4. **Deploy and get your Vercel frontend URL**: `https://your-app.vercel.app`

---

### **3. Update CORS Settings**

1. **Go back to Railway dashboard**
2. **Update Environment Variables:**
   - **CORS_ORIGIN**: `https://your-vercel-domain.vercel.app`
3. **Redeploy backend**

---

### **4. Update OAuth Redirect URIs**

Update these URLs in each platform's developer console:

```bash
# Facebook Developer Console
FACEBOOK_REDIRECT_URI=https://your-railway-backend.railway.app/api/social/facebook/callback

# Twitter Developer Portal  
TWITTER_REDIRECT_URI=https://your-railway-backend.railway.app/api/social/twitter/callback

# LinkedIn Developer Platform
LINKEDIN_REDIRECT_URI=https://your-railway-backend.railway.app/api/social/linkedin/callback

# Instagram Basic Display
INSTAGRAM_REDIRECT_URI=https://your-railway-backend.railway.app/api/social/instagram/callback

# Legal Pages for OAuth Compliance
Privacy Policy: https://your-railway-backend.railway.app/legal/privacy
Terms of Service: https://your-railway-backend.railway.app/legal/terms
Data Deletion: https://your-railway-backend.railway.app/legal/data-deletion
```

---

## ✅ **Final URLs**

After successful deployment:
- **Frontend**: `https://socialsync-frontend.vercel.app`
- **Backend API**: `https://socialsync-backend.railway.app`
- **Total Cost**: $0 (Completely Free!)

---

## 💡 **Pro Tips**

1. **Deploy backend first** to get the URL for frontend configuration
2. **Always update CORS_ORIGIN** after frontend deployment
3. **Railway gives you $5 free credit monthly** - more than enough for development
4. **Vercel has unlimited deployments** for frontend
5. **Both platforms auto-deploy** on Git push

---

## 🔧 **Commands for Local Testing**

Before deploying, test locally:

```bash
# Backend
cd backend
npm start

# Frontend (new terminal)
cd frontend
REACT_APP_API_URL=http://localhost:5000 npm start
```

---

## 🆘 **Troubleshooting**

**Railway backend not starting:**
- Check environment variables are set
- Verify MongoDB Atlas connection string
- Check Railway build logs

**Vercel frontend can't connect to backend:**
- Verify REACT_APP_API_URL is set correctly
- Check CORS_ORIGIN in Railway backend
- Ensure both services are deployed

**OAuth not working:**
- Update redirect URIs in developer consoles
- Verify environment variables in Railway
- Check legal page URLs are accessible 