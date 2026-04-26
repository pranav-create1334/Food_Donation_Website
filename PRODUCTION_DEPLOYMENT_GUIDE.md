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

### 1. Fixed 500 Internal Server Error
- **Root cause**: Nested `HomeController` inside `AuthController` was causing Spring initialization issues
- **Fix**: Removed the nested class and created a proper standalone `WebController`

### 2. Fixed CORS Issues
- Updated `CorsConfig.java` with correct Vercel frontend URL
- Removed duplicate CORS configuration conflicts

### 3. Fixed API Routing
- Updated `vercel.json` with correct backend URL (was placeholder)
- Created proper `WebController` for root and `/app` endpoints

### 4. Simplified Deployment
- `render.json` now only builds the backend (frontend is separate on Vercel)
- Clear separation of concerns between frontend and backend

## Files Modified

### Backend (Spring Boot)
1. **`Food_Donation/food_donation_backend/src/main/java/food/donation/Food_Donation/controller/WebController.java`** (NEW)
   - Handles `/`, `/app`, and `/api/status` endpoints
   - Returns simple status messages

2. **`Food_Donation/food_donation_backend/src/main/java/food/donation/Food_Donation/controller/AuthController.java`**
   - Removed problematic nested `HomeController`
   - Clean REST API endpoints for auth

3. **`Food_Donation/food_donation_backend/src/main/java/food/donation/Food_Donation/config/CorsConfig.java`**
   - Updated with correct Vercel frontend URL
   - Added all necessary CORS headers

4. **`Food_Donation/food_donation_backend/src/main/java/food/donation/Food_Donation/config/SecurityConfig.java`**
   - Updated CORS to match `CorsConfig.java`
   - Added `/app`, `/`, and static assets to permitted paths

5. **`render.json`**
   - Simplified to only build backend (frontend deployed separately)

### Frontend (Vite/React)
1. **`vercel.json`**
   - Fixed API rewrite to use actual backend URL

2. **`.env.production`**
   - Already correctly configured with backend API URL

## Deployment Steps

### Step 1: Push Changes to Git
```bash
git add .
git commit -m "Fix production deployment issues - 500 error, CORS, routing"
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
Expected: "Food Donation API is running. Frontend is available at: ..."

#### Test API Status
Visit: `https://food-donation-website-amqz.onrender.com/api/status`
Expected: `{"status":"ok","message":"Food Donation API is running"}`

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

### 500 Internal Server Error
1. Check Render logs for error details
2. Verify database connection settings
3. Ensure all environment variables are set correctly

### "Failed to fetch" errors
1. Check browser console for CORS errors
2. Verify backend is running: visit `https://food-donation-website-amqz.onrender.com/`
3. Check that `.env.production` has correct URL
4. Verify `vercel.json` has correct backend URL

### CORS errors
1. Verify `CorsConfig.java` includes your frontend URL
2. Check that backend has been redeployed with latest changes
3. Clear browser cache and try again

### Database connection errors
1. Check MySQL is running and accessible
2. Verify database credentials in Render environment variables
3. Ensure database allows connections from Render's IP ranges

## Testing Checklist

- [ ] Backend health check: `https://food-donation-website-amqz.onrender.com/`
- [ ] API status check: `https://food-donation-website-amqz.onrender.com/api/status`
- [ ] Frontend loads: `https://food-donation-website-ai8d7gyub-prs-projects-fa9db43c.vercel.app/`
- [ ] Sign up works
- [ ] Login works
- [ ] Dashboard loads after login
- [ ] Can create/view donations
- [ ] Logout works
- [ ] No console errors
- [ ] No CORS errors in network tab

## API Endpoints

### Public (No Auth Required)
- `GET /` - API status message
- `GET /app` - API status with frontend link
- `GET /api/status` - JSON status check
- `POST /api/auth/signup` - User registration
- `POST /api/auth/signin` - User login

### Protected (Requires JWT Token)
- `GET /api/donations` - List all donations
- `POST /api/donations` - Create new donation
- `PUT /api/donations/:id/status` - Update donation status

## Notes

- Frontend and backend are deployed separately
- Frontend on Vercel proxies API calls to Render backend
- CORS is configured to allow both deployment origins
- JWT tokens are used for authentication
- All API endpoints (except auth) require authentication
- Backend serves pure API, no static frontend files