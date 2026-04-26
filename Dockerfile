# ===== Stage 1: Build Frontend (React) =====
FROM node:20-slim AS frontend-builder
WORKDIR /app/frontend

# Copy package files
COPY package.json package-lock.json ./

# Clean install (fix oxide bug)
RUN rm -rf node_modules package-lock.json && npm install

# Copy rest of frontend
COPY . .

# Build
RUN npm run build


# ===== Stage 2: Build Backend (Spring Boot) =====
FROM gradle:8-jdk17 AS backend-builder
WORKDIR /app/backend

COPY Food_Donation/food_donation_backend/build.gradle ./
COPY Food_Donation/food_donation_backend/settings.gradle ./
COPY Food_Donation/food_donation_backend/gradle ./gradle
COPY Food_Donation/food_donation_backend/gradlew ./
RUN chmod +x gradlew

COPY Food_Donation/food_donation_backend/src ./src

RUN ./gradlew clean build -x test --no-daemon


# ===== Stage 3: Runtime =====
FROM eclipse-temurin:17-jre-alpine
WORKDIR /app

RUN apk add --no-cache curl

COPY --from=backend-builder /app/backend/build/libs/*.jar app.jar
COPY --from=frontend-builder /app/frontend/dist ./static

# Set default PORT if not provided by environment (e.g., Render, Railway)
ENV PORT=${PORT:-8080}
ENV SPRING_PROFILES_ACTIVE=prod

EXPOSE ${PORT}

HEALTHCHECK --interval=30s --timeout=10s --start-period=60s --retries=3 \
  CMD curl -f http://localhost:${PORT}/api/status || exit 1

ENTRYPOINT ["sh", "-c", "java -Dserver.port=${PORT} -jar app.jar"]
