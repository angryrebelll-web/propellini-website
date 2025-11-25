# Как загрузить проект на GitHub (включая видео)

## Вариант 1: Через веб-интерфейс GitHub (САМЫЙ ПРОСТОЙ)

1. **Создайте репозиторий на GitHub:**
   - Перейдите на https://github.com
   - Нажмите "+" → "New repository"
   - Название: `propellini-website`
   - Выберите "Public"
   - Нажмите "Create repository"

2. **Загрузите файлы через веб-интерфейс:**
   - На странице созданного репозитория нажмите "uploading an existing file"
   - Перетащите ВСЮ папку `propellini-final` в браузер
   - Или выберите файлы по одному
   - Обязательно загрузите папку `public/images/video/` с файлами видео
   - Нажмите "Commit changes"

3. **Получите ссылки на видео:**
   После загрузки видео будут доступны по адресам:
   ```
   https://raw.githubusercontent.com/YOUR_USERNAME/propellini-website/main/public/images/video/teaser-desktop.mp4
   https://raw.githubusercontent.com/YOUR_USERNAME/propellini-website/main/public/images/video/teaser-mobile.mp4
   ```

4. **Обновите пути в index.html:**
   Замените пути к видео на ссылки из GitHub (см. инструкцию ниже)

## Вариант 2: Через Git командную строку

### Шаг 1: Установите Git
- Скачайте: https://git-scm.com/download/win
- Установите с настройками по умолчанию
- Перезапустите терминал

### Шаг 2: Выполните команды

Откройте PowerShell в папке `propellini-final` и выполните:

```powershell
# Инициализация репозитория
git init

# Добавление всех файлов
git add .

# Создание коммита
git commit -m "Initial commit: Propellini website"

# Добавление удаленного репозитория (замените YOUR_USERNAME)
git remote add origin https://github.com/YOUR_USERNAME/propellini-website.git

# Переименование ветки
git branch -M main

# Загрузка на GitHub
git push -u origin main
```

## После загрузки - обновите пути к видео в HTML

1. Получите ссылку на ваш репозиторий: `https://github.com/YOUR_USERNAME/propellini-website`

2. Обновите пути в `index.html`:

**Найти:**
```html
<source src="./public/images/video/teaser-desktop.mp4" type="video/mp4" />
```

**Заменить на:**
```html
<source src="https://raw.githubusercontent.com/YOUR_USERNAME/propellini-website/main/public/images/video/teaser-desktop.mp4" type="video/mp4" />
```

Аналогично для mobile видео.

## Важно!

⚠️ **Размер файлов**: GitHub имеет ограничение 100 MB на файл. Если видео больше, используйте Git LFS или загрузите видео отдельно на файлообменник (например, Google Drive, Dropbox) и используйте прямые ссылки.

## Быстрый способ (если видео большое)

1. Загрузите видео на любой файлообменник:
   - Google Drive (сделайте доступ по ссылке)
   - Dropbox
   - Яндекс.Диск
   - Cloudflare Stream (бесплатно для видео)

2. Получите прямую ссылку на видео

3. Обновите пути в HTML на эти прямые ссылки





