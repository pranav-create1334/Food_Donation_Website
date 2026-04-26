# Production Deployment Guide - Food Donation Website

## Architecture Overview

This project uses a **decoupled architecture**:
- **Frontend**: React + Vite, deployed on **Vercel**
- **Backend**: Spring Boot, deployed on **Render**
- **Database**: MySQL (external or Render MySQL addon)

## URLs

- **Frontend (Vercel)**: `https://food-donation-website-ai8d7gyub-prs-projects-fa9db43c.vercel.app/`
- **Backend (Render)**: `https://food-donation-website-amqz.onrender.com/`
- **API Base URL**: `https://food-donation-website-amqz.onrender.com/api`

## Recent Fixes Applied

### 1. Fixed 403 Error on /app Route
- Created `WebController.java` to handle SPA routing
- Updated `SecurityConfig.java` to permit static resources and `/app` path
- Updated `render.json` to build and include frontend in backend JAR

### 2. Fixed "Failed to Fetch" Error
- Updated `vercel.json` with correct backend URL (was placeholder)
- Updated CORS configuration to allow Vercel frontend origin
- Ensured `.env.production` has correct API base URL

## Files Modified

### Backend (Spring Boot)
1. **`Food_Donation/food_donation_backend/src/main/java/food/donation/Food_Donation/controller/WebController.java`** (NEW)
   - Handles SPA routing for `/app` and other frontend routes

2. **`Food_Donation/food_donation_backend/src/main/java/food/donation/Food_Donation/config/SecurityConfig.java`**
   - Added `/app`, `/app/**`, static assets to `permitAll()`
   - Added Vercel frontend URL to CORS allowed origins

3. **`render.json`**
   - Updated build command to build frontend and include in backend JAR

### Frontend (Vite/React)
1. **`vercel.json`**
   - Fixed API rewrite to use actual backend URL instead of placeholder

2. **`.env.production`**
   - Already correctly configured with backend API URL

## Deployment Steps

### Step 1: Push Changes to Git
```bash
git add .
git commit -m "Fix CORS and routing issues for production deployment"
git push origin main
```

### Step 2: Deploy Backend to Render
1. Go to your Render dashboard
2. Find your web service
3. Click "Manual Deploy" → "Deploy latest commit"
4. Wait for the build to complete (~5-10 minutes)

### Step 3: Deploy Frontend to Vercel
1. If connected to Git, Vercel will auto-deploy on push
2. Or manually trigger: `vercel --prod`

### Step 4: Verify Deployment

#### Test Backend Health
Visit: `https://food-donation-website-amqz.onrender.com/`
Expected: "Backend is running successfully 🚀"

#### Test Frontend
Visit: `https://food-donation-website-ai8d7gyub-prs-projects-fa9db43c.vercel.app/`
Expected: Landing page loads

#### Test API Calls
1. Try signing up a new user
2. Try logging in
3. Check browser console for any errors

## Environment Variables

### Backend (Render)
Make sure these are set in Render dashboard:
```
PORT=8080
SPRING_PROFILES_ACTIVE=prod
JWT_SECRET=foodDonationSuperSecretKeyForJwtTokenGeneration2026ChangeThisToRandomString
JWT_EXPIRATION_MS=86400000
SPRING_DATASOURCE_URL=jdbc:mysql://your-mysql-host:3306/food_donation
SPRING_DATASOURCE_USERNAME=your_username
SPRING_DATASOURCE_PASSWORD=your_password
```

### Frontend (Vercel)
Vite environment variables are set at build time:
- `VITE_API_BASE_URL=https://food-donation-website-amqz.onrender.com/api`

This is already in `.env.production` which Vercel uses during build.

## Troubleshooting

### "Failed to fetch" errors
1. Check browser console for CORS errors
2. Verify backend is running: visit `https://food-donation-website-amqz.onrender.com/`
3. Check that `.env.production` has correct URL
4. Verify `vercel.json` has correct backend URL

### 403 Forbidden errors
1. Check that `SecurityConfig.java` permits the requested paths
2. Ensure frontend build includes correct API URL
3. Verify Render deployment completed successfully

### Database connection errors
1. Check MySQL is running and accessible
2. Verify database credentials in Render environment variables
3. Ensure database allows connections from Render's IP ranges

## Testing Checklist

- [ ] Backend health check: `https://food-donation-website-amqz.onrender.com/`
- [ ] Frontend loads: `https://food-donation-website-ai8d7gyub-prs-projects-fa9db43c.vercel.app/`
- [ ] Sign up works
- [ ] Login works
- [ ] Dashboard loads after login
- [ ] Can create/view donations
- [ ] Logout works
- [ ] No console errors

## Notes

- The backend serves both API and static frontend files (for the Render deployment)
- The Vercel frontend proxies API calls through Vercel's rewrites to the Render backend
- CORS is configured to allow both deployment origins
- JWT tokens are used for authentication
- All API endpoints (except auth) require authentication