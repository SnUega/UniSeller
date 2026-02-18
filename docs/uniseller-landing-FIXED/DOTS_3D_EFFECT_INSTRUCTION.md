# Инструкция: 3D Dot Plane эффект

## Проблема
Нужен эффект где каждая точка реагирует на курсор индивидуально - чем ближе курсор, тем больше точка "вырастает" из плоскости.

## Решение

### Вариант 1: Простой CSS (рекомендуется для начала)
Заменить SVG на HTML точки с CSS transform:

```vue
<template>
  <div class="dots-container" @mousemove="handleMouseMove">
    <div 
      v-for="(dot, i) in dots" 
      :key="i"
      class="dot"
      :style="getDotStyle(dot, i)"
    ></div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const mouseX = ref(0)
const mouseY = ref(0)

// Generate grid of dots
const dots = []
const cols = 100
const rows = 60
for (let y = 0; y < rows; y++) {
  for (let x = 0; x < cols; x++) {
    dots.push({ x: x * 14, y: y * 14 })
  }
}

const handleMouseMove = (e) => {
  const rect = e.currentTarget.getBoundingClientRect()
  mouseX.value = e.clientX - rect.left
  mouseY.value = e.clientY - rect.top
}

const getDotStyle = (dot, i) => {
  const dx = mouseX.value - dot.x
  const dy = mouseY.value - dot.y
  const distance = Math.sqrt(dx * dx + dy * dy)
  const maxDistance = 200
  
  if (distance < maxDistance) {
    const scale = 1 + (1 - distance / maxDistance) * 3
    return {
      left: dot.x + 'px',
      top: dot.y + 'px',
      transform: `scale(${scale})`,
      opacity: 0.3 + (1 - distance / maxDistance) * 0.7
    }
  }
  
  return {
    left: dot.x + 'px',
    top: dot.y + 'px',
    transform: 'scale(1)',
    opacity: 0.3
  }
}
</script>

<style scoped>
.dots-container {
  position: absolute;
  width: 1420px;
  height: 892px;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
}

.dot {
  position: absolute;
  width: 2px;
  height: 2px;
  background: rgba(255, 213, 138, 0.5);
  border-radius: 50%;
  transition: transform 0.2s ease, opacity 0.2s ease;
  pointer-events: none;
}
</style>
```

### Вариант 2: Canvas (лучшая производительность)
Для большого количества точек лучше использовать Canvas:

1. Установите в terminal:
```bash
# Остановите dev server (Ctrl+C)
npm install
# Снова запустите
npm run dev
```

2. Создайте `/src/components/DotsPlane.vue`:

```vue
<template>
  <canvas 
    ref="canvas" 
    class="dots-canvas"
    @mousemove="handleMouseMove"
    @mouseleave="handleMouseLeave"
  ></canvas>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const canvas = ref(null)
let ctx = null
let animationId = null
const mouseX = ref(-1000)
const mouseY = ref(-1000)

const dots = []
const cols = 100
const rows = 60
const spacing = 14

// Initialize dots
for (let y = 0; y < rows; y++) {
  for (let x = 0; x < cols; x++) {
    dots.push({
      x: x * spacing,
      y: y * spacing,
      baseSize: 2,
      size: 2,
      opacity: 0.3
    })
  }
}

const handleMouseMove = (e) => {
  const rect = canvas.value.getBoundingClientRect()
  mouseX.value = e.clientX - rect.left
  mouseY.value = e.clientY - rect.top
}

const handleMouseLeave = () => {
  mouseX.value = -1000
  mouseY.value = -1000
}

const draw = () => {
  if (!ctx || !canvas.value) return
  
  ctx.clearRect(0, 0, canvas.value.width, canvas.value.height)
  
  dots.forEach(dot => {
    const dx = mouseX.value - dot.x
    const dy = mouseY.value - dot.y
    const distance = Math.sqrt(dx * dx + dy * dy)
    const maxDistance = 150
    
    if (distance < maxDistance) {
      const influence = 1 - distance / maxDistance
      dot.size = dot.baseSize + influence * 8
      dot.opacity = 0.3 + influence * 0.7
    } else {
      dot.size = dot.baseSize
      dot.opacity = 0.3
    }
    
    ctx.fillStyle = `rgba(255, 213, 138, ${dot.opacity})`
    ctx.beginPath()
    ctx.arc(dot.x, dot.y, dot.size, 0, Math.PI * 2)
    ctx.fill()
  })
  
  animationId = requestAnimationFrame(draw)
}

onMounted(() => {
  if (!canvas.value) return
  
  canvas.value.width = 1420
  canvas.value.height = 892
  ctx = canvas.value.getContext('2d')
  
  draw()
})

onUnmounted(() => {
  if (animationId) cancelAnimationFrame(animationId)
})
</script>

<style scoped>
.dots-canvas {
  position: absolute;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 1420px;
  height: 892px;
  z-index: 1;
}
</style>
```

3. В `HeroSection.vue` замените:
```vue
<!-- Было -->
<div class="dot-plane-wrapper">...</div>

<!-- Стало -->
<DotsPlane />

<!-- И добавьте import -->
<script setup>
import DotsPlane from './DotsPlane.vue'
</script>
```

## Выбор варианта
- **HTML+CSS**: Проще, но может лагать при большом количестве точек
- **Canvas**: Лучшая производительность, плавная анимация

Рекомендую начать с Canvas варианта!
