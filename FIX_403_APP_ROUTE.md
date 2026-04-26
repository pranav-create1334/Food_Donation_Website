# Fix for 403 Error on /app Route

## Problem
When accessing `https://food-donation-website-amqz.onrender.com/app`, users received:
```
Access to food-donation-website-amqz.onrender.com was denied
You don't have the user rights to view this page.
HTTP ERROR 403
```

## Root Cause
1. **Spring Security Configuration**: The `SecurityConfig.java` only permitted access to `/api/auth/**` and `/h2-console/**`. All other requests, including `/app`, required authentication, resulting in a 403 Forbidden error.

2. **Missing Frontend Serving**: The backend was not configured to serve the React frontend's static files. The frontend routes were not being handled properly.

3. **Missing Controller**: There was no controller to handle the `/app` path and forward it to the React SPA's `index.html`.

## Changes Made

### 1. Created WebController.java
**File**: `Food_Donation/food_donation_backend/src/main/java/food/donation/Food_Donation/controller/WebController.java`

This new controller handles all non-API routes and forwards them to `index.html` for React's client-side routing:
- `GET /` → forwards to `/index.html`
- `GET /app` → forwards to `/index.html`
- `GET /{path}` (any non-API path without file extension) → forwards to `/index.html`

### 2. Updated SecurityConfig.java
**File**: `Food_Donation/food_donation_backend/src/main/java/food/donation/Food_Donation/config/SecurityConfig.java`

Added the following paths to the `permitAll()` list:
- `/`, `/index.html` - Root and index page
- `/app`, `/app/**` - Main application route
- `/*.js`, `/*.css`, `/*.png`, `/*.jpg`, etc. - Static assets (JS, CSS, images, fonts)

Also updated CORS configuration to allow the production URL:
```java
config.setAllowedOrigins(List.of(
    "http://localhost:5173",
    "http://localhost:8080",
    "https://food-donation-website-amqz.onrender.com"
));
```

### 3. Updated render.json
**File**: `render.json`

Updated the build command to:
1. Install npm dependencies
2. Build the React frontend
3. Copy the frontend `dist/` folder to the backend's static resources directory
4. Build the Spring Boot backend (which now includes the frontend files in the JAR)

```json
"buildCommand": "npm install && npm run build && cp -r dist Food_Donation/food_donation_backend/src/main/resources/static/ && cd Food_Donation/food_donation_backend && chmod +x gradlew && ./gradlew clean build -x test --no-daemon"
```

## Deployment Steps

After these changes are pushed to your Git repository connected to Render:

1. **Render will automatically trigger a new deployment** (or you can manually trigger it)
2. The build process will:
   - Build the React frontend with the correct API base URL from `.env.production`
   - Include the frontend files in the Spring Boot JAR
   - Deploy the combined application
3. After deployment, accessing `https://food-donation-website-amqz.onrender.com/app` will:
   - Serve the React frontend
   - Allow unauthenticated access to the landing page and login
   - API calls to `/api/auth/**` and `/api/donations/**` will work correctly

## Testing After Deployment

1. Visit `https://food-donation-website-amqz.onrender.com/app` - Should show the landing page
2. Visit `https://food-donation-website-amqz.onrender.com/` - Should also work
3. Try logging in - API calls should work correctly
4. Navigate between pages - React Router should handle client-side routing

## Notes

- The `.env.production` file already had the correct API URL: `https://food-donation-website-amqz.onrender.com/api`
- The frontend API client (`src/lib/api.ts`) correctly uses this base URL
- All API endpoints (`/api/auth/signin`, `/api/auth/signup`, `/api/donations`) will work as expected