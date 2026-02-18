# Инструкция по добавлению Aurora Gradient из ReactBits

## Шаг 1: Откройте файл
Откройте `/src/components/HeroSection.vue`

## Шаг 2: Найдите блок `.aurora-bg`
В секции `<style scoped>` найдите:
```css
.aurora-bg {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 892px;
  z-index: 0;
  pointer-events: none;
  /* ВОТ ЗДЕСЬ ЗАМЕНИТЬ СТИЛИ */
}
```

## Шаг 3: Получите код из ReactBits
1. Откройте: https://reactbits.dev/backgrounds/aurora?color1=e1a92c&color2=e1d58a&color3=604815&blend=0.74
2. Нажмите "View Code"
3. Скопируйте CSS стили из секции `.aurora`

## Шаг 4: Вставьте стили
Замените содержимое `.aurora-bg` на скопированные стили из ReactBits

## Пример результата:
```css
.aurora-bg {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 892px;
  z-index: 0;
  pointer-events: none;
  
  /* Вставьте сюда код из ReactBits */
  background: 
    /* их градиенты и анимация */
}
```

## Альтернатива: Простая CSS анимация
Если ReactBits не подходит, можно использовать эту:
```css
.aurora-bg {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 892px;
  z-index: 0;
  pointer-events: none;
  background: 
    radial-gradient(ellipse 80% 50% at 50% -20%, rgba(225, 169, 44, 0.74), transparent),
    radial-gradient(ellipse 60% 50% at 80% 10%, rgba(225, 213, 138, 0.74), transparent),
    radial-gradient(ellipse 60% 50% at 20% 15%, rgba(96, 72, 21, 0.74), transparent);
  animation: aurora-shift 15s ease-in-out infinite;
}

@keyframes aurora-shift {
  0%, 100% {
    filter: hue-rotate(0deg) brightness(1);
  }
  33% {
    filter: hue-rotate(10deg) brightness(1.1);
  }
  66% {
    filter: hue-rotate(-5deg) brightness(0.9);
  }
}
```
