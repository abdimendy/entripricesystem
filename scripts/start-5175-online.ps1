# Temporary online tunnel for localhost:5175 — run: .\scripts\start-5175-online.ps1
# Link changes each time; PC must stay on. For permanent 24/7 link run: .\scripts\deploy-permanent.ps1
# Permanent URL: https://yellowbook-somalia.vercel.app

$ErrorActionPreference = "Stop"
$root = Split-Path $PSScriptRoot -Parent
$apiDir = Join-Path $root "backend\YellowBook.API"
$feDir = Join-Path $root "frontend"
$apiLog = Join-Path $env:TEMP "yb-api-tunnel.log"
$feLog = Join-Path $env:TEMP "yb-fe-tunnel.log"

Write-Host "Starting API (5261)..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$apiDir'; dotnet run" -WindowStyle Minimized

Write-Host "Starting Vite dev (5175)..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$feDir'; npm run dev" -WindowStyle Minimized

Start-Sleep -Seconds 15

Remove-Item $apiLog, $feLog -ErrorAction SilentlyContinue
Start-Process powershell -ArgumentList "-NoExit", "-Command", "npx --yes cloudflared tunnel --url http://127.0.0.1:5261 2>&1 | Tee-Object '$apiLog'" -WindowStyle Minimized
Start-Process powershell -ArgumentList "-NoExit", "-Command", "npx --yes cloudflared tunnel --url http://127.0.0.1:5175 2>&1 | Tee-Object '$feLog'" -WindowStyle Minimized

$apiUrl = $null
$siteUrl = $null
for ($i = 0; $i -lt 45; $i++) {
  Start-Sleep -Seconds 2
  if (Test-Path $apiLog) {
    $m = Select-String -Path $apiLog -Pattern "https://[a-z0-9-]+\.trycloudflare\.com" | Select-Object -Last 1
    if ($m) { $apiUrl = $m.Matches[0].Value }
  }
  if (Test-Path $feLog) {
    $m = Select-String -Path $feLog -Pattern "https://[a-z0-9-]+\.trycloudflare\.com" | Select-Object -Last 1
    if ($m) { $siteUrl = $m.Matches[0].Value }
  }
  if ($apiUrl -and $siteUrl) { break }
}

if (-not $apiUrl -or -not $siteUrl) {
  Write-Host "Tunnel failed. Check logs in %TEMP%" -ForegroundColor Red
  exit 1
}

$apiBase = "$apiUrl/api"
@{ apiUrl = $apiBase } | ConvertTo-Json | Set-Content (Join-Path $feDir "public\config.json") -Encoding UTF8

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "  ONLINE (same as localhost:5175):" -ForegroundColor Green
Write-Host "  $siteUrl" -ForegroundColor Green
Write-Host "  LOGIN: $siteUrl/login" -ForegroundColor Green
Write-Host "  API:   $apiBase" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host "Permanent (no PC needed): https://yellowbook-somalia.vercel.app" -ForegroundColor Cyan
Write-Host "admin / Admin@123" -ForegroundColor Yellow
