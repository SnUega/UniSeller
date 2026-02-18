<template>
  <section class="solutions" ref="sectionRef">
    <!-- Dots background - full section -->
    <canvas ref="dotsCanvas" class="dots-background"></canvas>

    <div class="container">
      <div class="solutions-header">
        <h2 class="section-title">Решения для автоматизации<br>и продвижения бизнеса на маркетплейсах</h2>
        <div class="slider-nav">
          <button @click="prevSlide" class="nav-btn" :disabled="currentSlide === 0" aria-label="Previous">
            <img src="/src/assets/images/ico/slider-nav-arrow.svg" alt="" class="arrow-prev" />
          </button>
          <button @click="nextSlide" class="nav-btn" :disabled="currentSlide >= maxSlide" aria-label="Next">
            <img src="/src/assets/images/ico/slider-nav-arrow.svg" alt="" class="arrow-next" />
          </button>
        </div>
      </div>
    </div>

    <!-- Slider - outside container, bleeds to right edge -->
    <div class="slider-outer" ref="sliderEl">
      <div class="slider-inner-pad">
        <div
          class="slider-track"
          :style="{ transform: `translateX(-${currentSlide * (cardWidth + gap)}px)` }"
        >
          <div
            v-for="(slide, i) in slides"
            :key="i"
            class="solution-card"
            :class="{ 'active': currentSlide === i }"
          >
            <h3 class="card-title">{{ slide.title }}</h3>
            <p class="card-text">{{ slide.text }}</p>
            <div class="card-image">
              <img :src="slide.image" :alt="slide.title" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'

const sectionRef = ref(null)
const sliderEl = ref(null)
const dotsCanvas = ref(null)
const currentSlide = ref(0)
const cardWidth = 480
const gap = 24

const slides = [
  {
    title: 'Интеграция с 1С и «МойСклад»',
    text: 'Uniseller обеспечивает синхронизацию 1С (УТ, ERP, КА) и «МойСклад» с маркетплейсами.',
    image: '/src/assets/images/1c-int.png'
  },
  {
    title: 'Кастомная интеграция с CRM',
    text: 'Автоматизация, снижение ручного труда, ускорение процессов',
    image: '/src/assets/images/CRM-int.png'
  },
  {
    title: 'Бот для работы с отзывами',
    text: 'Рост рейтинга магазина, экономия десятки часов ручной работы каждый месяц',
    image: '/src/assets/images/bot-phone.png'
  },
  {
    title: 'Парсер товаров',
    text: 'Сбор данных о конкурентах, анализ рынка, мониторинг цен',
    image: '/src/assets/images/parser.png'
  }
]

const maxSlide = computed(() => {
  const vw = viewportW.value
  const containerLeft = Math.max(20, (vw - 1240) / 2 + 20)
  const availableW = vw - containerLeft
  const visibleCards = Math.max(1, Math.floor((availableW + gap) / (cardWidth + gap)))
  return Math.max(0, slides.length - visibleCards)
})

const viewportW = ref(typeof window !== 'undefined' ? window.innerWidth : 1440)

const nextSlide = () => {
  if (currentSlide.value < maxSlide.value) currentSlide.value++
}

const prevSlide = () => {
  if (currentSlide.value > 0) currentSlide.value--
}

// Dots
let ctx = null
let animationId = null
const dots = []
const mouseX = ref(-1000)
const mouseY = ref(-1000)
const COLS = 60
const ROWS = ref(30) // Will be calculated dynamically based on height

const handleMouseMove = (e) => {
  if (!sectionRef.value || !dotsCanvas.value) return
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

const initDots = (w, h) => {
  dots.length = 0
  // Calculate horizontal spacing first
  const sx = w / (COLS - 1)
  
  // Calculate ROWS so that vertical spacing matches horizontal spacing
  ROWS.value = Math.max(2, Math.round(h / sx) + 1)
  
  const sy = h / (ROWS.value - 1)
  for (let y = 0; y < ROWS.value; y++) {
    for (let x = 0; x < COLS; x++) {
      dots.push({ x: x * sx, y: y * sy })
    }
  }
}

const draw = () => {
  if (!ctx || !dotsCanvas.value) return
  const dpr = window.devicePixelRatio || 1
  const w = dotsCanvas.value.width / dpr
  const h = dotsCanvas.value.height / dpr
  ctx.clearRect(0, 0, w, h)
  const mx = mouseX.value
  const my = mouseY.value
  const maxD = 100 * 100

  ctx.fillStyle = 'rgba(53,53,53,0.4)'
  ctx.beginPath()
  dots.forEach(d => { ctx.moveTo(d.x + 1.5, d.y); ctx.arc(d.x, d.y, 1.5, 0, Math.PI * 2) })
  ctx.fill()

  dots.forEach(d => {
    const dx = mx - d.x, dy = my - d.y
    const distSq = dx * dx + dy * dy
    if (distSq < maxD) {
      const inf = 1 - Math.sqrt(distSq) / 100
      const size = 2 + inf * inf * 8
      const op = inf * inf * 0.7 // Increased from 0.5 to 0.7 for more brightness
      const g = ctx.createRadialGradient(d.x, d.y, 0, d.x, d.y, size * 2.5)
      g.addColorStop(0, `rgba(255,213,138,${op * 0.7})`) // Increased from 0.6 to 0.7
      g.addColorStop(0.4, `rgba(255,169,44,${op * 0.4})`) // Increased from 0.3 to 0.4
      g.addColorStop(1, 'rgba(255,169,44,0)')
      ctx.fillStyle = g
      ctx.beginPath()
      ctx.arc(d.x, d.y, size * 2.5, 0, Math.PI * 2)
      ctx.fill()
      ctx.fillStyle = `rgba(255,213,138,${op * 0.7})` // Increased from 0.5 to 0.7
      ctx.beginPath()
      ctx.arc(d.x, d.y, size * 0.6, 0, Math.PI * 2)
      ctx.fill()
    }
  })
  animationId = requestAnimationFrame(draw)
}

const resizeCanvas = () => {
  viewportW.value = window.innerWidth
  if (!dotsCanvas.value || !sectionRef.value) return
  const dpr = window.devicePixelRatio || 1
  const w = sectionRef.value.offsetWidth
  
  // Get SecuritySection height dynamically
  const securitySection = document.querySelector('.security')
  const securityHeight = securitySection ? securitySection.offsetHeight : 320
  
  // SolutionsSection header area: padding-top (120px) + header (48px) + gap (80px) = 248px
  // Add extra space to reach slightly below the top edge of slider cards
  // Cards start after header, so we add ~120px more to go below card top edge (2 more rows)
  const h = securityHeight + 248 + 200 // SecuritySection + header + extra space below card top
  
  dotsCanvas.value.width = w * dpr
  dotsCanvas.value.height = h * dpr
  dotsCanvas.value.style.width = w + 'px'
  dotsCanvas.value.style.height = h + 'px'
  ctx = dotsCanvas.value.getContext('2d', { alpha: true, desynchronized: true })
  ctx.scale(dpr, dpr)
  initDots(w, h)
  
  // Update CSS top position to start from SecuritySection
  if (dotsCanvas.value) {
    dotsCanvas.value.style.top = `-${securityHeight}px`
  }
}

// Touch swipe support
let touchStartX = 0
let touchStartY = 0
let isSwiping = false

const onTouchStart = (e) => {
  touchStartX = e.touches[0].clientX
  touchStartY = e.touches[0].clientY
  isSwiping = false
}

const onTouchMove = (e) => {
  const dx = e.touches[0].clientX - touchStartX
  const dy = e.touches[0].clientY - touchStartY
  // Determine swipe direction on first significant move
  if (!isSwiping && Math.abs(dx) > 5) {
    if (Math.abs(dx) > Math.abs(dy)) {
      // Horizontal swipe — prevent page scroll
      isSwiping = true
      e.preventDefault()
    }
  } else if (isSwiping) {
    e.preventDefault()
  }
}

const onTouchEnd = (e) => {
  if (!isSwiping) return
  const dx = e.changedTouches[0].clientX - touchStartX
  if (Math.abs(dx) > 50) {
    if (dx < 0) nextSlide()
    else prevSlide()
  }
}

onMounted(() => {
  resizeCanvas()
  draw()
  document.addEventListener('mousemove', handleMouseMove, { passive: true })
  window.addEventListener('resize', resizeCanvas)
  const el = sliderEl.value
  if (el) {
    el.addEventListener('touchstart', onTouchStart, { passive: true })
    el.addEventListener('touchmove', onTouchMove, { passive: false })
    el.addEventListener('touchend', onTouchEnd, { passive: true })
  }
})

onUnmounted(() => {
  if (animationId) cancelAnimationFrame(animationId)
  document.removeEventListener('mousemove', handleMouseMove)
  window.removeEventListener('resize', resizeCanvas)
  const el = sliderEl.value
  if (el) {
    el.removeEventListener('touchstart', onTouchStart)
    el.removeEventListener('touchmove', onTouchMove)
    el.removeEventListener('touchend', onTouchEnd)
  }
})
</script>

<style scoped>
.solutions {
  padding: 120px 0 80px;
  position: relative;
  overflow: visible; /* cards bleed right */
}

/* Dots start from SecuritySection, end below SolutionsSection header (above cards) */
.dots-background {
  position: absolute;
  top: 0; /* Will be set dynamically via JS to -securityHeight */
  left: 0;
  width: 100%;
  height: calc(120px + 48px + 80px); /* Will be set dynamically via JS */
  z-index: 0;
  pointer-events: none;
}

.container {
  max-width: 1240px;
  margin: 0 auto;
  padding: 0 20px;
  position: relative;
  z-index: 1;
}

.solutions-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 48px;
}

.section-title {
  font-family: 'Benzin', 'Arial Black', sans-serif;
  font-weight: 400;
  font-size: 36px;
  line-height: 110%;
  color: rgba(255, 255, 255, 0.8);
  text-align: left;
}

/* Nav buttons */
.slider-nav {
  display: flex;
  gap: 16px;
  flex-shrink: 0;
  margin-top: 8px;
}

.nav-btn {
  width: 52px;
  height: 52px;
  border-radius: 50%;
  border: 1px solid rgba(255, 255, 255, 0.12);
  background: rgba(255, 255, 255, 0.05);
  cursor: pointer;
  transition: all 0.3s;
  display: flex;
  align-items: center;
  justify-content: center;
  backdrop-filter: blur(8px);
}

.nav-btn:hover:not(:disabled) {
  border-color: rgba(255, 213, 138, 0.35);
  background: rgba(255, 255, 255, 0.08);
}

.nav-btn:disabled {
  opacity: 0.3;
  cursor: default;
}

/* Arrows — prev points RIGHT, next points LEFT (reversed) */
.arrow-prev {
  transform: rotate(0deg);
}

.arrow-next {
  transform: rotate(180deg);
}

/* Slider bleeds to right viewport edge */
.slider-outer {
  position: relative;
  z-index: 1;
  overflow: visible;
}

.slider-inner-pad {
  /* Start aligned with container left edge */
  margin-left: calc((100vw - 1240px) / 2 + 20px);
  overflow: visible;
}

.slider-track {
  display: flex;
  gap: 24px;
  transition: transform 0.55s cubic-bezier(0.4, 0, 0.2, 1);
}

/* Cards */
.solution-card {
  min-width: 480px;
  flex: 0 0 480px;
  border-radius: 24px;
  padding: 24px;
  background: rgba(255, 255, 255, 0.06);
  backdrop-filter: blur(8px);
  display: flex;
  flex-direction: column;
  gap: 12px;
  position: relative;
  isolation: isolate; /* prevent backdrop-filter bleed / glitch on edges */
}

/* Active card — gradient border, always rendered but fades in */
.solution-card::before {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: 24px;
  padding: 2px;
  background:
    linear-gradient(93.85deg, rgba(255, 213, 138, 0.3) 0%, rgba(255, 213, 138, 0.12) 100%),
    linear-gradient(64.18deg, rgba(255, 169, 44, 0) 72.93%, #FFA92C 93.92%);
  -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  -webkit-mask-composite: xor;
  mask-composite: exclude;
  pointer-events: none;
  opacity: 0;
  transition: opacity 0.5s ease;
}

.solution-card.active::before {
  opacity: 1;
}

.card-image {
  width: 100%;
  height: 240px;
  border-radius: 12px;
  overflow: hidden;
  background: transparent;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: auto;
}

.card-image img {
  width: 100%;
  height: 100%;
  object-fit: contain;
  display: block;
}

.card-title {
  font-family: 'Benzin', 'Arial Black', sans-serif;
  font-weight: 400;
  font-size: 18px;
  line-height: 130%;
  color: rgba(255, 255, 255, 0.9);
  position: relative;
  z-index: 1;
}

.card-text {
  font-family: 'PP Mori', sans-serif;
  font-weight: 500;
  font-size: 15px;
  line-height: 130%;
  color: rgba(255, 255, 255, 0.7);
  position: relative;
  z-index: 1;
}

@media (max-width: 1280px) {
  .slider-inner-pad {
    margin-left: 20px;
  }
}

@media (max-width: 968px) {
  .solutions-header {
    flex-direction: column;
    gap: 24px;
  }
  .section-title { text-align: center; }
  .slider-nav { align-self: center; }
  .solution-card {
    min-width: 360px;
    flex: 0 0 360px;
  }
}

@media (max-width: 640px) {
  .solutions { padding: 80px 0 60px; }
  .section-title { font-size: 28px; }
  .solution-card {
    min-width: calc(100vw - 48px);
    flex: 0 0 calc(100vw - 48px);
  }
  .slider-inner-pad { margin-left: 20px; }
}
</style>
