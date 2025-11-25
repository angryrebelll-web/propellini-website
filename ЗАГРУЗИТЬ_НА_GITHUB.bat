@echo off
chcp 65001 >nul
cls
echo ==========================================
echo  ЗАГРУЗКА ПРОЕКТА НА GITHUB
echo ==========================================
echo.
echo Убедитесь, что Git установлен!
echo Если нет - скачайте: https://git-scm.com/download/win
echo.
pause
echo.

cd /d "%~dp0"
echo Текущая папка: %CD%
echo.

echo [1/9] Инициализация Git репозитория...
call git init
if errorlevel 1 (
    echo ОШИБКА: Git не установлен или не найден в PATH!
    echo Установите Git: https://git-scm.com/download/win
    pause
    exit /b 1
)
echo.

echo [2/9] Добавление README.md...
call git add README.md
echo.

echo [3/9] Создание первого коммита...
call git commit -m "первый коммит"
echo.

echo [4/9] Переименование ветки в main...
call git branch -M main
echo.

echo [5/9] Добавление remote репозитория...
call git remote add origin https://github.com/angryrebelll-web/propellini-website.git
if errorlevel 1 (
    echo ВНИМАНИЕ: Remote уже существует, пропускаем...
    call git remote set-url origin https://github.com/angryrebelll-web/propellini-website.git
)
echo.

echo [6/9] Добавление всех файлов проекта...
call git add .
echo.

echo [7/9] Создание коммита со всеми файлами...
call git commit -m "Initial commit: полный проект Propellini"
echo.

echo [8/9] Загрузка на GitHub...
echo ВНИМАНИЕ: Может потребоваться авторизация!
echo Если попросит логин/пароль, используйте Personal Access Token
echo.
call git push -u origin main
echo.

if errorlevel 1 (
    echo.
    echo ==========================================
    echo ОШИБКА ПРИ ЗАГРУЗКЕ!
    echo ==========================================
    echo.
    echo Возможные причины:
    echo 1. Неверные учетные данные
    echo 2. Нужна авторизация через токен
    echo 3. Репозиторий не существует на GitHub
    echo.
    echo Решение:
    echo - Создайте репозиторий на https://github.com/angryrebelll-web/propellini-website
    echo - Используйте Personal Access Token вместо пароля
    echo.
) else (
    echo.
    echo ==========================================
    echo УСПЕШНО ЗАГРУЖЕНО!
    echo ==========================================
    echo.
    echo Проект доступен по адресу:
    echo https://github.com/angryrebelll-web/propellini-website
    echo.
)

pause




