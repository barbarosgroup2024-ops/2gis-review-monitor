# Skript proverki gotovnosti proekta

Write-Host "================================" -ForegroundColor Cyan
Write-Host "  Proverka gotovnosti proekta" -ForegroundColor Cyan
Write-Host "================================" -ForegroundColor Cyan
Write-Host ""

$allGood = $true

# Proverka 1: Node.js
Write-Host "1. Proverka Node.js..." -NoNewline
try {
    $nodeVersion = node --version
    Write-Host " OK Ustanovlen ($nodeVersion)" -ForegroundColor Green
}
catch {
    Write-Host " FAIL Ne ustanovlen!" -ForegroundColor Red
    Write-Host "   Ustanovite Node.js: https://nodejs.org/" -ForegroundColor Yellow
    $allGood = $false
}

# Proverka 2: npm
Write-Host "2. Proverka npm..." -NoNewline
try {
    $npmVersion = npm --version
    Write-Host " OK Ustanovlen ($npmVersion)" -ForegroundColor Green
}
catch {
    Write-Host " FAIL Ne ustanovlen!" -ForegroundColor Red
    $allGood = $false
}

# Proverka 3: .env file
Write-Host "3. Proverka .env faila..." -NoNewline
if (Test-Path ".env") {
    Write-Host " OK Naiden" -ForegroundColor Green
    
    $envContent = Get-Content ".env" -Raw
    
    Write-Host "   Proverka peremennyh:" -ForegroundColor Cyan
    
    if ($envContent -match "MASTER_SPREADSHEET_ID=.+") {
        Write-Host "   - MASTER_SPREADSHEET_ID..." -NoNewline
        if ($envContent -match "MASTER_SPREADSHEET_ID=VSTAVTE") {
            Write-Host " WARNING Ne nastroen!" -ForegroundColor Yellow
            $allGood = $false
        }
        else {
            Write-Host " OK" -ForegroundColor Green
        }
    }
    else {
        Write-Host "   - MASTER_SPREADSHEET_ID... FAIL Otsutstvuet!" -ForegroundColor Red
        $allGood = $false
    }
    
    if ($envContent -match "JWT_SECRET=.+") {
        Write-Host "   - JWT_SECRET... OK" -ForegroundColor Green
    }
    else {
        Write-Host "   - JWT_SECRET... FAIL Otsutstvuet!" -ForegroundColor Red
        $allGood = $false
    }
}
else {
    Write-Host " FAIL Ne naiden!" -ForegroundColor Red
    Write-Host "   Skopiruyte .env.example v .env" -ForegroundColor Yellow
    $allGood = $false
}

# Proverka 4: Google credentials
Write-Host "4. Proverka Google credentials..." -NoNewline
if (Test-Path "credentials\google-credentials.json") {
    Write-Host " OK Naiden" -ForegroundColor Green
    
    try {
        $creds = Get-Content "credentials\google-credentials.json" -Raw | ConvertFrom-Json
        if ($creds.client_email) {
            Write-Host "   Service Account: $($creds.client_email)" -ForegroundColor Cyan
        }
    }
    catch {
        Write-Host "   WARNING File povrezhden ili nevalidnyi JSON!" -ForegroundColor Yellow
        $allGood = $false
    }
}
else {
    Write-Host " FAIL Ne naiden!" -ForegroundColor Red
    Write-Host "   Sleduyte instrukciyam v credentials/README.md" -ForegroundColor Yellow
    $allGood = $false
}

# Proverka 5: Backend zavisimosti
Write-Host "5. Proverka zavisimostey backend..." -NoNewline
if (Test-Path "node_modules") {
    Write-Host " OK Ustanovleny" -ForegroundColor Green
}
else {
    Write-Host " FAIL Ne ustanovleny!" -ForegroundColor Red
    Write-Host "   Vypolnite: npm install" -ForegroundColor Yellow
    $allGood = $false
}

# Proverka 6: Frontend zavisimosti
Write-Host "6. Proverka zavisimostey frontend..." -NoNewline
if (Test-Path "client\node_modules") {
    Write-Host " OK Ustanovleny" -ForegroundColor Green
}
else {
    Write-Host " FAIL Ne ustanovleny!" -ForegroundColor Red
    Write-Host "   Vypolnite: cd client; npm install" -ForegroundColor Yellow
    $allGood = $false
}

# Proverka 7: Struktura proekta
Write-Host "7. Proverka struktury proekta..." -NoNewline
$requiredDirs = @("server", "client", "credentials")
$missingDirs = @()
foreach ($dir in $requiredDirs) {
    if (-not (Test-Path $dir)) {
        $missingDirs += $dir
    }
}
if ($missingDirs.Count -eq 0) {
    Write-Host " OK Korrektna" -ForegroundColor Green
}
else {
    Write-Host " FAIL Otsutstvuyut papki: $($missingDirs -join ', ')" -ForegroundColor Red
    $allGood = $false
}

# Proverka 8: Osnovnye faily backend
Write-Host "8. Proverka failov backend..." -NoNewline
$backendFiles = @(
    "server\index.js",
    "server\services\googleSheets.js",
    "server\services\reviewChecker.js",
    "server\services\telegram.js",
    "server\services\twoGis.js"
)
$missingBackend = @()
foreach ($file in $backendFiles) {
    if (-not (Test-Path $file)) {
        $missingBackend += $file
    }
}
if ($missingBackend.Count -eq 0) {
    Write-Host " OK Vse na meste" -ForegroundColor Green
}
else {
    Write-Host " FAIL Otsutstvuyut faily!" -ForegroundColor Red
    foreach ($file in $missingBackend) {
        Write-Host "   - $file" -ForegroundColor Red
    }
    $allGood = $false
}

# Proverka 9: Osnovnye faily frontend
Write-Host "9. Proverka failov frontend..." -NoNewline
$frontendFiles = @(
    "client\src\App.js",
    "client\src\index.js",
    "client\src\pages\Login.js",
    "client\src\pages\Dashboard.js"
)
$missingFrontend = @()
foreach ($file in $frontendFiles) {
    if (-not (Test-Path $file)) {
        $missingFrontend += $file
    }
}
if ($missingFrontend.Count -eq 0) {
    Write-Host " OK Vse na meste" -ForegroundColor Green
}
else {
    Write-Host " FAIL Otsutstvuyut faily!" -ForegroundColor Red
    foreach ($file in $missingFrontend) {
        Write-Host "   - $file" -ForegroundColor Red
    }
    $allGood = $false
}

# Itogovyi rezultat
Write-Host ""
Write-Host "================================" -ForegroundColor Cyan
if ($allGood) {
    Write-Host "OK Proekt gotov k zapusku!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Dlya zapuska vypolnite:" -ForegroundColor Cyan
    Write-Host "  .\start.ps1" -ForegroundColor White
    Write-Host ""
    Write-Host "Ili:" -ForegroundColor Cyan
    Write-Host "  npm run dev:full" -ForegroundColor White
}
else {
    Write-Host "FAIL Proekt ne gotov k zapusku!" -ForegroundColor Red
    Write-Host ""
    Write-Host "Ispravte oshibki vyshe i zapustite proverku snova." -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Dokumentaciya:" -ForegroundColor Cyan
    Write-Host "  START_HERE.md - Bystryi start" -ForegroundColor White
    Write-Host "  CHECKLIST.md - Cheklist nastroyki" -ForegroundColor White
    Write-Host "  credentials/README.md - Nastroyka Google API" -ForegroundColor White
}
Write-Host "================================" -ForegroundColor Cyan
Write-Host ""

pause