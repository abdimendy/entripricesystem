# One-time: create GitHub repo + push main (fixes Vercel "branch not found")
# Run: .\scripts\setup-github-and-push.ps1

$ErrorActionPreference = "Stop"
$root = Split-Path $PSScriptRoot -Parent
Set-Location $root

$defaultUser = "abdimendy-3347"
$repoName = "yellowbook-somalia"
$user = Read-Host "GitHub username [$defaultUser]"
if ([string]::IsNullOrWhiteSpace($user)) { $user = $defaultUser }

$remoteUrl = "https://github.com/$user/$repoName.git"
Write-Host ""
Write-Host "BEFORE push — create empty repo on GitHub:" -ForegroundColor Cyan
Write-Host "  1. Open: https://github.com/new" -ForegroundColor White
Write-Host "  2. Name: $repoName  |  Public  |  NO README / NO .gitignore" -ForegroundColor White
Write-Host "  3. Create repository, then press Enter here..." -ForegroundColor White
Read-Host

git remote remove origin 2>$null
git remote add origin $remoteUrl
git branch -M main

Write-Host "Committing all project files..." -ForegroundColor Cyan
git add -A
$null = git diff --cached --quiet 2>$null
if ($LASTEXITCODE -ne 0) {
    git commit -m "Yellow Book — production ready (Vercel + frontend build fix)"
}

Write-Host "Pushing to $remoteUrl ..." -ForegroundColor Cyan
git push -u origin main
if ($LASTEXITCODE -ne 0) {
    Write-Host ""
    Write-Host "Push failed. Use GitHub login / Personal Access Token:" -ForegroundColor Yellow
    Write-Host "  https://github.com/settings/tokens → repo scope" -ForegroundColor Gray
    Write-Host "  git push -u origin main" -ForegroundColor DarkYellow
    exit 1
}

Write-Host ""
Write-Host "SUCCESS. Next in Vercel dashboard:" -ForegroundColor Green
Write-Host "  Project → Settings → Git → Connect → $user/$repoName → branch: main" -ForegroundColor White
Write-Host "  Then Redeploy." -ForegroundColor White
