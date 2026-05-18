# Habee Cloudinary — run: .\scripts\setup-cloudinary.ps1
# Ka hel: https://cloudinary.com/console → Dashboard → API Environment variable (CLOUDINARY_URL)

$ErrorActionPreference = 'Stop'
$root = (Join-Path $PSScriptRoot '..') | Resolve-Path
$envFile = Join-Path $root '.env'

Write-Host ''
Write-Host '=== Cloudinary Setup (Yellow Book) ===' -ForegroundColor Cyan
Write-Host '1. Gal https://cloudinary.com (account bilaash ah)' -ForegroundColor Yellow
Write-Host '2. Dashboard → copy CLOUDINARY_URL (cloudinary://KEY:SECRET@CLOUD_NAME)' -ForegroundColor Yellow
Write-Host ''

$url = Read-Host 'Paste CLOUDINARY_URL halkan (ama Enter si aad uga baxdo)'

if ([string]::IsNullOrWhiteSpace($url)) {
  Write-Host 'Waa la joojiyay. Ma jiro wax la beddelay.' -ForegroundColor Gray
  exit 0
}

$url = $url.Trim().Trim('"')
if ($url -notmatch '^cloudinary://') {
  Write-Host 'URL-ka waa inuu ku bilaabmaa cloudinary://' -ForegroundColor Red
  exit 1
}

$lines = @()
if (Test-Path $envFile) {
  $lines = Get-Content $envFile
  $lines = $lines | Where-Object { $_ -notmatch '^\s*CLOUDINARY_' }
}

$lines += ''
$lines += '# Cloudinary — business photos'
$lines += "CLOUDINARY_URL=$url"

Set-Content -Path $envFile -Value ($lines -join "`n") -Encoding UTF8

Write-Host ''
Write-Host 'Waa la kaydiyay .env' -ForegroundColor Green
Write-Host 'Dib u bilow API: cd backend\YellowBook.API; dotnet run' -ForegroundColor Cyan
Write-Host 'Hubi: http://localhost:5261/api/upload/status' -ForegroundColor Cyan
Write-Host ''
