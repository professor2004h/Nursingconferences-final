# PowerShell script to start both frontend and backend services

Write-Host "Starting Nursing Conferences Application Services..." -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Yellow

# Start Sanity Backend (Studio)
Write-Host "Starting Sanity Studio (Backend) on port 3333..." -ForegroundColor Cyan
Start-Process powershell.exe -ArgumentList "-NoExit", "-Command", "cd 'C:\Users\user\Desktop\Nursingconferences\SanityBackend'; Write-Host 'Installing dependencies...' -ForegroundColor Yellow; npm install; Write-Host 'Starting Sanity Studio...' -ForegroundColor Green; npm run dev -- --port 3333"

# Wait a moment
Start-Sleep -Seconds 3

# Start Next.js Frontend
Write-Host "Starting Next.js Frontend on port 3000..." -ForegroundColor Cyan
Start-Process powershell.exe -ArgumentList "-NoExit", "-Command", "cd 'C:\Users\user\Desktop\Nursingconferences\nextjs-frontend'; Write-Host 'Installing dependencies...' -ForegroundColor Yellow; npm install; Write-Host 'Starting frontend...' -ForegroundColor Green; npm run dev"

Write-Host "========================================" -ForegroundColor Yellow
Write-Host "Services are starting up..." -ForegroundColor Green
Write-Host "Frontend will be available at: http://localhost:3000" -ForegroundColor White
Write-Host "Sanity Studio will be available at: http://localhost:3333" -ForegroundColor White
Write-Host "Please wait a moment for the services to fully start..." -ForegroundColor Yellow

# Wait for services to start
Write-Host "Waiting 30 seconds for services to initialize..." -ForegroundColor Yellow
Start-Sleep -Seconds 30

# Test if services are running
Write-Host "Testing service connectivity..." -ForegroundColor Cyan

try {
    $frontend = Test-NetConnection -ComputerName localhost -Port 3000 -WarningAction SilentlyContinue
    if ($frontend.TcpTestSucceeded) {
        Write-Host "✓ Frontend is running on port 3000" -ForegroundColor Green
    } else {
        Write-Host "✗ Frontend is not responding on port 3000" -ForegroundColor Red
    }
} catch {
    Write-Host "✗ Could not test frontend connection" -ForegroundColor Red
}

try {
    $backend = Test-NetConnection -ComputerName localhost -Port 3333 -WarningAction SilentlyContinue
    if ($backend.TcpTestSucceeded) {
        Write-Host "✓ Sanity Studio is running on port 3333" -ForegroundColor Green
    } else {
        Write-Host "✗ Sanity Studio is not responding on port 3333" -ForegroundColor Red
    }
} catch {
    Write-Host "✗ Could not test backend connection" -ForegroundColor Red
}

Write-Host "========================================" -ForegroundColor Yellow
Write-Host "Startup script completed!" -ForegroundColor Green
