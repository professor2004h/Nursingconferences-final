# =============================================================================
# NURSING CONFERENCES - DEVELOPMENT SERVER STARTUP SCRIPT
# =============================================================================
# This script starts both frontend and backend servers with environment variables
# =============================================================================

param(
    [switch]$SkipEnvCheck,
    [switch]$Production,
    [switch]$Help
)

if ($Help) {
    Write-Host "==============================================================================" -ForegroundColor Cyan
    Write-Host "NURSING CONFERENCES - SERVER STARTUP SCRIPT" -ForegroundColor Cyan
    Write-Host "==============================================================================" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Usage:" -ForegroundColor Yellow
    Write-Host "  .\start-servers.ps1                 # Start development servers"
    Write-Host "  .\start-servers.ps1 -Production     # Start production servers"
    Write-Host "  .\start-servers.ps1 -SkipEnvCheck   # Skip environment variable validation"
    Write-Host "  .\start-servers.ps1 -Help           # Show this help"
    Write-Host ""
    Write-Host "Environment Variables:" -ForegroundColor Yellow
    Write-Host "  The script will load environment variables from .env file"
    Write-Host "  Copy .env.example to .env and configure your values"
    Write-Host ""
    exit 0
}

Write-Host "==============================================================================" -ForegroundColor Green
Write-Host "NURSING CONFERENCES - STARTING DEVELOPMENT ENVIRONMENT" -ForegroundColor Green
Write-Host "==============================================================================" -ForegroundColor Green
Write-Host ""

# Get the script directory
$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$envFile = Join-Path $scriptDir ".env"

# Function to load environment variables from .env file
function Load-EnvFile {
    param([string]$FilePath)

    if (Test-Path $FilePath) {
        Write-Host "Loading environment variables from .env file..." -ForegroundColor Cyan

        $envVars = @{}
        Get-Content $FilePath | ForEach-Object {
            if ($_ -match '^([^#][^=]+)=(.*)$') {
                $name = $matches[1].Trim()
                $value = $matches[2].Trim()
                # Remove quotes if present
                $value = $value -replace '^["'']|["'']$', ''
                $envVars[$name] = $value
                [Environment]::SetEnvironmentVariable($name, $value, "Process")
            }
        }

        Write-Host "✅ Loaded $($envVars.Count) environment variables" -ForegroundColor Green
        return $envVars
    } else {
        Write-Host "⚠️  No .env file found at: $FilePath" -ForegroundColor Yellow
        Write-Host "   Copy .env.example to .env and configure your values" -ForegroundColor Yellow
        return @{}
    }
}

# Function to validate critical environment variables
function Test-EnvironmentVariables {
    param([hashtable]$EnvVars)

    Write-Host "Validating environment variables..." -ForegroundColor Cyan

    $criticalVars = @(
        "NEXT_PUBLIC_SANITY_PROJECT_ID",
        "NEXT_PUBLIC_SANITY_DATASET",
        "SANITY_API_TOKEN"
    )

    $missing = @()
    $configured = @()

    foreach ($var in $criticalVars) {
        $value = [Environment]::GetEnvironmentVariable($var)
        if ([string]::IsNullOrEmpty($value) -or $value -like "*your_*_here*") {
            $missing += $var
        } else {
            $configured += $var
        }
    }

    if ($configured.Count -gt 0) {
        Write-Host "✅ Configured variables:" -ForegroundColor Green
        $configured | ForEach-Object { Write-Host "   - $_" -ForegroundColor Green }
    }

    if ($missing.Count -gt 0) {
        Write-Host "⚠️  Missing or unconfigured variables:" -ForegroundColor Yellow
        $missing | ForEach-Object { Write-Host "   - $_" -ForegroundColor Yellow }
        Write-Host ""
        Write-Host "Note: Some features may not work without proper configuration" -ForegroundColor Yellow
    }

    return $missing.Count -eq 0
}

# Check if Node.js is installed
Write-Host "Checking system requirements..." -ForegroundColor Cyan
try {
    $nodeVersion = node --version 2>$null
    Write-Host "✅ Node.js version: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ ERROR: Node.js is not installed!" -ForegroundColor Red
    Write-Host "Please install Node.js from https://nodejs.org/" -ForegroundColor Yellow
    Write-Host "Then run this script again." -ForegroundColor Yellow
    Read-Host "Press Enter to exit"
    exit 1
}

# Load environment variables
$envVars = Load-EnvFile -FilePath $envFile

# Validate environment variables (unless skipped)
if (-not $SkipEnvCheck) {
    $envValid = Test-EnvironmentVariables -EnvVars $envVars
}

Write-Host ""
Write-Host "Starting servers..." -ForegroundColor Green
Write-Host ""

# Determine which npm script to use
$frontendScript = if ($Production) { "start" } else { "dev" }
$backendScript = if ($Production) { "start" } else { "dev" }

# Start Frontend Server (Port 3000)
Write-Host "🚀 Starting Frontend Server on port 3000..." -ForegroundColor Cyan
$frontendPath = Join-Path $scriptDir "nextjs-frontend"

# Create frontend startup command with environment variables
$frontendEnvString = ""
if ($envVars.Count -gt 0) {
    $envVars.GetEnumerator() | ForEach-Object {
        $frontendEnvString += "`$env:$($_.Key)='$($_.Value)'; "
    }
}

$frontendCommand = "$frontendEnvString cd '$frontendPath'; npm install; npm run $frontendScript"
Start-Process powershell -ArgumentList "-NoExit", "-Command", $frontendCommand -WindowStyle Normal

# Wait a moment
Start-Sleep -Seconds 3

# Start Backend Server (Port 3333)
Write-Host "🚀 Starting Sanity Backend on port 3333..." -ForegroundColor Cyan
$backendPath = Join-Path $scriptDir "SanityBackend"

# Create backend startup command with environment variables
$backendEnvString = ""
if ($envVars.Count -gt 0) {
    $envVars.GetEnumerator() | ForEach-Object {
        $backendEnvString += "`$env:$($_.Key)='$($_.Value)'; "
    }
}

$backendCommand = "$backendEnvString cd '$backendPath'; npm install; npm run $backendScript"
Start-Process powershell -ArgumentList "-NoExit", "-Command", $backendCommand -WindowStyle Normal

Write-Host ""
Write-Host "==============================================================================" -ForegroundColor Green
Write-Host "🎉 SERVERS STARTED SUCCESSFULLY!" -ForegroundColor Green
Write-Host "==============================================================================" -ForegroundColor Green
Write-Host "📱 Frontend (Next.js):     http://localhost:3000" -ForegroundColor Yellow
Write-Host "🔧 Backend (Sanity CMS):   http://localhost:3333" -ForegroundColor Yellow
Write-Host "📊 Data Population:        http://localhost:3000/populate-sanity-backend" -ForegroundColor Yellow
Write-Host ""
Write-Host "Environment:" -ForegroundColor Cyan
Write-Host "  Mode: $(if ($Production) { 'Production' } else { 'Development' })" -ForegroundColor White
Write-Host "  Env File: $(if (Test-Path $envFile) { '✅ Loaded' } else { '❌ Not Found' })" -ForegroundColor White
Write-Host "  Variables: $($envVars.Count) loaded" -ForegroundColor White
Write-Host ""
Write-Host "💡 Tips:" -ForegroundColor Cyan
Write-Host "  - Both servers will continue running in separate windows" -ForegroundColor White
Write-Host "  - Close the terminal windows to stop the servers" -ForegroundColor White
Write-Host "  - Check the individual terminal windows for detailed logs" -ForegroundColor White
Write-Host "  - Use Ctrl+C in each terminal to stop servers gracefully" -ForegroundColor White
Write-Host ""
Write-Host "Press any key to exit this script (servers will continue running)..." -ForegroundColor Gray
Read-Host
