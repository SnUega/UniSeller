<template>
  <section class="reviews" ref="sectionRef">
    <!-- Blob layer -->
    <div class="blob-layer">
      <div class="blob-right" :style="blobRightStyle">
        <img src="/src/assets/images/blob/blob-right-3.png" alt="" loading="lazy" />
      </div>
    </div>

    <div class="container">
      <div class="reviews-header">
        <h2 class="section-title">Отзывы</h2>
        <div class="slider-nav">
          <button @click="prevSlide" class="nav-btn" :disabled="currentSlide === 0">
            <img src="/src/assets/images/ico/slider-nav-arrow.svg" alt="" class="arrow-prev" loading="lazy" />
          </button>
          <button @click="nextSlide" class="nav-btn" :disabled="currentSlide >= maxSlide">
            <img src="/src/assets/images/ico/slider-nav-arrow.svg" alt="" class="arrow-next" loading="lazy" />
          </button>
        </div>
      </div>
    </div>

    <!-- Slider bleeds to right edge -->
    <div class="slider-outer" ref="sliderEl">
      <div class="slider-inner-pad">
        <div
          class="slider-track"
          :style="{ transform: isMobile ? `translateX(calc(-${currentSlide * 100}% - ${currentSlide * 16}px))` : `translateX(-${currentSlide * (cardWidth + gap)}px)` }"
          :class="{ 'mobile-track': isMobile }"
        >
          <div
            v-for="(review, i) in reviews"
            :key="i"
            class="review-card"
            :class="{ active: currentSlide === i }"
          >
            <p class="review-text">{{ review.text }}</p>
            <div class="review-author">
              <img :src="review.avatar" :alt="review.name" class="avatar" loading="lazy" />
              <span class="author-name">{{ review.name }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Navigation buttons below slider -->
    <div class="container">
      <div class="slider-nav-wrapper">
        <div class="slider-nav">
          <button @click="prevSlide" class="nav-btn" :disabled="currentSlide === 0">
            <img src="/src/assets/images/ico/slider-nav-arrow.svg" alt="" class="arrow-prev" loading="lazy" />
          </button>
          <button @click="nextSlide" class="nav-btn" :disabled="currentSlide >= maxSlide">
            <img src="/src/assets/images/ico/slider-nav-arrow.svg" alt="" class="arrow-next" loading="lazy" />
          </button>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'

const sectionRef = ref(null)
const sliderEl = ref(null)
const currentSlide = ref(0)
const cardWidth = 340
const gap = 24
const scrollY = ref(0)
const sectionTop = ref(0)
const isMobileForParallax = computed(() => typeof window !== 'undefined' && window.innerWidth <= 1024)

// ======= Blob parallax =======
const blobRightStyle = computed(() => {
  // Отключаем параллакс на мобильных для производительности
  if (isMobileForParallax.value) {
    return { transform: 'translateY(0px)' }
  }
  const offset = scrollY.value - sectionTop.value
  return {
    transform: `translateY(${offset * 0.18}px)`
  }
})

const reviews = [
  {
    text: 'Платформа для маркетплейсов супер. Сделали интеграцию за пару дней. Связал все маркетплейсы. Долго искал инструмент для автоматизации на яндекс маркете. Наконец-то нашел. Желаю разработчикам всех благ',
    name: 'Александр Г.',
    avatar: new URL('../assets/images/reviews/1.png', import.meta.url).href
  },
  {
    text: 'Самая удобная CRM для автоматизации. Поддержка на связи, спасибо команде.',
    name: 'Анна Р.',
    avatar: new URL('../assets/images/reviews/2.png', import.meta.url).href
  },
  {
    text: 'Пол года назад, наткнулся на одну интересную компанию с выгодными условиями работы, не мог найти что то на подобие. Теперь отлично сотрудничаем и я доволен прогрессом своего бизнеса. Вырос примерно в 5 раз.',
    name: 'Михаил Н.',
    avatar: new URL('../assets/images/reviews/3.png', import.meta.url).href
  },
  {
    text: 'Платформа для маркетплейсов супер. Сделали интеграцию за пару дней. Связал все маркетплейсы. Долго искал инструмент для автоматизации на яндекс маркете. Наконец-то нашел. Желаю разработчикам всех благ',
    name: 'Лиза З.',
    avatar: new URL('../assets/images/reviews/4.png', import.meta.url).href
  },
  {
    text: 'Отличный сервис! Интеграция прошла быстро, поддержка всегда на связи. Рекомендую всем продавцам на маркетплейсах.',
    name: 'Дмитрий К.',
    avatar: new URL('../assets/images/reviews/1.png', import.meta.url).href
  },
  {
    text: 'Очень удобно управлять заказами с нескольких площадок в одном окне. Экономит кучу времени!',
    name: 'Ольга М.',
    avatar: new URL('../assets/images/reviews/2.png', import.meta.url).href
  }
]

const viewportW = ref(typeof window !== 'undefined' ? window.innerWidth : 1440)
const isMobile = computed(() => viewportW.value <= 640)

const maxSlide = computed(() => {
  const vw = viewportW.value
  const isMobile = vw <= 640
  
  if (isMobile) {
    // На мобильных показываем одну карточку за раз
    return Math.max(0, reviews.length - 1)
  }
  
  // Slider starts at container left edge
  const containerLeft = Math.max(20, (vw - 1240) / 2 + 20)
  // Available width from left edge to right edge of viewport
  const availableW = vw - containerLeft
  const visibleCards = Math.max(1, Math.floor((availableW + gap) / (cardWidth + gap)))
  return Math.max(0, reviews.length - visibleCards)
})

const nextSlide = () => { if (currentSlide.value < maxSlide.value) currentSlide.value++ }
const prevSlide = () => { if (currentSlide.value > 0) currentSlide.value-- }

// Touch swipe
let touchStartX = 0
let touchStartY = 0
let swipeDir = null

const onTouchStart = (e) => {
  touchStartX = e.touches[0].clientX
  touchStartY = e.touches[0].clientY
  swipeDir = null
}

const onTouchMove = (e) => {
  const dx = e.touches[0].clientX - touchStartX
  const dy = e.touches[0].clientY - touchStartY
  if (!swipeDir) {
    swipeDir = Math.abs(dx) > Math.abs(dy) ? 'h' : 'v'
  }
  if (swipeDir === 'h') e.preventDefault()
}

const onTouchEnd = (e) => {
  if (swipeDir !== 'h') return
  const dx = e.changedTouches[0].clientX - touchStartX
  if (Math.abs(dx) > 50) {
    if (dx < 0) nextSlide()
    else prevSlide()
  }
}

// Throttle для мобильных устройств
let scrollTimeout = null
let resizeTimeout = null

const handleScroll = () => {
  if (!sectionRef.value || isMobileForParallax.value) return // На мобильных не обрабатываем scroll для параллакса
  scrollY.value = window.scrollY
  sectionTop.value = sectionRef.value.offsetTop
}

const throttledScroll = () => {
  if (isMobileForParallax.value) return // На мобильных не нужен параллакс
  if (scrollTimeout) return
  scrollTimeout = requestAnimationFrame(() => {
    handleScroll()
    scrollTimeout = null
  })
}

const handleResize = () => {
  if (!sectionRef.value) return
  sectionTop.value = sectionRef.value.offsetTop
  viewportW.value = window.innerWidth
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

onMounted(() => {
  scrollY.value = window.scrollY
  if (sectionRef.value) {
    sectionTop.value = sectionRef.value.offsetTop
  }
  // На мобильных не добавляем scroll listener для параллакса
  if (!isMobileForParallax.value) {
    window.addEventListener('scroll', throttledScroll, { passive: true })
  }
  window.addEventListener('resize', throttledResize, { passive: true })
  handleScroll()
  
  const el = sliderEl.value
  if (el) {
    el.addEventListener('touchstart', onTouchStart, { passive: true })
    el.addEventListener('touchmove', onTouchMove, { passive: false })
    el.addEventListener('touchend', onTouchEnd, { passive: true })
  }
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
  window.removeEventListener('resize', handleResize)
  const el = sliderEl.value
  if (el) {
    el.removeEventListener('touchstart', onTouchStart)
    el.removeEventListener('touchmove', onTouchMove)
    el.removeEventListener('touchend', onTouchEnd)
  }
})
</script>

<style scoped>
.reviews {
  padding: 120px 0 145px;
  position: relative;
  overflow: visible;
}

.container {
  max-width: 1240px;
  margin: 0 auto;
  padding: 0 20px;
  position: relative;
  z-index: 1;
}

.section-title {
  font-family: 'Benzin', 'Arial Black', sans-serif;
  font-weight: 400;
  font-size: 36px;
  line-height: 110%;
  color: rgba(255, 255, 255, 0.8);
  margin-bottom: 48px;
  text-align: center;
}

.reviews-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 48px;
}

@media (max-width: 640px) {
  .reviews-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 24px;
    margin-bottom: 32px; /* Заголовок ниже на мобильных */
  }
  
  .reviews-header .slider-nav {
    display: none; /* Скрываем верхние кнопки на мобильных */
  }
  
  .section-title {
    text-align: left; /* Заголовок влево на мобильных */
    margin-bottom: 0;
  }
}

.slider-nav-wrapper {
  display: none; /* Скрыто на десктопе, показывается только на мобильных */
}

.slider-nav {
  display: flex;
  gap: 16px;
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

.nav-btn:disabled { opacity: 0.3; cursor: default; }

       /* Arrows — prev points RIGHT, next points LEFT (reversed) */
       .arrow-prev { transform: rotate(0deg); }
       .arrow-next { transform: rotate(180deg); }

/* Slider bleeds to right edge */
.slider-outer {
  position: relative;
  z-index: 1;
  /* Исправляем обрезку: используем overflow hidden для обрезки справа */
  /* Но позволяем карточкам полностью появляться при переключении */
  overflow: hidden;
  /* Убираем isolation, clip-path и transform, так как они могут блокировать backdrop-filter */
  /* isolation: isolate; */
  /* clip-path блокирует backdrop-filter на дочерних элементах */
  /* transform: translateZ(0) создает новый stacking context, который может блокировать backdrop-filter */
}

.slider-inner-pad {
  margin-left: calc((100vw - 1240px) / 2 + 20px);
  overflow: visible;
  /* Позволяем карточкам выходить за правый край для эффекта "bleed" */
  /* Убираем transform, так как он может блокировать backdrop-filter */
  /* Добавляем padding справа для того, чтобы карточки могли полностью появляться */
  padding-right: 200vw;
}

@media (max-width: 640px) {
  .slider-inner-pad {
    margin-left: 0;
    padding-right: 0;
  }
}

.slider-track {
  display: flex;
  gap: 24px;
  transition: transform 0.55s cubic-bezier(0.4, 0, 0.2, 1);
  will-change: transform;
  transform: translateZ(0); /* Аппаратное ускорение */
  backface-visibility: hidden; /* Устраняет мерцание */
  contain: layout style; /* Оптимизация рендеринга, убираем paint для backdrop-filter */
  /* Исправление: на мобильных не используем contain */
}

@media (max-width: 640px) {
  .slider-track {
    contain: none; /* Отключаем contain на мобильных для правильного отображения */
  }
}

@media (max-width: 640px) {
  .slider-track {
    gap: 16px;
  }
}

/* Cards */
.review-card {
  min-width: 340px;
  flex: 0 0 340px;
  border-radius: 20px;
  padding: 28px 24px;
  background: rgba(255, 255, 255, 0.06);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px); /* Для Safari */
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 28px;
  position: relative;
  z-index: 102; /* Above blob (z-index: 101) */
  /* Предотвращение глитча при анимации */
  /* Убираем transform: translateZ(0), так как он может блокировать backdrop-filter */
  backface-visibility: hidden;
  /* Border transition */
  transition: background 0.4s;

}

@media (max-width: 640px) {
  .review-card {
    min-width: 100%;
    flex: 0 0 100%;
    width: 100%;
    max-width: 100%;
    box-sizing: border-box;
    flex-shrink: 0;
  }
}

/* Gradient border via pseudo — always present but fades in */
.review-card::before {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: 20px;
  padding: 2px;
  background:
    linear-gradient(93.85deg, rgba(255, 213, 138, 0.3) 0%, rgba(255, 213, 138, 0.12) 100%),
    linear-gradient(64.18deg, rgba(255, 169, 44, 0) 72.93%, #FFA92C 93.92%);
  -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  -webkit-mask-composite: xor;
  mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  mask-composite: exclude;
  pointer-events: none;
  opacity: 0;
  transition: opacity 0.5s ease;
}

.review-card.active::before {
  opacity: 1;
}

.review-text {
  font-family: 'PP Mori', sans-serif;
  font-weight: 500;
  font-size: 14px;
  line-height: 150%;
  color: rgba(255, 255, 255, 0.7);
  position: relative;
  z-index: 1;
}

.review-author {
  display: flex;
  align-items: center;
  gap: 12px;
  position: relative;
  z-index: 1;
}

.avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  object-fit: cover;
  flex-shrink: 0;
}

.author-name {
  font-family: 'PP Mori', sans-serif;
  font-weight: 600;
  font-size: 13px;
  color: rgba(255, 255, 255, 0.85);
}

@media (max-width: 1280px) {
  .slider-inner-pad { margin-left: 20px; }
}

/* Blob layer: absolutely positioned within reviews section */
/* Positioned above dots (z-index: 0-1) and other sections, but below cards */
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

.blob-right {
  position: absolute;
  width: 480px;
  height: 580px;
  top: 105px;
  right: -110px;
  pointer-events: none;
  will-change: transform;
  z-index: 0;
}

.blob-right img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

@media (min-width: 1800px) {
  .blob-right {
    width: 520px;
    height: 620px;
  }
}

/* Hide blob on tablet and mobile */
@media (max-width: 1024px) {
  .blob-layer {
    display: none;
  }
}

@media (max-width: 640px) {
  .reviews { padding: 80px 0 0; }
  .section-title { 
    font-size: 22px;
    text-align: left;
  }
  .reviews-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 32px;
  }
  .slider-nav-wrapper {
    display: flex;
    justify-content: center;
    margin-top: 32px;
  }
 
  .slider-outer {
    margin: 0 20px;
    overflow: hidden;
    clip-path: none;
    width: calc(100% - 40px);
  }
  
  .slider-inner-pad { 
    margin-left: 0;
    padding-right: 0;
    width: 100%;
  }
  
  .slider-track {
    gap: 16px;
    width: 100%;
    contain: none;
    flex-shrink: 0;
  }
  
  .review-card {
    min-width: 100%;
    flex: 0 0 100%;
    width: 100%;
    max-width: 100%;
    box-sizing: border-box;
    flex-shrink: 0;
  }
  .blob-right {
    display: none;
  }
}
</style>
