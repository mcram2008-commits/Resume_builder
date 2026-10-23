@echo off
echo ===================================================
echo   Starting Smart Resume Builder (Backend + Frontend)
echo ===================================================
start "Resume Backend (Port 5001)" cmd /k "cd server && node server.js"
start "Resume Frontend (Port 5173)" cmd /k "cd client && npm run dev"
timeout /t 3 >nul
start http://localhost:5173
echo.
echo Application is starting at http://localhost:5173
echo.
