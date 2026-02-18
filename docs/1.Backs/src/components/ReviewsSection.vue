<template>
  <section class="reviews" ref="sectionRef">
    <!-- Blob layer -->
    <div class="blob-layer">
      <div class="blob-right" :style="blobRightStyle">
        <img src="/src/assets/images/blob/blob-right-3.png" alt="" />
      </div>
    </div>

    <div class="container">
      <div class="reviews-header">
        <h2 class="section-title">Отзывы</h2>
        <div class="slider-nav">
          <button @click="prevSlide" class="nav-btn" :disabled="currentSlide === 0">
            <img src="/src/assets/images/ico/slider-nav-arrow.svg" alt="" class="arrow-prev" />
          </button>
          <button @click="nextSlide" class="nav-btn" :disabled="currentSlide >= maxSlide">
            <img src="/src/assets/images/ico/slider-nav-arrow.svg" alt="" class="arrow-next" />
          </button>
        </div>
      </div>
    </div>

    <!-- Slider bleeds to right edge -->
    <div class="slider-outer" ref="sliderEl">
      <div class="slider-inner-pad">
        <div
          class="slider-track"
          :style="{ transform: `translateX(-${currentSlide * (cardWidth + gap)}px)` }"
        >
          <div
            v-for="(review, i) in reviews"
            :key="i"
            class="review-card"
            :class="{ active: currentSlide === i }"
          >
            <p class="review-text">{{ review.text }}</p>
            <div class="review-author">
              <img :src="review.avatar" :alt="review.name" class="avatar" />
              <span class="author-name">{{ review.name }}</span>
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
const currentSlide = ref(0)
const cardWidth = 340
const gap = 24
const scrollY = ref(0)
const sectionTop = ref(0)

// ======= Blob parallax =======
const blobRightStyle = computed(() => {
  const offset = scrollY.value - sectionTop.value
  return {
    transform: `translateY(${offset * 0.18}px)` // Enhanced parallax
  }
})

const reviews = [
  {
    text: 'Платформа для маркетплейсов супер. Сделали интеграцию за пару дней. Связал все маркетплейсы. Долго искал инструмент для автоматизации на яндекс маркете. Наконец-то нашел. Желаю разработчикам всех благ',
    name: 'Александр Г.',
    avatar: '/src/assets/images/reviews/1.png'
  },
  {
    text: 'Самая удобная CRM для автоматизации. Поддержка на связи, спасибо команде.',
    name: 'Анна Р.',
    avatar: '/src/assets/images/reviews/2.png'
  },
  {
    text: 'Пол года назад, наткнулся на одну интересную компанию с выгодными условиями работы, не мог найти что то на подобие. Теперь отлично сотрудничаем и я доволен прогрессом своего бизнеса. Вырос примерно в 5 раз.',
    name: 'Михаил Н.',
    avatar: '/src/assets/images/reviews/3.png'
  },
  {
    text: 'Платформа для маркетплейсов супер. Сделали интеграцию за пару дней. Связал все маркетплейсы. Долго искал инструмент для автоматизации на яндекс маркете. Наконец-то нашел. Желаю разработчикам всех благ',
    name: 'Лиза З.',
    avatar: '/src/assets/images/reviews/4.png'
  },
  {
    text: 'Отличный сервис! Интеграция прошла быстро, поддержка всегда на связи. Рекомендую всем продавцам на маркетплейсах.',
    name: 'Дмитрий К.',
    avatar: '/src/assets/images/reviews/1.png'
  },
  {
    text: 'Очень удобно управлять заказами с нескольких площадок в одном окне. Экономит кучу времени!',
    name: 'Ольга М.',
    avatar: '/src/assets/images/reviews/2.png'
  }
]

const viewportW = ref(typeof window !== 'undefined' ? window.innerWidth : 1440)

const maxSlide = computed(() => {
  const vw = viewportW.value
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

const handleScroll = () => {
  if (!sectionRef.value) return
  scrollY.value = window.scrollY
  sectionTop.value = sectionRef.value.offsetTop
}

const handleResize = () => {
  if (sectionRef.value) {
    sectionTop.value = sectionRef.value.offsetTop
  }
  viewportW.value = window.innerWidth
}

onMounted(() => {
  scrollY.value = window.scrollY
  if (sectionRef.value) {
    sectionTop.value = sectionRef.value.offsetTop
  }
  window.addEventListener('scroll', handleScroll, { passive: true })
  window.addEventListener('resize', handleResize, { passive: true })
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

.reviews-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 48px;
}

.section-title {
  font-family: 'Benzin', 'Arial Black', sans-serif;
  font-weight: 400;
  font-size: 36px;
  line-height: 110%;
  color: rgba(255, 255, 255, 0.8);
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
  overflow: visible;
  position: relative;
  z-index: 1;
}

.slider-inner-pad {
  margin-left: calc((100vw - 1240px) / 2 + 20px);
  overflow: visible;
}

.slider-track {
  display: flex;
  gap: 24px;
  transition: transform 0.55s cubic-bezier(0.4, 0, 0.2, 1);
  will-change: transform;
}

/* Cards */
.review-card {
  min-width: 340px;
  flex: 0 0 340px;
  border-radius: 20px;
  padding: 28px 24px;
  background: rgba(255, 255, 255, 0.06);
  backdrop-filter: blur(8px);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 28px;
  position: relative;
  z-index: 102; /* Above blob (z-index: 101) */
  /* Border transition */
  transition: background 0.4s;
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
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 0;
  overflow: hidden;
}

.blob-right {
  position: absolute;
  width: 480px;
  height: 580px;
  top: 105px;
  right: -110px;
  pointer-events: none;
  will-change: transform;
  z-index: 0; /* Below slider cards */
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
  .section-title { font-size: 28px; }
  .review-card {
    min-width: calc(100vw - 64px);
    flex: 0 0 calc(100vw - 64px);
  }
  .slider-inner-pad { margin-left: 20px; }
  .blob-right {
    display: none;
  }
}
</style>
