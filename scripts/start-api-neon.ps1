# Run API with web PostgreSQL (Neon / Supabase) - no Docker
# 1. Put DATABASE_URL in .env
# 2. Run: .\scripts\start-api-neon.ps1

$ErrorActionPreference = 'Stop'
$root = (Join-Path $PSScriptRoot '..') | Resolve-Path
$apiPath = Join-Path $root 'backend\YellowBook.API'
$envFile = Join-Path $root '.env'

if (Test-Path $envFile) {
  Get-Content $envFile | ForEach-Object {
    $line = $_.Trim()
    if ($line -and -not $line.StartsWith('#') -and $line -match '^([^=]+)=(.*)$') {
      $key = $Matches[1].Trim()
      $val = $Matches[2].Trim().Trim('"')
      Set-Item -Path "env:$key" -Value $val
    }
  }
}

if (-not $env:DATABASE_URL) {
  Write-Host 'Missing DATABASE_URL in .env' -ForegroundColor Red
  Write-Host 'Get a free URL from https://neon.tech' -ForegroundColor Yellow
  exit 1
}

Write-Host 'Using Neon/web PostgreSQL' -ForegroundColor Cyan
Write-Host 'API:     http://localhost:5261' -ForegroundColor Green
Write-Host 'Swagger: http://localhost:5261/swagger' -ForegroundColor Green
Write-Host 'Login:   admin / Admin@123' -ForegroundColor Green
Write-Host ''

Set-Location $apiPath
$env:ASPNETCORE_ENVIRONMENT = 'Development'
$env:ENABLE_SWAGGER = 'true'
dotnet run --launch-profile http
