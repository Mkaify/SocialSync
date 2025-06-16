@echo off
echo Setting up SocialSync project...
echo.

echo Creating backend .env file...
(
echo PORT=5000
echo MONGO_URI=mongodb://localhost:27017/socialsync
echo JWT_SECRET=your-jwt-secret-key-here-change-in-production
echo NODE_ENV=development
echo CORS_ORIGIN=http://localhost:3000
) > backend\.env

echo Installing backend dependencies...
cd backend
call npm install
if %errorlevel% neq 0 (
    echo Failed to install backend dependencies
    pause
    exit /b 1
)
cd ..

echo Installing frontend dependencies...
cd frontend
call npm install
if %errorlevel% neq 0 (
    echo Failed to install frontend dependencies
    pause
    exit /b 1
)
cd ..

echo.
echo Setup complete!
echo.
echo To run the project:
echo 1. Make sure MongoDB is running on your system
echo 2. Open two terminal windows:
echo    - In first terminal: cd backend && npm run dev
echo    - In second terminal: cd frontend && npm start
echo.
echo The backend will run on http://localhost:5000
echo The frontend will run on http://localhost:3000
echo.
pause 