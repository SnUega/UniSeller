<template>
  <section class="products" ref="sectionRef">
    <!-- Blob layer -->
    <div class="blob-layer">
      <div class="blob-left" :style="blobLeftStyle">
        <img src="/src/assets/images/blob/blob-left-2.png" alt="" loading="lazy" />
      </div>
    </div>

    <div class="container">
      <h2 class="section-title">Продукты для роста вашего<br>бизнеса на маркетплейсах</h2>

      <div class="products-grid">

        <!-- Product 1 - MPBalance -->
        <div class="product-card">
          <!-- Gradient spots -->
          <div class="card-glow card-glow-left"></div>
          <div class="card-glow card-glow-right"></div>

          <!-- Image holder -->
          <div class="product-image-holder">
            <img src="/src/assets/images/product-1.png" alt="MPBalance" loading="lazy" />
          </div>

          <div class="product-content">
            <h3 class="product-title">MPBalance. Автоматизация работы<br>с маркетплейсами в области финансов</h3>
            <p class="product-description">MPBalance — платформа, которая синхронизирует товары, остатки и цены с МойСклад, обрабатывает отчёты Wildberries/Яндекс.Маркет</p>

            <div class="product-features">
              <div class="feature-item">
                <img src="/src/assets/images/ico/check_circle.svg" alt="" class="check-icon" loading="lazy" />
                <span>Управление товарами</span>
              </div>
              <div class="feature-item">
                <img src="/src/assets/images/ico/check_circle.svg" alt="" class="check-icon" loading="lazy" />
                <span>Склады и организации</span>
              </div>
              <div class="feature-item">
                <img src="/src/assets/images/ico/check_circle.svg" alt="" class="check-icon" loading="lazy" />
                <span>Отчётность и аналитика</span>
              </div>
              <div class="feature-item">
                <img src="/src/assets/images/ico/check_circle.svg" alt="" class="check-icon" loading="lazy" />
                <span>Командная работа</span>
              </div>
              <div class="feature-item">
                <img src="/src/assets/images/ico/check_circle.svg" alt="" class="check-icon" loading="lazy" />
                <span>Управление заказами</span>
              </div>
              <div class="feature-item">
                <img src="/src/assets/images/ico/check_circle.svg" alt="" class="check-icon" loading="lazy" />
                <span>Автоматизация процессов</span>
              </div>
            </div>

            <p class="product-result">Результат: Синхронизация каталога, отчёты, статусы заказов, склады и команды — в одном месте.</p>
            <button class="btn-details">Подробнее</button>
          </div>
        </div>

        <!-- Product 2 - Content Rating -->
        <div class="product-card product-card-2">
          <div class="card-glow card-glow-left"></div>
          <div class="card-glow card-glow-right"></div>

          <div class="product-image-holder">
            <img src="/src/assets/images/product-2.png" alt="Улучшение контент-рейтинга" loading="lazy" />
          </div>

          <div class="product-content">
            <h3 class="product-title">Улучшение контент рейтинга Товаров<br>на Яндекс Маркет</h3>
            <p class="product-description">ИИ - оптимизация карточек: автоматическое повышение контент-рейтинга и продаж.</p>

            <div class="product-features">
              <div class="feature-item">
                <img src="/src/assets/images/ico/check_circle.svg" alt="" class="check-icon" loading="lazy" />
                <span>Анализ конкурентов с высоким рейтингом.</span>
              </div>
              <div class="feature-item">
                <img src="/src/assets/images/ico/check_circle.svg" alt="" class="check-icon" loading="lazy" />
                <span>Заполнение ключевых характеристик.</span>
              </div>
              <div class="feature-item">
                <img src="/src/assets/images/ico/check_circle.svg" alt="" class="check-icon" loading="lazy" />
                <span>Генерация названия и описания с помощью ИИ.</span>
              </div>
              <div class="feature-item">
                <img src="/src/assets/images/ico/check_circle.svg" alt="" class="check-icon" loading="lazy" />
                <span>Массовое улучшение карточек в один клик.</span>
              </div>
            </div>

            <p class="product-result">Результат: Рост контент-рейтинга, позиций в выдаче и конверсии в заказы без ручной оптимизации.</p>
            <button class="btn-details">Подробнее</button>
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
const isMobile = computed(() => typeof window !== 'undefined' && window.innerWidth <= 1024)

// ======= Blob parallax =======
const blobLeftStyle = computed(() => {
  // Отключаем параллакс на мобильных для производительности
  if (isMobile.value) {
    return { transform: 'translateY(0px)' }
  }
  const offset = scrollY.value - sectionTop.value
  return {
    transform: `translateY(${offset * 0.18}px)`
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

onMounted(() => {
  scrollY.value = window.scrollY
  if (sectionRef.value) {
    sectionTop.value = sectionRef.value.offsetTop
  }
  // На мобильных не добавляем scroll listener для параллакса
  if (!isMobile.value) {
    window.addEventListener('scroll', throttledScroll, { passive: true })
  }
  window.addEventListener('resize', throttledResize, { passive: true })
  handleScroll()
})

onUnmounted(() => {
  window.removeEventListener('scroll', throttledScroll)
  window.removeEventListener('resize', throttledResize)
  if (scrollTimeout) cancelAnimationFrame(scrollTimeout)
  if (resizeTimeout) cancelAnimationFrame(resizeTimeout)
})
</script>

<style scoped>
.products {
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

.products-grid {
  display: flex;
  flex-direction: column;
  gap: 32px;
}

/* Card */
.product-card {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0;
  border-radius: 24px;
  overflow: hidden;
  background: rgba(255, 255, 255, 0.04);
  backdrop-filter: blur(8px);
  border: 1px solid rgba(255, 255, 255, 0.08);
  position: relative;
  isolation: isolate;
  min-height: 400px;
  z-index: 10;
}

/* Градиентная рамка при hover */
.product-card::before {
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
  z-index: -1;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.product-card:hover::before {
  opacity: 1;
}

.card-glow {
  position: absolute;
  border-radius: 50%;
  pointer-events: none;
  z-index: 0; 
  filter: blur(60px);
}

.card-glow-left {
  width: 300px;
  height: 300px;
  left: -60px;
  top: 50%;
  transform: translateY(-50%);
  background: radial-gradient(circle, rgba(255, 169, 44, 0.35) 0%, rgba(255, 169, 44, 0.15) 30%, transparent 70%);
}

.card-glow-right {
  width: 200px;
  height: 200px;
  right: 80px;
  bottom: -40px;
  background: radial-gradient(circle, rgba(255, 213, 138, 0.25) 0%, rgba(255, 213, 138, 0.1) 30%, transparent 70%);
}

.product-image-holder {
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 32px;
  background: transparent; /* ← УБРАН фон, теперь однородный с карточкой */
  min-height: 400px;
}

.product-image-holder img {
  width: 100%;
  height: auto;
  max-width: 100%; /* Не выходит за границы */
  max-height: 100%;
  object-fit: contain;
  border-radius: 24px;
  display: block;
}

/* Content */
.product-content {
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 24px 40px 36px 40px;
  justify-content: center;
}

.product-title {
  font-family: 'Benzin', 'Arial Black', sans-serif;
  font-weight: 400;
  font-size: 20px;
  line-height: 130%;
  color: rgba(255, 255, 255, 0.9);
}

.product-description {
  font-family: 'PP Mori', sans-serif;
  font-weight: 500;
  font-size: 14px;
  line-height: 150%;
  color: rgba(255, 255, 255, 0.6);
}

.product-features {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px 20px;
}

/* Product 2 - single column for features */
.product-card-2 .product-features {
  grid-template-columns: 1fr;
}

.feature-item {
  display: flex;
  align-items: baseline;
  gap: 8px;
  font-family: 'PP Mori', sans-serif;
  font-weight: 500;
  font-size: 13px;
  color: rgba(255, 255, 255, 0.8);
}

.check-icon {
  width: 16px;
  height: 16px;
  flex-shrink: 0;
}

.product-result {
  font-family: 'PP Mori', sans-serif;
  font-weight: 500;
  font-size: 13px;
  line-height: 150%;
  color: rgba(255, 255, 255, 0.45);
  padding-top: 8px;
  border-top: 1px solid rgba(255, 255, 255, 0.06);
}

.btn-details {
  width: fit-content;
  padding: 14px 32px;
  border-radius: 48px;
  background: linear-gradient(90deg, #FFD58A 0%, #FFA92C 100%);
  border: none;
  font-family: 'PP Mori', sans-serif;
  font-weight: 600;
  font-size: 14px;
  color: rgba(0, 0, 0, 0.9);
  cursor: pointer;
  transition: all 0.3s;
  margin-top: 4px;
}

.btn-details:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(255, 169, 44, 0.4);
}

/* Blob layer: absolutely positioned within products section */
/* Positioned under content */
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
    width: 480px;
    height: 580px;
  }
}

/* Hide blob on tablet and mobile */
@media (max-width: 1024px) {
  .blob-layer {
    display: none;
  }
}

@media (max-width: 900px) {
  .product-card {
    grid-template-columns: 1fr;
  }
  .product-image-holder {
    padding: 24px;
    min-height: 260px;
  }
  .product-content {
    padding: 24px 28px;
  }
}

@media (max-width: 640px) {
  .products { padding: 80px 0 0; }
  .section-title { font-size: 22px; }
  .product-features { grid-template-columns: 1fr; }
  .product-content { padding: 12px 20px 20px 20px; } /* Уменьшили верхний padding для сокращения расстояния от изображения */
  .blob-left {
    display: none;
  }

  .btn-details {
    width: 316px;
    height: 56px;
    padding: 0 28px;
    border-radius: 48px;
    border-width: 2px;
    gap: 10px;
  }

  .product-image-holder {
    padding: 20px;
  }

  .product-image-holder {
    padding: 5.5px 17px 0 17px;
    align-items: flex-start; 
  }
  
  .product-image-holder img {
    border-radius: 24px;
    width: 105%;
    max-width: 105%;
    margin-left: -8px;
    max-height: 260px;
  }
}
</style>
