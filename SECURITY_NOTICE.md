# 🚨 CRITICAL SECURITY NOTICE

## Before Deploying or Sharing This Project:

### 1. ⚠️ UPDATE JWT_SECRET IMMEDIATELY

The `backend/.env` file currently contains placeholder values that are **NOT SECURE** for production use.

**Required Action:**
```bash
# Generate a secure JWT secret (minimum 32 characters)
# You can use any of these methods:

# Method 1: Using Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Method 2: Using OpenSSL
openssl rand -hex 32

# Method 3: Online generator
# Visit: https://generate-secret.vercel.app/32
```

Then update your `backend/.env` file:
```bash
JWT_SECRET=your_generated_secure_secret_here
```

### 2. 🔐 OAuth Credentials

Replace ALL placeholder OAuth credentials in `backend/.env`:
- `FACEBOOK_APP_ID` and `FACEBOOK_APP_SECRET`
- `TWITTER_CLIENT_ID` and `TWITTER_CLIENT_SECRET`
- `LINKEDIN_CLIENT_ID` and `LINKEDIN_CLIENT_SECRET`
- `INSTAGRAM_CLIENT_ID` and `INSTAGRAM_CLIENT_SECRET`

See `OAUTH_SETUP.md` for detailed setup instructions.

### 3. 🗄️ Database Configuration

Update `MONGO_URI` for production:
```bash
# For MongoDB Atlas:
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/socialsync

# For local production:
MONGO_URI=mongodb://username:password@localhost:27017/socialsync
```

### 4. 🌐 CORS Configuration

Update `CORS_ORIGIN` for your production domain:
```bash
CORS_ORIGIN=https://yourdomain.com
```

## ✅ Verification Steps

Run the security check before deploying:
```bash
cd backend
npm run security-check
```

## 🚫 NEVER COMMIT .env FILES

The `.gitignore` file is configured to exclude `.env` files from Git commits.
**Always verify your .env file is NOT committed to Git!**

---

**⚠️ This notice will be automatically removed when you run the security check successfully.** 