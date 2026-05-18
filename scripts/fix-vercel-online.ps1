# Fix 404 /api on https://yellowbook-live.vercel.app
# Requires: API on :5261 (.\scripts\start-api-neon.ps1)
# Run: .\scripts\fix-vercel-online.ps1

$ErrorActionPreference = 'Stop'
$root = (Join-Path $PSScriptRoot '..') | Resolve-Path
$vercelJson = Join-Path $root 'vercel.json'
$log = Join-Path $env:TEMP 'yb-lt.log'

try {
  $null = Invoke-WebRequest -Uri 'http://localhost:5261/api/health' -UseBasicParsing -TimeoutSec 8
} catch {
  Write-Host 'Start API: .\scripts\start-api-neon.ps1' -ForegroundColor Red
  exit 1
}

Write-Host 'Starting Cloudflare tunnel...' -ForegroundColor Cyan
Remove-Item $log -ErrorAction SilentlyContinue
Start-Process powershell -ArgumentList @(
  '-NoProfile', '-Command',
  "npx --yes cloudflared tunnel --url http://127.0.0.1:5261 2>&1 | Tee-Object '$log'"
) -WindowStyle Minimized

$tunnel = $null
for ($i = 0; $i -lt 50; $i++) {
  Start-Sleep -Seconds 2
  if (Test-Path $log) {
    $m = Select-String -Path $log -Pattern 'https://[a-z0-9-]+\.trycloudflare\.com' | Select-Object -Last 1
    if ($m) { $tunnel = $m.Matches[0].Value.TrimEnd('/'); break }
  }
}
if (-not $tunnel) { Write-Host "Tunnel failed. See $log" -ForegroundColor Red; exit 1 }

try {
  $null = Invoke-WebRequest -Uri "$tunnel/api/health" -UseBasicParsing -TimeoutSec 30
} catch {
  Write-Host "Tunnel not ready: $tunnel" -ForegroundColor Red
  exit 1
}

Write-Host "[OK] $tunnel" -ForegroundColor Green

@{ apiUrl = '/api' } | ConvertTo-Json | Set-Content (Join-Path $root 'frontend\public\config.json') -Encoding UTF8
# vercel.json must NOT rewrite /api to itself — api/[[...path]].js handles /api/*

Set-Location $root
Write-Host "Setting BACKEND_URL=$tunnel on Vercel ..." -ForegroundColor Cyan
npx vercel env rm BACKEND_URL production --yes 2>$null
echo $tunnel | npx vercel env add BACKEND_URL production 2>&1 | Out-Null

Write-Host 'Deploying Vercel...' -ForegroundColor Cyan
npx vercel deploy --prod --yes --scope mahdi-abdi 2>&1 | Out-Host

Write-Host ''
Write-Host 'https://yellowbook-live.vercel.app  (Ctrl+Shift+R)' -ForegroundColor Green
Write-Host "Tunnel: $tunnel" -ForegroundColor Yellow
Write-Host 'Keep API + localtunnel running on this PC' -ForegroundColor Yellow
