# Инструкция по деплою на GitHub Pages

## Быстрый старт

### 1. Подготовка репозитория

Если репозиторий еще не создан:

```bash
# Инициализация git (если еще не сделано)
git init

# Добавление всех файлов
git add .

# Первый коммит
git commit -m "Initial commit"

# Переименование ветки в main (если нужно)
git branch -M main

# Добавление remote репозитория (замените YOUR_USERNAME на ваш GitHub username)
git remote add origin https://github.com/YOUR_USERNAME/Uniseller-TEST.git

# Push в GitHub
git push -u origin main
```

### 2. Настройка GitHub Pages

1. Откройте ваш репозиторий на GitHub
2. Перейдите в `Settings` → `Pages`
3. В разделе `Source` выберите **`GitHub Actions`**
4. Сохраните изменения

### 3. Проверка base path

**Важно:** Если ваш репозиторий называется не `Uniseller-TEST`, нужно изменить base path:

1. Откройте `vite.config.js`
2. Найдите строку с `base: '/Uniseller-TEST/'`
3. Замените на `/ваше-название-репозитория/`

Например, если репозиторий называется `my-landing`, то:
```js
base: process.env.NODE_ENV === 'production' ? '/my-landing/' : '/',
```

### 4. Автоматический деплой

После настройки:
- Каждый push в ветку `main` или `master` автоматически запустит деплой
- Проверить статус можно в разделе `Actions` репозитория
- После успешного деплоя сайт будет доступен по адресу:
  ```
  https://YOUR_USERNAME.github.io/Uniseller-TEST/
  ```

### 5. Проверка локально перед деплоем

```bash
# Сборка проекта
npm run build

# Предпросмотр продакшен сборки
npm run preview
```

## Альтернатива: Ручной деплой

Если хотите деплоить вручную через `gh-pages`:

```bash
# Установка gh-pages
npm install --save-dev gh-pages

# Деплой
npm run deploy
```

После этого в настройках репозитория (`Settings` → `Pages`) выберите источник `gh-pages` branch.

## Решение проблем

### Сайт не открывается / 404 ошибка

1. Проверьте, что base path в `vite.config.js` совпадает с названием репозитория
2. Убедитесь, что в настройках Pages выбран источник `GitHub Actions`
3. Проверьте логи в разделе `Actions` репозитория

### Изображения не загружаются

Убедитесь, что пути к изображениям в коде начинаются с `/` (абсолютные пути) или используют правильный base path.

### Стили не применяются

Проверьте, что в `vite.config.js` правильно настроен `base` для production режима.
