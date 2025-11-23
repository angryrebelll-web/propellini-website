@echo off
echo ============================================
echo Настройка Git репозитория для Propellini
echo ============================================
echo.

REM Проверка наличия Git
where git >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [ОШИБКА] Git не установлен!
    echo.
    echo Пожалуйста, установите Git с https://git-scm.com/download/win
    echo После установки перезапустите этот скрипт.
    pause
    exit /b 1
)

echo [OK] Git установлен
echo.

REM Инициализация репозитория
echo Инициализация Git репозитория...
git init
if %ERRORLEVEL% NEQ 0 (
    echo [ОШИБКА] Не удалось инициализировать репозиторий
    pause
    exit /b 1
)

echo [OK] Репозиторий инициализирован
echo.

REM Добавление всех файлов
echo Добавление файлов в репозиторий...
git add .
if %ERRORLEVEL% NEQ 0 (
    echo [ОШИБКА] Не удалось добавить файлы
    pause
    exit /b 1
)

echo [OK] Файлы добавлены
echo.

REM Создание коммита
echo Создание первого коммита...
git commit -m "Initial commit: Propellini website with video"
if %ERRORLEVEL% NEQ 0 (
    echo [ОШИБКА] Не удалось создать коммит
    pause
    exit /b 1
)

echo [OK] Коммит создан
echo.
echo ============================================
echo Репозиторий готов!
echo ============================================
echo.
echo Следующие шаги:
echo 1. Создайте репозиторий на GitHub.com
echo 2. Выполните команды:
echo    git remote add origin https://github.com/YOUR_USERNAME/propellini-website.git
echo    git branch -M main
echo    git push -u origin main
echo.
echo Замените YOUR_USERNAME на ваш GitHub username
echo.
pause

