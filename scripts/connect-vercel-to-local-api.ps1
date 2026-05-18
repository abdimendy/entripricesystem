# Connect https://yellowbook-live.vercel.app to your local API (Neon) via Cloudflare tunnel
# Requires: API running on http://localhost:5261 (.\scripts\start-api-neon.ps1)
# Run: .\scripts\connect-vercel-to-local-api.ps1

$ErrorActionPreference = 'Stop'
$root = (Join-Path $PSScriptRoot '..') | Resolve-Path
$log = Join-Path $env:TEMP 'yb-cloudflared.log'

try {
  $h = Invoke-WebRequest -Uri 'http://localhost:5261/api/health' -UseBasicParsing -TimeoutSec 5
  if ($h.StatusCode -ne 200) { throw 'API not healthy' }
} catch {
  Write-Host 'Start API first: .\scripts\start-api-neon.ps1' -ForegroundColor Red
  exit 1
}

Write-Host 'Starting tunnel to localhost:5261 ...' -ForegroundColor Cyan
Remove-Item $log -ErrorAction SilentlyContinue
Start-Process powershell -ArgumentList @(
  '-NoProfile', '-Command',
  "npx --yes cloudflared tunnel --url http://127.0.0.1:5261 2>&1 | Tee-Object '$log'"
) -WindowStyle Minimized

$apiUrl = $null
for ($i = 0; $i -lt 45; $i++) {
  Start-Sleep -Seconds 2
  if (Test-Path $log) {
    $m = Select-String -Path $log -Pattern 'https://[a-z0-9-]+\.trycloudflare\.com' | Select-Object -Last 1
    if ($m) { $apiUrl = $m.Matches[0].Value; break }
  }
}

if (-not $apiUrl) {
  Write-Host "Tunnel failed. See $log" -ForegroundColor Red
  exit 1
}

Write-Host "Tunnel: $apiUrl" -ForegroundColor Green
Set-Location $root

$apiBase = "$apiUrl/api"
$configPath = Join-Path $root 'frontend\public\config.json'
@{ apiUrl = $apiBase } | ConvertTo-Json | Set-Content $configPath -Encoding UTF8
Write-Host "Updated config.json -> $apiBase" -ForegroundColor Cyan

Write-Host 'Redeploying yellowbook-live ...' -ForegroundColor Cyan
npx vercel deploy --prod --yes --scope mahdi-abdi 2>&1

Write-Host ''
Write-Host '========================================' -ForegroundColor Green
Write-Host '  https://yellowbook-live.vercel.app' -ForegroundColor Green
Write-Host "  API tunnel: $apiUrl" -ForegroundColor Green
Write-Host '  Keep API + tunnel running on this PC' -ForegroundColor Yellow
Write-Host '========================================' -ForegroundColor Green
