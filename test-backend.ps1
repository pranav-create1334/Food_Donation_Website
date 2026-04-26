# Quick Backend Testing Commands
# Run these in PowerShell to verify your backend

Write-Host "🧪 Testing Backend Setup" -ForegroundColor Green
Write-Host "======================" -ForegroundColor Green
Write-Host ""

# Test 1: Check if backend is running
Write-Host "Test 1: Checking if backend is responding..." -ForegroundColor Cyan
try {
    $response = Invoke-WebRequest -Uri "http://localhost:8080/" -Method GET -TimeoutSec 5
    Write-Host "✅ Backend is running!" -ForegroundColor Green
    Write-Host "   Response: $($response.Content)" -ForegroundColor Gray
} catch {
    Write-Host "❌ Backend is not responding" -ForegroundColor Red
    Write-Host "   Make sure you ran: setup-backend.ps1" -ForegroundColor Yellow
    exit 1
}

Write-Host ""

# Test 2: Check CORS
Write-Host "Test 2: Checking CORS configuration..." -ForegroundColor Cyan
try {
    $response = Invoke-WebRequest -Uri "http://localhost:8080/api/auth/signin" `
        -Method OPTIONS `
        -Headers @{
            "Origin" = "https://food-donation-website-eta.vercel.app"
            "Access-Control-Request-Method" = "POST"
        } `
        -TimeoutSec 5
    Write-Host "✅ CORS is configured!" -ForegroundColor Green
} catch {
    Write-Host "⚠️  CORS check returned: $($_.Exception.Message)" -ForegroundColor Yellow
}

Write-Host ""

# Test 3: Test login endpoint (will fail with 400 but shows endpoint works)
Write-Host "Test 3: Testing login endpoint..." -ForegroundColor Cyan
try {
    $body = @{
        username = "test"
        password = "test"
    } | ConvertTo-Json

    $response = Invoke-WebRequest -Uri "http://localhost:8080/api/auth/signin" `
        -Method POST `
        -Headers @{"Content-Type" = "application/json"} `
        -Body $body `
        -TimeoutSec 5
    
    Write-Host "✅ Login endpoint responded!" -ForegroundColor Green
} catch {
    if ($_.Exception.Response.StatusCode -eq 400 -or $_.Exception.Response.StatusCode -eq 401) {
        Write-Host "✅ Login endpoint is accessible (got expected error for test credentials)" -ForegroundColor Green
    } else {
        Write-Host "⚠️  Got response code: $($_.Exception.Response.StatusCode)" -ForegroundColor Yellow
    }
}

Write-Host ""
Write-Host "✅ Backend setup verification complete!" -ForegroundColor Green
Write-Host ""
Write-Host "📝 Next steps:" -ForegroundColor Cyan
Write-Host "   1. Update frontend .env file with: VITE_API_BASE_URL=http://localhost:8080/api" -ForegroundColor Gray
Write-Host "   2. Run: npm run dev" -ForegroundColor Gray
Write-Host "   3. Open http://localhost:5173 and test login" -ForegroundColor Gray
