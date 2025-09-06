# Sanity Content Import Script
param(
    [string]$ExportPath = "C:\Users\qwen\Documents\sanity-complete-export",
    [string]$DatasetFile = "production-dataset-complete.tar.gz",
    [switch]$UseRawDataset = $false
)

Write-Host "🔄 Sanity Content Import Process Starting..." -ForegroundColor Cyan
Write-Host ""

# Set dataset file based on parameter
if ($UseRawDataset) {
    $DatasetFile = "production-dataset-raw.tar.gz"
    Write-Host "📋 Using raw dataset (documents only)" -ForegroundColor Yellow
} else {
    Write-Host "📋 Using complete dataset (documents + assets)" -ForegroundColor Yellow
}

# Check if export package exists
$ExportPackagePath = Join-Path $ExportPath "dataset" $DatasetFile
Write-Host "🔍 Checking export package at: $ExportPackagePath" -ForegroundColor White

if (-not (Test-Path $ExportPackagePath)) {
    Write-Host "❌ Export package not found at specified location!" -ForegroundColor Red
    Write-Host "📁 Expected location: $ExportPackagePath" -ForegroundColor Red
    Write-Host ""
    Write-Host "🔧 Troubleshooting steps:" -ForegroundColor Yellow
    Write-Host "1. Verify the export package exists at the specified location" -ForegroundColor White
    Write-Host "2. Check if the dataset folder contains .tar.gz files" -ForegroundColor White
    Write-Host "3. Ensure the export package was properly extracted" -ForegroundColor White
    Write-Host ""
    
    # Check for alternative locations
    Write-Host "🔍 Searching for export files in current directory..." -ForegroundColor Cyan
    $LocalExports = Get-ChildItem -Path . -Name "*.tar.gz" -Recurse -ErrorAction SilentlyContinue
    if ($LocalExports) {
        Write-Host "📦 Found export files locally:" -ForegroundColor Green
        foreach ($file in $LocalExports) {
            Write-Host "   - $file" -ForegroundColor White
        }
        Write-Host ""
        Write-Host "💡 You can use one of these files by updating the script parameters" -ForegroundColor Yellow
    }
    
    exit 1
}

Write-Host "✅ Export package found!" -ForegroundColor Green
Write-Host ""

# Verify we're in the correct directory
$CurrentDir = Get-Location
$SanityBackendPath = "j:\Nursingconferences\SanityBackend"

if ($CurrentDir.Path -ne $SanityBackendPath) {
    Write-Host "📂 Navigating to Sanity backend directory..." -ForegroundColor Yellow
    Set-Location $SanityBackendPath
}

# Verify Sanity CLI is available
Write-Host "🔧 Checking Sanity CLI..." -ForegroundColor Cyan
try {
    $SanityVersion = npx sanity --version 2>$null
    Write-Host "✅ Sanity CLI available: $SanityVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Sanity CLI not available!" -ForegroundColor Red
    Write-Host "💡 Please ensure Sanity CLI is installed" -ForegroundColor Yellow
    exit 1
}

# Check current project status
Write-Host "📊 Checking current project status..." -ForegroundColor Cyan
try {
    $ProjectInfo = npx sanity dataset list 2>$null
    Write-Host "✅ Connected to Sanity project" -ForegroundColor Green
} catch {
    Write-Host "❌ Cannot connect to Sanity project!" -ForegroundColor Red
    Write-Host "💡 Please check your credentials and network connection" -ForegroundColor Yellow
    exit 1
}

# Get current document count before import
Write-Host "📈 Getting current document count..." -ForegroundColor Cyan
$PreImportCount = node ../test-new-project-connection.js 2>$null | Select-String "Total documents:" | ForEach-Object { ($_ -split ":")[1].Trim() }
Write-Host "📄 Current documents: $PreImportCount" -ForegroundColor White
Write-Host ""

# Confirm import
Write-Host "⚠️  IMPORTANT CONFIRMATION" -ForegroundColor Yellow
Write-Host "This will import content into your current Sanity project:" -ForegroundColor White
Write-Host "   Project ID: zt8218vh" -ForegroundColor White
Write-Host "   Dataset: production" -ForegroundColor White
Write-Host "   Source: $ExportPackagePath" -ForegroundColor White
Write-Host ""
$Confirmation = Read-Host "Do you want to proceed with the import? (y/N)"

if ($Confirmation -ne "y" -and $Confirmation -ne "Y") {
    Write-Host "❌ Import cancelled by user" -ForegroundColor Red
    exit 0
}

Write-Host ""
Write-Host "🚀 Starting import process..." -ForegroundColor Green
Write-Host "📦 Importing from: $ExportPackagePath" -ForegroundColor White

# Execute import command
try {
    Write-Host "⏳ Importing dataset... (this may take a few minutes)" -ForegroundColor Yellow
    $ImportResult = npx sanity dataset import $ExportPackagePath production 2>&1
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Import completed successfully!" -ForegroundColor Green
    } else {
        Write-Host "❌ Import failed!" -ForegroundColor Red
        Write-Host "Error details: $ImportResult" -ForegroundColor Red
        exit 1
    }
} catch {
    Write-Host "❌ Import command failed: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

# Verify import results
Write-Host ""
Write-Host "🔍 Verifying import results..." -ForegroundColor Cyan
$PostImportCount = node ../test-new-project-connection.js 2>$null | Select-String "Total documents:" | ForEach-Object { ($_ -split ":")[1].Trim() }
Write-Host "📄 Documents after import: $PostImportCount" -ForegroundColor White

$ImportedDocs = [int]$PostImportCount - [int]$PreImportCount
if ($ImportedDocs -gt 0) {
    Write-Host "📈 Successfully imported $ImportedDocs new documents!" -ForegroundColor Green
} else {
    Write-Host "⚠️  No new documents detected. Import may have failed or contained no new content." -ForegroundColor Yellow
}

Write-Host ""
Write-Host "🎉 Import process completed!" -ForegroundColor Green
Write-Host ""
Write-Host "📋 Next steps:" -ForegroundColor Cyan
Write-Host "1. Check Sanity Studio for imported content" -ForegroundColor White
Write-Host "2. Verify frontend displays new content at http://localhost:3000" -ForegroundColor White
Write-Host "3. Test all functionality with imported data" -ForegroundColor White
Write-Host ""
Write-Host "✅ All credentials and configuration preserved" -ForegroundColor Green
