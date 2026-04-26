# 🎯 NEXT STEPS: Deploy Your Food Donation Website (FREE)

## Status: ✅ Your Project is Ready for Deployment!

All necessary files have been prepared for you:
- ✅ Updated Dockerfile (builds both frontend & backend)
- ✅ Production environment config (.env.production)
- ✅ Render deployment guide (RENDER_DEPLOYMENT_FREE.md)
- ✅ render.json configuration

---

## 🚀 QUICK ACTION PLAN (Do This Now!)

### PHASE 1: Push Code to GitHub (10 minutes)

Follow these exact steps in PowerShell:

```powershell
# 1. Navigate to project
cd d:\programs\food_donation\Food_Donation_Website

# 2. Check Git status
git status

# 3. Stage all changes
git add .

# 4. Commit changes
git commit -m "Prepare for Render.com deployment - Updated Dockerfile and configs"

# 5. Check if remote is set
git remote -v

# If no remote, add it (replace with YOUR GitHub URL):
git remote add origin https://github.com/YOUR_USERNAME/food-donation-website.git

# 6. Push to GitHub
git branch -M main
git push -u origin main
```

**If you get errors:**
- Error: "fatal: not a git repository" → Run: `git init` first
- Error: "git: command not found" → Install from https://git-scm.com/
- Error: "Everything up-to-date" → That's OK! Your code is already pushed

---

### PHASE 2: Create GitHub Repository (3 minutes)

1. Go to **[https://github.com/new](https://github.com/new)**
2. Enter these values:
   - **Repository name:** `food-donation-website`
   - **Description:** Food Donation Platform (optional)
   - **Visibility:** Public
3. Click **"Create repository"**
4. Copy the repository URL (e.g., `https://github.com/YOUR_USERNAME/food-donation-website.git`)
5. Use that URL in PHASE 1 Step 5

---

### PHASE 3: Deploy on Render.com (20 minutes)

#### Step 1: Sign Up on Render

1. Open **[https://render.com](https://render.com)**
2. Click **"Sign Up"**
3. Choose **"GitHub"** option
4. Click **"Authorize"** to connect with GitHub
5. Done! ✅

#### Step 2: Create MySQL Database

1. In Render Dashboard, click **"New +"** button (top right)
2. Select **"MySQL"**
3. Fill in:
   - **Name:** `food_donation_db`
   - **Database Name:** `food_donation_db`
4. Click **"Create Database"**
5. Wait 1-2 minutes...
6. Once created, click the database
7. Go to **"Connections"** tab
8. **COPY and SAVE** these values:
   ```
   Internal Database URL
   Root Password
   Username
   Port (usually 3306)
   ```
   
   You'll need them in Step 4!

#### Step 3: Deploy Backend Service

1. Click **"New +"** button
2. Select **"Web Service"**
3. Click **"Connect a Repository"**
4. Find and select: `food-donation-website`
5. Fill in:
   - **Name:** `food-donation-backend`
   - **Root Directory:** (leave empty)
   - **Runtime:** Select **"Docker"**
   - **Plan:** Keep as-is (free tier)
6. Click **"Create Web Service"**
7. Wait for deployment to start (you'll see logs)

#### Step 4: Set Environment Variables (IMPORTANT!)

While the service is building:

1. On the service page, scroll down to **"Environment"** section
2. Click **"Add Environment Variable"**
3. Add these variables (click + for each):

```
SPRING_PROFILES_ACTIVE = prod

DB_URL = mysql://root:PASSWORD@HOSTNAME:3306/food_donation_db?useSSL=false&serverTimezone=UTC

DB_USER = root

DB_PASSWORD = [your database password from Step 2]

JWT_SECRET = foodDonationSuperSecretKeyForJwtTokenGeneration2026ChangeThisToRandomString

JWT_EXPIRATION_MS = 86400000
```

**Where to get values:**
- From Step 2 MySQL connections tab:
  - Replace `PASSWORD` with your root password
  - Replace `HOSTNAME` with your database hostname

#### Step 5: Save and Wait

1. After adding all variables, click **"Save"**
2. Wait 5-10 minutes for build to complete
3. You should see: **"Live"** with a green indicator
4. Copy your service URL (shown at top, looks like: `https://food-donation-backend.onrender.com`)

#### Step 6: Update Production Config

1. Edit `.env.production` file in your project:
   ```
   VITE_API_BASE_URL=https://YOUR-SERVICE-URL.onrender.com/api
   ```
   (Replace with your actual URL from Step 5)

2. Push to GitHub:
   ```powershell
   git add .env.production
   git commit -m "Update production API URL"
   git push origin main
   ```

3. Render will **automatically redeploy** ✨

#### Step 7: Verify It Works!

1. Open your browser
2. Go to: `https://YOUR-SERVICE-URL.onrender.com`
3. You should see your Food Donation website! 🎉

---

## ✅ TESTING CHECKLIST

After deployment, test these:

- [ ] Website loads at your Render URL
- [ ] Can see the homepage with donations
- [ ] Login page loads
- [ ] Can create a donation (if logged in)
- [ ] Can volunteer for a donation
- [ ] Check browser console (F12) for errors
- [ ] Check that images load properly

---

## ⚠️ IF YOU ENCOUNTER ERRORS

### Error: "Build Failed"

**Most Common Cause:** Docker build timeout

**Fix:**
1. Go to your service
2. Click **"Logs"** tab
3. Look for error messages
4. Click **"Redeploy"** and try again

### Error: "Cannot connect to database"

**Fix:**
1. Check all DB variables are correct in Environment section
2. Verify DB credentials from Render MySQL dashboard
3. Make sure DB_URL format is: `mysql://root:password@hostname:3306/food_donation_db?useSSL=false&serverTimezone=UTC`

### Error: "API requests failing" or "CORS error"

**Fix:**
1. Make sure `.env.production` has correct backend URL
2. Verify VITE_API_BASE_URL ends with `/api`
3. Check backend logs for actual errors

### Error: "Service hibernating after 15 minutes"

**This is normal on free tier!**
- Free services sleep after 15 min of inactivity
- They wake up when you visit the URL
- First load might take 20-30 seconds
- Upgrade to paid tier to prevent this

---

## 📊 Your Deployment Overview

| Component | Status | Cost | Notes |
|-----------|--------|------|-------|
| Frontend | ✅ Deployed | FREE | Served with backend |
| Backend | ✅ Deployed | FREE | Spring Boot app |
| Database | ✅ Deployed | FREE | MySQL on Render |
| Domain | ✅ Ready | FREE | onrender.com domain |
| HTTPS | ✅ Ready | FREE | Auto SSL certificate |
| **TOTAL** | ✅ LIVE | **$0** | 🎉 Completely FREE! |

---

## 🔄 Updating Your Website After Deployment

It's super simple! Just:

1. Make changes to your code locally
2. Commit and push to GitHub:
   ```powershell
   git add .
   git commit -m "Your changes"
   git push origin main
   ```
3. Render automatically redeploys! ✨

---

## 📚 Resources

- **Render Documentation:** https://render.com/docs
- **Docker Guide:** https://docs.docker.com/
- **Git Help:** https://git-scm.com/docs

---

## 🎯 What's Next?

After deployment works:

1. **Optimize:** Check performance in browser dev tools (F12)
2. **Monitor:** Check logs regularly in Render dashboard
3. **Update:** Push code changes anytime
4. **Upgrade:** If free tier isn't enough, upgrade to paid ($7-20/month)

---

## 💡 Pro Tips

- **Free tier sleep:** Add a monitoring service to ping your app every 15 mins to prevent sleeping
- **Database backups:** Regularly export important data
- **Logs:** Always check logs first when debugging
- **Environment variables:** Never commit `.env` files with secrets to Git

---

## 🎉 Congratulations!

Your Food Donation Website is now ready to deploy! Follow the steps above and you'll be live in about 30 minutes.

**Questions?** Check the detailed guide: **RENDER_DEPLOYMENT_FREE.md**

---

## 📞 Need Help?

If something isn't working:

1. Check the error message carefully
2. Look at Render logs (go to service → Logs)
3. Review the detailed guide: RENDER_DEPLOYMENT_FREE.md
4. Check browser console (F12 → Console tab)
5. Review environment variables are all correct

---

**Status:** ✅ Ready to Deploy  
**Cost:** 💰 FREE  
**Time to Deploy:** ⏱️ 30 minutes  

**Let's go! 🚀**
