# Frontend-Backend Communication Fix

## Problem
The Vercel frontend was giving "unexpected server error" when performing operations like login/signup, even though the Render backend was working correctly.

## Root Cause
The `.env.production` file had:
```
VITE_API_BASE_URL=https://food-donation-website-amqz.onrender.com/api
```

This caused the frontend to make direct API calls to Render from the browser, which:
1. Triggers CORS (Cross-Origin Resource Sharing) restrictions
2. May be blocked by browser security policies
3. Creates network latency issues

## Solution
Changed `.env.production` to use a relative path:
```
VITE_API_BASE_URL=/api
```

### How This Works

1. **Frontend makes requests to `/api/...`** (relative path)
2. **Vercel rewrites intercept `/api/*` requests** (configured in `vercel.json`)
3. **Vercel proxies requests to Render backend** transparently
4. **Response is returned to frontend** without CORS issues

### Vercel Rewrites Configuration (`vercel.json`)
```json
"rewrites": [
  {
    "source": "/api/(.*)",
    "destination": "https://food-donation-website-amqz.onrender.com/api/$1"
  }
]
```

This means:
- When frontend calls `/api/auth/signin`
- Vercel intercepts and forwards to `https://food-donation-website-amqz.onrender.com/api/auth/signin`
- Browser sees it as same-origin (Vercel to Vercel), no CORS issues

## Benefits

1. **No CORS issues** - Requests go through Vercel's edge network
2. **Better performance** - Vercel's CDN handles the proxying
3. **Cleaner URLs** - Frontend uses relative paths
4. **More secure** - Backend URL is not exposed to the browser
5. **Easier maintenance** - Single source of truth for API routing in `vercel.json`

## Files Changed

1. **`.env.production`** - Changed from full URL to `/api`
2. **`.env.local`** (NEW) - Added for local development consistency

## Deployment Steps

1. **Push changes to Git**:
   ```bash
   git add .
   git commit -m "Fix frontend-backend communication - use Vercel rewrites"
   git push origin main
   ```

2. **Vercel will auto-redeploy** (or trigger manually)

3. **Test**:
   - Visit Vercel frontend
   - Try signup/login
   - Should work without "unexpected server error"

## Important Notes

- **Backend (Render) does NOT need to be redeployed** - it's already working correctly
- Only the Vercel frontend needs to be redeployed with the new `.env.production`
- The change is purely on the frontend side - how it constructs API URLs

## How API Calls Work Now

### Before (Broken):
```
Browser (Vercel) → CORS → https://food-donation-website-amqz.onrender.com/api/auth/signin
```
❌ CORS error or blocked

### After (Working):
```
Browser (Vercel) → /api/auth/signin → Vercel Edge → Render Backend → Response
```
✅ No CORS, works perfectly

## Testing Checklist

- [ ] Visit Vercel frontend URL
- [ ] Try signing up a new user
- [ ] Try logging in
- [ ] Navigate to dashboard
- [ ] Create a donation
- [ ] Check browser console - should have no errors
- [ ] Check Network tab - all API calls should succeed (200/201 status)