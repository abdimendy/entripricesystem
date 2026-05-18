# Make https://yellowbook-live.vercel.app work like http://localhost:5175
# Requires: API on :5261 (.\scripts\start-api-neon.ps1)
# Run: .\scripts\sync-vercel-live.ps1

$ErrorActionPreference = 'Stop'
$root = (Join-Path $PSScriptRoot '..') | Resolve-Path

try {
  $null = Invoke-WebRequest -Uri 'http://localhost:5261/api/health' -UseBasicParsing -TimeoutSec 8
} catch {
  Write-Host 'Start API first: .\scripts\start-api-neon.ps1' -ForegroundColor Red
  exit 1
}

Write-Host 'Starting localtunnel to localhost:5261 ...' -ForegroundColor Cyan
$ltLog = Join-Path $env:TEMP 'yb-lt-sync.log'
Remove-Item $ltLog -ErrorAction SilentlyContinue
Start-Process powershell -ArgumentList @(
  '-NoProfile', '-Command',
  "npx --yes localtunnel --port 5261 2>&1 | Tee-Object '$ltLog'"
) -WindowStyle Minimized

$tunnel = $null
for ($i = 0; $i -lt 45; $i++) {
  Start-Sleep -Seconds 2
  if (Test-Path $ltLog) {
    $m = Select-String -Path $ltLog -Pattern 'https://[a-z0-9-]+\.loca\.lt' | Select-Object -Last 1
    if ($m) { $tunnel = $m.Matches[0].Value.TrimEnd('/'); break }
  }
}
if (-not $tunnel) {
  Write-Host "Tunnel failed. See $ltLog" -ForegroundColor Red
  exit 1
}

try {
  $null = Invoke-WebRequest -Uri "$tunnel/api/health" -UseBasicParsing -TimeoutSec 45 -Headers @{ 'Bypass-Tunnel-Reminder' = 'true' }
} catch {
  Write-Host "Tunnel not ready: $tunnel" -ForegroundColor Red
  exit 1
}

Write-Host "[OK] Tunnel: $tunnel" -ForegroundColor Green

@{ apiUrl = '/api' } | ConvertTo-Json | Set-Content (Join-Path $root 'frontend\public\config.json') -Encoding UTF8
# vercel.json must NOT rewrite /api to itself — api/[[...path]].js handles /api/*

Set-Location $root
Write-Host "Setting BACKEND_URL=$tunnel on Vercel ..." -ForegroundColor Cyan
npx vercel env rm BACKEND_URL production --yes 2>$null
echo $tunnel | npx vercel env add BACKEND_URL production 2>&1 | Out-Null

Write-Host 'Deploying yellowbook-live ...' -ForegroundColor Cyan
npx vercel deploy --prod --yes --archive=tgz 2>&1 | Out-Host

Write-Host ''
Write-Host '========================================' -ForegroundColor Green
Write-Host '  https://yellowbook-live.vercel.app' -ForegroundColor Green
Write-Host '  (same data as localhost:5175)' -ForegroundColor Green
Write-Host "  Tunnel: $tunnel" -ForegroundColor Yellow
Write-Host '  Keep API + tunnel running on this PC' -ForegroundColor Yellow
Write-Host '  Login: admin / Admin@123' -ForegroundColor Yellow
Write-Host '========================================' -ForegroundColor Green
