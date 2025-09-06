# PowerShell script to update remaining Sanity credentials
Write-Host "Updating remaining Sanity credentials..." -ForegroundColor Cyan

# Files to update with their patterns
$filesToUpdate = @(
    @{ File = "populate-sponsorship-test-data.js"; Pattern = "n3no08m3"; Replacement = "zt8218vh" },
    @{ File = "verify-cleanup.js"; Pattern = "n3no08m3"; Replacement = "zt8218vh" },
    @{ File = "test-registration-api.js"; Pattern = "n3no08m3"; Replacement = "zt8218vh" },
    @{ File = "test-sanity-speed.js"; Pattern = "n3no08m3"; Replacement = "zt8218vh" },
    @{ File = "test-sanity-write-permissions.js"; Pattern = "n3no08m3"; Replacement = "zt8218vh" },
    @{ File = "update-categories-simple.js"; Pattern = "n3no08m3"; Replacement = "zt8218vh" },
    @{ File = "update-content-field.js"; Pattern = "n3no08m3"; Replacement = "zt8218vh" },
    @{ File = "validate-schema.js"; Pattern = "n3no08m3"; Replacement = "zt8218vh" },
    @{ File = "verify-period-pricing-sanity.js"; Pattern = "n3no08m3"; Replacement = "zt8218vh" },
    @{ File = "cleanup-test-registrations.js"; Pattern = "n3no08m3"; Replacement = "zt8218vh" },
    @{ File = "DEPLOYMENT_CONFIG.md"; Pattern = "n3no08m3"; Replacement = "zt8218vh" }
)

foreach ($fileInfo in $filesToUpdate) {
    $filePath = $fileInfo.File
    if (Test-Path $filePath) {
        Write-Host "Updating $filePath..." -ForegroundColor Yellow
        $content = Get-Content $filePath -Raw
        $updatedContent = $content -replace $fileInfo.Pattern, $fileInfo.Replacement
        Set-Content $filePath -Value $updatedContent -NoNewline
        Write-Host "Updated $filePath" -ForegroundColor Green
    } else {
        Write-Host "File not found: $filePath" -ForegroundColor Red
    }
}

Write-Host "Credential update completed!" -ForegroundColor Green
