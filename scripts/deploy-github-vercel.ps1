# Deploy Yellow Book online — same experience as http://localhost:5175
# Run from repo root: .\scripts\deploy-github-vercel.ps1

$ErrorActionPreference = 'Stop'
$root = (Join-Path $PSScriptRoot '..') | Resolve-Path
Set-Location $root

$RenderApi = 'https://yellowbook-api.onrender.com'
$VercelProject = 'fullsystem-7med'
$PrimaryUrl = 'https://fullsystem-7med.vercel.app'
$FallbackUrl = 'https://yellowbook-somalia.vercel.app'

function Test-GitRemote {
    git ls-remote origin HEAD 2>$null | Out-Null
    return $LASTEXITCODE -eq 0
}

function Test-UrlOk($url, $timeoutSec = 15) {
    try {
        $null = Invoke-WebRequest -Uri $url -UseBasicParsing -TimeoutSec $timeoutSec
        return $true
    } catch {
        return $false
    }
}

# Same as localhost:5175 — frontend calls /api (Vercel serverless or BACKEND_URL proxy)
@{ apiUrl = '/api' } | ConvertTo-Json | Set-Content (Join-Path $root 'frontend\public\config.json') -Encoding UTF8

Write-Host 'Installing + building frontend...' -ForegroundColor Cyan
npm ci --prefix frontend 2>$null
if ($LASTEXITCODE -ne 0) { npm install --prefix frontend }
npm run build
if ($LASTEXITCODE -ne 0) { throw 'Build failed.' }

if (-not (Test-GitRemote)) {
    Write-Host ''
    Write-Host 'GitHub repo not found — run first:' -ForegroundColor Red
    Write-Host '  .\scripts\setup-github-and-push.ps1' -ForegroundColor Yellow
    exit 1
}

Write-Host 'Pushing to GitHub (main)...' -ForegroundColor Cyan
git add vercel.json package.json frontend/package.json frontend/package-lock.json frontend/public/config.json scripts/deploy-github-vercel.ps1 2>$null
$null = git diff --cached --quiet 2>$null
if ($LASTEXITCODE -ne 0) {
    git commit -m 'Fix Vercel deploy: repo root, SPA rewrites, api/ included'
}
git push -u origin main
if ($LASTEXITCODE -ne 0) { throw 'git push failed. Run .\scripts\setup-github-and-push.ps1' }
Write-Host 'GitHub push OK.' -ForegroundColor Green

# --- Vercel CLI (required for yellowbooks.vercel.app — Git push alone does not fix a broken alias) ---
Write-Host 'Deploying to Vercel (repo root — NOT frontend/)...' -ForegroundColor Cyan
npx vercel link --yes --project $VercelProject 2>$null
# Do NOT use --archive=tgz: dist/ is gitignored and would ship an empty site (NOT_FOUND).
$deployOut = npx vercel deploy --prod --yes 2>&1 | Out-String
if ($LASTEXITCODE -ne 0) { throw "Vercel deploy failed.`n$deployOut" }
$deployUrl = ($deployOut | Select-String -Pattern 'https://[a-z0-9-]+\.vercel\.app' -AllMatches | Select-Object -Last 1).Matches[0].Value
Write-Host "Deployment: $deployUrl" -ForegroundColor Gray

# Point yellowbooks.vercel.app at this deployment (fixes platform NOT_FOUND)
Write-Host "Aliasing $PrimaryUrl ..." -ForegroundColor Cyan
npx vercel alias set $deployUrl fullsystem-7med.vercel.app 2>&1 | Out-Null

# Optional: live Neon/DB via Render (same data model as localhost when API is up)
Write-Host "Checking Render API ($RenderApi)..." -ForegroundColor Cyan
if (Test-UrlOk "$RenderApi/api/health" 45) {
    Write-Host 'Render API is up — setting BACKEND_URL on Vercel.' -ForegroundColor Green
    npx vercel env rm BACKEND_URL production --yes 2>$null
    $RenderApi | npx vercel env add BACKEND_URL production 2>&1 | Out-Null
    npx vercel deploy --prod --yes 2>&1 | Out-Null
} else {
    Write-Host 'Render API asleep or unreachable — using bundled demo /api on Vercel.' -ForegroundColor Yellow
    Write-Host 'For 100% DB + login like localhost: wake Render or run .\scripts\sync-vercel-live.ps1' -ForegroundColor Yellow
}

Write-Host ''
Write-Host '========================================' -ForegroundColor Green
Write-Host '  ONLINE (should match localhost:5175):' -ForegroundColor Green
Write-Host "  $PrimaryUrl" -ForegroundColor Green
Write-Host "  $FallbackUrl" -ForegroundColor Green
Write-Host '  Login: admin / Admin@123' -ForegroundColor Yellow
Write-Host '========================================' -ForegroundColor Green
Write-Host 'Vercel dashboard: Root Directory must be EMPTY (repo root).' -ForegroundColor DarkGray

# Quick smoke test
Start-Sleep -Seconds 3
foreach ($u in @($PrimaryUrl, $FallbackUrl, 'https://yellowbooks.vercel.app')) {
    $ok = (Test-UrlOk "$u/") -and (Test-UrlOk "$u/businesses")
    if ($ok) { Write-Host "[OK] $u" -ForegroundColor Green }
    else { Write-Host "[?] $u — wait 30s and refresh, or check Vercel deployment logs" -ForegroundColor Yellow }
}
