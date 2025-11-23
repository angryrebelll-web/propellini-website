# Скрипт для настройки Git и загрузки на GitHub
# Использование: .\SETUP_AND_UPLOAD.ps1

Write-Host "============================================" -ForegroundColor Cyan
Write-Host "Настройка Git репозитория для Propellini" -ForegroundColor Cyan
Write-Host "============================================" -ForegroundColor Cyan
Write-Host ""

# Проверка наличия Git
$gitInstalled = Get-Command git -ErrorAction SilentlyContinue
if (-not $gitInstalled) {
    Write-Host "[ОШИБКА] Git не установлен!" -ForegroundColor Red
    Write-Host ""
    Write-Host "Установите Git: https://git-scm.com/download/win" -ForegroundColor Yellow
    Write-Host "После установки перезапустите этот скрипт." -ForegroundColor Yellow
    Read-Host "Нажмите Enter для выхода"
    exit 1
}

Write-Host "[OK] Git установлен" -ForegroundColor Green
Write-Host ""

# Проверка, инициализирован ли репозиторий
if (Test-Path ".git") {
    Write-Host "[INFO] Git репозиторий уже инициализирован" -ForegroundColor Yellow
    Write-Host ""
} else {
    Write-Host "Инициализация Git репозитория..." -ForegroundColor Cyan
    git init
    if ($LASTEXITCODE -ne 0) {
        Write-Host "[ОШИБКА] Не удалось инициализировать репозиторий" -ForegroundColor Red
        Read-Host "Нажмите Enter для выхода"
        exit 1
    }
    Write-Host "[OK] Репозиторий инициализирован" -ForegroundColor Green
    Write-Host ""
}

# Добавление всех файлов
Write-Host "Добавление файлов в репозиторий..." -ForegroundColor Cyan
git add .
if ($LASTEXITCODE -ne 0) {
    Write-Host "[ОШИБКА] Не удалось добавить файлы" -ForegroundColor Red
    Read-Host "Нажмите Enter для выхода"
    exit 1
}
Write-Host "[OK] Файлы добавлены" -ForegroundColor Green
Write-Host ""

# Проверка, есть ли коммиты
$hasCommits = git log -1 --oneline 2>$null
if ($LASTEXITCODE -eq 0) {
    Write-Host "[INFO] Коммиты уже существуют" -ForegroundColor Yellow
    Write-Host ""
} else {
    Write-Host "Создание первого коммита..." -ForegroundColor Cyan
    git commit -m "Initial commit: Propellini website with video"
    if ($LASTEXITCODE -ne 0) {
        Write-Host "[ОШИБКА] Не удалось создать коммит" -ForegroundColor Red
        Read-Host "Нажмите Enter для выхода"
        exit 1
    }
    Write-Host "[OK] Коммит создан" -ForegroundColor Green
    Write-Host ""
}

Write-Host "============================================" -ForegroundColor Cyan
Write-Host "Репозиторий готов!" -ForegroundColor Green
Write-Host "============================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Следующие шаги:" -ForegroundColor Yellow
Write-Host ""
Write-Host "1. Создайте репозиторий на GitHub.com" -ForegroundColor White
Write-Host "   https://github.com/new" -ForegroundColor Gray
Write-Host ""
Write-Host "2. После создания репозитория выполните команды:" -ForegroundColor White
Write-Host ""
Write-Host "   git remote add origin https://github.com/YOUR_USERNAME/propellini-website.git" -ForegroundColor Cyan
Write-Host "   git branch -M main" -ForegroundColor Cyan
Write-Host "   git push -u origin main" -ForegroundColor Cyan
Write-Host ""
Write-Host "   Замените YOUR_USERNAME на ваш GitHub username" -ForegroundColor Gray
Write-Host ""
Write-Host "3. После загрузки обновите пути к видео в index.html:" -ForegroundColor White
Write-Host "   Замените ./public/images/video/ на ссылки из GitHub" -ForegroundColor Gray
Write-Host ""

Read-Host "Нажмите Enter для выхода"

