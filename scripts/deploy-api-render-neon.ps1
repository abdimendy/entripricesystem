# Deploy API 24/7 on Render.com using Neon PostgreSQL (no PC needed)
# 1. Push repo to GitHub
# 2. https://dashboard.render.com → New → Blueprint → connect repo
# 3. Set env DATABASE_URL = your Neon connection string (from .env)
# 4. Set AdminUser__Password = Admin@123
# 5. After deploy, copy API URL e.g. https://yellowbook-api.onrender.com
# 6. Vercel: set VITE_API_URL = https://YOUR-API.onrender.com/api
# 7. Redeploy: npx vercel deploy --prod --scope mahdi-abdi

$ErrorActionPreference = 'Stop'
Write-Host 'Render + Neon setup (24/7 online API)' -ForegroundColor Cyan
Write-Host ''
Write-Host '1. GitHub: push this repo' -ForegroundColor Yellow
Write-Host '2. Render: https://dashboard.render.com → New Blueprint' -ForegroundColor Yellow
Write-Host '3. Environment variables on yellowbook-api service:' -ForegroundColor Yellow
Write-Host '   DATABASE_URL = (copy from your .env file)' -ForegroundColor White
Write-Host '   AdminUser__Password = Admin@123' -ForegroundColor White
Write-Host '   FRONTEND_URL = https://yellowbook-live.vercel.app' -ForegroundColor White
Write-Host '4. Wait for deploy, then test:' -ForegroundColor Yellow
Write-Host '   https://YOUR-SERVICE.onrender.com/api/health' -ForegroundColor White
Write-Host '5. Vercel dashboard → yellowbook-live → Environment:' -ForegroundColor Yellow
Write-Host '   VITE_API_URL = https://YOUR-SERVICE.onrender.com/api' -ForegroundColor White
Write-Host '6. Redeploy Vercel (Deployments → Redeploy)' -ForegroundColor Yellow
Write-Host ''
if (Test-Path (Join-Path $PSScriptRoot '..\.env')) {
  Write-Host 'Your DATABASE_URL is in .env (Neon)' -ForegroundColor Green
}
