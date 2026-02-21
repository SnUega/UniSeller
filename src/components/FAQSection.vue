<template>
  <section class="faq" ref="sectionRef">
    <!-- Dots background -->
    <canvas ref="dotsCanvas" class="dots-background"></canvas>

    <!-- Blob layer -->
    <div class="blob-layer">
      <div class="blob-left" :style="blobLeftStyle">
        <img src="/src/assets/images/blob/blob-left-3.png" alt="" loading="lazy" />
      </div>
    </div>

    <div class="container">
      <h2 class="section-title">Ответы на наиболее часто<br>задаваемые вопросы</h2>

      <div class="faq-list">
        <div 
          v-for="(item, index) in faqItems" 
          :key="index"
          class="faq-item card-glow-border"
          :class="{ 'active': activeIndex === index }"
        >
          <button 
            class="faq-question" 
            @click="toggleItem(index)"
            :aria-expanded="activeIndex === index"
          >
            <span>{{ item.question }}</span>
            <svg 
              class="chevron" 
              :class="{ 'rotated': activeIndex === index }"
              width="24" 
              height="24" 
              viewBox="0 0 24 24" 
              fill="none"
            >
              <path d="M6 9L12 15L18 9" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </button>
          
          <transition 
            name="accordion"
            @enter="enter"
            @after-enter="afterEnter"
            @leave="leave"
            @after-leave="afterLeave"
          >
            <div v-if="activeIndex === index" class="faq-answer-wrapper">
              <div class="faq-answer">{{ item.answer }}</div>
            </div>
          </transition>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useCardGlow } from '../composables/useCardGlow.js'

const sectionRef = ref(null)

useCardGlow({
  cardSelector: '.faq-item',
  getSectionEl: () => sectionRef.value,
})
const scrollY = ref(0)
const sectionTop = ref(0)
const activeIndex = ref(null) // Initially closed
const dotsCanvas = ref(null)
const isMobile = computed(() => typeof window !== 'undefined' && window.innerWidth <= 1024)

// ======= Blob parallax =======
const blobLeftStyle = computed(() => {
  // Отключаем параллакс на мобильных для производительности
  if (isMobile.value) {
    return { transform: 'translateY(0px)' }
  }
  const offset = scrollY.value - sectionTop.value
  return {
    transform: `translateY(${offset * 0.38}px)`
  }
})

// Throttle для мобильных устройств
let scrollTimeout = null
let resizeTimeout = null

const handleScroll = () => {
  if (!sectionRef.value || isMobile.value) return // На мобильных не обрабатываем scroll для параллакса
  scrollY.value = window.scrollY
  sectionTop.value = sectionRef.value.offsetTop
}

const throttledScroll = () => {
  if (isMobile.value) return // На мобильных не нужен параллакс
  if (scrollTimeout) return
  scrollTimeout = requestAnimationFrame(() => {
    handleScroll()
    scrollTimeout = null
  })
}

const handleResize = () => {
  if (!sectionRef.value) return
  sectionTop.value = sectionRef.value.offsetTop
}

const throttledResize = () => {
  if (resizeTimeout) {
    cancelAnimationFrame(resizeTimeout)
  }
  resizeTimeout = requestAnimationFrame(() => {
    handleResize()
    resizeTimeout = null
  })
}

// Dots
let ctx = null
let animationId = null
const dots = []
const mouseX = ref(-1000)
const mouseY = ref(-1000)
const COLS = 60
const ROWS = ref(30)

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

// Тач-обработчики для свайпов (как в hero DotsPlane)
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
    const sx = w / (COLS - 1)
    const targetRowSpacing = sx
    ROWS.value = Math.max(30, Math.ceil(h / targetRowSpacing))
    
    const sy = h / (ROWS.value - 1)
    for (let y = 0; y < ROWS.value; y++) {
      for (let x = 0; x < COLS; x++) {
        dots.push({ x: x * sx, y: y * sy })
      }
    }
  }
}

// Оптимизация FPS для мобильных
let lastDrawTime = 0
const TARGET_FPS = 60
const MOBILE_FPS = 30 // Снижаем FPS на мобильных для производительности
const FRAME_TIME = 1000 / TARGET_FPS
const MOBILE_FRAME_TIME = 1000 / MOBILE_FPS

const draw = (currentTime = 0) => {
  if (!ctx || !dotsCanvas.value) {
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

const resizeCanvas = () => {
  if (!dotsCanvas.value || !sectionRef.value) return
  const dpr = window.devicePixelRatio || 1
  const w = sectionRef.value.offsetWidth
  const h = sectionRef.value.offsetHeight
  
  dotsCanvas.value.width = w * dpr
  dotsCanvas.value.height = h * dpr
  dotsCanvas.value.style.width = w + 'px'
  dotsCanvas.value.style.height = h + 'px'
  ctx = dotsCanvas.value.getContext('2d', { alpha: true, desynchronized: true })
  ctx.scale(dpr, dpr)
  initDots(w, h)
}

onMounted(() => {
  scrollY.value = window.scrollY
  if (sectionRef.value) {
    sectionTop.value = sectionRef.value.offsetTop
  }
  window.addEventListener('scroll', handleScroll, { passive: true })
  window.addEventListener('resize', handleResize, { passive: true })
  handleScroll()

  // Dots canvas setup
  resizeCanvas()
  window.addEventListener('resize', resizeCanvas)
  document.addEventListener('mousemove', handleMouseMove, { passive: true })
  // Добавляем обработчики для свайпов (как в hero DotsPlane)
  document.addEventListener('touchstart', handleTouchStart, { passive: true })
  document.addEventListener('touchmove', handleTouchMove, { passive: true })
  document.addEventListener('touchend', handleTouchEnd, { passive: true })
  document.addEventListener('touchcancel', handleTouchEnd, { passive: true })
  animationId = requestAnimationFrame(draw)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
  window.removeEventListener('resize', handleResize)
  if (animationId) cancelAnimationFrame(animationId)
  document.removeEventListener('mousemove', handleMouseMove)
  document.removeEventListener('touchstart', handleTouchStart)
  document.removeEventListener('touchmove', handleTouchMove)
  document.removeEventListener('touchend', handleTouchEnd)
  document.removeEventListener('touchcancel', handleTouchEnd)
  window.removeEventListener('resize', resizeCanvas)
})

const faqItems = ref([
  {
    question: 'Как работает ваше программное обеспечение CRM?',
    answer: 'Наше ПО работает на персональных серверах, что гарантирует безопасность ваших данных. Мы предоставляем интеграцию с вашей системой складского учета 1C и Мой Склад. Что обеспечивает вам контроль за всеми бизнес процессов.'
  },
  {
    question: 'Подходит ли ваша CRM-система для малого бизнеса?',
    answer: 'Да, наша система подходит для нужд любого масштаба бизнеса. Вы можете выбрать оптимальный тариф, который обеспечит вам комфорт в работе, исходя из ваших оборотов.'
  },
  {
    question: 'Могу ли я интегрировать CRM с другими инструментами?',
    answer: 'Да, наши специалисты предоставят вам возможность и помогут на всех этапах подключения. Будь то сторонний сервис, либо ваша самописная система. Uniseller оптимально подойдет для интеграции к любым платформам.'
  },
  {
    question: 'Какие функции включены в базовый план?',
    answer: 'Базовый тариф позволяет автоматизировать процесс обработки заказов и закрыть базовую потребность для вашего бизнеса. Позволяет вести до 6 кабинетов одновременно, добавлять товары до 10 штук в день и гарантирует обновление цен на всех маркетплейсах до 3 раз в сутки.'
  },
  {
    question: 'Как мне повысить или понизить тарифный план?',
    answer: 'Мы хорошо знаем все проблемы, с которыми встречаются наши клиенты. Мы собрали для вас в одном сервисе полный пакет модулей и необходимых услуг — все, что необходимо для успешных продаж.'
  }
])

const toggleItem = (index) => {
  activeIndex.value = activeIndex.value === index ? null : index
}

// Smooth height animation methods
const enter = (element) => {
  const height = element.scrollHeight
  element.style.height = '0'
  element.style.opacity = '0'
  element.style.overflow = 'hidden'
  // Force reflow
  element.offsetHeight
  requestAnimationFrame(() => {
    element.style.transition = 'height 0.4s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
    element.style.height = height + 'px'
    element.style.opacity = '1'
  })
}

const afterEnter = (element) => {
  element.style.height = 'auto'
  element.style.overflow = 'visible'
}

const leave = (element) => {
  const height = element.scrollHeight
  element.style.height = height + 'px'
  element.style.overflow = 'hidden'
  // Force reflow
  element.offsetHeight
  requestAnimationFrame(() => {
    element.style.transition = 'height 0.4s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
    element.style.height = '0'
    element.style.opacity = '0'
  })
}

const afterLeave = (element) => {
  element.style.height = ''
  element.style.opacity = ''
  element.style.overflow = ''
  element.style.transition = ''
}
</script>

<style scoped>
.faq {
  padding: 120px 0 0;
  position: relative;
  overflow: visible;
}

/* Dots background */
.dots-background {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
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

.container {
  position: relative;
  z-index: 1; /* Above dots */
}

.section-title {
  font-family: 'Benzin', 'Arial Black', sans-serif;
  font-weight: 400;
  font-size: 36px;
  line-height: 110%;
  text-align: center;
  color: rgba(255, 255, 255, 0.8);
  margin-bottom: 60px;
}

.faq-list {
  max-width: 820px;
  margin: 0 auto;
  padding: 0 20px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.faq-item {
  border-radius: 24px;
  background: rgba(255, 255, 255, 0.04);
  backdrop-filter: blur(8px);
  border: 1px solid rgba(255, 255, 255, 0.06);
  overflow: hidden;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
}

/* Градиентная рамка — через .card-glow-border::after (useCardGlow) */

.faq-item.active {
  background: rgba(255, 255, 255, 0.06);
  border: none;
  position: relative;
}

/* Активный аккордеон — усиленный glow */
.faq-item.active {
  --glow-intensity: 0.85;
}

.faq-question {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 24px;
  padding: 24px 32px;
  background: transparent;
  border: none;
  cursor: pointer;
  text-align: left;
  font-family: 'Benzin', 'Arial Black', sans-serif;
  font-weight: 400;
  font-size: 18px;
  line-height: 130%;
  color: rgba(255, 255, 255, 0.9);
  transition: all 0.3s;
  position: relative;
  z-index: 1;
}

.faq-item.active .faq-question {
  background: linear-gradient(90deg, #FFD58A 0%, #FFA92C 100%);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  color: transparent;
}

.chevron {
  flex-shrink: 0;
  color: rgba(255, 213, 138, 0.6);
  transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.chevron.rotated {
  transform: rotate(180deg);
}

.faq-answer-wrapper {
  overflow: hidden;
  position: relative;
  z-index: 1;
}

.faq-answer {
  padding: 0 32px 24px;
  font-family: 'PP Mori', sans-serif;
  font-weight: 500;
  font-size: 15px;
  line-height: 150%;
  color: rgba(255, 255, 255, 0.7);
}

.blob-layer {
  position: absolute;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 100vw;
  height: 100%;
  pointer-events: none;
  z-index: 0;
  overflow: visible;
}

.blob-left {
  position: absolute;
  width: 480px;
  height: 580px;
  top: 0;
  left: -100px;
  pointer-events: none;
  will-change: transform;
}

.blob-left img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

@media (min-width: 1800px) {
  .blob-left {
    width: 560px;
    height: 680px;
  }
}

@media (max-width: 1024px) {
  .blob-layer {
    display: none;
  }
}

@media (max-width: 640px) {
  .faq {
    padding: 80px 0 0;
  }
  
  .section-title {
    font-size: 22px;
  }
  
  .faq-question {
    padding: 20px 24px;
    font-size: 16px;
  }
  
  .faq-answer {
    padding: 0 24px 20px;
    font-size: 14px;
  }
  
  .blob-left {
    display: none;
  }
}
</style>
