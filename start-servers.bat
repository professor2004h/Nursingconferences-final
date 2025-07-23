@echo off
echo Starting Frontend and Backend Servers...
echo.

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Node.js is not installed!
    echo Please install Node.js from https://nodejs.org/
    echo Then run this script again.
    pause
    exit /b 1
)

echo Node.js is installed. Starting servers...
echo.

REM Start Frontend Server (Port 3000)
echo Starting Frontend Server on port 3000...
start "Frontend Server" cmd /k "cd /d %~dp0nextjs-frontend && npm install && npm run dev"

REM Wait a moment
timeout /t 3 /nobreak >nul

REM Start Backend Server (Port 3333)
echo Starting Sanity Backend on port 3333...
start "Sanity Backend" cmd /k "cd /d %~dp0SanityBackend && npm install && npm run dev"

echo.
echo Both servers are starting...
echo Frontend: http://localhost:3000
echo Backend: http://localhost:3333
echo Population: http://localhost:3000/populate-sanity-backend
echo.
echo Press any key to exit this script (servers will continue running)
pause
