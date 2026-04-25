# Food Donation Website - Deployment Guide

## Overview
This guide will help you deploy the Food Donation Website to **Railway.app** - a modern cloud platform perfect for first-time deployers.

**Tech Stack:**
- Frontend: React + TypeScript + Vite
- Backend: Spring Boot (Java 17)
- Database: MySQL

---

## Step 1: Prepare Your Project (LOCAL)

### 1.1 Install Prerequisites
Ensure you have:
- **Git** installed ([https://git-scm.com/](https://git-scm.com/))
- **GitHub account** ([https://github.com](https://github.com))
- **Railway.app account** ([https://railway.app](https://railway.app))

### 1.2 Push Your Project to GitHub

```bash
# Navigate to your project root
cd d:\programs\food_donation\Food_Donation_Website

# Initialize git (if not already done)
git init

# Add all files
git add .

# Commit changes
git commit -m "Initial commit: Food Donation Website ready for deployment"

# Create repository on GitHub, then:
git remote add origin https://github.com/YOUR_USERNAME/food-donation-website.git
git branch -M main
git push -u origin main
```

---

## Step 2: Set Up Railway.app

### 2.1 Create Railway Project

1. Go to **[https://railway.app](https://railway.app)** and sign in/sign up
2. Click **"Create a New Project"**
3. Select **"Deploy from GitHub"**
4. Authorize Railway with GitHub and select your **food-donation-website** repository
5. Railway will auto-detect it's a Docker project

### 2.2 Add MySQL Database

1. In your Railway project, click **"Add"** (+ button)
2. Select **"Database"** → **"MySQL"**
3. Railway will provision a MySQL instance automatically
4. Note the generated credentials (you'll see them in Variables)

### 2.3 Configure Environment Variables

Click on your **Backend Service** → **Variables tab** → Add these:

```
PORT=8080
SPRING_PROFILES_ACTIVE=prod
DB_URL=<Railway MySQL Connection URL>
DB_USER=<MySQL Username>
DB_PASSWORD=<MySQL Password>
JWT_SECRET=foodDonationSuperSecretKeyForJwtTokenGeneration2026
JWT_EXPIRATION_MS=86400000
```

**To get MySQL connection details:**
- Go to your MySQL Database service in Railway
- Click the **"Connect"** tab
- Copy the connection URL and credentials

---

## Step 3: Update Application Configuration

### 3.1 Backend Configuration (ALREADY DONE ✓)

Production config file created: `application-prod.properties`

### 3.2 Frontend Configuration

Create a `.env.production` file in your project root:

```
VITE_API_BASE_URL=https://your-railway-domain.up.railway.app/api
```

To find your Railway domain:
1. Go to your Railway project
2. Click on Backend Service
3. Copy the **Public URL** and append `/api`

---

## Step 4: Automatic Deployment

Railway will automatically:
1. Build your Docker image
2. Start the backend service
3. Connect to MySQL
4. Deploy within 2-5 minutes

You can monitor the build in the **Deploy** tab.

---

## Step 5: Verify Deployment

### 5.1 Test Backend
```bash
curl https://your-railway-domain.up.railway.app/auth/signin
# Should return a 400 Bad Request (expected - missing credentials)
```

### 5.2 Test Frontend
1. Visit: `https://your-railway-domain.up.railway.app`
2. You should see the Landing page
3. Click "New Donation" → Should redirect to login

### 5.3 Test API Connection
1. Sign up as a donor
2. Create a donation
3. Check if it saves without the "Data too long" error

---

## Step 6: Troubleshooting

### Issue: "Build failed"
- Check Railway **Logs** tab for error messages
- Ensure all environment variables are set
- Verify MySQL is connected

### Issue: "Cannot connect to database"
- Check `DB_URL`, `DB_USER`, `DB_PASSWORD` are correct
- Verify MySQL service is running in Railway
- Check Application logs for connection errors

### Issue: "Frontend not loading"
- Ensure `VITE_API_BASE_URL` points to correct backend URL
- Check browser console for CORS or API errors
- Verify backend is running

### Issue: "CORS errors"
Add to Backend `SecurityConfig.java`:
```java
@CrossOrigin(origins = "your-railway-domain.up.railway.app")
```

---

## Step 7: Custom Domain (Optional)

### 7.1 Connect Custom Domain
1. In Railway → Project Settings → **Domains**
2. Add your custom domain (e.g., `foodshare.com`)
3. Update DNS records as instructed by Railway
4. Update frontend `VITE_API_BASE_URL` if changed

---

## Step 8: Monitoring & Maintenance

### Monitor Logs
Railway → Backend Service → **Logs tab**

### Monitor Database
Railway → MySQL Service → Check usage in **Overview**

### View Metrics
Railway → **Deployments** → Click any deployment to see CPU, Memory usage

---

## Step 9: Scaling (Future)

Once deployed, you can:
- **Increase replicas**: Railway → Backend → Increase instances
- **Upgrade MySQL**: MySQL Service → Change plan
- **Enable auto-scaling**: In settings (if needed)

---

## Quick Reference: Important URLs After Deployment

| Service | URL |
|---------|-----|
| Frontend | `https://your-railway-domain.up.railway.app` |
| Backend API | `https://your-railway-domain.up.railway.app/api` |
| Railway Dashboard | `https://railway.app/dashboard` |
| MySQL Connection | Via Railway Variables |

---

## Cost Estimate

**Railway Pricing (as of 2026):**
- **Backend Service**: ~$5/month
- **MySQL Database**: ~$5-15/month (depending on usage)
- **Total**: ~$10-20/month (very affordable!)

---

## Need Help?

- **Railway Docs**: https://docs.railway.app
- **Spring Boot Docs**: https://spring.io/projects/spring-boot
- **React/Vite Docs**: https://vitejs.dev

---

## Final Checklist

- [ ] Project pushed to GitHub
- [ ] Railway account created
- [ ] Docker configuration added
- [ ] Environment variables set
- [ ] MySQL database provisioned
- [ ] Deployment successful
- [ ] Frontend loads correctly
- [ ] API requests working
- [ ] Donations saving to database

✅ **Your website is now live!**
