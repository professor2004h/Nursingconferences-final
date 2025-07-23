# PowerShell script to check if services are running

Write-Host "Checking Nursing Conferences Application Services..." -ForegroundColor Green
Write-Host "=================================================" -ForegroundColor Yellow

# Function to test port connectivity
function Test-Port {
    param(
        [string]$ComputerName,
        [int]$Port,
        [string]$ServiceName
    )
    
    try {
        $connection = Test-NetConnection -ComputerName $ComputerName -Port $Port -WarningAction SilentlyContinue
        if ($connection.TcpTestSucceeded) {
            Write-Host "✓ $ServiceName is running on port $Port" -ForegroundColor Green
            return $true
        } else {
            Write-Host "✗ $ServiceName is not responding on port $Port" -ForegroundColor Red
            return $false
        }
    } catch {
        Write-Host "✗ Could not test $ServiceName connection on port $Port" -ForegroundColor Red
        return $false
    }
}

# Check Frontend (Next.js)
Write-Host "Testing Frontend (Next.js) on port 3000..." -ForegroundColor Cyan
$frontendRunning = Test-Port -ComputerName "localhost" -Port 3000 -ServiceName "Frontend"

# Check Backend (Sanity Studio)
Write-Host "Testing Backend (Sanity Studio) on port 3333..." -ForegroundColor Cyan
$backendRunning = Test-Port -ComputerName "localhost" -Port 3333 -ServiceName "Sanity Studio"

Write-Host "=================================================" -ForegroundColor Yellow

if ($frontendRunning -and $backendRunning) {
    Write-Host "🎉 Both services are running successfully!" -ForegroundColor Green
    Write-Host "Frontend: http://localhost:3000" -ForegroundColor White
    Write-Host "Sanity Studio: http://localhost:3333" -ForegroundColor White
} elseif ($frontendRunning) {
    Write-Host "⚠️  Frontend is running, but Sanity Studio is not responding" -ForegroundColor Yellow
    Write-Host "Frontend: http://localhost:3000" -ForegroundColor White
} elseif ($backendRunning) {
    Write-Host "⚠️  Sanity Studio is running, but Frontend is not responding" -ForegroundColor Yellow
    Write-Host "Sanity Studio: http://localhost:3333" -ForegroundColor White
} else {
    Write-Host "❌ Neither service is responding. Please check if they are running." -ForegroundColor Red
    Write-Host "Try running the start-dev.bat file to start both services." -ForegroundColor Yellow
}

Write-Host "=================================================" -ForegroundColor Yellow
