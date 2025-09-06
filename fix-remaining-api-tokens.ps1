# Fix remaining API tokens script
Write-Host "Fixing remaining API tokens..." -ForegroundColor Cyan

$oldApiToken = 'skIrRjdaaygkwN7mE9JXLLV8IUPfHl2phKAu0umRR5eCLYuRw4oFi4kXfh3kXa0xxHHJZcv451AY6SFMxGuLWbHUMrPjxppFxA0NAFwgrkEZggVUYPJ3jtKA76br4f07USUJMDOR1JQoS7U0vSsiJzCp8q2CwgAcHiksA7H4FrN04Vh3kC3c'
$newApiToken = 'sk0GQKtnjRSE2G2rBjwZwbm5MxW5um7sYAXSX4L9tkIvkP8RSAnV5RfABNtIKcfnawrjSyBwb1pem0LbDX4eBDUSh44Rk55GjJV7ellaWXCm5SD8NDujbzay3MeHLHxVygMain1FyEuigX3qPdRcYM9TQzgCA0MGwinjRybhmcByyWfcrs9Q'

# Get all files that might contain the old API token
$files = Get-ChildItem -Path . -Recurse -File | Where-Object { 
    $_.Extension -match '\.(js|ts|tsx|jsx|md|yaml|yml|json|env)$' -and 
    $_.Name -notmatch 'node_modules|\.git|\.zip|\.tar\.gz|fix-remaining-api-tokens' 
}

$updatedFiles = 0

foreach ($file in $files) {
    try {
        $content = Get-Content $file.FullName -Raw -ErrorAction SilentlyContinue
        if ($content -and $content -match [regex]::Escape($oldApiToken)) {
            $newContent = $content -replace [regex]::Escape($oldApiToken), $newApiToken
            Set-Content $file.FullName -Value $newContent -NoNewline
            Write-Host "Updated: $($file.Name)" -ForegroundColor Green
            $updatedFiles++
        }
    }
    catch {
        Write-Host "Error processing $($file.Name): $($_.Exception.Message)" -ForegroundColor Red
    }
}

Write-Host "API token cleanup completed!" -ForegroundColor Green
Write-Host "Files updated: $updatedFiles" -ForegroundColor Yellow
