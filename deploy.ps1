# ============================================================
#  deploy.ps1 — campus-eat-picker
#  powershell -ExecutionPolicy Bypass -File .\deploy.ps1
# ============================================================

$REPO_URL = "https://github.com/nianjh/campus-eat-picker.git"
$COMMIT_MSG = "feat: pixel slot machine campus food picker"
$BRANCH = "main"

Set-Location $PSScriptRoot

# 1. .gitignore
$gitignorePath = Join-Path $PSScriptRoot ".gitignore"
if (-not (Test-Path $gitignorePath)) {
    Write-Host "[1/6] Creating .gitignore ..." -ForegroundColor Yellow
    Set-Content -Path $gitignorePath -Encoding UTF8 -Value @'
node_modules/
frontend/dist/
frontend/node_modules/
.vite/
target/
*.class
*.jar
!lib/*.jar
.idea/
*.iml
.vscode/
*.swp
*.swo
*~
dm8_data/
dm8_logs/
.DS_Store
Thumbs.db
desktop.ini
.env
.env.local
*.log
'@
} else {
    Write-Host "[1/6] .gitignore exists" -ForegroundColor Green
}

# 2. git init
$gitDir = Join-Path $PSScriptRoot ".git"
if (-not (Test-Path $gitDir)) {
    Write-Host "[2/6] git init ..." -ForegroundColor Yellow
    git init
    if ($LASTEXITCODE -ne 0) { Write-Host "FAIL: git init" -ForegroundColor Red; exit 1 }
} else {
    Write-Host "[2/6] Git repo exists" -ForegroundColor Green
}

# 3. Ensure git user config (required for commit)
$gitName = git config user.name 2>$null
$gitEmail = git config user.email 2>$null
if (-not $gitName) {
    Write-Host "[3/6] Setting temporary git user.name ..." -ForegroundColor Yellow
    git config user.name "campus-eat-picker"
}
if (-not $gitEmail) {
    Write-Host "[3/6] Setting temporary git user.email ..." -ForegroundColor Yellow
    git config user.email "eat@campus.local"
}
if ($gitName -and $gitEmail) {
    Write-Host "[3/6] Git user: $gitName <$gitEmail>" -ForegroundColor Green
}

# 4. git add + commit
Write-Host "[4/6] git add . ..." -ForegroundColor Yellow
git add .
if ($LASTEXITCODE -ne 0) { Write-Host "FAIL: git add" -ForegroundColor Red; exit 1 }

Write-Host "[5/6] git commit ..." -ForegroundColor Yellow
git commit -m $COMMIT_MSG --allow-empty
# --allow-empty ensures a commit is created even if nothing changed
# This is needed so the branch exists for renaming

# 6. push
Write-Host "[6/6] git push ..." -ForegroundColor Yellow

# Set up remote
$existing = git remote get-url origin 2>$null
if ($existing) {
    if ($existing -ne $REPO_URL) {
        Write-Host "  Updating origin URL..." -ForegroundColor Cyan
        git remote set-url origin $REPO_URL
    }
} else {
    git remote add origin $REPO_URL
}

# Rename branch to main
$currentBranch = git branch --show-current 2>$null
if ($currentBranch -and $currentBranch -ne $BRANCH) {
    Write-Host "  Renaming branch: $currentBranch -> $BRANCH" -ForegroundColor Cyan
    git branch -M $BRANCH
} elseif (-not $currentBranch) {
    Write-Host "  Creating branch: $BRANCH" -ForegroundColor Cyan
    git branch -M $BRANCH
}

git push -u origin $BRANCH

if ($LASTEXITCODE -eq 0) {
    Write-Host "`nSUCCESS! $REPO_URL" -ForegroundColor Green
} else {
    Write-Host "`nPUSH FAILED. Check:" -ForegroundColor Yellow
    Write-Host "  1. Does the GitHub repo exist?" -ForegroundColor Yellow
    Write-Host "  2. Is the username in REPO_URL correct?" -ForegroundColor Yellow
    Write-Host "  3. Are you logged in to GitHub? (git config --global credential.helper)" -ForegroundColor Yellow
}

Read-Host "`nPress Enter to exit"
