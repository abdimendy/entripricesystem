# Deploy Yellow Book to permanent online URL (Vercel production).

# Run from repo root: .\scripts\deploy-permanent.ps1



$ErrorActionPreference = "Stop"

$root = Split-Path $PSScriptRoot -Parent

Set-Location $root



Write-Host "Building frontend..." -ForegroundColor Cyan

Push-Location frontend

npm run build

Pop-Location



Write-Host "Deploying to Vercel production..." -ForegroundColor Cyan

npx vercel deploy --prod --yes



Write-Host ""

Write-Host "========================================" -ForegroundColor Green

Write-Host "  PERMANENT LINK (24/7, no PC needed):" -ForegroundColor Green

Write-Host "  https://yellowbook-somalia.vercel.app" -ForegroundColor Green

Write-Host "  LOGIN: https://yellowbook-somalia.vercel.app/login" -ForegroundColor Green

Write-Host "========================================" -ForegroundColor Green

Write-Host "Local dev only: http://localhost:5175" -ForegroundColor DarkGray


