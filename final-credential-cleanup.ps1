# Final comprehensive credential cleanup script
Write-Host "Starting final credential cleanup..." -ForegroundColor Cyan

# Get all files that might contain credentials
$files = Get-ChildItem -Path . -Recurse -File | Where-Object { 
    $_.Extension -match '\.(js|ts|tsx|jsx|md|yaml|yml|json|env)$' -and 
    $_.Name -notmatch 'node_modules|\.git|\.zip|\.tar\.gz|update-remaining-credentials|final-credential-cleanup' 
}

$oldProjectIds = @('n3no08m3', 'tq1qdk3m')
$newProjectId = 'zt8218vh'
$oldApiToken = 'skm5Vr6I3J2tGwXbH5VE34OrEZd2YsVkMv8ZOTvxEhLE2YVsABikeolCIUOyVP3vpBPBu1IcEWaIPyXpoJPUGCtq7PYrMb1tBTlxK3GozsWLLVOrLlbn1htqdDFnLLeBciCS3H13s8UhkYaEOwSBCOIRSZDpC8cpRCphSQw18umo9dfGFGGq'
$newApiToken = 'sk0GQKtnjRSE2G2rBjwZwbm5MxW5um7sYAXSX4L9tkIvkP8RSAnV5RfABNtIKcfnawrjSyBwb1pem0LbDX4eBDUSh44Rk55GjJV7ellaWXCm5SD8NDujbzay3MeHLHxVygMain1FyEuigX3qPdRcYM9TQzgCA0MGwinjRybhmcByyWfcrs9Q'

$updatedFiles = 0
$totalReplacements = 0

foreach ($file in $files) {
    $content = Get-Content $file.FullName -Raw -ErrorAction SilentlyContinue
    if ($content) {
        $originalContent = $content
        $fileUpdated = $false
        
        # Replace old project IDs
        foreach ($oldId in $oldProjectIds) {
            if ($content -match $oldId) {
                $content = $content -replace $oldId, $newProjectId
                $fileUpdated = $true
                $totalReplacements++
            }
        }
        
        # Replace old API token
        if ($content -match [regex]::Escape($oldApiToken)) {
            $content = $content -replace [regex]::Escape($oldApiToken), $newApiToken
            $fileUpdated = $true
            $totalReplacements++
        }
        
        # Write back if changed
        if ($fileUpdated -and $content -ne $originalContent) {
            Set-Content $file.FullName -Value $content -NoNewline
            Write-Host "Updated: $($file.Name)" -ForegroundColor Green
            $updatedFiles++
        }
    }
}

Write-Host "Cleanup completed!" -ForegroundColor Green
Write-Host "Files updated: $updatedFiles" -ForegroundColor Yellow
Write-Host "Total replacements: $totalReplacements" -ForegroundColor Yellow
