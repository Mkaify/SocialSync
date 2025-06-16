# 🚀 Free Deployment Guide for SocialSync

## 🆓 **Best Free Deployment Options**

### **Option 1: Render (Recommended)**

#### **What You'll Get:**
- ✅ **Backend**: Free Node.js hosting
- ✅ **Frontend**: Free static site hosting  
- ✅ **Database**: MongoDB Atlas (free 512MB)
- ✅ **SSL**: Automatic HTTPS
- ✅ **Custom Domain**: Supported

---

## 📋 **Step-by-Step Deployment**

### **1. Setup MongoDB Atlas (Database)**

1. Go to [mongodb.com/atlas](https://www.mongodb.com/atlas)
2. Create free account
3. Create new cluster (M0 Sandbox - Free)
4. Create database user
5. Get connection string: `mongodb+srv://username:password@cluster.mongodb.net/socialsync`

### **2. Deploy to Render**

1. **Go to [render.com](https://render.com)**
2. **Connect your GitHub repository**
3. **Create Web Service (Backend)**:
   - Environment: `Node`
   - Build Command: `cd backend && npm install`
   - Start Command: `cd backend && npm start`
   - Instance Type: `Free`

4. **Create Static Site (Frontend)**:
   - Build Command: `cd frontend && npm install && npm run build`
   - Publish Directory: `frontend/build`

### **3. Environment Variables**

Set these in Render Dashboard for your backend service:

```bash
NODE_ENV=production
PORT=10000
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/socialsync
JWT_SECRET=your-secure-64-character-secret
CORS_ORIGIN=https://your-frontend-name.onrender.com

# OAuth Credentials (from developer consoles)
FACEBOOK_APP_ID=your_facebook_app_id
FACEBOOK_APP_SECRET=your_facebook_app_secret
TWITTER_CLIENT_ID=your_twitter_client_id
TWITTER_CLIENT_SECRET=your_twitter_client_secret
LINKEDIN_CLIENT_ID=your_linkedin_client_id
LINKEDIN_CLIENT_SECRET=your_linkedin_client_secret
INSTAGRAM_CLIENT_ID=your_instagram_client_id
INSTAGRAM_CLIENT_SECRET=your_instagram_client_secret
```

### **4. Update OAuth Redirect URIs**

Update these URLs in each platform's developer console:

```bash
# Replace with your actual Render URLs
FACEBOOK_REDIRECT_URI=https://your-backend-name.onrender.com/api/social/facebook/callback
TWITTER_REDIRECT_URI=https://your-backend-name.onrender.com/api/social/twitter/callback
LINKEDIN_REDIRECT_URI=https://your-backend-name.onrender.com/api/social/linkedin/callback
INSTAGRAM_REDIRECT_URI=https://your-backend-name.onrender.com/api/social/instagram/callback

# Legal pages for OAuth compliance
Privacy Policy: https://your-backend-name.onrender.com/legal/privacy
Terms of Service: https://your-backend-name.onrender.com/legal/terms
Data Deletion: https://your-backend-name.onrender.com/legal/data-deletion
```

---

## 🔧 **Alternative Platforms**

### **Railway**
- Free $5/month credit
- Very similar to Heroku
- Built-in databases

### **Vercel (Frontend) + Railway (Backend)**
- Vercel: Best for React apps
- Railway: Great for Node.js APIs

### **Netlify (Frontend) + Render (Backend)**
- Netlify: Excellent static hosting
- Render: Reliable backend hosting

---

## ⚡ **Quick Deploy Commands**

### **For Render:**
```bash
# 1. Commit your changes
git add .
git commit -m "Prepare for production deployment"
git push origin main

# 2. Connect repository to Render
# 3. Deploy using Render dashboard
```

---

## 🎯 **Post-Deployment Checklist**

- [ ] Backend API is accessible: `https://your-backend.onrender.com`
- [ ] Frontend loads: `https://your-frontend.onrender.com`
- [ ] Database connection works
- [ ] OAuth redirects are updated
- [ ] Environment variables are set
- [ ] SSL certificates are active
- [ ] Legal pages are accessible

---

## 💡 **Pro Tips**

1. **Free Tier Limitations:**
   - Render: Services sleep after 15 min of inactivity
   - MongoDB Atlas: 512MB storage limit
   - Consider upgrading for production traffic

2. **Performance:**
   - Use CDN for static assets
   - Enable gzip compression
   - Optimize images

3. **Monitoring:**
   - Set up uptime monitoring (UptimeRobot - free)
   - Use Render's built-in logs
   - Monitor MongoDB Atlas metrics

---

## 🆘 **Troubleshooting**

**Backend won't start:**
- Check environment variables
- Verify MongoDB connection string
- Check Render build logs

**Frontend can't connect to backend:**
- Verify API_BASE_URL configuration
- Check CORS_ORIGIN setting
- Ensure backend is running

**OAuth not working:**
- Update redirect URIs in developer consoles
- Verify environment variables
- Check legal page URLs

---

**Your SocialSync app will be live at:**
- **Frontend**: `https://your-frontend-name.onrender.com`
- **Backend API**: `https://your-backend-name.onrender.com` 