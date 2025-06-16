# PowerShell script to run SocialSync project
Write-Host "Starting SocialSync Development Setup..." -ForegroundColor Green

# Set environment variables for backend
$env:PORT = "5000"
$env:MONGO_URI = "mongodb://localhost:27017/socialsync"
$env:JWT_SECRET = "your-jwt-secret-key-here-change-in-production"
$env:NODE_ENV = "development"
$env:CORS_ORIGIN = "http://localhost:3000"

Write-Host "Environment variables set" -ForegroundColor Yellow

# Check if MongoDB is running
Write-Host "Checking MongoDB connection..." -ForegroundColor Yellow
try {
    $mongoTest = mongosh --eval "db.runCommand('ping')" --quiet 2>$null
    if ($LASTEXITCODE -eq 0) {
        Write-Host "MongoDB is running!" -ForegroundColor Green
    } else {
        Write-Host "Warning: MongoDB might not be running. Make sure MongoDB is started." -ForegroundColor Red
    }
} catch {
    Write-Host "Warning: Cannot check MongoDB status. Make sure it's running." -ForegroundColor Red
}

Write-Host "`nTo run the project:" -ForegroundColor Cyan
Write-Host "1. Backend: cd backend && npm run dev" -ForegroundColor White
Write-Host "2. Frontend: cd frontend && npm start" -ForegroundColor White
Write-Host "`nBackend will run on: http://localhost:5000" -ForegroundColor Green
Write-Host "Frontend will run on: http://localhost:3000" -ForegroundColor Green 