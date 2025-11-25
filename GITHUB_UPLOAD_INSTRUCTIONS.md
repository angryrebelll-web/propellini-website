# Инструкция по созданию GitHub репозитория и загрузке видео

## Шаг 1: Создание репозитория на GitHub

1. Перейдите на https://github.com
2. Нажмите кнопку "+" в правом верхнем углу → "New repository"
3. Название репозитория: `propellini-website` (или любое другое)
4. Выберите "Public" (для бесплатного хостинга)
5. НЕ добавляйте README, .gitignore или лицензию
6. Нажмите "Create repository"

## Шаг 2: Установка Git (если еще не установлен)

1. Скачайте Git: https://git-scm.com/download/win
2. Установите с настройками по умолчанию
3. Перезапустите терминал после установки

## Шаг 3: Инициализация репозитория и загрузка файлов

Выполните следующие команды в PowerShell в папке проекта:

```powershell
cd C:\Users\dmitry\Desktop\awesome-shadcn-ui-main\propellini-final

# Инициализация git репозитория
git init

# Добавление всех файлов
git add .

# Создание первого коммита
git commit -m "Initial commit: Propellini website"

# Добавление удаленного репозитория (замените YOUR_USERNAME на ваш GitHub username)
git remote add origin https://github.com/YOUR_USERNAME/propellini-website.git

# Переименование ветки в main (если нужно)
git branch -M main

# Загрузка файлов на GitHub
git push -u origin main
```

## Шаг 4: Получение ссылок на видео

После загрузки файлов на GitHub, ссылки на видео будут:

**Desktop видео:**
```
https://raw.githubusercontent.com/YOUR_USERNAME/propellini-website/main/public/images/video/teaser-desktop.mp4
```

**Mobile видео:**
```
https://raw.githubusercontent.com/YOUR_USERNAME/propellini-website/main/public/images/video/teaser-mobile.mp4
```

## Шаг 5: Обновление путей в HTML

После получения ссылок на видео, обновите пути в `index.html`:

```html
<!-- Вместо: -->
<source src="./public/images/video/teaser-desktop.mp4" type="video/mp4" />

<!-- Используйте: -->
<source src="https://raw.githubusercontent.com/YOUR_USERNAME/propellini-website/main/public/images/video/teaser-desktop.mp4" type="video/mp4" />
```

## Альтернативный вариант: Использование GitHub Pages

1. После загрузки файлов в репозиторий
2. Перейдите в Settings → Pages
3. Выберите ветку `main` и папку `/root`
4. Нажмите Save
5. Ссылка на сайт будет: `https://YOUR_USERNAME.github.io/propellini-website/`
6. Видео будет доступно по путям относительно сайта

## Примечание

⚠️ **Важно**: GitHub имеет ограничение на размер файлов:
- Максимальный размер файла: 100 MB
- Для файлов больше 50 MB рекомендуется использовать Git LFS

Если видео файл больше 50 MB, используйте:
```powershell
# Установка Git LFS
git lfs install

# Отслеживание видео файлов
git lfs track "*.mp4"

# Затем обычные команды git add, commit, push
```





