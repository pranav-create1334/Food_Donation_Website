# ===================================
# Food Donation Website - Quick Deployment Script
# ===================================
# This script automates the deployment process
# Run with: .\deploy.ps1
# ===================================

Write-Host "🚀 Food Donation Website - Quick Deployment Script" -ForegroundColor Green
Write-Host "==================================================" -ForegroundColor Green
Write-Host ""

# Check if Git is installed
Write-Host "📋 Checking Git installation..." -ForegroundColor Yellow
if (-Not (Get-Command git -ErrorAction SilentlyContinue)) {
    Write-Host "❌ Git is not installed. Please install Git from https://git-scm.com/" -ForegroundColor Red
    exit 1
}
Write-Host "✅ Git is installed" -ForegroundColor Green

# Check if Docker is installed
Write-Host "🐳 Checking Docker installation..." -ForegroundColor Yellow
if (-Not (Get-Command docker -ErrorAction SilentlyContinue)) {
    Write-Host "⚠️  Docker is not installed. Docker is recommended for testing." -ForegroundColor Yellow
    Write-Host "   Install from https://docs.docker.com/desktop/" -ForegroundColor Yellow
} else {
    Write-Host "✅ Docker is installed" -ForegroundColor Green
}

Write-Host ""
Write-Host "🎯 Deployment Options:" -ForegroundColor Cyan
Write-Host "1. Docker + Render (Recommended - All-in-one)" -ForegroundColor White
Write-Host "2. Vercel + Render (Frontend on Vercel, Backend on Render)" -ForegroundColor White
Write-Host "3. Test Docker build locally" -ForegroundColor White
Write-Host "4. Just push to GitHub (manual deployment)" -ForegroundColor White
Write-Host ""

$choice = Read-Host "Select an option (1-4)"

if ($choice -eq "1") {
    Write-Host ""
    Write-Host "🎯 Option 1: Docker + Render (All-in-one with MySQL)" -ForegroundColor Cyan
    Write-Host "This will deploy your entire app (frontend + backend) to Render.com with MySQL database" -ForegroundColor White
    Write-Host ""
    Write-Host "⚠️  Note: Your app uses MySQL database. You'll need to create a MySQL database on Render first." -ForegroundColor Yellow
    Write-Host ""
    
    # Step 1: Git setup
    Write-Host "📦 Step 1: Setting up Git..." -ForegroundColor Yellow
    if (-Not (Test-Path ".git")) {
        Write-Host "Initializing Git repository..." -ForegroundColor White
        git init
    }
    
    Write-Host "Staging all changes..." -ForegroundColor White
    git add .
    
    $commitMsg = Read-Host "Enter commit message (or press Enter for default)"
    if ([string]::IsNullOrWhiteSpace($commitMsg)) {
        $commitMsg = "Deploy to Render with Docker"
    }
    
    git commit -m $commitMsg
    
    # Step 2: GitHub remote
    Write-Host ""
    Write-Host "📦 Step 2: GitHub Repository Setup" -ForegroundColor Yellow
    $hasRemote = git remote -v | Select-String "origin"
    if (-Not $hasRemote) {
        $repoUrl = Read-Host "Enter your GitHub repository URL (https://github.com/username/repo.git)"
        git remote add origin $repoUrl
    } else {
        Write-Host "✅ Remote 'origin' already exists" -ForegroundColor Green
    }
    
    # Set default branch to main
    git branch -M main 2>$null
    
    $pushConfirm = Read-Host "Push to GitHub? (y/n)"
    if ($pushConfirm -eq "y" -or $pushConfirm -eq "Y") {
        git push -u origin main
    }
    
    # Step 3: Render deployment instructions
    Write-Host ""
    Write-Host "🚀 Step 3: Deploy to Render.com with MySQL" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "First, create a MySQL database:" -ForegroundColor Cyan
    Write-Host "1. Go to https://render.com and sign up/login with GitHub" -ForegroundColor White
    Write-Host "2. Click 'New +' → 'MySQL'" -ForegroundColor White
    Write-Host "3. Name: food-donation-db, Database Name: food_donation_db" -ForegroundColor White
    Write-Host "4. Click 'Create Database' and wait 2-3 minutes" -ForegroundColor White
    Write-Host "5. Click on your database → 'Connections' tab" -ForegroundColor White
    Write-Host "6. Copy the Internal Database URL, Username, and Password" -ForegroundColor White
    Write-Host ""
    
    Write-Host "Then, deploy your application:" -ForegroundColor Cyan
    Write-Host "1. Click 'New +' → 'Web Service'" -ForegroundColor White
    Write-Host "2. Connect your repository: food-donation-website" -ForegroundColor White
    Write-Host "3. Configure:" -ForegroundColor White
    Write-Host "   - Name: food-donation-app" -ForegroundColor Gray
    Write-Host "   - Runtime: Docker" -ForegroundColor Gray
    Write-Host "   - Plan: Free" -ForegroundColor Gray
    Write-Host "4. Click 'Advanced' to add Environment Variables:" -ForegroundColor White
    
    Write-Host ""
    Write-Host "Copy these environment variables (replace YOUR_DB_* with your MySQL values):" -ForegroundColor Cyan
    Write-Host "PORT=8080" -ForegroundColor Gray
    Write-Host "SPRING_PROFILES_ACTIVE=prod" -ForegroundColor Gray
    Write-Host "SPRING_DATASOURCE_URL=jdbc:mysql://YOUR_DB_HOST:3306/food_donation_db?useSSL=false&serverTimezone=UTC" -ForegroundColor Gray
    Write-Host "SPRING_DATASOURCE_USERNAME=root" -ForegroundColor Gray
    Write-Host "SPRING_DATASOURCE_PASSWORD=YOUR_DB_PASSWORD" -ForegroundColor Gray
    Write-Host "APP_JWT_SECRET=foodDonationSuperSecretKeyForJwtTokenGeneration2026" -ForegroundColor Gray
    Write-Host "APP_JWT_EXPIRATION_MS=86400000" -ForegroundColor Gray
    Write-Host "VITE_API_BASE_URL=/api" -ForegroundColor Gray
    
    Write-Host ""
    Write-Host "5. Click 'Create Web Service'" -ForegroundColor White
    Write-Host "6. Wait 5-10 minutes for deployment" -ForegroundColor White
    Write-Host ""
    Write-Host "✅ Your app will be live at: https://food-donation-app.onrender.com" -ForegroundColor Green
    Write-Host ""
    Write-Host "📖 For detailed MySQL deployment instructions, see: MYSQL_DEPLOYMENT_GUIDE.md" -ForegroundColor Cyan

} elseif ($choice -eq "2") {
    Write-Host ""
    Write-Host "🎯 Option 2: Vercel + Render (Split Deployment)" -ForegroundColor Cyan
    Write-Host "This will deploy frontend to Vercel and backend to Render" -ForegroundColor White
    Write-Host ""
    
    # First, deploy backend to Render
    Write-Host "📦 Step 1: Deploy Backend to Render" -ForegroundColor Yellow
    Write-Host "Follow the same steps as Option 1, but name it 'food-donation-backend'" -ForegroundColor White
    Write-Host "After deployment, note your backend URL (e.g., https://food-donation-backend.onrender.com)" -ForegroundColor White
    Write-Host ""
    
    $backendUrl = Read-Host "Enter your Render backend URL (without https://)"
    
    # Update vercel.json
    Write-Host "📝 Step 2: Updating vercel.json..." -ForegroundColor Yellow
    $vercelConfig = @{
        buildCommand = "npm run build"
        outputDirectory = "dist"
        devCommand = "npm run dev"
        installCommand = "npm install"
        framework = "vite"
        rewrites = @(
            @{
                source = "/api/(.*)"
                destination = "https://$backendUrl/api/`$1"
            },
            @{
                source = "/(.*)"
                destination = "/$1"
            }
        )
    }
    
    $vercelConfig | ConvertTo-Json -Depth 10 | Out-File -FilePath "vercel.json" -Encoding utf8
    Write-Host "✅ vercel.json updated with backend URL" -ForegroundColor Green
    
    # Update .env.production
    Write-Host "📝 Step 3: Updating environment configuration..." -ForegroundColor Yellow
    $envContent = @"
# Production Environment Configuration
VITE_API_BASE_URL=https://$backendUrl/api
"@
    $envContent | Out-File -FilePath ".env.production" -Encoding utf8
    Write-Host "✅ .env.production created" -ForegroundColor Green
    
    # Push changes
    Write-Host "📦 Step 4: Pushing changes to GitHub..." -ForegroundColor Yellow
    git add .
    git commit -m "Configure for Vercel + Render deployment"
    git push origin main
    
    Write-Host ""
    Write-Host "🚀 Step 5: Deploy Frontend to Vercel" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Follow these steps:" -ForegroundColor Cyan
    Write-Host "1. Go to https://vercel.com and sign up/login with GitHub" -ForegroundColor White
    Write-Host "2. Click 'Add New...' → 'Project'" -ForegroundColor White
    Write-Host "3. Import your repository: food-donation-website" -ForegroundColor White
    Write-Host "4. Configure:" -ForegroundColor White
    Write-Host "   - Framework Preset: Vite" -ForegroundColor Gray
    Write-Host "   - Root Directory: ./" -ForegroundColor Gray
    Write-Host "   - Build Command: npm run build" -ForegroundColor Gray
    Write-Host "   - Output Directory: dist" -ForegroundColor Gray
    Write-Host "5. Click 'Deploy'" -ForegroundColor White
    Write-Host ""
    Write-Host "✅ Your frontend will be live at: https://food-donation-website.vercel.app" -ForegroundColor Green
    Write-Host ""
    Write-Host "📖 For detailed instructions, see: DEPLOYMENT_GUIDE_DOCKER_VERCEL.md" -ForegroundColor Cyan

} elseif ($choice -eq "3") {
    Write-Host ""
    Write-Host "🐳 Testing Docker Build Locally" -ForegroundColor Cyan
    Write-Host ""
    
    if (-Not (Get-Command docker -ErrorAction SilentlyContinue)) {
        Write-Host "❌ Docker is not installed. Please install Docker Desktop." -ForegroundColor Red
        exit 1
    }
    
    Write-Host "Building Docker image..." -ForegroundColor Yellow
    docker build -t food-donation .
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Docker build successful!" -ForegroundColor Green
        Write-Host ""
        Write-Host "To run the container:" -ForegroundColor Cyan
        Write-Host "docker run -p 8080:8080 food-donation" -ForegroundColor White
        Write-Host ""
        Write-Host "Then open: http://localhost:8080" -ForegroundColor Green
    } else {
        Write-Host "❌ Docker build failed. Check the error messages above." -ForegroundColor Red
    }

} elseif ($choice -eq "4") {
    Write-Host ""
    Write-Host "📦 Pushing to GitHub Only" -ForegroundColor Cyan
    Write-Host ""
    
    if (-Not (Test-Path ".git")) {
        git init
    }
    
    git add .
    $commitMsg = Read-Host "Enter commit message (or press Enter for default)"
    if ([string]::IsNullOrWhiteSpace($commitMsg)) {
        $commitMsg = "Update for deployment"
    }
    git commit -m $commitMsg
    
    $hasRemote = git remote -v | Select-String "origin"
    if (-Not $hasRemote) {
        $repoUrl = Read-Host "Enter your GitHub repository URL"
        git remote add origin $repoUrl
    }
    
    git branch -M main 2>$null
    git push -u origin main
    
    Write-Host ""
    Write-Host "✅ Code pushed to GitHub!" -ForegroundColor Green
    Write-Host "Now deploy manually on Render or Vercel." -ForegroundColor White
    Write-Host "See DEPLOYMENT_GUIDE_DOCKER_VERCEL.md for instructions." -ForegroundColor Cyan
}

Write-Host ""
Write-Host "==================================================" -ForegroundColor Green
Write-Host "🎉 Deployment script completed!" -ForegroundColor Green
Write-Host "==================================================" -ForegroundColor Green
Write-Host ""
Write-Host "📄 Important files created/updated:" -ForegroundColor Cyan
Write-Host "   - DEPLOYMENT_GUIDE_DOCKER_VERCEL.md (Complete deployment guide)" -ForegroundColor White
Write-Host "   - vercel.json (Vercel configuration)" -ForegroundColor White
Write-Host "   - .env.example (Environment variables template)" -ForegroundColor White
Write-Host ""
Write-Host "Good luck with your deployment! 🚀" -ForegroundColor Green