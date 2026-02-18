# Инструкция по установке шрифтов PP Mori и Benzin

## Проблема
Шрифты с CDN могут не загружаться или загружаться не те версии.

## Решение: Добавить шрифты локально

### Шаг 1: Скачайте шрифты

**PP Mori:**
1. Зайдите на https://fonts.cdnfonts.com/css/pp-mori
2. Скачайте файлы шрифта (.woff2 или .ttf)
3. Или найдите "PP Mori font download" в Google

**Benzin (Benzin-Regular):**
1. Зайдите на https://www.dafont.com/benzin.font
2. Скачайте шрифт
3. Или найдите "Benzin font download" в Google

### Шаг 2: Создайте папку для шрифтов

В проекте создайте:
```
/src/assets/fonts/
  ├── PPMori-Regular.woff2
  ├── PPMori-Medium.woff2
  ├── PPMori-SemiBold.woff2
  └── Benzin-Regular.woff2
```

### Шаг 3: Добавьте @font-face в main.css

Откройте `/src/assets/styles/main.css` и добавьте в начало:

```css
/* PP Mori */
@font-face {
  font-family: 'PP Mori';
  src: url('../fonts/PPMori-Regular.woff2') format('woff2');
  font-weight: 400;
  font-style: normal;
  font-display: swap;
}

@font-face {
  font-family: 'PP Mori';
  src: url('../fonts/PPMori-Medium.woff2') format('woff2');
  font-weight: 500;
  font-style: normal;
  font-display: swap;
}

@font-face {
  font-family: 'PP Mori';
  src: url('../fonts/PPMori-SemiBold.woff2') format('woff2');
  font-weight: 600;
  font-style: normal;
  font-display: swap;
}

/* Benzin */
@font-face {
  font-family: 'Benzin';
  src: url('../fonts/Benzin-Regular.woff2') format('woff2');
  font-weight: 400;
  font-style: normal;
  font-display: swap;
}
```

### Шаг 4: Удалите CDN ссылки

В `index.html` удалите строки:
```html
<style>
  @import url('https://fonts.cdnfonts.com/css/pp-mori');
  @import url('https://fonts.cdnfonts.com/css/benzin');
</style>
```

### Альтернатива: Google Fonts похожие шрифты

Если не можете найти эти шрифты, используйте похожие:

**Вместо PP Mori:** Inter или DM Sans
**Вместо Benzin:** Bebas Neue или Oswald

В `index.html`:
```html
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Bebas+Neue&display=swap" rel="stylesheet">
```

В CSS замените:
```css
font-family: 'Inter', sans-serif; /* вместо PP Mori */
font-family: 'Bebas Neue', sans-serif; /* вместо Benzin */
```

## Проверка

После добавления шрифтов:
1. Перезапустите `npm run dev`
2. Откройте DevTools (F12) → Network → Font
3. Проверьте что шрифты загрузились
4. В Elements → Computed найдите элемент и проверьте что используется правильный шрифт
