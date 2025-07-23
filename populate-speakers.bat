@echo off
echo 🎤 Populating Speaker Data in Sanity CMS...
echo.
echo This will create 8 comprehensive speaker profiles:
echo - 2 Keynote Speakers (Dr. Maria Rodriguez, Prof. James Chen)
echo - 2 Invited Speakers (Dr. Sarah Kim, Prof. Ahmed Hassan)
echo - 1 Plenary Speaker (Dr. Lisa Wang-Chen)
echo - 1 Session Speaker (Dr. Michael Thompson)
echo - 1 Workshop Leader (Dr. Elena Petrov)
echo - 1 Panel Moderator (Prof. David Johnson)
echo.
echo Make sure both servers are running:
echo 1. Sanity Backend: http://localhost:3333
echo 2. Next.js Frontend: http://localhost:3000
echo.
pause
echo.
echo Running speaker data population script...
echo Current directory: %CD%
cd /d "%~dp0SanityBackend"
echo Changed to: %CD%
echo.
echo Checking if Node.js is available...
where node >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Node.js not found in PATH
    echo Please install Node.js or add it to your PATH
    echo You can download it from: https://nodejs.org/
    pause
    exit /b 1
)
echo ✅ Node.js found
echo.
echo Running create-speaker-data.js...
node create-speaker-data.js
if %ERRORLEVEL% EQU 0 (
    echo.
    echo ✅ Speaker data population complete!
    echo.
    echo Next steps:
    echo 1. Visit http://localhost:3333/structure/speakers to see speakers in Sanity Studio
    echo 2. Visit http://localhost:3000/speakers to see the speakers page
    echo 3. Upload profile images for each speaker in Sanity Studio
    echo 4. Test the filtering and modal functionality
) else (
    echo.
    echo ❌ Error occurred during speaker data population
    echo Please check the error messages above
    echo.
    echo Alternative methods:
    echo 1. Manual entry via Sanity Studio: http://localhost:3333/structure/speakers
    echo 2. Follow the guide: SPEAKER_DATA_POPULATION_GUIDE.md
)
echo.
pause
