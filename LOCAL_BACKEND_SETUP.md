# LOCAL BACKEND SETUP - Quick Start

## ⚡ One-Command Setup (Windows PowerShell)

```powershell
# Make sure you're in the project root directory
cd "d:\programs\food_donation\Food_Donation_Website"

# Run the setup script (starts MySQL + Backend)
.\setup-backend.ps1
```

**This will:**
- ✅ Start MySQL database in Docker
- ✅ Wait 30 seconds for MySQL to initialize
- ✅ Build and run Spring Boot backend on `http://localhost:8080`

---

## 🧪 Verify Backend is Working

Open a **NEW PowerShell window** and run:

```powershell
cd "d:\programs\food_donation\Food_Donation_Website"
.\test-backend.ps1
```

This will test:
- ✅ Backend is responding
- ✅ CORS configuration is correct
- ✅ API endpoints are accessible

---

## 🎯 Test Frontend → Backend Connection

After backend is running:

```powershell
# In the root directory (new terminal)
npm run dev
```

Then:
1. Open `http://localhost:5173`
2. Try to **Login or Sign Up**
3. Check browser console (F12) for any errors

---

## 🛑 How to Stop Everything

**Stop Backend:** Press `Ctrl+C` in the backend terminal

**Stop MySQL:**
```powershell
cd "d:\programs\food_donation\Food_Donation_Website\Food_Donation\food_donation_backend"
docker-compose down
```

---

## 📝 Configuration Files Created

- `.env` - Frontend dev config (uses http://localhost:8080/api)
- `.env.production` - Frontend prod config (uses https://food-donation-website-amqz.onrender.com/api)
- `setup-backend.ps1` - Automated backend startup
- `test-backend.ps1` - Backend verification tests

---

## ❓ Common Issues

**"Docker not found"**
- Install Docker Desktop: https://www.docker.com/products/docker-desktop

**"MySQL connection failed"**
- Wait 30+ seconds after docker-compose up
- Check: `docker ps` to see running containers

**"Gradle build failed"**
- Make sure Java 17+ is installed
- Try: `.\gradlew clean build` first

**"Port 8080 already in use"**
- Change port in `application.properties` or kill the process using it

---

Run this now and let me know what happens! 🚀
