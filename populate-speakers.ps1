# PowerShell script to populate speaker data in Sanity CMS
Write-Host "🎤 Populating Speaker Data in Sanity CMS..." -ForegroundColor Cyan
Write-Host ""
Write-Host "This will create 8 comprehensive speaker profiles:" -ForegroundColor Yellow
Write-Host "- 2 Keynote Speakers (Dr. Maria Rodriguez, Prof. James Chen)" -ForegroundColor Green
Write-Host "- 2 Invited Speakers (Dr. Sarah Kim, Prof. Ahmed Hassan)" -ForegroundColor Green  
Write-Host "- 1 Plenary Speaker (Dr. Lisa Wang-Chen)" -ForegroundColor Green
Write-Host "- 1 Session Speaker (Dr. Michael Thompson)" -ForegroundColor Green
Write-Host "- 1 Workshop Leader (Dr. Elena Petrov)" -ForegroundColor Green
Write-Host "- 1 Panel Moderator (Prof. David Johnson)" -ForegroundColor Green
Write-Host ""
Write-Host "Make sure both servers are running:" -ForegroundColor Yellow
Write-Host "1. Sanity Backend: http://localhost:3333" -ForegroundColor White
Write-Host "2. Next.js Frontend: http://localhost:3000" -ForegroundColor White
Write-Host ""
Read-Host "Press Enter to continue..."

Write-Host ""
Write-Host "Running speaker data population script..." -ForegroundColor Cyan
Write-Host "Current directory: $PWD" -ForegroundColor Gray

# Change to SanityBackend directory
$scriptPath = Split-Path -Parent $MyInvocation.MyCommand.Path
$sanityPath = Join-Path $scriptPath "SanityBackend"

if (Test-Path $sanityPath) {
    Set-Location $sanityPath
    Write-Host "Changed to: $PWD" -ForegroundColor Gray
    Write-Host ""
    
    # Check if Node.js is available
    Write-Host "Checking if Node.js is available..." -ForegroundColor Yellow
    try {
        $nodeVersion = node --version 2>$null
        if ($nodeVersion) {
            Write-Host "✅ Node.js found: $nodeVersion" -ForegroundColor Green
        } else {
            throw "Node.js not found"
        }
    } catch {
        Write-Host "❌ Node.js not found in PATH" -ForegroundColor Red
        Write-Host "Please install Node.js or add it to your PATH" -ForegroundColor Yellow
        Write-Host "You can download it from: https://nodejs.org/" -ForegroundColor White
        Read-Host "Press Enter to exit..."
        exit 1
    }
    
    Write-Host ""
    Write-Host "Running create-speaker-data.js..." -ForegroundColor Cyan
    
    # Run the speaker data creation script
    try {
        node create-speaker-data.js
        if ($LASTEXITCODE -eq 0) {
            Write-Host ""
            Write-Host "✅ Speaker data population complete!" -ForegroundColor Green
            Write-Host ""
            Write-Host "Next steps:" -ForegroundColor Yellow
            Write-Host "1. Visit http://localhost:3333/structure/speakers to see speakers in Sanity Studio" -ForegroundColor White
            Write-Host "2. Visit http://localhost:3000/speakers to see the speakers page" -ForegroundColor White
            Write-Host "3. Upload profile images for each speaker in Sanity Studio" -ForegroundColor White
            Write-Host "4. Test the filtering and modal functionality" -ForegroundColor White
        } else {
            throw "Script execution failed"
        }
    } catch {
        Write-Host ""
        Write-Host "❌ Error occurred during speaker data population" -ForegroundColor Red
        Write-Host "Please check the error messages above" -ForegroundColor Yellow
        Write-Host ""
        Write-Host "Alternative methods:" -ForegroundColor Yellow
        Write-Host "1. Manual entry via Sanity Studio: http://localhost:3333/structure/speakers" -ForegroundColor White
        Write-Host "2. Follow the guide: SPEAKER_DATA_POPULATION_GUIDE.md" -ForegroundColor White
    }
} else {
    Write-Host "❌ SanityBackend directory not found at: $sanityPath" -ForegroundColor Red
    Write-Host "Please make sure you're running this script from the correct directory" -ForegroundColor Yellow
}

Write-Host ""
Read-Host "Press Enter to exit..."
