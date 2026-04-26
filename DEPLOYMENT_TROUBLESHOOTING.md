# 🐛 Deployment Troubleshooting Guide

## Common Issues & Solutions

---

## 1. GitHub Push Issues

### Problem: "fatal: not a git repository"

**Cause:** Git hasn't been initialized in this folder

**Solution:**
```powershell
cd d:\programs\food_donation\Food_Donation_Website
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/YOUR_USERNAME/food-donation-website.git
git push -u origin main
```

---

### Problem: "git: command not found"

**Cause:** Git is not installed or not in PATH

**Solution:**
1. Download Git from https://git-scm.com/
2. Run the installer (accept all defaults)
3. Restart PowerShell completely
4. Try git command again

---

### Problem: "Failed to connect to GitHub"

**Cause:** SSH key not set up or authentication issue

**Solution:**
```powershell
# Use HTTPS instead of SSH
git remote set-url origin https://github.com/YOUR_USERNAME/food-donation-website.git
git push origin main

# Then enter your GitHub username and personal access token
```

---

## 2. Docker Build Issues

### Problem: "Build Failed - Docker Error"

**Check Render Logs:**
1. Go to your Render service
2. Click **"Logs"** tab
3. Read the error message carefully

---

### Problem: "Timeout waiting for build"

**Cause:** Build takes too long (usually >15 minutes)

**Solutions:**
1. Check if `.dockerignore` exists and contains:
   ```
   node_modules/
   .git/
   .env
   dist/
   Food_Donation/food_donation_backend/build/
   Food_Donation/food_donation_backend/.gradle/
   ```

2. Try reducing build dependencies
3. Click **"Redeploy"** in Render to restart

---

### Problem: "Cannot find Dockerfile"

**Cause:** Dockerfile is not in root directory

**Solution:**
1. Make sure `Dockerfile` (no extension) is in: `d:\programs\food_donation\Food_Donation_Website\`
2. Verify capitalization: `Dockerfile` (not `dockerfile`)
3. Push to GitHub and redeploy

---

## 3. Database Connection Issues

### Problem: "Lost connection to MySQL server"

**Possible causes:**
1. Wrong credentials in environment variables
2. Database hostname is incorrect
3. Database not running in Render

**Solutions:**

**Check 1: Verify Credentials**
1. Go to Render MySQL service
2. Click **"Connections"** tab
3. Copy the connection string
4. In backend service → Environment:
   - Make sure `DB_URL`, `DB_USER`, `DB_PASSWORD` match exactly

**Check 2: Test Connection**

From your computer, test the database:
```powershell
# If MySQL client installed:
mysql -h YOUR_HOSTNAME -u root -p

# Then enter password
```

**Check 3: Restart Database**
1. In Render, find your MySQL service
2. Click **"Settings"**
3. Click **"Restart"**
4. Wait 1-2 minutes
5. Redeploy your backend

---

### Problem: "Table doesn't exist" or Database schema errors

**Cause:** Migrations haven't run

**Solution:**

Spring Boot should auto-create tables. If not:

1. Check backend logs for initialization errors
2. Make sure `application-prod.properties` exists in backend
3. Verify `spring.jpa.hibernate.ddl-auto=create-drop` or `update` in config

---

## 4. API Connection Issues

### Problem: "API request failed" or "Cannot reach backend"

**Cause:** Frontend doesn't know backend URL

**Solution:**
1. Check `.env.production` has correct URL:
   ```
   VITE_API_BASE_URL=https://YOUR-SERVICE-URL.onrender.com/api
   ```

2. Make sure it ends with `/api`

3. Commit and push to GitHub:
   ```powershell
   git add .env.production
   git commit -m "Fix API URL"
   git push origin main
   ```

4. Render will redeploy automatically

---

### Problem: CORS Errors in Browser Console

**Example Error:**
```
Access to XMLHttpRequest at 'https://...' from origin 'https://...' 
has been blocked by CORS policy
```

**Solution:**

Check your Spring Boot CORS configuration in:
`Food_Donation/food_donation_backend/src/main/java/food/donation/Food_Donation/config/CorsConfig.java`

Make sure it includes your Render URL:
```java
allowedOrigins.add("https://food-donation-backend.onrender.com");
allowedOrigins.add("YOUR_DOMAIN");
```

Then commit and push.

---

## 5. Authentication Issues

### Problem: "Cannot login" or "Invalid credentials"

**Cause:** JWT token issues or database not initialized

**Solutions:**

1. **Check if users exist:**
   - Go to Render MySQL service
   - Use external connection to check data

2. **Verify JWT secret:**
   - In backend Environment, check `JWT_SECRET` is set
   - Make sure it's the same across all instances

3. **Check password encoding:**
   - Ensure password is hashed (Spring Security should do this)

---

### Problem: "Token expired immediately"

**Cause:** JWT_EXPIRATION_MS is too low or JWT_SECRET changed

**Solution:**
1. In backend Environment, set:
   ```
   JWT_EXPIRATION_MS=86400000  (24 hours)
   ```

2. Keep `JWT_SECRET` consistent

3. Redeploy

---

## 6. Frontend Issues

### Problem: Blank page or "Cannot GET /"

**Cause:** Frontend build failed or not included

**Solutions:**

1. **Check Docker log:**
   - Look for "frontend-builder" errors
   - Search for "npm" errors

2. **Verify Node version:**
   - The Docker image uses Node 18
   - Check `package.json` compatibility

3. **Check build command:**
   ```powershell
   cd d:\programs\food_donation\Food_Donation_Website
   npm install
   npm run build
   ```
   - If this fails locally, it will fail in Docker

---

### Problem: "Module not found" or CSS not loading

**Cause:** Missing dependencies or path issues

**Solutions:**

1. **Reinstall dependencies:**
   ```powershell
   cd d:\programs\food_donation\Food_Donation_Website
   rm -r node_modules
   rm package-lock.json
   npm install
   npm run build
   ```

2. **Push clean code:**
   ```powershell
   git add .
   git commit -m "Fix dependencies"
   git push origin main
   ```

---

## 7. Performance Issues

### Problem: "Website is very slow"

**Cause:** Free tier limitations or cold starts

**Solutions:**

1. **Free tier sleep:** Service wakes from sleep on first request
   - First load might take 20-30 seconds
   - This is normal for free tier

2. **Monitor resource usage:**
   - Go to service → Metrics
   - Check CPU and Memory

3. **Upgrade to paid tier** if consistently slow

---

### Problem: "Database queries are slow"

**Cause:** Free tier database limitations

**Solutions:**

1. **Add indexes to important columns:**
   - In your backend, add `@Index` annotations
   - Then redeploy

2. **Monitor slow queries:**
   - Check Render database metrics

3. **Upgrade database** if needed

---

## 8. Deployment Not Updating

### Problem: "I pushed to GitHub but Render didn't redeploy"

**Solutions:**

1. **Check Git push worked:**
   ```powershell
   git log --oneline -5
   git remote -v
   ```

2. **Manual redeploy:**
   - Go to Render service
   - Click **"Redeploy"** button
   - Select latest commit

3. **Check if webhook is connected:**
   - Service should auto-deploy on push
   - If not, check GitHub integration in Render

---

## 9. Environment Variable Issues

### Problem: "Environment variables not being read"

**Cause:** Variables not set or wrong format

**Solution:**

1. Go to backend service → **Environment**
2. Verify each variable:
   - `SPRING_PROFILES_ACTIVE` = `prod`
   - `DB_URL` = `mysql://...`
   - `DB_USER` = `root`
   - `DB_PASSWORD` = your password
   - `JWT_SECRET` = your secret
   - `JWT_EXPIRATION_MS` = `86400000`

3. Click **"Save"** after each change

4. **Redeploy** the service

---

## 10. Port Issues

### Problem: "Port already in use" or "Cannot bind to port"

**Cause:** PORT environment variable not set

**Solution:**

In backend service → Environment, add:
```
PORT = 8080
```

Then redeploy.

---

## How to Debug Effectively

### Step 1: Check Render Logs

1. Go to your service
2. Click **"Logs"** tab
3. Look for errors (they're usually red or in brackets)
4. Scroll up to see full error message

### Step 2: Check Browser Console

1. Open your website
2. Press **F12** to open Developer Tools
3. Go to **Console** tab
4. Look for red errors
5. Expand errors to see full message

### Step 3: Test Locally

```powershell
# Test frontend build
npm install
npm run build

# Test backend build
cd Food_Donation\food_donation_backend
./gradlew build
```

### Step 4: Check GitHub

1. Go to your GitHub repo
2. Check the latest commit was pushed
3. Verify branch is `main`

### Step 5: Ask for Help

Include these in your question:
- Error message from Render logs
- Error message from browser console
- Screenshot of the issue
- Your service URL

---

## Quick Fixes (Try These First)

| Issue | Quick Fix |
|-------|-----------|
| "Service not running" | Click Redeploy |
| "Cannot connect to DB" | Restart database |
| "Slow load" | Wait 30 seconds (free tier wake-up) |
| "CORS error" | Check API URL in .env.production |
| "Blank page" | Check browser console (F12) |
| "Build failed" | Check Render logs |

---

## Getting More Help

**Resources:**
- [Render Docs](https://render.com/docs)
- [Spring Boot Issues](https://github.com/spring-projects/spring-boot/issues)
- [Docker Docs](https://docs.docker.com/)

**Before giving up:**
1. ✅ Checked all environment variables
2. ✅ Checked all Render logs
3. ✅ Checked browser console
4. ✅ Tested locally
5. ✅ Redeployed service

---

## Still Stuck?

Check these files:
- [NEXT_STEPS_DEPLOYMENT.md](NEXT_STEPS_DEPLOYMENT.md) - Full deployment guide
- [RENDER_DEPLOYMENT_FREE.md](RENDER_DEPLOYMENT_FREE.md) - Render specific guide
- [ENV_VARIABLES.md](ENV_VARIABLES.md) - Environment variable reference
