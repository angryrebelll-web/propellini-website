@echo off
chcp 65001 >nul
echo ===================================
echo Загрузка проекта на GitHub
echo ===================================
echo.

cd /d "%~dp0"

echo Создание README.md...
echo # propellini-website > README.md
echo.

echo Инициализация Git репозитория...
git init
echo.

echo Добавление README.md...
git add README.md
echo.

echo Создание первого коммита...
git commit -m "первый коммит"
echo.

echo Переименование ветки в main...
git branch -M main
echo.

echo Добавление remote репозитория...
git remote add origin https://github.com/angryrebelll-web/propellini-website.git
echo.

echo Добавление всех файлов...
git add .
echo.

echo Создание коммита со всеми файлами...
git commit -m "Initial commit: полный проект"
echo.

echo Загрузка на GitHub...
echo ВНИМАНИЕ: Может потребоваться авторизация!
git push -u origin main
echo.

echo ===================================
echo ГОТОВО!
echo ===================================
pause


