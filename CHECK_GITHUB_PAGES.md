# Проверка обновления GitHub Pages

## Что проверить:

1. **Открой GitHub репозиторий:**
   https://github.com/angryrebelll-web/propellini-website

2. **Проверь Actions (вкладка вверху):**
   - Если есть ошибки - исправь их
   - Если деплой в процессе - подожди

3. **Проверь Settings → Pages:**
   - Source: Deploy from a branch
   - Branch: main
   - Folder: / (root)
   - Должна быть зеленая галочка и ссылка

4. **Очисти кэш браузера:**
   - Нажми Ctrl+Shift+R (Windows) или Cmd+Shift+R (Mac)
   - Или открой в режиме инкогнито

5. **Проверь через 2-3 минуты:**
   https://angryrebelll-web.github.io/propellini-website/

## Если не обновляется:

1. Сделай пустой коммит:
   ```bash
   git commit --allow-empty -m "Force update"
   git push
   ```

2. Или измени настройки Pages:
   - Сохрани с другим источником
   - Потом верни обратно

3. Проверь, что файлы в корне репозитория (не в подпапке)

