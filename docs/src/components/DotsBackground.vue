<template>
  <canvas 
    ref="dotsCanvas" 
    class="dots-background"
    :class="canvasClass"
  ></canvas>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const props = defineProps({
  /**
   * CSS класс для canvas
   */
  canvasClass: {
    type: String,
    default: ''
  },
  /**
   * Фиксированная ширина (если не указана, берется из контейнера)
   */
  width: {
    type: Number,
    default: null
  },
  /**
   * Фиксированная высота (если не указана, берется из контейнера)
   */
  height: {
    type: Number,
    default: null
  },
  /**
   * Родительский элемент для получения размеров
   */
  containerRef: {
    type: Object,
    default: null
  },
  /**
   * Z-index для canvas
   */
  zIndex: {
    type: Number,
    default: 0
  },
  /**
   * Показывать ли canvas (для условного рендеринга)
   */
  visible: {
    type: Boolean,
    default: true
  }
})

const dotsCanvas = ref(null)
let ctx = null
let animationId = null
const dots = []
const mouseX = ref(-1000)
const mouseY = ref(-1000)

// Оптимизация FPS для мобильных
let lastDrawTime = 0
const TARGET_FPS = 60
const MOBILE_FPS = 30
const FRAME_TIME = 1000 / TARGET_FPS
const MOBILE_FRAME_TIME = 1000 / MOBILE_FPS

const initDots = (w, h) => {
  dots.length = 0
  const isMobile = window.innerWidth <= 768
  const fixedSpacing = 20
  
  if (isMobile) {
    // На мобильных: равный интервал 20px по вертикали и горизонтали
    const cols = Math.ceil(w / fixedSpacing) + 1
    const rows = Math.ceil(h / fixedSpacing) + 1
    
    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < cols; x++) {
        dots.push({ x: x * fixedSpacing, y: y * fixedSpacing })
      }
    }
  } else {
    // На десктопе: адаптивная сетка
    const cols = Math.ceil(w / 20) + 1
    const rows = Math.ceil(h / 20) + 1
    const sx = w / (cols - 1)
    const sy = h / (rows - 1)
    
    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < cols; x++) {
        dots.push({ x: x * sx, y: y * sy })
      }
    }
  }
}

const draw = (currentTime = 0) => {
  if (!ctx || !dotsCanvas.value || !props.visible) {
    if (animationId) {
      cancelAnimationFrame(animationId)
      animationId = null
    }
    return
  }
  
  // Ограничение FPS для оптимизации производительности на мобильных
  const isMobileDevice = window.innerWidth <= 768
  const frameTime = isMobileDevice ? MOBILE_FRAME_TIME : FRAME_TIME
  const elapsed = currentTime - lastDrawTime
  if (elapsed < frameTime && lastDrawTime > 0) {
    animationId = requestAnimationFrame(draw)
    return
  }
  lastDrawTime = currentTime
  
  const dpr = window.devicePixelRatio || 1
  const w = dotsCanvas.value.width / dpr
  const h = dotsCanvas.value.height / dpr
  ctx.clearRect(0, 0, w, h)
  const mx = mouseX.value
  const my = mouseY.value
  const maxD = 100 * 100

  // Batch rendering базовых точек для оптимизации
  ctx.fillStyle = 'rgba(53,53,53,0.4)'
  ctx.beginPath()
  for (let i = 0; i < dots.length; i++) {
    const d = dots[i]
    ctx.moveTo(d.x + 1.5, d.y)
    ctx.arc(d.x, d.y, 1.5, 0, Math.PI * 2)
  }
  ctx.fill()

  // Оптимизированный рендеринг активных точек
  for (let i = 0; i < dots.length; i++) {
    const d = dots[i]
    const dx = mx - d.x
    const dy = my - d.y
    const distSq = dx * dx + dy * dy
    if (distSq < maxD) {
      const inf = 1 - Math.sqrt(distSq) / 100
      const size = 2 + inf * inf * 8
      const op = inf * inf * 0.7
      const g = ctx.createRadialGradient(d.x, d.y, 0, d.x, d.y, size * 2.5)
      g.addColorStop(0, `rgba(255,213,138,${op * 0.7})`)
      g.addColorStop(0.4, `rgba(255,169,44,${op * 0.4})`)
      g.addColorStop(1, 'rgba(255,169,44,0)')
      ctx.fillStyle = g
      ctx.beginPath()
      ctx.arc(d.x, d.y, size * 2.5, 0, Math.PI * 2)
      ctx.fill()
      ctx.fillStyle = `rgba(255,213,138,${op * 0.7})`
      ctx.beginPath()
      ctx.arc(d.x, d.y, size * 0.6, 0, Math.PI * 2)
      ctx.fill()
    }
  }
  animationId = requestAnimationFrame(draw)
}

const handleMouseMove = (e) => {
  if (!dotsCanvas.value) return
  const canvasRect = dotsCanvas.value.getBoundingClientRect()
  const x = e.clientX - canvasRect.left
  const y = e.clientY - canvasRect.top
  if (x >= 0 && y >= 0 && x <= canvasRect.width && y <= canvasRect.height) {
    mouseX.value = x
    mouseY.value = y
  } else {
    mouseX.value = -1000
    mouseY.value = -1000
  }
}

const handleTouchMove = (e) => {
  if (!dotsCanvas.value) return
  const touch = e.touches[0]
  if (!touch) return
  const canvasRect = dotsCanvas.value.getBoundingClientRect()
  const x = touch.clientX - canvasRect.left
  const y = touch.clientY - canvasRect.top
  if (x >= 0 && x <= canvasRect.width && y >= 0 && y <= canvasRect.height) {
    mouseX.value = x
    mouseY.value = y
  } else {
    mouseX.value = -1000
    mouseY.value = -1000
  }
}

const handleTouchStart = (e) => {
  if (!dotsCanvas.value) return
  const touch = e.touches[0]
  if (!touch) return
  const canvasRect = dotsCanvas.value.getBoundingClientRect()
  const x = touch.clientX - canvasRect.left
  const y = touch.clientY - canvasRect.top
  if (x >= 0 && x <= canvasRect.width && y >= 0 && y <= canvasRect.height) {
    mouseX.value = x
    mouseY.value = y
  }
}

const handleTouchEnd = () => {
  mouseX.value = -1000
  mouseY.value = -1000
}

// Throttle для resize canvas на мобильных
let resizeCanvasTimeout = null
const resizeCanvas = () => {
  if (!dotsCanvas.value) return
  const dpr = window.devicePixelRatio || 1
  const w = props.width || (props.containerRef?.value?.offsetWidth || window.innerWidth)
  const h = props.height || (props.containerRef?.value?.offsetHeight || window.innerHeight)
  
  dotsCanvas.value.width = w * dpr
  dotsCanvas.value.height = h * dpr
  dotsCanvas.value.style.width = w + 'px'
  dotsCanvas.value.style.height = h + 'px'
  ctx = dotsCanvas.value.getContext('2d', { alpha: true, desynchronized: true })
  ctx.scale(dpr, dpr)
  initDots(w, h)
}

const throttledResizeCanvas = () => {
  if (resizeCanvasTimeout) {
    cancelAnimationFrame(resizeCanvasTimeout)
  }
  resizeCanvasTimeout = requestAnimationFrame(() => {
    resizeCanvas()
    resizeCanvasTimeout = null
  })
}

onMounted(() => {
  resizeCanvas()
  draw()
  document.addEventListener('mousemove', handleMouseMove, { passive: true })
  document.addEventListener('touchstart', handleTouchStart, { passive: true })
  document.addEventListener('touchmove', handleTouchMove, { passive: true })
  document.addEventListener('touchend', handleTouchEnd, { passive: true })
  document.addEventListener('touchcancel', handleTouchEnd, { passive: true })
  window.addEventListener('resize', throttledResizeCanvas, { passive: true })
  
  // ResizeObserver для отслеживания изменений размера контейнера
  let resizeObserver = null
  if (props.containerRef?.value && window.ResizeObserver) {
    resizeObserver = new ResizeObserver(() => throttledResizeCanvas())
    resizeObserver.observe(props.containerRef.value)
  }
})

onUnmounted(() => {
  if (animationId) cancelAnimationFrame(animationId)
  document.removeEventListener('mousemove', handleMouseMove)
  document.removeEventListener('touchstart', handleTouchStart)
  document.removeEventListener('touchmove', handleTouchMove)
  document.removeEventListener('touchend', handleTouchEnd)
  document.removeEventListener('touchcancel', handleTouchEnd)
  window.removeEventListener('resize', throttledResizeCanvas)
  if (resizeCanvasTimeout) cancelAnimationFrame(resizeCanvasTimeout)
})
</script>

<style scoped>
.dots-background {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  /* Плавный переход прозрачности по верхней и нижней границе */
  mask-image: linear-gradient(
    to bottom,
    transparent 0%,
    black 5%,
    black 95%,
    transparent 100%
  );
  -webkit-mask-image: linear-gradient(
    to bottom,
    transparent 0%,
    black 5%,
    black 95%,
    transparent 100%
  );
}
</style>
