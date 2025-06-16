# 🚀 SocialSync Deployment Guide

This guide covers secure deployment practices for SocialSync in production environments.

## 🔒 Pre-Deployment Security Checklist

### 1. Environment Variables Security

- [ ] **JWT_SECRET**: Use a cryptographically secure random string (min 32 characters)
- [ ] **Database Credentials**: Use strong passwords and restricted database users
- [ ] **OAuth Secrets**: Ensure all OAuth credentials are production-ready
- [ ] **CORS Configuration**: Set proper CORS origins for your domain
- [ ] **Environment Files**: Ensure `.env` files are never committed to Git

### 2. OAuth Configuration for Production

**Critical Requirements:**
- All OAuth redirect URIs must use HTTPS in production
- Update redirect URIs in each platform's developer console
- Ensure legal pages are accessible via HTTPS

**Update these URLs in your OAuth apps:**
```
Privacy Policy: https://yourdomain.com/legal/privacy
Terms of Service: https://yourdomain.com/legal/terms
Data Deletion: https://yourdomain.com/legal/data-deletion
```

### 3. Database Security

- Use MongoDB Atlas or a properly secured MongoDB instance
- Enable authentication and use strong passwords
- Restrict database access to specific IP addresses
- Enable encryption at rest and in transit

## 🌐 Deployment Options

### Option 1: Heroku Deployment

1. **Create Heroku Apps**
   ```bash
   # Backend
   heroku create your-app-backend
   
   # Frontend (if deploying separately)
   heroku create your-app-frontend
   ```

2. **Set Environment Variables**
   ```bash
   heroku config:set MONGO_URI="your-production-mongodb-uri" -a your-app-backend
   heroku config:set JWT_SECRET="your-super-secure-jwt-secret" -a your-app-backend
   heroku config:set NODE_ENV="production" -a your-app-backend
   heroku config:set CORS_ORIGIN="https://your-frontend-domain.com" -a your-app-backend
   
   # OAuth credentials
   heroku config:set FACEBOOK_APP_ID="your-production-facebook-app-id" -a your-app-backend
   heroku config:set FACEBOOK_APP_SECRET="your-production-facebook-secret" -a your-app-backend
   # ... repeat for other platforms
   ```

3. **Deploy**
   ```bash
   git push heroku main
   ```

### Option 2: DigitalOcean/AWS/VPS Deployment

1. **Server Setup**
   ```bash
   # Update system
   sudo apt update && sudo apt upgrade -y
   
   # Install Node.js
   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   sudo apt-get install -y nodejs
   
   # Install PM2 for process management
   sudo npm install -g pm2
   
   # Install Nginx
   sudo apt install nginx -y
   ```

2. **Application Setup**
   ```bash
   # Clone repository
   git clone https://github.com/yourusername/socialsync.git
   cd socialsync
   
   # Install dependencies
   cd backend && npm install --production
   cd ../frontend && npm install && npm run build
   ```

3. **Environment Configuration**
   ```bash
   # Create production .env file
   sudo nano backend/.env
   
   # Add your production environment variables
   NODE_ENV=production
   PORT=5000
   MONGO_URI=your-production-mongodb-uri
   JWT_SECRET=your-super-secure-jwt-secret
   CORS_ORIGIN=https://yourdomain.com
   # ... OAuth credentials
   ```

4. **Process Management with PM2**
   ```bash
   # Start application with PM2
   cd backend
   pm2 start server.js --name "socialsync-backend"
   pm2 startup
   pm2 save
   ```

5. **Nginx Configuration**
   ```nginx
   # /etc/nginx/sites-available/socialsync
   server {
       listen 80;
       server_name yourdomain.com www.yourdomain.com;
       
       # Redirect to HTTPS
       return 301 https://$server_name$request_uri;
   }
   
   server {
       listen 443 ssl http2;
       server_name yourdomain.com www.yourdomain.com;
       
       # SSL Configuration
       ssl_certificate /path/to/your/certificate.pem;
       ssl_certificate_key /path/to/your/private.key;
       
       # Frontend (React build)
       location / {
           root /path/to/socialsync/frontend/build;
           try_files $uri $uri/ /index.html;
       }
       
       # Backend API
       location /api/ {
           proxy_pass http://localhost:5000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_set_header X-Real-IP $remote_addr;
           proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
           proxy_set_header X-Forwarded-Proto $scheme;
           proxy_cache_bypass $http_upgrade;
       }
       
       # Legal pages
       location /legal/ {
           proxy_pass http://localhost:5000;
           proxy_set_header Host $host;
           proxy_set_header X-Real-IP $remote_addr;
           proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
           proxy_set_header X-Forwarded-Proto $scheme;
       }
   }
   ```

6. **Enable Nginx Configuration**
   ```bash
   sudo ln -s /etc/nginx/sites-available/socialsync /etc/nginx/sites-enabled/
   sudo nginx -t
   sudo systemctl reload nginx
   ```

## 🔐 SSL Certificate Setup

### Using Let's Encrypt (Recommended)

```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx -y

# Obtain SSL certificate
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com

# Auto-renewal
sudo crontab -e
# Add: 0 12 * * * /usr/bin/certbot renew --quiet
```

## 📊 Monitoring & Logging

### 1. Application Monitoring

```bash
# PM2 monitoring
pm2 monit

# View logs
pm2 logs socialsync-backend

# Application status
pm2 status
```

### 2. Nginx Logs

```bash
# Access logs
sudo tail -f /var/log/nginx/access.log

# Error logs
sudo tail -f /var/log/nginx/error.log
```

### 3. System Monitoring

```bash
# System resources
htop

# Disk usage
df -h

# Memory usage
free -h
```

## 🛡️ Security Hardening

### 1. Firewall Configuration

```bash
# Allow SSH, HTTP, and HTTPS
sudo ufw allow ssh
sudo ufw allow 80
sudo ufw allow 443
sudo ufw enable
```

### 2. Fail2Ban (Protection against brute force)

```bash
sudo apt install fail2ban -y
sudo systemctl enable fail2ban
sudo systemctl start fail2ban
```

### 3. Regular Security Updates

```bash
# Automatic security updates
sudo apt install unattended-upgrades -y
sudo dpkg-reconfigure unattended-upgrades
```

## 🔄 Deployment Workflow

### 1. Pre-deployment Steps

```bash
# Run security checks
npm run security-check

# Test application locally
npm run dev

# Build frontend for production
cd frontend && npm run build
```

### 2. Deployment Process

```bash
# Pull latest changes
git pull origin main

# Install/update dependencies
cd backend && npm install --production
cd ../frontend && npm install && npm run build

# Restart application
pm2 restart socialsync-backend

# Check status
pm2 status
```

## 🚨 Troubleshooting

### Common Issues

1. **OAuth Redirect Mismatch**
   - Ensure all redirect URIs in developer consoles match your production URLs
   - Verify HTTPS is used for all production redirects

2. **CORS Errors**
   - Check `CORS_ORIGIN` environment variable matches your frontend domain
   - Ensure proper protocol (https://) is used

3. **Database Connection Issues**
   - Verify MongoDB connection string and credentials
   - Check firewall rules and IP whitelist

4. **SSL Certificate Issues**
   - Verify certificate paths in Nginx configuration
   - Check certificate expiration dates

### Health Check Endpoints

Add these endpoints to monitor application health:

```javascript
// In server.js
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});
```

## 📋 Post-Deployment Checklist

- [ ] All environment variables are properly set
- [ ] OAuth redirects work correctly
- [ ] SSL certificate is installed and valid
- [ ] Legal pages are accessible
- [ ] Database connection is secure
- [ ] Application logs are being generated
- [ ] Monitoring is set up
- [ ] Backup strategy is in place
- [ ] Security headers are configured
- [ ] Performance is optimized

---

**Remember**: Always test your deployment in a staging environment before deploying to production! 