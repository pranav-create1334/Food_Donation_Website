# Community Food Donation Platform

Full-stack project with:

- Frontend: React + Vite + TypeScript
- Backend: Spring Boot + Spring Security (JWT) + Spring Data JPA
- Database: H2 (default for local development)

## Project Structure

- Frontend root: `Food_Donation_Website/`
- Backend: `Food_Donation_Website/Food_Donation/food_donation_backend`

## Roles and Workflow

- `DONOR`: creates donation requests with pickup address, food details, image URL, and passcode.
- `VOLUNTEER`: marks donations `ON_THE_WAY`, then marks `RECEIVED` with donor passcode.
- `ADMIN`: monitors all donations and their status changes.

## Local Run

### 1) Backend

```bash
cd Food_Donation/food_donation_backend
./gradlew bootRun
```

Default backend URL: http://localhost:8080

Seeded demo users (password: `password123`):

- `donor1` (`DONOR`)
- `volunteer1` (`VOLUNTEER`)
- `admin1` (`ADMIN`)

### 2) Frontend

```bash
npm install
npm run dev
```

Default frontend URL: http://localhost:5173

The Vite dev server proxies `/api/*` to `http://localhost:8080`.

## API Summary

- `POST /api/auth/signup`
- `POST /api/auth/signin`
- `GET /api/donations`
- `POST /api/donations` (`DONOR` only)
- `PUT /api/donations/{id}/status` (`VOLUNTEER`/`ADMIN` only)

## Environment Variables

See `.env.example` for frontend and backend variables.

