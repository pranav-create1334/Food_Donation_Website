# 🚀 MySQL Deployment Guide - Food Donation Website

## ✅ Good News: Your Backend is Already Configured for MySQL!

Your Spring Boot application (`application.properties`) is already set up to use MySQL. We just need to configure the deployment environment.

---

## 🎯 Fastest Deployment: Docker + Render with MySQL (20 Minutes)

### Step 1: Push to GitHub (5 minutes)

```powershell
cd d:\programs\food_donation\Food_Donation_Website
git add .
git commit -m "Deploy with MySQL database"
git push origin main
```

### Step 2: Create MySQL Database on Render (5 minutes)

1. Go to [Render.com](https://render.com) and sign up/login with GitHub

2. **Create a MySQL Database:**
   - Click **"New +"** → **"MySQL"**
   - Name: `food-donation-db`
   - Database Name: `food_donation_db`
   - Click **"Create Database"**
   - Wait 2-3 minutes for it to be ready

3. **Get Database Connection Details:**
   - Click on your database
   - Go to **"Connections"** tab
   - Copy these values:
     - **Internal Database URL** (looks like: `mysql://root:password@hostname:3306/food_donation_db`)
     - **Username** (usually `root`)
     - **Password**

### Step 3: Deploy Your Application (10 minutes)

1. **Create a new Web Service:**
   - Click **"New +"** → **"Web Service"**
   - Connect your repository: `food-donation-website`

2. **Configure:**
   - **Name:** `food-donation-app`
   - **Runtime:** **Docker**
   - **Plan:** Free
   - Click **"Advanced"** to add environment variables

3. **Add Environment Variables:**

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

**Replace:**
- `YOUR_DB_HOST` with your Render MySQL hostname (from Connections tab)
- `YOUR_DB_PASSWORD` with your MySQL root password

4. **Click "Create Web Service"**

5. **Wait 5-10 minutes** for deployment

### Step 4: Test Your App

Open your browser: `https://food-donation-app.onrender.com`

**Your app is live with MySQL database!** 🎉

---

## 🔄 Alternative: Use Your Own MySQL Database

If you have your own MySQL server (local or cloud), use these environment variables:

```
SPRING_DATASOURCE_URL=jdbc:mysql://YOUR_HOST:3306/food_donation_db?useSSL=false&serverTimezone=UTC
SPRING_DATASOURCE_USERNAME=your_username
SPRING_DATASOURCE_PASSWORD=your_password
```

---

## 🐳 Test Locally with MySQL (Optional)

### Option 1: Use Docker MySQL

```powershell
# Start MySQL container
docker run --name food-donation-mysql -e MYSQL_ROOT_PASSWORD=root123 -e MYSQL_DATABASE=food_donation -p 3306:3306 -d mysql:8

# Run your app
npm install
npm run dev
```

### Option 2: Use Your Local MySQL

1. Create database:
```sql
CREATE DATABASE food_donation;
```

2. Update `.env` file:
```
SPRING_DATASOURCE_URL=jdbc:mysql://localhost:3306/food_donation?useSSL=false&serverTimezone=UTC
SPRING_DATASOURCE_USERNAME=root
SPRING_DATASOURCE_PASSWORD=your_password
```

3. Run your app:
```powershell
npm run dev
```

---

## 📊 MySQL Configuration Summary

| Setting | Value |
|---------|-------|
| **Driver** | `com.mysql.cj.jdbc.Driver` |
| **Dialect** | Auto-detected by Hibernate |
| **DDL Auto** | `update` (creates/updates tables) |
| **Connection Pool** | HikariCP (default) |

---

## ⚠️ Important MySQL Notes

1. **Database Creation:** Your app will automatically create tables on first run (due to `ddl-auto=update`)

2. **Connection String Format:**
   ```
   jdbc:mysql://HOST:PORT/DATABASE?useSSL=false&serverTimezone=UTC
   ```

3. **Default Credentials in Development:**
   - Username: `root`
   - Password: `root123` (from `application.properties`)

4. **Production:** Always use strong passwords and enable SSL for production MySQL

---

## 🔧 Troubleshooting MySQL Issues

### Error: "Access denied for user"
- **Fix:** Check username and password in environment variables

### Error: "Unknown database"
- **Fix:** Create the database first: `CREATE DATABASE food_donation;`

### Error: "Communications link failure"
- **Fix:** Check MySQL is running and host/port are correct

### Error: "Table doesn't exist"
- **Fix:** Wait a few minutes - Hibernate will create tables automatically on first startup

---

## 🎯 Quick Summary

**Your backend is already configured for MySQL!** Just:

1. **Push to GitHub**
2. **Create MySQL database on Render** (or use your own)
3. **Deploy with Docker** and set MySQL connection environment variables
4. **Done!** Your app will automatically create tables and work with MySQL

**Total time: 20 minutes** ⏱️

---

**Need help?** Run `.\deploy.ps1` and select Option 1, then use MySQL environment variables instead of H2.

**Ready to deploy?** Follow the steps above or check `QUICK_DEPLOY.md` for the fastest deployment! 🚀