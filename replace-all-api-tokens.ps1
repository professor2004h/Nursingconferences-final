# Replace All API Tokens Script
Write-Host "🔄 REPLACING ALL API TOKENS WITH NEW TOKEN..." -ForegroundColor Cyan
Write-Host ""

$oldApiToken = 'sk0GQKtnjRSE2G2rBjwZwbm5MxW5um7sYAXSX4L9tkIvkP8RSAnV5RfABNtIKcfnawrjSyBwb1pem0LbDX4eBDUSh44Rk55GjJV7ellaWXCm5SD8NDujbzay3MeHLHxVygMain1FyEuigX3qPdRcYM9TQzgCA0MGwinjRybhmcByyWfcrs9Q'
$newApiToken = 'skJo4iwMzLtavnRYqibHHTzDqOJc5UJTQE9JCv066MM6vWDFE6XEZBnV2XZTzbxE8BKTawmfQhPE2ZPwrLNP7CokAwUlJN5VeQWLuUiLFeZQfyiXeDdkAShynpyk1v4jWmcNAZDvph2QCuCFcJko5q0XAf123nDHp9VF4oRr7NnJh1NkEa6V'

# Get all files that might contain the old API token
$files = Get-ChildItem -Path . -Recurse -File | Where-Object { 
    $_.Extension -match '\.(js|ts|tsx|jsx|md|yaml|yml|json|env)$' -and 
    $_.Name -notmatch 'node_modules|\.git|\.zip|\.tar\.gz|replace-all-api-tokens' 
}

$updatedFiles = 0
$totalReplacements = 0

Write-Host "📋 Files to check: $($files.Count)" -ForegroundColor Yellow
Write-Host ""

foreach ($file in $files) {
    try {
        $content = Get-Content $file.FullName -Raw -ErrorAction SilentlyContinue
        if ($content -and $content -match [regex]::Escape($oldApiToken)) {
            $newContent = $content -replace [regex]::Escape($oldApiToken), $newApiToken
            Set-Content $file.FullName -Value $newContent -NoNewline
            Write-Host "✅ Updated: $($file.Name)" -ForegroundColor Green
            $updatedFiles++
            
            # Count how many replacements were made in this file
            $matches = [regex]::Matches($content, [regex]::Escape($oldApiToken))
            $totalReplacements += $matches.Count
        }
    }
    catch {
        Write-Host "❌ Error processing $($file.Name): $($_.Exception.Message)" -ForegroundColor Red
    }
}

Write-Host ""
Write-Host "🎉 API TOKEN REPLACEMENT COMPLETED!" -ForegroundColor Green
Write-Host "📊 Files updated: $updatedFiles" -ForegroundColor Yellow
Write-Host "🔄 Total replacements: $totalReplacements" -ForegroundColor Yellow
Write-Host ""
Write-Host "🔑 Old Token: sk0GQKtnjRSE2G2rBjwZwbm5MxW5um7s..." -ForegroundColor Red
Write-Host "🔑 New Token: skJo4iwMzLtavnRYqibHHTzDqOJc5UJTQE9JCv066MM6..." -ForegroundColor Green
Write-Host ""
Write-Host "✅ All API tokens have been successfully updated!" -ForegroundColor Green
