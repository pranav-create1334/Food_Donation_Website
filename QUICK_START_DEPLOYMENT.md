# 🚀 QUICK START: Deploy Food Donation Website in 30 Minutes

## ⚡ Quick Decision: Choose Your Platform

### Recommended: **Railway.app** (EASIEST for first-time)
- ✅ Auto builds Docker image
- ✅ Free MySQL included
- ✅ Auto deploys on git push
- ✅ $5-20/month cost
- ✅ Perfect for beginners

---

## 📋 STEP-BY-STEP DEPLOYMENT

### **STEP 1: Create GitHub Repository (5 minutes)**

1. Go to **https://github.com** and sign in
2. Click **"New"** button (top left)
3. Repository name: `food-donation-website`
4. Select **"Public"** 
5. Click **"Create repository"**
6. Copy the repository URL (e.g., `https://github.com/YOUR_USERNAME/food-donation-website.git`)

### **STEP 2: Push Your Code to GitHub (5 minutes)**

Open **PowerShell** in your project folder:

```powershell
cd d:\programs\food_donation\Food_Donation_Website

# Initialize git
git init

# Add all files
git add .

# Create initial commit
git commit -m "Initial commit: Food Donation Website"

# Add remote (paste your repository URL)
git remote add origin https://github.com/YOUR_USERNAME/food-donation-website.git

# Push to GitHub
git branch -M main
git push -u origin main
```

If you get stuck, it means git is not in PATH. Install git from https://git-scm.com/

---

### **STEP 3: Sign Up for Railway.app (3 minutes)**

1. Go to **https://railway.app**
2. Click **"Sign Up"**
3. Connect with **GitHub** (easiest)
4. Authorize Railway

---

### **STEP 4: Create New Project (5 minutes)**

1. In Railway dashboard, click **"New Project"**
2. Select **"Deploy from GitHub"**
3. Connect your GitHub account if not already done
4. Select **`food-donation-website`** repository
5. Click **"Deploy"**

Railway will auto-detect the Dockerfile and start building! ✅

---

### **STEP 5: Set Up MySQL Database (3 minutes)**

1. In Railway project view, click **"Add"** (+ button)
2. Select **"Database"** → **"MySQL"**
3. Wait for MySQL to provision (~30 seconds)
4. Click the **MySQL** service card

---

### **STEP 6: Configure Environment Variables (5 minutes)**

**Step 6A: Get MySQL Connection Details**

In MySQL service card:
- Click **"Connect"** tab
- You'll see connection details
- Copy: `DB_URL`, `DB_USER`, `DB_PASSWORD`

**Step 6B: Add Variables to Backend Service**

1. Go back to main project view
2. Click the **Backend** service (or "FoodDonation...")
3. Click **"Variables"** tab
4. Add these variables:

```
PORT = 8080
SPRING_PROFILES_ACTIVE = prod
DB_URL = <paste MySQL URL here>
DB_USER = <paste username here>
DB_PASSWORD = <paste password here>
JWT_SECRET = foodDonationSuperSecretKeyForJwtTokenGeneration2026
JWT_EXPIRATION_MS = 86400000
```

Example MySQL URL format:
```
jdbc:mysql://user:password@host:3306/dbname?useSSL=false&serverTimezone=UTC
```

---

### **STEP 7: Monitor Deployment (2 minutes)**

1. Click on Backend service
2. Go to **"Deployments"** tab
3. Wait for status to show: ✅ **"Success"** (usually 2-5 minutes)
4. Check **"Logs"** if there are errors

---

### **STEP 8: Get Your Live URL (1 minute)**

1. Click Backend service
2. Look for **"Public URL"** (e.g., `https://food-donation.up.railway.app`)
3. This is your website URL!

---

### **STEP 9: Test Your Deployment (2 minutes)**

1. Visit: `https://YOUR_RAILWAY_URL`
2. You should see the **Landing page**
3. Click **"New Donation"** → Should redirect to login ✅
4. Sign up as a **DONOR**
5. Try creating a donation
6. Check if it saves successfully

---

## 🎉 YOU'RE LIVE!

Your website is now publicly accessible at your Railway URL!

---

## ❓ Troubleshooting

### Issue: "Build Failed"
- Check **Logs** tab for error messages
- Ensure all files were pushed to GitHub
- Try redeploying from Railway dashboard

### Issue: "Cannot connect to database"
- Double-check `DB_URL`, `DB_USER`, `DB_PASSWORD`
- Ensure MySQL service is running
- Check connection format is correct

### Issue: "Blank page / 404 error"
- Wait 5-10 minutes for full deployment
- Hard refresh browser (Ctrl+Shift+R)
- Check backend logs for errors

### Issue: "Form won't submit / API errors"
- Check backend logs for error messages
- Verify database connection variables
- Restart backend service (click "Redeploy" in Railway)

---

## 📱 Update Frontend URL (If Using Custom Domain)

If you later want to use a custom domain:

1. Point your domain DNS to Railway
2. In project → Backend → Domains → Add your domain
3. Update `VITE_API_BASE_URL` in production

---

## 💰 Cost

- **Backend**: $5/month
- **MySQL**: $5-15/month
- **Total**: $10-20/month (very affordable!)

---

## 🔄 Making Updates

After deployment, any changes are easy:

```powershell
cd d:\programs\food_donation\Food_Donation_Website

# Make your code changes...

git add .
git commit -m "Your changes description"
git push origin main

# Railway will auto-rebuild and deploy! 🚀
```

---

## ✅ Deployment Checklist

- [ ] GitHub repository created
- [ ] Code pushed to GitHub
- [ ] Railway account created
- [ ] Project deployed from GitHub
- [ ] MySQL database added
- [ ] Environment variables set
- [ ] Deployment completed successfully
- [ ] Website accessible at public URL
- [ ] Frontend loads without errors
- [ ] Can sign up and create donations

---

## 🆘 Need More Help?

- **Railway Docs**: https://docs.railway.app
- **This Repo Docs**: See `DEPLOYMENT_GUIDE.md` for advanced setup
- **YouTube**: Search "Railway.app deployment tutorial"

---

**Congratulations! Your Food Donation Website is now live! 🎉**
