# Start PostgreSQL (Docker) + Yellow Book API — PostgreSQL only
$ErrorActionPreference = 'Stop'
$root = (Join-Path $PSScriptRoot '..') | Resolve-Path
$apiPath = Join-Path $root 'backend\YellowBook.API'

function Find-Docker {
  $candidates = @(
    'docker',
    "$env:ProgramFiles\Docker\Docker\resources\bin\docker.exe",
    "$env:LOCALAPPDATA\Programs\Docker\Docker\resources\bin\docker.exe"
  )
  foreach ($c in $candidates) {
    if (Get-Command $c -ErrorAction SilentlyContinue) { return (Get-Command $c).Source }
  }
  return $null
}

$docker = Find-Docker
if (-not $docker) {
  Write-Host 'Docker not found. Install Docker Desktop OR PostgreSQL 16:' -ForegroundColor Yellow
  Write-Host '  winget install PostgreSQL.PostgreSQL.16' -ForegroundColor Cyan
  Write-Host 'Then create database: yellowbook (user postgres / password postgres)' -ForegroundColor Cyan
  exit 1
}

Write-Host 'Starting PostgreSQL container...' -ForegroundColor Cyan
Set-Location $root
& $docker compose up -d postgres
if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }

Write-Host 'Waiting for PostgreSQL on port 5432...' -ForegroundColor Cyan
$ready = $false
for ($i = 0; $i -lt 30; $i++) {
  if (Get-NetTCPConnection -LocalPort 5432 -State Listen -ErrorAction SilentlyContinue) {
    $ready = $true
    break
  }
  Start-Sleep -Seconds 2
}
if (-not $ready) {
  Write-Host 'PostgreSQL did not start in time. Check: docker compose logs postgres' -ForegroundColor Red
  exit 1
}

Set-Location $apiPath
Write-Host 'Building and starting API at http://localhost:5261 ...' -ForegroundColor Green
dotnet run --launch-profile http
