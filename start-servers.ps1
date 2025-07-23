# PowerShell script to start both servers
Write-Host "Starting Frontend and Backend Servers..." -ForegroundColor Green
Write-Host ""

# Check if Node.js is installed
try {
    $nodeVersion = node --version 2>$null
    Write-Host "Node.js version: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "ERROR: Node.js is not installed!" -ForegroundColor Red
    Write-Host "Please install Node.js from https://nodejs.org/" -ForegroundColor Yellow
    Write-Host "Then run this script again." -ForegroundColor Yellow
    Read-Host "Press Enter to exit"
    exit 1
}

Write-Host "Starting servers..." -ForegroundColor Green
Write-Host ""

# Get the script directory
$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path

# Start Frontend Server (Port 3000)
Write-Host "Starting Frontend Server on port 3000..." -ForegroundColor Cyan
$frontendPath = Join-Path $scriptDir "nextjs-frontend"
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$frontendPath'; npm install; npm run dev" -WindowStyle Normal

# Wait a moment
Start-Sleep -Seconds 3

# Start Backend Server (Port 3333)
Write-Host "Starting Sanity Backend on port 3333..." -ForegroundColor Cyan
$backendPath = Join-Path $scriptDir "SanityBackend"
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$backendPath'; npm install; npm run dev" -WindowStyle Normal

Write-Host ""
Write-Host "Both servers are starting..." -ForegroundColor Green
Write-Host "Frontend: http://localhost:3000" -ForegroundColor Yellow
Write-Host "Backend: http://localhost:3333" -ForegroundColor Yellow
Write-Host "Population: http://localhost:3000/populate-sanity-backend" -ForegroundColor Yellow
Write-Host ""
Write-Host "Press any key to exit this script (servers will continue running)" -ForegroundColor Gray
Read-Host
