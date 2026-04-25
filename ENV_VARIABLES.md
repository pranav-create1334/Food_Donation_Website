# 🔐 Environment Variables Reference

## Required Variables for Production

### Backend Variables (Set in Railway)

| Variable | Description | Example | Required |
|----------|-------------|---------|----------|
| `PORT` | Server port | `8080` | ✅ Yes |
| `SPRING_PROFILES_ACTIVE` | Spring profile | `prod` | ✅ Yes |
| `DB_URL` | MySQL connection URL | `jdbc:mysql://user:pass@host:3306/food_donation?useSSL=false&serverTimezone=UTC` | ✅ Yes |
| `DB_USER` | Database username | `railway` | ✅ Yes |
| `DB_PASSWORD` | Database password | `securepassword123` | ✅ Yes |
| `JWT_SECRET` | JWT signing secret | `foodDonationSuperSecretKeyForJwtTokenGeneration2026` | ✅ Yes |
| `JWT_EXPIRATION_MS` | JWT token expiration | `86400000` (24 hours) | ❌ No (default: 24h) |

### Frontend Variables

#### Development (.env)
```
VITE_API_BASE_URL=http://localhost:8080/api
```

#### Production (.env.production)
```
VITE_API_BASE_URL=https://your-railway-domain.up.railway.app/api
```

---

## How to Set Variables in Railway

### Method 1: Railway Dashboard (Easiest)
1. Go to Railway project
2. Click Backend service
3. Click **Variables** tab
4. Click **"+ Add"** for each variable
5. Enter key and value

### Method 2: Railway CLI (Advanced)
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login
railway login

# Link project
railway link

# Set variables
railway variables set SPRING_PROFILES_ACTIVE=prod
railway variables set DB_URL="jdbc:mysql://..."
# ... etc
```

---

## Getting MySQL Connection Details from Railway

1. In Railway dashboard, go to MySQL service
2. Click **Connect** tab
3. Select **Database URL** (for JDBC) or **Connection** tabs
4. Copy the connection string
5. Extract components:
   - `DB_URL`: Full JDBC connection string
   - `DB_USER`: Username part
   - `DB_PASSWORD`: Password part

**Example Connection URL:**
```
jdbc:mysql://railway:K8p9x2Lq@monorail.proxy.rlwy.net:43701/railway?useSSL=false&serverTimezone=UTC
```

Breakdown:
- `DB_URL`: `jdbc:mysql://railway:K8p9x2Lq@monorail.proxy.rlwy.net:43701/railway?useSSL=false&serverTimezone=UTC`
- `DB_USER`: `railway`
- `DB_PASSWORD`: `K8p9x2Lq`

---

## Security Best Practices

⚠️ **NEVER** commit environment variables to Git!

✅ **DO:**
- Use `.env` files locally with `.gitignore`
- Store production secrets in Railway variables only
- Use strong JWT_SECRET (change from default)
- Rotate secrets periodically
- Use different secrets for dev/prod

❌ **DON'T:**
- Hardcode credentials in code
- Commit `.env` files to Git
- Share production secrets via email
- Use same secrets across environments

---

## Local Development Setup

Create `.env` in project root:
```
VITE_API_BASE_URL=http://localhost:8080/api
```

Create `Food_Donation/food_donation_backend/local.env`:
```
PORT=8080
SPRING_PROFILES_ACTIVE=dev
spring.datasource.url=jdbc:mysql://localhost:3306/food_donation
spring.datasource.username=root
spring.datasource.password=root123
JWT_SECRET=dev-secret-key-only-for-testing
```

---

## Troubleshooting Missing Variables

If you see errors like:
- `ERROR: Jdbc connection error`
- `JWT_SECRET not found`
- `Port already in use`

**Solution:** Check Railway Variables tab to ensure all required variables are set.

**In Railway Logs, look for:**
```
The following 1 profiles are active: "prod"
c.mysql.cj.jdbc.Driver
HikariPool initialized with size: 10
```

---

## Update Variables After Deployment

Variables can be updated anytime:
1. Go to Backend service
2. Click **Variables** tab
3. Edit the value
4. Click **Redeploy** to apply changes

No need to push to GitHub!

---

## Adding New Environment Variables

If you add new variables to your code:

1. Add to `application-prod.properties`:
```properties
my.new.property=${MY_NEW_VAR}
```

2. Add to Railway Variables tab

3. Push code changes to GitHub

4. Railway will auto-rebuild

---

## Testing Environment Variables

After deployment, verify variables are working:

```bash
# Via Railway CLI
railway logs --backend

# Via Railway Dashboard
# Backend → Deployments → Click deployment → Logs tab
```

Look for confirmation like:
```
Database connected successfully!
JWT token initialized
Port 8080 listening
```
