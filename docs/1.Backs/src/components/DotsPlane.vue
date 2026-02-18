<template>
  <canvas 
    ref="canvas" 
    class="dots-canvas"
    :class="{ 'full-screen': fullScreen }"
  ></canvas>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const props = defineProps({
  fullScreen: {
    type: Boolean,
    default: false
  }
})

const canvas = ref(null)
let ctx = null
let animationId = null
const mouseX = ref(-1000)
const mouseY = ref(-1000)
let isRunning = false

const dots = []
let canvasWidth = 0
let canvasHeight = 892
let COLS = 60
let ROWS = 38
const MAX_DISTANCE = 120

// Адаптивное количество колонок в зависимости от ширины экрана
const getAdaptiveCols = () => {
  const width = window.innerWidth
  if (width <= 480) return 16
  if (width <= 640) return 22
  if (width <= 768) return 30
  if (width <= 1024) return 40
  return 60
}

// Адаптивное количество строк
const getAdaptiveRows = () => {
  if (props.fullScreen) {
    const height = window.innerHeight
    if (height <= 480) return 16
    if (height <= 640) return 22
    if (height <= 768) return 28
    if (height <= 900) return 32
    return 38
  }
  const width = window.innerWidth
  if (width <= 480) return 16
  if (width <= 640) return 22
  if (width <= 768) return 28
  if (width <= 1024) return 32
  return 38
}

// Глобальный обработчик на document - ловит ВСЕ движения мыши
const handleMouseMove = (e) => {
  if (!canvas.value) return
  
  const rect = canvas.value.getBoundingClientRect()
  const x = e.clientX - rect.left
  const y = e.clientY - rect.top
  
  // Проверяем что курсор в пределах canvas
  if (x >= 0 && x <= canvasWidth && y >= 0 && y <= canvasHeight) {
    mouseX.value = x
    mouseY.value = y
    
    if (!isRunning) {
      isRunning = true
      draw()
    }
  } else {
    mouseX.value = -1000
    mouseY.value = -1000
  }
}

// Тач-обработчики — НИКОГДА не блокируют скролл (все passive: true)
// Эффект точек работает параллельно со скроллом
const handleTouchMove = (e) => {
  if (!canvas.value) return
  
  const touch = e.touches[0]
  if (!touch) return
  
  const rect = canvas.value.getBoundingClientRect()
  const x = touch.clientX - rect.left
  const y = touch.clientY - rect.top
  
  if (x >= 0 && x <= canvasWidth && y >= 0 && y <= canvasHeight) {
    mouseX.value = x
    mouseY.value = y
    
    if (!isRunning) {
      isRunning = true
      draw()
    }
  } else {
    mouseX.value = -1000
    mouseY.value = -1000
  }
}

const handleTouchStart = (e) => {
  if (!canvas.value) return
  const touch = e.touches[0]
  if (!touch) return
  
  const rect = canvas.value.getBoundingClientRect()
  const x = touch.clientX - rect.left
  const y = touch.clientY - rect.top
  
  if (x >= 0 && x <= canvasWidth && y >= 0 && y <= canvasHeight) {
    mouseX.value = x
    mouseY.value = y
    
    if (!isRunning) {
      isRunning = true
      draw()
    }
  }
}

const handleTouchEnd = () => {
  mouseX.value = -1000
  mouseY.value = -1000
}

const initDots = () => {
  dots.length = 0
  
  // Обновляем количество колонок и строк в зависимости от размера экрана
  COLS = getAdaptiveCols()
  ROWS = getAdaptiveRows()
  
  const spacingX = canvasWidth / (COLS - 1)
  const spacingY = canvasHeight / (ROWS - 1)
  
  for (let y = 0; y < ROWS; y++) {
    for (let x = 0; x < COLS; x++) {
      dots.push({
        x: x * spacingX,
        y: y * spacingY
      })
    }
  }
}

let lastDrawTime = 0
const TARGET_FPS = 60
const FRAME_TIME = 1000 / TARGET_FPS

const draw = (currentTime = 0) => {
  if (!ctx || !canvas.value) {
    isRunning = false
    return
  }
  
  const elapsed = currentTime - lastDrawTime
  if (elapsed < FRAME_TIME) {
    animationId = requestAnimationFrame(draw)
    return
  }
  lastDrawTime = currentTime
  
  ctx.clearRect(0, 0, canvasWidth, canvasHeight)
  
  const mx = mouseX.value
  const my = mouseY.value
  const maxDistSq = MAX_DISTANCE * MAX_DISTANCE
  
  // Batch rendering базовых точек
  ctx.fillStyle = 'rgba(53, 53, 53, 0.4)'
  ctx.beginPath()
  for (let i = 0; i < dots.length; i++) {
    ctx.moveTo(dots[i].x + 1.5, dots[i].y)
    ctx.arc(dots[i].x, dots[i].y, 1.5, 0, Math.PI * 2)
  }
  ctx.fill()
  
  // Активные точки
  for (let i = 0; i < dots.length; i++) {
    const dot = dots[i]
    
    const dx = mx - dot.x
    const dy = my - dot.y
    const distSq = dx * dx + dy * dy
    
    if (distSq < maxDistSq) {
      const distance = Math.sqrt(distSq)
      const influence = 1 - (distance / MAX_DISTANCE)
      const size = 2 + influence * influence * 8
      const opacity = influence * influence * 0.9
      
      // Внешнее свечение
      const outerGlow = ctx.createRadialGradient(dot.x, dot.y, 0, dot.x, dot.y, size * 2.5)
      outerGlow.addColorStop(0, `rgba(255, 213, 138, ${opacity * 0.8})`)
      outerGlow.addColorStop(0.4, `rgba(255, 169, 44, ${opacity * 0.5})`)
      outerGlow.addColorStop(1, `rgba(255, 169, 44, 0)`)
      
      ctx.fillStyle = outerGlow
      ctx.beginPath()
      ctx.arc(dot.x, dot.y, size * 2.5, 0, Math.PI * 2)
      ctx.fill()
      
      // Центральная точка
      ctx.fillStyle = `rgba(255, 213, 138, ${opacity})`
      ctx.beginPath()
      ctx.arc(dot.x, dot.y, size * 0.6, 0, Math.PI * 2)
      ctx.fill()
    }
  }
  
  if (isRunning) {
    animationId = requestAnimationFrame(draw)
  }
}

const resize = () => {
  if (!canvas.value) return
  
  const dpr = window.devicePixelRatio || 1
  canvasWidth = window.innerWidth
  
  // В fullScreen режиме canvas занимает весь viewport
  if (props.fullScreen) {
    canvasHeight = window.innerHeight
  } else {
    canvasHeight = 892
  }
  
  canvas.value.width = canvasWidth * dpr
  canvas.value.height = canvasHeight * dpr
  canvas.value.style.width = canvasWidth + 'px'
  canvas.value.style.height = canvasHeight + 'px'
  
  ctx = canvas.value.getContext('2d', { 
    alpha: true,
    desynchronized: true,
    willReadFrequently: false
  })
  
  ctx.scale(dpr, dpr)
  
  initDots()
  
  // Начальная отрисовка
  ctx.fillStyle = 'rgba(53, 53, 53, 0.4)'
  ctx.beginPath()
  dots.forEach(dot => {
    ctx.moveTo(dot.x + 1.5, dot.y)
    ctx.arc(dot.x, dot.y, 1.5, 0, Math.PI * 2)
  })
  ctx.fill()
}

onMounted(() => {
  if (!canvas.value) return
  
  resize()
  
  isRunning = true
  draw()
  
  // Мышь
  document.addEventListener('mousemove', handleMouseMove, { passive: true })
  
  // Тач-события — ВСЕ passive: true, НЕ блокируют скролл
  // Эффект точек работает как бонус при свайпе, не мешая прокрутке
  document.addEventListener('touchstart', handleTouchStart, { passive: true })
  document.addEventListener('touchmove', handleTouchMove, { passive: true })
  document.addEventListener('touchend', handleTouchEnd, { passive: true })
  document.addEventListener('touchcancel', handleTouchEnd, { passive: true })
  
  window.addEventListener('resize', resize)
})

onUnmounted(() => {
  isRunning = false
  if (animationId) cancelAnimationFrame(animationId)
  document.removeEventListener('mousemove', handleMouseMove)
  document.removeEventListener('touchstart', handleTouchStart)
  document.removeEventListener('touchmove', handleTouchMove)
  document.removeEventListener('touchend', handleTouchEnd)
  document.removeEventListener('touchcancel', handleTouchEnd)
  window.removeEventListener('resize', resize)
})
</script>

<style scoped>
.dots-canvas {
  position: absolute;
  top: 0;
  left: 0;
  width: 100vw;
  height: 892px;
  z-index: 1;
  pointer-events: none; /* Canvas не ловит события, но рисует эффект */
}

.dots-canvas.full-screen {
  width: 100%;
  height: 100%;
}
</style>
