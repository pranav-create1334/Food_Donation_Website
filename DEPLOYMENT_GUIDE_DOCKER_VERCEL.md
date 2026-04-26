# 🚀 Complete Deployment Guide: Docker + Vercel

## 📋 Project Overview

Your Food Donation Website consists of:
- **Frontend**: React + Vite + TypeScript + Tailwind CSS
- **Backend**: Spring Boot (Java) with Gradle
- **Database**: MySQL (or H2 for development)

## ⚠️ Important: Deployment Architecture

**Vercel Limitation**: Vercel is designed for frontend/static sites and serverless functions. It **cannot** run:
- Spring Boot (Java) applications
- Docker containers directly
- Full-stack applications with Java backends

### Recommended Solutions:

| Option | Frontend | Backend | Database | Cost |
|--------|----------|---------|----------|------|
| **Option A (Easiest)** | Docker (all-in-one) | Docker (all-in-one) | Docker (all-in-one) | FREE (Render/Railway) |
| **Option B** | Vercel | Render/Railway (Docker) | Render/Railway | FREE |
| **Option C** | Vercel | Vercel Serverless* | Vercel Postgres | FREE tier limited |

*Option C requires rewriting backend to Node.js/Serverless

---

## 🎯 OPTION A: Deploy Everything with Docker (RECOMMENDED)

This is the **simplest and fastest** way to deploy your full-stack application.

### Step 1: Push Code to GitHub

```powershell
# Navigate to project
cd d:\programs\food_donation\Food_Donation_Website

# Initialize git if not already
git init

# Add all files
git add .

# Commit
git commit -m "Ready for Docker deployment"

# Create GitHub repository and push
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/food-donation-website.git
git push -u origin main
```

### Step 2: Deploy to Render.com (FREE with Docker)

1. **Sign up**: Go to [https://render.com](https://render.com) and sign up with GitHub

2. **Create a new Web Service**:
   - Click **"New +"** → **"Web Service"**
   - Connect your GitHub repository: `food-donation-website`
   - Configure:
     - **Name**: `food-donation-app`
     - **Region**: Choose closest to you
     - **Branch**: `main`
     - **Root Directory**: (leave empty)
     - **Runtime**: **Docker**
     - **Dockerfile**: `./Dockerfile`
     - **Plan**: Free

3. **Set Environment Variables** (click "Advanced" → "Add Environment Variable"):

```
PORT=8080
SPRING_PROFILES_ACTIVE=prod
SPRING_DATASOURCE_URL=jdbc:h2:mem:food_donation;MODE=PostgreSQL;DB_CLOSE_DELAY=-1;DB_CLOSE_ON_EXIT=FALSE
SPRING_DATASOURCE_USERNAME=sa
SPRING_DATASOURCE_PASSWORD=
APP_JWT_SECRET=foodDonationSuperSecretKeyForJwtTokenGeneration2026
APP_JWT_EXPIRATION_MS=86400000
VITE_API_BASE_URL=/api
```

4. **Click "Create Web Service"**

5. **Wait 5-10 minutes** for the build to complete

6. **Your app is live!** Copy the URL (e.g., `https://food-donation-app.onrender.com`)

### Step 3: Test Your Deployment

Open your browser and go to your Render URL. You should see your Food Donation Website!

---

## 🎯 OPTION B: Deploy Frontend to Vercel + Backend to Render

If you specifically want to use Vercel for the frontend:

### Part 1: Deploy Backend to Render (Docker)

1. Follow **Option A, Steps 1-5** to deploy the backend

2. **Important**: Note your backend URL (e.g., `https://food-donation-backend.onrender.com`)

### Part 2: Deploy Frontend to Vercel

1. **Create `vercel.json`** in your project root:

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "devCommand": "npm run dev",
  "installCommand": "npm install",
  "framework": "vite",
  "rewrites": [
    {
      "source": "/api/(.*)",
      "destination": "https://YOUR-BACKEND-URL.onrender.com/api/$1"
    },
    {
      "source": "/(.*)",
      "destination": "/$1"
    }
  ]
}
```

**Replace `YOUR-BACKEND-URL` with your actual Render backend URL!**

2. **Update `.env.production`**:

```
VITE_API_BASE_URL=https://YOUR-BACKEND-URL.onrender.com/api
```

3. **Push changes to GitHub**:

```powershell
git add vercel.json .env.production
git commit -m "Add Vercel configuration"
git push origin main
```

4. **Deploy to Vercel**:

   a. Go to [https://vercel.com](https://vercel.com) and sign up with GitHub
   
   b. Click **"Add New..."** → **"Project"**
   
   c. Import your `food-donation-website` repository
   
   d. Configure:
      - **Framework Preset**: Vite
      - **Root Directory**: `./`
      - **Build Command**: `npm run build`
      - **Output Directory**: `dist`
      - **Install Command**: `npm install`
   
   e. Click **"Deploy"**

5. **Your frontend is live on Vercel!**

### Part 3: Update Backend CORS Settings

Update your Spring Boot backend to allow requests from Vercel:

In your `Food_Donation/food_donation_backend/src/main/java/.../config/SecurityConfig.java` (or similar), add:

```java
@Bean
public CorsConfigurationSource corsConfigurationSource() {
    CorsConfiguration configuration = new CorsConfiguration();
    configuration.setAllowedOrigins(Arrays.asList(
        "https://food-donation-website.vercel.app",  // Your Vercel URL
        "http://localhost:5173"  // For development
    ));
    configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"));
    configuration.setAllowedHeaders(Arrays.asList("*"));
    configuration.setAllowCredentials(true);
    
    UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
    source.registerCorsConfiguration("/**", configuration);
    return source;
}
```

Then rebuild and redeploy to Render.

---

## 🎯 OPTION C: All-in-One Docker Deployment (Alternative Platforms)

### Railway.app (FREE with Docker)

1. Go to [https://railway.app](https://railway.app)
2. Sign up with GitHub
3. Click **"New Project"** → **"Deploy from GitHub repo"**
4. Select your repository
5. Railway will auto-detect your Dockerfile
6. Add environment variables (same as Render)
7. Deploy!

### Fly.io (FREE tier available)

1. Install Fly CLI: `curl -L https://fly.io/install.sh | sh`
2. Sign up: `fly auth signup`
3. In your project directory:
   ```powershell
   fly launch --dockerfile ./Dockerfile
   fly secrets set SPRING_PROFILES_ACTIVE=prod
   fly deploy
   ```

---

## 📝 Environment Variables Reference

### For Docker/Render Deployment:

```env
# Server
PORT=8080
SPRING_PROFILES_ACTIVE=prod

# Database (H2 for simplicity, change for production MySQL)
SPRING_DATASOURCE_URL=jdbc:h2:mem:food_donation;MODE=PostgreSQL;DB_CLOSE_DELAY=-1;DB_CLOSE_ON_EXIT=FALSE
SPRING_DATASOURCE_USERNAME=sa
SPRING_DATASOURCE_PASSWORD=

# JWT Security
APP_JWT_SECRET=foodDonationSuperSecretKeyForJwtTokenGeneration2026
APP_JWT_EXPIRATION_MS=86400000

# Frontend API URL
VITE_API_BASE_URL=/api
```

### For Production MySQL (Recommended):

```env
SPRING_DATASOURCE_URL=jdbc:mysql://YOUR_DB_HOST:3306/food_donation_db?useSSL=false&serverTimezone=UTC
SPRING_DATASOURCE_USERNAME=your_username
SPRING_DATASOURCE_PASSWORD=your_password
```

---

## 🔧 Troubleshooting

### Docker Build Fails

**Error**: `timeout` or `build failed`
- **Solution**: Increase build timeout in Render settings or optimize Dockerfile

**Error**: `jar not found`
- **Solution**: Check that `Food_Donation/food_donation_backend/build/libs/` contains a .jar file after build

### Backend Not Starting

**Error**: `Port already in use`
- **Solution**: Ensure PORT environment variable is set correctly

**Error**: `Database connection failed`
- **Solution**: Check database URL and credentials in environment variables

### Frontend API Errors

**Error**: `CORS error` or `Network request failed`
- **Solution**: 
  1. Ensure `VITE_API_BASE_URL` is set correctly
  2. Check backend CORS configuration
  3. Verify backend is running and accessible

### Vercel Deployment Issues

**Error**: `Build failed`
- **Solution**: Check build logs, ensure `vercel.json` is correct

**Error**: `API routes not working`
- **Solution**: Update `vercel.json` rewrites with correct backend URL

---

## 📊 Deployment Comparison

| Feature | Option A (Render Docker) | Option B (Vercel + Render) |
|---------|--------------------------|----------------------------|
| **Setup Time** | 15-20 minutes | 30-45 minutes |
| **Complexity** | Simple | Moderate |
| **Cost** | FREE | FREE |
| **Performance** | Good | Excellent (Vercel CDN) |
| **Maintenance** | Easy | Moderate |
| **Scalability** | Good | Excellent |

---

## ✅ Post-Deployment Checklist

- [ ] Website loads successfully
- [ ] Can view donations list
- [ ] Can create new donation (if logged in)
- [ ] Can volunteer for donations
- [ ] Images load properly
- [ ] No console errors (F12 → Console)
- [ ] API calls work correctly
- [ ] HTTPS is working (should be automatic)

---

## 🔄 Updating After Deployment

### For Docker/Render (Option A):
```powershell
git add .
git commit -m "Your changes"
git push origin main
# Render automatically redeploys!
```

### For Vercel + Render (Option B):
```powershell
git add .
git commit -m "Your changes"
git push origin main
# Both Vercel and Render automatically redeploy!
```

---

## 🎉 Quick Start Command (Option A - Recommended)

```powershell
# 1. Push to GitHub
cd d:\programs\food_donation\Food_Donation_Website
git add .
git commit -m "Deploy to Render with Docker"
git push origin main

# 2. Deploy on Render.com
# - Go to render.com
# - Create new Web Service
# - Connect your GitHub repo
# - Select Docker runtime
# - Add environment variables
# - Deploy!

# 3. Done! Your app is live in 10-15 minutes
```

---

## 📞 Need Help?

1. **Check logs** on your deployment platform
2. **Review environment variables** are set correctly
3. **Test locally** with `docker build -t food-donation .` and `docker run -p 8080:8080 food-donation`
4. **Check browser console** (F12) for errors

---

**Status**: ✅ Ready to Deploy  
**Recommended**: Option A (Render with Docker) - Simplest and fastest!  
**Time**: 15-30 minutes  
**Cost**: FREE  

**Let's deploy! 🚀**