# PostgreSQL API tests - run: .\scripts\test-api.ps1
# Start first: docker compose up -d  &&  cd backend\YellowBook.API; dotnet run

$ErrorActionPreference = "Continue"
$base = if ($env:API_URL) { $env:API_URL.TrimEnd('/') } else { "http://localhost:5261/api" }
$passed = 0
$failed = 0

function Test-Endpoint {
  param([string]$Name, [string]$Url, [string]$Method = "GET", [object]$Body = $null)
  try {
    $params = @{ Uri = $Url; Method = $Method; TimeoutSec = 20; UseBasicParsing = $true }
    if ($Body) {
      $params.ContentType = "application/json"
      $params.Body = ($Body | ConvertTo-Json)
    }
    $r = Invoke-WebRequest @params
    $ok = $r.StatusCode -ge 200 -and $r.StatusCode -lt 300
    if ($ok) {
      Write-Host "[PASS] $Name ($($r.StatusCode))" -ForegroundColor Green
      $script:passed++
    } else {
      Write-Host "[FAIL] $Name status $($r.StatusCode)" -ForegroundColor Red
      $script:failed++
    }
  } catch {
    Write-Host "[FAIL] $Name - $($_.Exception.Message)" -ForegroundColor Red
    $script:failed++
  }
}

Write-Host ""
Write-Host "YellowBook API tests at $base" -ForegroundColor Cyan
Write-Host ""

Test-Endpoint "Health + PostgreSQL" "$base/health"
Test-Endpoint "Categories" "$base/categories"
Test-Endpoint "Businesses list" "$base/businesses"
Test-Endpoint "Search" "$base/businesses/search?name=&page=1&pageSize=5"
Test-Endpoint "Dashboard stats" "$base/dashboard/stats"
Test-Endpoint "Login" "$base/auth/login" "POST" @{ username = "admin"; password = "Admin@123" }

Write-Host ""
if ($failed -eq 0) {
  Write-Host "$passed passed, $failed failed" -ForegroundColor Green
} else {
  Write-Host "$passed passed, $failed failed" -ForegroundColor Yellow
}
Write-Host ""
exit $(if ($failed -gt 0) { 1 } else { 0 })
