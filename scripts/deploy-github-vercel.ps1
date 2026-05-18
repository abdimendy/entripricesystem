# Deploy Yellow Book online (Vercel + GitHub)
# Run from repo root: .\scripts\deploy-github-vercel.ps1

$ErrorActionPreference = "Stop"
$root = Split-Path $PSScriptRoot -Parent
Set-Location $root

function Test-GitRemote {
    $url = (git remote get-url origin 2>$null)
    if (-not $url) { return $false }
    git ls-remote origin HEAD 2>$null | Out-Null
    return $LASTEXITCODE -eq 0
}

Write-Host "Installing frontend dependencies..." -ForegroundColor Cyan
npm ci --prefix frontend 2>$null
if ($LASTEXITCODE -ne 0) { npm install --prefix frontend }

Write-Host "Testing production build..." -ForegroundColor Cyan
npm run build
if ($LASTEXITCODE -ne 0) { throw "Build failed — fix errors before deploying." }

# --- Git push (optional if remote exists) ---
$remoteOk = Test-GitRemote
if (-not $remoteOk) {
    Write-Host ""
    Write-Host "WARNING: GitHub remote missing or repo not found." -ForegroundColor Yellow
    Write-Host "  Current: $(git remote get-url origin 2>$null)" -ForegroundColor Gray
    Write-Host ""
    Write-Host "  Fix (one time):" -ForegroundColor Cyan
    Write-Host "  1. Open https://github.com/new" -ForegroundColor White
    Write-Host "  2. Repository name: yellowbook-somalia (Public)" -ForegroundColor White
    Write-Host "  3. Do NOT add README — repo must start empty" -ForegroundColor White
    Write-Host "  4. Run (replace YOUR_USER with your GitHub username):" -ForegroundColor White
    Write-Host "     git remote set-url origin https://github.com/YOUR_USER/yellowbook-somalia.git" -ForegroundColor DarkYellow
    Write-Host "     git add -A" -ForegroundColor DarkYellow
    Write-Host "     git commit -m `"Yellow Book — production ready`"" -ForegroundColor DarkYellow
    Write-Host "     git push -u origin main" -ForegroundColor DarkYellow
    Write-Host "  5. Vercel → Project → Settings → Git → Connect the same repo, branch: main" -ForegroundColor White
    Write-Host ""
} else {
    Write-Host "Pushing to GitHub (main)..." -ForegroundColor Cyan
    git add vercel.json package.json frontend/package.json frontend/package-lock.json frontend/.npmrc api frontend/public/config.json scripts/
    git add backend/YellowBook.API/Data/*.cs 2>$null
    $null = git diff --cached --quiet 2>$null
    if ($LASTEXITCODE -ne 0) {
        git commit -m "Fix Vercel build: vite in frontend, remove conflicting vercel.json"
    }
    git push -u origin main
    if ($LASTEXITCODE -ne 0) { throw "git push failed." }
    Write-Host "GitHub push OK." -ForegroundColor Green
}

# --- Vercel CLI deploy (works even without GitHub) ---
Write-Host "Deploying to Vercel (yellowbooks)..." -ForegroundColor Cyan
npx vercel link --yes --project yellowbooks 2>$null
npx vercel deploy --prod --yes --force --archive=tgz
if ($LASTEXITCODE -ne 0) { throw "Vercel deploy failed." }

Write-Host "Pointing yellowbooks.vercel.app alias..." -ForegroundColor Cyan
npx vercel alias set yellowbook-somalia.vercel.app yellowbooks.vercel.app 2>$null

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "  ONLINE (24/7):" -ForegroundColor Green
Write-Host "  https://yellowbooks.vercel.app" -ForegroundColor Green
Write-Host "  https://yellowbook-somalia.vercel.app" -ForegroundColor Green
Write-Host "  https://yellowbook-live.vercel.app" -ForegroundColor Green
Write-Host "  Login: admin / Admin@123" -ForegroundColor Yellow
Write-Host "========================================" -ForegroundColor Green
if (-not $remoteOk) {
    Write-Host "GitHub: create repo + push, then reconnect in Vercel Git settings." -ForegroundColor Yellow
} else {
    Write-Host "GitHub: $(git remote get-url origin)" -ForegroundColor Cyan
}
Write-Host "Vercel Root Directory: (empty — repo root, NOT frontend)" -ForegroundColor DarkGray
