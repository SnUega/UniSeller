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
