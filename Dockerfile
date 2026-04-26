# ===== Stage 1: Build Frontend (React) =====
FROM node:18-alpine AS frontend-builder
WORKDIR /app/frontend

# Copy package files
COPY package*.json ./
RUN npm install

# Copy frontend source
COPY src ./src
COPY index.html tsconfig.json vite.config.ts ./
COPY public ./public 2>/dev/null || true

# Build frontend
RUN npm run build

# ===== Stage 2: Build Backend (Spring Boot) =====
FROM gradle:8-jdk17 AS backend-builder
WORKDIR /app/backend

# Copy gradle files
COPY Food_Donation/food_donation_backend/build.gradle .
COPY Food_Donation/food_donation_backend/settings.gradle .
COPY Food_Donation/food_donation_backend/gradle ./gradle
COPY Food_Donation/food_donation_backend/gradlew* ./

# Copy source
COPY Food_Donation/food_donation_backend/src ./src

# Build backend (skip tests for faster build)
RUN ./gradlew clean build -x test --no-daemon

# ===== Stage 3: Runtime (Combine Frontend + Backend) =====
FROM eclipse-temurin:17-jre-alpine
WORKDIR /app

# Install curl for health checks
RUN apk add --no-cache curl

# Copy backend jar from builder
COPY --from=backend-builder /app/backend/build/libs/*.jar app.jar

# Copy frontend dist to backend static resources
COPY --from=frontend-builder /app/frontend/dist ./dist

# Create static content directory
RUN mkdir -p /app/static && cp -r ./dist/* /app/static/ 2>/dev/null || true

# Set environment variables
ENV PORT=8080
ENV SPRING_PROFILES_ACTIVE=prod

# Expose port
EXPOSE 8080

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
    CMD curl -f http://localhost:${PORT}/api/health || exit 1

# Start application
ENTRYPOINT ["sh", "-c", "exec java -Dserver.port=${PORT} -jar /app/app.jar"]