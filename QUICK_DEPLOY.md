# 🚀 Quick Deploy - Food Donation Website

## ⚡ Fastest Way to Deploy (15 Minutes)

### Option 1: One-Click Docker Deployment with MySQL (RECOMMENDED)

**Step 1: Push to GitHub**
```powershell
cd d:\programs\food_donation\Food_Donation_Website
git add .
git commit -m "Deploy with Docker and MySQL"
git push origin main
```

**Step 2: Create MySQL Database on Render**
1. Go to [Render.com](https://render.com)
2. Sign up with GitHub
3. Click **New +** → **MySQL**
4. Name: `food-donation-db`, Database Name: `food_donation_db`
5. Click **Create Database** and wait 2-3 minutes
6. Click on your database → **Connections** tab
7. Copy the **Internal Database URL**, **Username**, and **Password**

**Step 3: Deploy Your Application**
1. Click **New +** → **Web Service**
2. Connect your repository
3. Select **Docker** as runtime
4. Click **Advanced** and add environment variables:
   ```
   PORT=8080
   SPRING_PROFILES_ACTIVE=prod
   SPRING_DATASOURCE_URL=jdbc:mysql://YOUR_DB_HOST:3306/food_donation_db?useSSL=false&serverTimezone=UTC
   SPRING_DATASOURCE_USERNAME=root
   SPRING_DATASOURCE_PASSWORD=YOUR_DB_PASSWORD
   APP_JWT_SECRET=foodDonationSuperSecretKeyForJwtTokenGeneration2026
   APP_JWT_EXPIRATION_MS=86400000
   VITE_API_BASE_URL=/api
   ```
   *(Replace YOUR_DB_HOST and YOUR_DB_PASSWORD with your MySQL values)*
5. Click **Create Web Service**

**Done!** Your app will be live at `https://your-app-name.onrender.com` with MySQL database! 🎉

---

### Option 2: Use Automated Script

**Run the deployment script:**
```powershell
.\deploy.ps1
```

The script will guide you through the entire process with interactive prompts.

---

## 📋 What Files Were Created/Updated

| File | Purpose |
|------|---------|
| `DEPLOYMENT_GUIDE_DOCKER_VERCEL.md` | Complete deployment guide with all options |
| `vercel.json` | Vercel configuration (for frontend-only deployment) |
| `.env.example` | Updated environment variables template |
| `deploy.ps1` | Automated deployment script |
| `Dockerfile` | Already exists - builds frontend + backend |

---

## 🎯 Deployment Options Summary

| Option | Time | Complexity | Best For |
|--------|------|------------|----------|
| **Docker + Render** | 15 min | Easy | Full-stack app (Recommended) |
| **Vercel + Render** | 30 min | Medium | Better frontend performance |
| **Railway** | 15 min | Easy | Alternative to Render |

---

## 🔍 Test Locally Before Deploying

**Test with Docker:**
```powershell
docker build -t food-donation .
docker run -p 8080:8080 food-donation
# Open http://localhost:8080
```

**Test frontend only:**
```powershell
npm install
npm run build
npm run preview
```

---

## 📞 Troubleshooting

### Docker Build Fails
- Check if you have enough disk space
- Ensure Docker Desktop is running
- Try: `docker system prune` to free space

### Render Deployment Fails
- Check logs in Render dashboard
- Verify all environment variables are set
- Ensure your GitHub repository is public or connected

### App Shows But API Doesn't Work
- Check `VITE_API_BASE_URL` environment variable
- Verify backend is running (check Render logs)
- Check browser console (F12) for errors

---

## 📖 Detailed Guides

- **Complete Guide**: `DEPLOYMENT_GUIDE_DOCKER_VERCEL.md`
- **Render Guide**: `RENDER_DEPLOYMENT_FREE.md`
- **Environment Setup**: `.env.example`

---

## ✅ Post-Deployment Checklist

- [ ] Website loads at your deployment URL
- [ ] Can see donations list
- [ ] Can create/edit donations (if logged in)
- [ ] Images load properly
- [ ] No console errors (F12)
- [ ] HTTPS is working

---

## 🔄 Updating After Deployment

Just push to GitHub:
```powershell
git add .
git commit -m "Your changes"
git push origin main
```

**Render/Vercel will automatically redeploy!** ✨

---

**Need help?** Check `DEPLOYMENT_GUIDE_DOCKER_VERCEL.md` for detailed instructions.

**Ready?** Run `.\deploy.ps1` or follow the steps above! 🚀