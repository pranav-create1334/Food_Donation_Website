# Food Donation Backend Setup Script
# Run this to start MySQL and Spring Boot backend locally

Write-Host "🚀 Food Donation Backend Setup" -ForegroundColor Green
Write-Host "==============================" -ForegroundColor Green
Write-Host ""

# Navigate to backend directory
$backendPath = "d:\programs\food_donation\Food_Donation_Website\Food_Donation\food_donation_backend"
Set-Location $backendPath

Write-Host "📦 Step 1: Starting MySQL with Docker..." -ForegroundColor Cyan
docker-compose up -d mysql

Write-Host ""
Write-Host "⏳ Waiting for MySQL to be ready (30 seconds)..." -ForegroundColor Yellow
Start-Sleep -Seconds 30

Write-Host ""
Write-Host "✅ MySQL is ready on localhost:3306" -ForegroundColor Green
Write-Host "   Username: root" -ForegroundColor Gray
Write-Host "   Password: root123" -ForegroundColor Gray
Write-Host "   Database: food_donation" -ForegroundColor Gray
Write-Host ""

Write-Host "🔨 Step 2: Building and running Spring Boot backend..." -ForegroundColor Cyan
Write-Host "   This may take 2-3 minutes on first run..." -ForegroundColor Gray
Write-Host ""

./gradlew bootRun

Write-Host ""
Write-Host "❌ To stop the backend, press Ctrl+C above" -ForegroundColor Yellow
Write-Host "❌ To stop MySQL, run: docker-compose down" -ForegroundColor Yellow
