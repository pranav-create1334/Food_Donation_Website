# ===== Stage 1: Build Frontend (React) =====
FROM node:20-alpine AS frontend-builder

WORKDIR /app/frontend

# Copy package files from correct folder
COPY Food_Donation_Website/package*.json ./

# Install dependencies
RUN npm install

# Copy full frontend project
COPY Food_Donation_Website/ .

# Build frontend
RUN npm run build


# ===== Stage 2: Build Backend (Spring Boot) =====
FROM gradle:8-jdk17 AS backend-builder

WORKDIR /app/backend

# Copy gradle files
COPY Food_Donation/food_donation_backend/build.gradle ./
COPY Food_Donation/food_donation_backend/settings.gradle ./
COPY Food_Donation/food_donation_backend/gradle ./gradle
COPY Food_Donation/food_donation_backend/gradlew ./

# Give permission
RUN chmod +x gradlew

# Copy backend source
COPY Food_Donation/food_donation_backend/src ./src

# Build backend
RUN ./gradlew clean build -x test --no-daemon


# ===== Stage 3: Runtime =====
FROM eclipse-temurin:17-jre-alpine

WORKDIR /app

# Install curl
RUN apk add --no-cache curl

# Copy backend jar
COPY --from=backend-builder /app/backend/build/libs/*.jar app.jar

# Copy frontend build into Spring Boot static folder
COPY --from=frontend-builder /app/frontend/dist ./static

# Environment variables
ENV PORT=8080
ENV SPRING_PROFILES_ACTIVE=prod

# Expose port
EXPOSE 8080

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
  CMD curl -f http://localhost:${PORT}/ || exit 1

# Run app
ENTRYPOINT ["sh", "-c", "java -Dserver.port=${PORT} -jar app.jar"]