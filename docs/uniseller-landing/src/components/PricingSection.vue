<template>
  <section class="pricing" ref="sectionRef">
    <!-- Blob layer -->
    <div class="blob-layer">
      <div class="blob-right" :style="blobRightStyle">
        <img src="/src/assets/images/blob/blob-right-2.png" alt="" />
      </div>
    </div>

    <div class="container">
      <h2 class="section-title">Выберите подходящий<br>план для вашего бизнеса</h2>

      <!-- Desktop grid -->
      <div class="pricing-grid desktop-grid">
        <div v-for="(plan, i) in plans" :key="i" class="pricing-card" :class="plan.type">
          <div class="card-top">
            <div v-if="plan.badge" class="plan-badge">{{ plan.badge }}</div>
            <div class="plan-header-row">
              <div class="plan-name">{{ plan.name }}</div>
              <span class="plan-free">7 дней бесплатно</span>
            </div>
            <div class="plan-price">{{ plan.price }}</div>
            <div class="plan-orgs">{{ plan.orgs }}</div>
            <button class="btn-try" :class="plan.type">Попробовать</button>
          </div>
          <ul class="features-list">
            <li v-for="f in plan.features" :key="f.text" :class="f.active ? 'feature-active' : 'feature-inactive'">
              <img 
                v-if="f.active || plan.type !== 'basic'" 
                src="/src/assets/images/ico/check_circle.svg" 
                alt="" 
                class="feature-icon" 
              />
              <img 
                v-else 
                src="/src/assets/images/ico/cross_circle.svg" 
                alt="" 
                class="feature-icon" 
              />
              <span>{{ f.text }}</span>
            </li>
          </ul>
        </div>
      </div>

      <!-- Mobile slider -->
      <div class="mobile-slider-wrap">
        <div class="slider-nav">
          <button @click="prevPlan" class="nav-btn" :disabled="mobileSlide === 0">
            <img src="/src/assets/images/ico/slider-nav-arrow.svg" alt="" class="arrow-prev" />
          </button>
          <button @click="nextPlan" class="nav-btn" :disabled="mobileSlide >= plans.length - 1">
            <img src="/src/assets/images/ico/slider-nav-arrow.svg" alt="" class="arrow-next" />
          </button>
        </div>
        <div class="mobile-slider-outer">
          <div class="mobile-slider-track" :style="{ transform: `translateX(-${mobileSlide * 100}%)` }">
            <div v-for="(plan, i) in mobilePlans" :key="i" class="pricing-card" :class="plan.type">
              <div class="card-top">
                <div v-if="plan.badge" class="plan-badge">{{ plan.badge }}</div>
                <div class="plan-header-row">
                  <div class="plan-name">{{ plan.name }}</div>
                  <span class="plan-free">7 дней бесплатно</span>
                </div>
                <div class="plan-price">{{ plan.price }}</div>
                <div class="plan-orgs">{{ plan.orgs }}</div>
                <button class="btn-try" :class="plan.type">Попробовать</button>
              </div>
              <ul class="features-list">
                <li v-for="f in plan.features" :key="f.text" :class="f.active ? 'feature-active' : 'feature-inactive'">
                  <img 
                    v-if="f.active || plan.type !== 'basic'" 
                    src="/src/assets/images/ico/check_circle.svg" 
                    alt="" 
                    class="feature-icon" 
                  />
                  <img 
                    v-else 
                    src="/src/assets/images/ico/cross_circle.svg" 
                    alt="" 
                    class="feature-icon" 
                  />
                  <span>{{ f.text }}</span>
                </li>
              </ul>
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
const scrollY = ref(0)
const sectionTop = ref(0)
const mobileSlide = ref(0)

// ======= Blob parallax =======
const blobRightStyle = computed(() => {
  const offset = scrollY.value - sectionTop.value
  return {
    transform: `translateY(${offset * 0.18}px)` // Enhanced parallax
  }
})

const plans = [
  {
    name: 'Basic',
    badge: null,
    type: 'basic',
    price: '7500 ₽/в месяц',
    orgs: '5 организаций',
    features: [
      { text: 'Количество товаров 300', active: true },
      { text: 'Парсер товаров 10 шт. в сутки', active: true },
      { text: 'Количество заказов 6000', active: true },
      { text: 'Обновление цен мгновенно', active: true },
      { text: 'Телеграм бот', active: true },
      { text: 'Поддержка 8/5', active: true },
      { text: 'ИИ описание', active: false },
      { text: 'Интеграция с 1С и Мс', active: false },
    ]
  },
  {
    name: 'Basic',
    badge: 'ПОПУЛЯРНЫЙ',
    type: 'popular',
    price: '12900 ₽/в месяц',
    orgs: '7 организаций',
    features: [
      { text: 'Количество товаров 3200', active: true },
      { text: 'Парсер товаров 75 шт. в сутки', active: true },
      { text: 'Количество заказов 12000', active: true },
      { text: 'Обновление цен мгновенно', active: true },
      { text: 'Телеграм бот', active: true },
      { text: 'Поддержка 24/7', active: true },
      { text: 'ИИ описание в сутки 50 шт.', active: true },
      { text: 'Интеграция с 1С и Мс', active: true },
    ]
  },
  {
    name: 'Seller Pro',
    badge: 'САМЫЙ ПОПУЛЯРНЫЙ',
    type: 'highlighted',
    price: '24900 ₽/в месяц',
    orgs: '15 организаций',
    features: [
      { text: 'Количество товаров 11000', active: true },
      { text: 'Парсер товаров 150 шт. в сутки', active: true },
      { text: 'Количество заказов 35000', active: true },
      { text: 'Обновление цен мгновенно', active: true },
      { text: 'Телеграм бот', active: true },
      { text: 'Поддержка 24/7', active: true },
      { text: 'ИИ описание в сутки 100 шт.', active: true },
      { text: 'Интеграция с 1С и Мс', active: true },
    ]
  },
  {
    name: 'Mega Seller',
    badge: null,
    type: 'mega',
    price: '34900 ₽/в месяц',
    orgs: '30 организаций',
    features: [
      { text: 'Количество товаров 30000', active: true },
      { text: 'Парсер товаров 80', active: true },
      { text: 'Количество заказов 120000', active: true },
      { text: 'Обновление цен мгновенно', active: true },
      { text: 'Телеграм бот', active: true },
      { text: 'Поддержка 8/5', active: true },
      { text: 'ИИ описание в сутки 200 шт.', active: true },
      { text: 'Интеграция с 1С и Мс', active: true },
    ]
  }
]

// Mobile: Seller Pro first (index 2), then others
const mobilePlans = computed(() => [...plans.slice(2), ...plans.slice(0, 2)])

const prevPlan = () => { if (mobileSlide.value > 0) mobileSlide.value-- }
const nextPlan = () => { if (mobileSlide.value < plans.length - 1) mobileSlide.value++ }

// Touch swipe for mobile slider
let touchStartX = 0
let touchStartY = 0
let swipeDir = null
let sliderTrackEl = null

const onTouchStart = (e) => {
  touchStartX = e.touches[0].clientX
  touchStartY = e.touches[0].clientY
  swipeDir = null
}
const onTouchMove = (e) => {
  const dx = e.touches[0].clientX - touchStartX
  const dy = e.touches[0].clientY - touchStartY
  if (!swipeDir) swipeDir = Math.abs(dx) > Math.abs(dy) ? 'h' : 'v'
  if (swipeDir === 'h') e.preventDefault()
}
const onTouchEnd = (e) => {
  if (swipeDir !== 'h') return
  const dx = e.changedTouches[0].clientX - touchStartX
  if (Math.abs(dx) > 50) { if (dx < 0) nextPlan(); else prevPlan() }
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
}

onMounted(() => {
  scrollY.value = window.scrollY
  if (sectionRef.value) {
    sectionTop.value = sectionRef.value.offsetTop
  }
  window.addEventListener('scroll', handleScroll, { passive: true })
  window.addEventListener('resize', handleResize, { passive: true })
  handleScroll()
  
  sliderTrackEl = document.querySelector('.pricing .mobile-slider-outer')
  if (sliderTrackEl) {
    sliderTrackEl.addEventListener('touchstart', onTouchStart, { passive: true })
    sliderTrackEl.addEventListener('touchmove', onTouchMove, { passive: false })
    sliderTrackEl.addEventListener('touchend', onTouchEnd, { passive: true })
  }
})
onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
  window.removeEventListener('resize', handleResize)
  if (sliderTrackEl) {
    sliderTrackEl.removeEventListener('touchstart', onTouchStart)
    sliderTrackEl.removeEventListener('touchmove', onTouchMove)
    sliderTrackEl.removeEventListener('touchend', onTouchEnd)
  }
})
</script>

<style scoped>
.pricing {
  padding: 120px 0 0;
  position: relative;
  overflow: visible;
}

.container {
  max-width: 1240px;
  margin: 0 auto;
  padding: 0 20px;
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

/* Desktop grid */
.desktop-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
  justify-items: center;
}

.mobile-slider-wrap { display: none; }

/* Card base */
.pricing-card {
  border-radius: 24px;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 0;
  background: transparent;
  position: relative;
  width: 100%;
}

/* Cards 1 and 4 - total height 577px (233 top + 344 bottom) */
.pricing-card.basic,
.pricing-card.mega {
  height: 577px;
}

/* Cards 2 and 3 - total height 611px (267 top + 344 bottom) */
.pricing-card.popular,
.pricing-card.highlighted {
  height: 611px;
}

/* Align all cards by bottom */
.desktop-grid {
  align-items: flex-end;
  align-content: flex-end;
  max-width: fit-content;
  margin: 0 auto;
}

/* Top section - hero zone */
.card-top {
  background: #272727;
  border-radius: 24px;
  padding: 30px;
  display: flex;
  flex-direction: column;
  gap: 18px;
  margin: 0;
  margin-bottom: -24px; /* Overlap with bottom section */
  position: relative;
  z-index: 2; /* Above bottom section */
}

/* Cards 1 and 4 - top height 233px */
.pricing-card.basic .card-top,
.pricing-card.mega .card-top {
  height: 233px;
  min-height: 233px;
}

/* Cards 2 and 3 - top height 267px */
.pricing-card.popular .card-top,
.pricing-card.highlighted .card-top {
  height: 267px;
  min-height: 267px;
  position: relative;
  overflow: hidden; /* Clip gradient pseudo-element to card bounds */
}

/* Radial gradient pseudo-element for cards 2 and 3 in top right corner */
.pricing-card.popular .card-top::before,
.pricing-card.highlighted .card-top::before {
  content: '';
  position: absolute;
  top: -77px;
  right: 161.75px;
  width: 192px;
  height: 192px;
  background: #FFD58A;
  filter: blur(120px);
  border-radius: 50%;
  pointer-events: none;
  z-index: 0;
  opacity: 0.6;
}

/* Plan header row - align "7 дней бесплатно" with tariff name baseline */
.plan-header-row {
  display: flex;
  flex-direction: row;
  align-items: baseline; /* Align by text baseline */
  gap: 16px; /* Increased gap to move "7 дней бесплатно" right */
  margin: 0;
  position: relative;
  z-index: 1; /* Above gradient pseudo-element */
}

/* Remove gradient border from highlighted card */

.plan-labels {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 6px;
  margin-bottom: 0;
  min-height: 22px;
}

.plan-badge {
  font-family: 'PP Mori', sans-serif;
  font-weight: 615;
  font-size: 12px;
  line-height: 130%;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: #FFD58A;
  margin: 0;
  display: block;
  position: relative;
  z-index: 1; /* Above gradient pseudo-element */
}

.plan-free {
  font-family: 'PP Mori', sans-serif;
  font-weight: 615;
  font-size: 12px;
  line-height: 130%;
  letter-spacing: 0;
  color: #FFA92C;
  margin: 0;
}

.plan-name {
  font-family: 'Benzin', 'Arial Black', sans-serif;
  font-weight: 400;
  font-size: 16px;
  line-height: 130%;
  letter-spacing: 0;
  color: rgba(255, 255, 255, 0.8); /* #FFFFFFCC */
  margin: 0;
  position: relative;
  z-index: 1; /* Above gradient pseudo-element */
}

.plan-price {
  font-family: 'Benzin', 'Arial Black', sans-serif;
  font-weight: 400;
  font-size: 18px;
  line-height: 130%;
  letter-spacing: 0;
  color: rgba(255, 255, 255, 0.8); /* #FFFFFFCC */
  margin: 0;
  position: relative;
  z-index: 1; /* Above gradient pseudo-element */
}

.plan-orgs {
  font-family: 'PP Mori', sans-serif;
  font-weight: 500;
  font-size: 15px;
  line-height: 130%;
  letter-spacing: 0;
  color: rgba(255, 255, 255, 0.6); /* #FFFFFF99 */
  margin: 0;
  position: relative;
  z-index: 1; /* Above gradient pseudo-element */
}

.btn-try {
  width: 235.25px;
  height: 56px;
  padding: 0 28px;
  border-radius: 38px;
  background: rgba(255, 255, 255, 0.1); /* #FFFFFF1A */
  backdrop-filter: blur(10px);
  border: none;
  font-family: 'PP Mori', sans-serif;
  font-weight: 500;
  font-size: 16px;
  line-height: 22px;
  text-align: center;
  color: #FFD58A;
  cursor: pointer;
  transition: all 0.3s;
  margin: 0;
  margin-top: auto; /* Push to bottom of card-top */
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  align-self: stretch;
}

/* Gradient border for cards 1 and 4 */
.btn-try.basic::before,
.btn-try.mega::before {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: 38px;
  padding: 2px;
  background:
    linear-gradient(93.85deg, rgba(255, 213, 138, 0.3) 0%, rgba(255, 213, 138, 0.12) 100%),
    linear-gradient(64.18deg, rgba(255, 169, 44, 0) 72.93%, #FFA92C 93.92%);
  -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  -webkit-mask-composite: xor;
  mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  mask-composite: exclude;
  pointer-events: none;
  z-index: -1;
}

.btn-try:hover { 
  background: rgba(255, 255, 255, 0.15);
}

/* Cards 2 and 3 - gradient button */
.btn-try.popular,
.btn-try.highlighted {
  width: 235.25px;
  height: 56px;
  border-radius: 48px;
  background: linear-gradient(90deg, #FFD58A 0%, #FFA92C 100%);
  border: 2px solid #FFD58A;
  box-shadow: 0px 0px 38px rgba(0, 0, 0, 0.25), 0px 0px 74px #FFA92C;
  color: rgba(0, 0, 0, 0.8);
  backdrop-filter: none;
}

.btn-try.popular:hover,
.btn-try.highlighted:hover {
  transform: translateY(-1px);
  box-shadow: 0px 0px 45px rgba(0, 0, 0, 0.3), 0px 0px 80px #FFA92C;
}

.features-list {
  list-style: none;
  padding: 60px 30px 30px;
  margin: 0;
  margin-top: -24px; /* Overlap with top section */
  display: flex;
  flex-direction: column;
  gap: 16px;
  position: relative;
  z-index: 1; /* Below top section */
  background: rgba(255, 255, 255, 0.03);
  border-radius: 0 0 24px 24px;
  min-height: 344px; /* Same for all cards */
  padding-top: calc(60px + 24px); /* Extra padding to account for overlap */
}

.features-list li {
  font-family: 'PP Mori', sans-serif;
  font-weight: 500;
  font-size: 13px;
  line-height: 140%;
  padding-left: 0;
  position: relative;
  display: flex;
  align-items: baseline;
  gap: 8px;
}

.feature-icon {
  width: 16px;
  height: 16px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.feature-icon svg,
.feature-icon img {
  width: 6.5px;
  height: 6.5px;
  object-fit: contain;
}

.feature-active {
  color: rgba(255, 255, 255, 0.8);
}

.feature-inactive {
  color: rgba(255, 255, 255, 0.25);
}

/* Mobile slider */
@media (max-width: 968px) {
  .desktop-grid { display: none; }

  .mobile-slider-wrap {
    display: block;
  }

  .slider-nav {
    display: flex;
    justify-content: flex-end;
    gap: 12px;
    margin-bottom: 24px;
  }

  .nav-btn {
    width: 48px;
    height: 48px;
    border-radius: 50%;
    border: 1px solid rgba(255, 255, 255, 0.12);
    background: rgba(255, 255, 255, 0.05);
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.3s;
    backdrop-filter: blur(8px);
  }

  .nav-btn:hover:not(:disabled) {
    border-color: rgba(255, 213, 138, 0.35);
  }

  .nav-btn:disabled { opacity: 0.3; cursor: default; }

  /* Стрелки: SVG изначально смотрит влево, инвертируем для правильного направления */
  .arrow-prev { transform: rotate(0deg); } /* влево */
  .arrow-next { transform: rotate(180deg); } /* вправо */

  .mobile-slider-outer {
    overflow: hidden;
    border-radius: 20px;
  }

  .mobile-slider-track {
    display: flex;
    transition: transform 0.5s cubic-bezier(0.4, 0, 0.2, 1);
  }

  .mobile-slider-track .pricing-card {
    min-width: 100%;
    flex: 0 0 100%;
  }
}

/* Blob layer: absolutely positioned within pricing section */
/* Blob layer: absolutely positioned within pricing section */
/* Positioned above dots (z-index: 0-1) and other sections */
.blob-layer {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 100; /* Above dots (0-1) and all other sections */
  overflow: hidden;
}

.blob-right {
  position: absolute;
  width: 480px;
  height: 580px;
  top: 0;
  right: -15px;
  pointer-events: none;
  will-change: transform;
}

.blob-right img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

@media (min-width: 1800px) {
  .blob-right {
    width: 440px;
    height: 560px;
  }
}

/* Hide blob on tablet and mobile */
@media (max-width: 1024px) {
  .blob-layer {
    display: none;
  }
}

@media (max-width: 640px) {
  .pricing { padding: 80px 0 0; }
  .section-title { font-size: 28px; }
  .blob-right {
    display: none;
  }
}
</style>
