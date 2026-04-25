# Multi-stage Dockerfile for Food Donation Website

# Stage 1: Build Frontend
FROM node:20-alpine AS frontend-builder
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm ci
COPY . .
RUN npm run build

# Stage 2: Build Backend
FROM gradle:8-jdk17 AS backend-builder
WORKDIR /app
COPY Food_Donation/food_donation_backend ./
RUN gradle build -x test

# Stage 3: Runtime
FROM eclipse-temurin:17-jre-alpine
WORKDIR /app

# Copy backend jar
COPY --from=backend-builder /app/build/libs/*.jar app.jar

# Copy frontend dist (optional - for serving static files)
COPY --from=frontend-builder /app/dist ./static-files

# Environment variables
ENV PORT=8080
ENV SPRING_PROFILES_ACTIVE=prod

# Expose port
EXPOSE 8080

# Start application
ENTRYPOINT ["java", "-Dserver.port=${PORT}", "-Dspring.profiles.active=${SPRING_PROFILES_ACTIVE}", "-jar", "app.jar"]
