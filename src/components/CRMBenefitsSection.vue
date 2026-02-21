<template>
  <section class="crm-benefits" ref="sectionRef">
    <!-- Blob parallax elements -->
    <div class="blob-layer">
      <div class="blob-left" :style="blobLeftStyle">
        <img src="/src/assets/images/blob/blob-left-1.png" alt="" loading="lazy" />
      </div>
      <div class="blob-right" :style="blobRightStyle">
        <img src="/src/assets/images/blob/blob-right-1.png" alt="" loading="lazy" />
      </div>
    </div>

    <div class="container">
      <h2 class="section-title" ref="titleRef">Как наша CRM-система меняет<br>ваш рабочий процесс</h2>

      <!-- Dashed logo decoration - desktop only -->
      <div class="dashed-logo-deco" :class="{ 'animate': animateDeco }">
        <div class="dashed-ring ring-1"></div>
        <div class="dashed-ring ring-2"></div>
        <div class="dashed-ring ring-3"></div>
        <div class="dashed-ring ring-4"></div>
        <div class="dashed-ring ring-5"></div>
        <img src="/src/assets/images/glitched-logo.png" alt="" class="glitched-logo" loading="lazy" />
        <img src="/src/assets/images/logo-main.png" alt="Uniseller" class="main-logo" loading="lazy" />
      </div>

      <!-- Features grid -->
      <div class="features-grid" ref="featuresGridRef">
        <!-- Card 1 - with border -->
        <div class="feature-card card-glow-border">
          <img src="/src/assets/images/ico/codicon_settings.svg" alt="" class="feature-icon" loading="lazy" />
          <h3 class="feature-title">Простая настройка и интеграция</h3>
          <p class="feature-text">Uniseller даёт возможность производить интеграцию с системой 1С, Мой склад, а также по API. Применяя собственные наработки и опыт, наша команда готова создать для вас ваше собственно ПО, для ваших нужд, произвести оптимизацию и автоматизацию ваших бизнес процессов.</p>
        </div>

        <!-- Card 2 - no border -->
        <div class="feature-card card-glow-border">
          <img src="/src/assets/images/ico/tabler_filter.svg" alt="" class="feature-icon" loading="lazy" />
          <h3 class="feature-title">Отслеживайте и управляйте лидами</h3>
          <p class="feature-text">В основу Uniseller легла идея управления продажами с одного окна, в котором объединены личные кабинеты различных маркетплейсов и даже организаций. Подключив личные кабинеты каждого из МП к Uniseller вы получите три ЛК в одном окне.</p>
        </div>

        <!-- Card 3 - no border -->
        <div class="feature-card card-glow-border">
          <img src="/src/assets/images/ico/tabler_users.svg" alt="" class="feature-icon" loading="lazy" />
          <h3 class="feature-title">Централизуйте данные о клиентах</h3>
          <p class="feature-text">Uniseller — мощный аналитический инструмент, с помощью которого можно отслеживать объём реализованной продукции, посмотреть чистую прибыль и многое другое.</p>
        </div>

        <!-- Card 4 - with border -->
        <div class="feature-card card-glow-border">
          <img src="/src/assets/images/ico/ci_settings.svg" alt="" class="feature-icon" loading="lazy" />
          <h3 class="feature-title">Автоматизируйте рутинные задачи</h3>
          <p class="feature-text">Ускоренный способ поиска позиций и комплектации заказов. Изменение и контроль статусов. Минимальный процент ошибок и отмен.</p>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useCardGlow } from '../composables/useCardGlow.js'
import { animateCenterTitle, animateBubbleCards } from '../composables/useScrollAnimations.js'

const sectionRef = ref(null)
const titleRef = ref(null)
const featuresGridRef = ref(null)

useCardGlow({
  cardSelector: '.feature-card',
  getSectionEl: () => sectionRef.value,
  radius: 480
})
const animateDeco = ref(false)
const scrollY = ref(0)
const sectionTop = ref(0)
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
const blobRightStyle = computed(() => {
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
  if (!sectionRef.value) return

  // На мобильных не обрабатываем scroll для параллакса, но проверяем анимацию
  if (!isMobile.value) {
    scrollY.value = window.scrollY
    sectionTop.value = sectionRef.value.offsetTop
  }

  // Trigger animation when deco enters viewport (работает на всех устройствах)
  const decoElement = sectionRef.value.querySelector('.dashed-logo-deco')
  if (decoElement && !animateDeco.value) {
    const decoRect = decoElement.getBoundingClientRect()
    const viewportCenter = window.innerHeight / 2
    const decoCenter = decoRect.top + decoRect.height / 2
    if (Math.abs(decoCenter - viewportCenter) < 300) {
      animateDeco.value = true
    }
  }
}

const throttledScroll = () => {
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

onMounted(() => {
  scrollY.value = window.scrollY
  if (sectionRef.value) {
    sectionTop.value = sectionRef.value.offsetTop
  }
  window.addEventListener('scroll', throttledScroll, { passive: true })
  window.addEventListener('resize', throttledResize, { passive: true })
  handleScroll()

  animateCenterTitle(titleRef.value)
  if (featuresGridRef.value) {
    const cards = featuresGridRef.value.querySelectorAll('.feature-card')
    animateBubbleCards([...cards], { triggerEl: featuresGridRef.value })
  }
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
  window.removeEventListener('resize', handleResize)
})
</script>

<style scoped>
.crm-benefits {
  padding: 180px 0 200px;
  position: relative;
  overflow: visible; /* Allow blobs to extend to viewport edges */
}

.container {
  position: relative;
  z-index: 1;
}

.section-title {
  font-family: 'Benzin', 'Arial Black', sans-serif;
  font-weight: 400;
  font-size: 36px;
  line-height: 110%;
  text-align: center;
  color: rgba(255, 255, 255, 0.8);
  margin-bottom: 80px;
}

/* Dashed logo decoration */
.dashed-logo-deco {
  position: absolute;
  width: 590px;
  height: 590px;
  top: 122px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 0;
  pointer-events: none;
}

/* Radial pulsing gradient from center — over glitched, under rings and main-logo */
.dashed-logo-deco::before {
  content: '';
  position: absolute;
  width: 600px;
  height: 600px;
  background: radial-gradient(circle, rgba(255, 213, 138, 0.3) 0%, rgba(255, 169, 44, 0.2) 30%, transparent 70%);
  filter: blur(40px);
  animation: gradientPulse 6s ease-in-out infinite;
  z-index: 0;
}

@keyframes gradientPulse {
  0%, 100% {
    opacity: 0.6;
    transform: scale(1);
  }
  50% {
    opacity: 0.9;
    transform: scale(1.1);
  }
}

.dashed-ring {
  position: absolute;
  border: 2px dashed rgba(255, 213, 138, 0.2);
  border-radius: 50%;
  opacity: 0;
  transform: scale(0.8);
  z-index: 1;
}

.ring-1 {
  width: 590px;
  height: 590px;
}

.ring-2 {
  width: 530px;
  height: 530px;
}

.ring-3 {
  width: 470px;
  height: 470px;
}

.ring-4 {
  width: 410px;
  height: 410px;
}

.ring-5 {
  width: 350px;
  height: 350px;
}

/* Cascade pulse animation */
.dashed-logo-deco.animate .dashed-ring {
  animation: pulseCascade 2s cubic-bezier(0.4, 0, 0.2, 1) forwards;
}

.dashed-logo-deco.animate .ring-1 {
  animation-delay: 0s;
}

.dashed-logo-deco.animate .ring-2 {
  animation-delay: 0.15s;
}

.dashed-logo-deco.animate .ring-3 {
  animation-delay: 0.3s;
}

.dashed-logo-deco.animate .ring-4 {
  animation-delay: 0.45s;
}

.dashed-logo-deco.animate .ring-5 {
  animation-delay: 0.6s;
}

@keyframes pulseCascade {
  0% {
    opacity: 0;
    transform: scale(0.8);
  }
  30% {
    opacity: 1;
    transform: scale(1.05);
  }
  100% {
    opacity: 0;
    transform: scale(1.5);
  }
}

.glitched-logo {
  position: absolute;
  width: 320px;
  height: auto;
  z-index: -1;
  opacity: 0;
  transform: scale(0.8);
}

.main-logo {
  position: absolute;
  width: 180px;
  height: auto;
  z-index: 2;
  opacity: 0;
  transform: scale(0.8);
}

/* Logo cascade animations */
.dashed-logo-deco.animate .glitched-logo {
  animation: logoAppear 1.5s cubic-bezier(0.4, 0, 0.2, 1) 0.75s forwards,
             breathe 8s ease-in-out 2.25s infinite;
}

.dashed-logo-deco.animate .main-logo {
  animation: logoAppear 1.5s cubic-bezier(0.4, 0, 0.2, 1) 0.9s forwards;
}

@keyframes logoAppear {
  0% {
    opacity: 0;
    transform: scale(0.8);
  }
  100% {
    opacity: 1;
    transform: scale(1);
  }
}

@keyframes breathe {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.15);
  }
}

/* Features grid — compact layout matching design */
.features-grid {
  display: grid;
  grid-template-columns: repeat(2, 493px);
  gap: 83px 254px;
  justify-content: center;
  max-width: 1240px;
  margin: 0 auto;
  position: relative;
  z-index: 1;
}

/* Wider grid on large screens for better proportions */
@media (min-width: 1400px) {
  .features-grid {
    grid-template-columns: repeat(2, 493px);
    gap: 83px 254px;
  }
}

/* Common card styles */
.feature-card {
  border-radius: 24px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  background: rgba(255, 255, 255, 0.06);
  backdrop-filter: blur(8px);
  position: relative;
}

/* Градиентная рамка — теперь через .card-glow-border::after (useCardGlow) */

.feature-icon {
  width: 48px;
  height: 48px;
  position: relative;
  z-index: 1;
}

.feature-title {
  font-family: 'Benzin', 'Arial Black', sans-serif;
  font-weight: 400;
  font-size: 18px;
  line-height: 130%;
  color: rgba(255, 255, 255, 0.9);
  position: relative;
  z-index: 1;
}

.feature-text {
  font-family: 'PP Mori', sans-serif;
  font-weight: 500;
  font-size: 15px;
  line-height: 130%;
  color: rgba(255, 255, 255, 0.7);
  position: relative;
  z-index: 1;
}

/* ======== RESPONSIVE ======== */

/* Slightly narrower on medium-large screens */
@media (max-width: 1280px) {
  .features-grid {
    gap: 28px 50px;
    max-width: 960px;
  }
}

/* Hide deco on tablet and below */
@media (max-width: 1024px) {
  .dashed-logo-deco {
    display: none;
  }
  
  .section-title {
    margin-bottom: 60px;
  }
  
  .features-grid {
    gap: 28px 40px;
    max-width: 800px;
  }
}

/* Tablet landscape specific */
@media (min-width: 768px) and (max-width: 1024px) and (orientation: landscape) {
  .crm-benefits {
    padding: 120px 0 120px;
  }
  
  .section-title {
    font-size: 30px;
    margin-bottom: 50px;
  }
  
  .features-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 24px 32px;
    max-width: 720px;
    padding: 0 24px;
  }
  
  .feature-card {
    padding: 18px;
    gap: 14px;
  }
  
  .feature-title {
    font-size: 16px;
  }
  
  .feature-text {
    font-size: 13px;
  }
  
  .feature-icon {
    width: 40px;
    height: 40px;
  }
  
}

/* Blob layer: absolutely positioned within CRM section */
.blob-layer {
  position: absolute;
  top: 0;
  left: 50%; /* Center relative to section */
  transform: translateX(-50%);
  width: 100vw; /* ← БЫЛО 100%, ТЕПЕРЬ full viewport */
  height: 100%;
  pointer-events: none;
  z-index: 0;
  overflow: visible; /* ← БЫЛО hidden, КРИТИЧНО! */
}

.blob-left,
.blob-right {
  position: absolute;
  pointer-events: none;
  will-change: transform;
}

.blob-left {
  width: 480px;
  height: 580px;
  top: 0;
  left: -72px;
}

.blob-right {
  width: 480px;
  height: 580px;
  top: 420px;
  right: -111px;
}

.blob-left img,
.blob-right img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

@media (min-width: 1800px) {
  .blob-left, .blob-right {
    width: 580px;
    height: 700px;
  }
}

/* Hide blobs on tablet and mobile */
@media (max-width: 1024px) {
  .blob-layer {
    display: none;
  }
}

/* Single column for narrow screens */
@media (max-width: 768px) {
  .features-grid {
    grid-template-columns: 1fr;
    gap: 24px;
    padding: 0 20px;
    max-width: 100%;
  }
  
  .feature-card {
    max-width: 100%;
  }
}

@media (max-width: 640px) {
  .crm-benefits {
    padding: 100px 0 80px;
  }
  
  .section-title {
    font-size: 28px;
    margin-bottom: 40px;
    padding: 0 20px;
  }
  
  .blob-left,
  .blob-right {
    display: none;
  }
}
</style>
