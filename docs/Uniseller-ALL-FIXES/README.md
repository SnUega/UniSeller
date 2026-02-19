# Uniseller Landing Page

Лендинг для CRM-платформы Uniseller на Vue 3 + Vite.

## Структура проекта

```
uniseller-landing/
├── src/
│   ├── components/         # Vue компоненты
│   │   ├── AppHeader.vue
│   │   ├── HeroSection.vue
│   │   ├── DashboardPreview.vue
│   │   ├── PartnersSection.vue
│   │   ├── StatsSection.vue
│   │   └── AppFooter.vue
│   ├── assets/
│   │   ├── images/        # Изображения (пока пустая)
│   │   └── styles/
│   │       └── main.css   # Глобальные стили
│   ├── App.vue            # Главный компонент
│   └── main.js            # Точка входа
├── public/                # Статические файлы
├── index.html            # HTML шаблон
├── vite.config.js        # Конфигурация Vite
└── package.json          # Зависимости

```

## Установка и запуск

```bash
# Установка зависимостей
npm install

# Запуск dev сервера
npm run dev

# Сборка для продакшена
npm run build

# Предпросмотр продакшен сборки
npm run preview
```

## Следующие шаги

1. Добавить изображения в `/src/assets/images/`:
   - dashboard-main.png
   - ozon-logo.png
   - wildberries-logo.png
   - yandex-logo.png
   - sber-logo.png
   - trophy-left.png
   - trophy-right.png

2. Создать остальные компоненты по секциям:
   - CRMBenefitsSection.vue
   - SecurityFeatures.vue
   - AutomationSolutions.vue
   - ProductsSection.vue
   - PricingSection.vue
   - FAQSection.vue
   - CTASection.vue
   - ContactForm.vue

## Цветовая палитра (из Figma)

```css
--bg-main: #191919
--bg-card: #1F1F1F
--gradient-orange: linear-gradient(90deg, #FFD58A 0%, #FFA92C 100%)
--text-white: #FFFFFF
--text-muted: rgba(255, 255, 255, 0.6)
--text-dimmed: rgba(255, 255, 255, 0.4)
```

## Технологии

- Vue 3 (Composition API)
- Vite
- CSS (без препроцессоров)

## Деплой на GitHub Pages

### Автоматический деплой через GitHub Actions

Проект настроен для автоматического деплоя на GitHub Pages при каждом push в ветку `main` или `master`.

**Шаги для настройки:**

1. **Создайте репозиторий на GitHub:**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/ВАШ_USERNAME/Uniseller-TEST.git
   git push -u origin main
   ```

2. **Включите GitHub Pages в настройках репозитория:**
   - Перейдите в `Settings` → `Pages`
   - В разделе `Source` выберите `GitHub Actions`
   - Сохраните изменения

3. **Проверьте base path в `vite.config.js`:**
   - Если ваш репозиторий называется `Uniseller-TEST`, base уже настроен как `/Uniseller-TEST/`
   - Если название репозитория другое, измените `base` в `vite.config.js` на `/ваше-название-репозитория/`

4. **После push в main:**
   - GitHub Actions автоматически соберет проект и задеплоит его
   - Проверить статус можно в разделе `Actions` репозитория
   - Сайт будет доступен по адресу: `https://ВАШ_USERNAME.github.io/Uniseller-TEST/`

### Ручной деплой (альтернатива)

Если хотите деплоить вручную:

```bash
# Установите gh-pages (если еще не установлен)
npm install --save-dev gh-pages

# Соберите и задеплойте
npm run deploy
```

**Важно:** При ручном деплое убедитесь, что в настройках репозитория (`Settings` → `Pages`) выбран источник `gh-pages` branch.

### Локальная проверка продакшен сборки

Перед деплоем можно проверить сборку локально:

```bash
npm run build
npm run preview
```

Это запустит локальный сервер с продакшен сборкой, чтобы убедиться, что всё работает корректно.
