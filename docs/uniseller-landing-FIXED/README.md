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
