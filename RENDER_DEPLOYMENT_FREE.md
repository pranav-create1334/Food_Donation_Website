# 🚀 FREE Deployment Guide - Render.com (No Cost!)

## ⚡ Why Render.com for FREE Hosting?

✅ **Completely FREE** - No credit card needed  
✅ **Free MySQL database** included  
✅ **Auto-deploy** from GitHub  
✅ **HTTPS** included  
✅ Perfect for small-medium projects  

---

## 🎯 TOTAL DEPLOYMENT TIME: 45 Minutes

---

## STEP 1: Prepare Your Code (5 minutes)

### 1.1 Check Git Status
Open PowerShell and navigate to your project:

```powershell
cd d:\programs\food_donation\Food_Donation_Website

# Check if git is initialized
git status
```

If it says "not a git repository", initialize it:

```powershell
git init
```

### 1.2 Create .gitignore (if not exists)

Make sure `.gitignore` exists and includes:

```
node_modules/
dist/
.env
.env.local
.env.production.local
.vscode/
*.log
Food_Donation/food_donation_backend/build/
Food_Donation/food_donation_backend/.gradle/
Food_Donation/food_donation_backend/bin/
```

---

## STEP 2: Push Code to GitHub (10 minutes)

### 2.1 Create GitHub Repository

1. Go to **[https://github.com/new](https://github.com/new)**
2. Enter repository name: `food-donation-website`
3. Select **Public**
4. Click **Create repository**
5. **Copy the URL** (something like `https://github.com/YOUR_USERNAME/food-donation-website.git`)

### 2.2 Push Your Code

In PowerShell:

```powershell
cd d:\programs\food_donation\Food_Donation_Website

# Add all files
git add .

# Commit
git commit -m "Initial commit: Food Donation Website - Ready for Render deployment"

# Add remote (PASTE YOUR URL HERE)
git remote add origin https://github.com/YOUR_USERNAME/food-donation-website.git

# Push to GitHub
git branch -M main
git push -u origin main
```

**If you get errors:**
- Make sure Git is installed: Download from https://git-scm.com/
- Restart PowerShell after installing Git

---

## STEP 3: Sign Up for Render.com (3 minutes)

1. Go to **[https://render.com](https://render.com)**
2. Click **Sign Up**
3. Choose **Sign up with GitHub** (easiest)
4. Authorize Render to access your GitHub
5. Done! ✅

---

## STEP 4: Create MySQL Database on Render (5 minutes)

### 4.1 Create Database

1. In Render dashboard, click **New +**
2. Select **MySQL**
3. Enter database name: `food_donation_db`
4. Select **Free** tier
5. Click **Create Database**
6. Wait 1-2 minutes for provision

### 4.2 Save Database Credentials

Once created:
- Click the database
- Go to **Connections** tab
- **Copy and SAVE these credentials** (you'll need them):
  - **Internal Database URL** (for backend connection)
  - **External Database URL** (for local testing)
  - **Username**
  - **Password**
  - **Port**

**Example format:**
```
Internal URL: mysql://root:password123@db.render.com/food_donation_db?useSSL=false&serverTimezone=UTC
Username: root
Password: password123
Port: 3306
```

---

## STEP 5: Deploy Backend (10 minutes)

### 5.1 Create Backend Service

1. In Render dashboard, click **New +**
2. Select **Web Service**
3. Click **Connect a Repository**
4. Select your `food-donation-website` repo
5. Enter service name: `food-donation-backend`
6. Environment: **Docker**
7. Click **Deploy**

### 5.2 Configure Environment Variables

While deployment is starting:

1. Click the backend service
2. Go to **Environment** tab
3. Add these variables:

```
SPRING_PROFILES_ACTIVE=prod
DB_URL=mysql://root:password123@db.render.com/food_donation_db?useSSL=false&serverTimezone=UTC
DB_USER=root
DB_PASSWORD=password123
JWT_SECRET=foodDonationSuperSecretKeyForJwtTokenGeneration2026Change_This_To_Random_String
JWT_EXPIRATION_MS=86400000
```

**⚠️ IMPORTANT:** Replace the credentials with actual values from Step 4.2

### 5.3 Set Build & Start Commands

In the same service settings:

**Build Command:**
```
docker build -t food-donation .
```

**Start Command:**
Keep it empty (Docker will handle it)

### 5.4 Wait for Deploy

- Render will build your Docker image
- Deploy should complete in 5-10 minutes
- Once deployed, note your **Backend URL** (e.g., `https://food-donation-backend.onrender.com`)

---

## STEP 6: Deploy Frontend (5 minutes)

### 6.1 Create .env.production File

Create a file named `.env.production` in your project root:

```
VITE_API_BASE_URL=https://food-donation-backend.onrender.com/api
```

(Replace with your actual backend URL from Step 5.4)

### 6.2 Commit & Push

```powershell
git add .env.production
git commit -m "Add production environment configuration"
git push origin main
```

### 6.3 Frontend Deploy is Automatic!

Since Render detects Docker, your frontend will be included in the Docker build automatically.

---

## STEP 7: Verify Deployment (5 minutes)

### 7.1 Check Backend is Running

Open in your browser:
```
https://food-donation-backend.onrender.com/api/health
```

You should see a health check response.

### 7.2 Check Frontend is Loaded

Open in your browser:
```
https://food-donation-backend.onrender.com
```

You should see your Food Donation Website loaded!

### 7.3 Test Authentication

1. Go to Login page
2. Try to create a donation or volunteer
3. Check if API calls work

---

## ⚠️ COMMON ISSUES & FIXES

### Issue: "Build Failed - Dockerfile Not Found"
**Fix:** Make sure your `Dockerfile` is in the root directory. Check [STEP 8](#step-8-docker-fixes) below.

### Issue: "Backend connection refused"
**Fix:** Your database credentials are wrong. Re-check Step 5.2 variables.

### Issue: "Database not connecting"
**Fix:** 
1. Verify the MySQL service is running in Render
2. Check database credentials are correct
3. Make sure DB_URL uses `mysql://` not `jdbc:mysql://`

### Issue: "Frontend shows blank page"
**Fix:**
1. Check `.env.production` file is correct
2. Verify VITE_API_BASE_URL points to your backend
3. Check browser console for errors (F12)

### Issue: "Timeout during build"
**Fix:**
1. Try redeploying: Go to service → Deploy → Redeploy
2. Reduce Docker image size by checking `.dockerignore`
3. Ensure no large files in repo

---

## STEP 8: Docker Configuration Check ✅

Your `Dockerfile` should be correctly configured. If you face build issues, check that it:
1. Builds frontend React app
2. Builds backend Spring Boot jar
3. Copies both to final image
4. Runs on port 8080

---

## 🎉 DEPLOYMENT COMPLETE!

Your Food Donation Website is now **LIVE and FREE** on Render.com! 

**Your URLs:**
- Backend API: `https://food-donation-backend.onrender.com/api`
- Frontend: `https://food-donation-backend.onrender.com`

---

## 📚 Additional Resources

- **Render Docs**: https://render.com/docs
- **Docker Docs**: https://docs.docker.com/
- **Spring Boot Production**: https://spring.io/guides/gs/spring-boot/

---

## 🔄 How to Update After Deployment

Simply push changes to GitHub:

```powershell
git add .
git commit -m "Your change description"
git push origin main
```

Render will **automatically redeploy** your app! ✨

---

## 💰 Cost Breakdown

| Component | Cost |
|-----------|------|
| Backend (Web Service) | **FREE** ✅ |
| MySQL Database | **FREE** ✅ |
| Frontend | **FREE** ✅ |
| HTTPS Certificate | **FREE** ✅ |
| **Total** | **$0/month** ✅ |

---

## ⚡ Free Tier Limitations (Acceptable for small projects)

- **Web Service**: Hibernates after 15 min of inactivity (wakes on request)
- **Database**: 1GB storage (plenty for starting out)
- **Bandwidth**: Generous free limits

If you outgrow free tier, upgrade easily with $7-20/month paid tiers.
