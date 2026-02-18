<template>
  <section class="products" ref="sectionRef">
    <!-- Blob layer -->
    <div class="blob-layer">
      <div class="blob-left" :style="blobLeftStyle">
        <img src="/src/assets/images/blob/blob-left-2.png" alt="" />
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
            <img src="/src/assets/images/product-1.png" alt="MPBalance" />
          </div>

          <div class="product-content">
            <h3 class="product-title">MPBalance. Автоматизация работы<br>с маркетплейсами в области финансов</h3>
            <p class="product-description">MPBalance — платформа, которая синхронизирует товары, остатки и цены с МойСклад, обрабатывает отчёты Wildberries/Яндекс.Маркет</p>

            <div class="product-features">
              <div class="feature-item">
                <img src="/src/assets/images/ico/check_circle.svg" alt="" class="check-icon" />
                <span>Управление товарами</span>
              </div>
              <div class="feature-item">
                <img src="/src/assets/images/ico/check_circle.svg" alt="" class="check-icon" />
                <span>Склады и организации</span>
              </div>
              <div class="feature-item">
                <img src="/src/assets/images/ico/check_circle.svg" alt="" class="check-icon" />
                <span>Отчётность и аналитика</span>
              </div>
              <div class="feature-item">
                <img src="/src/assets/images/ico/check_circle.svg" alt="" class="check-icon" />
                <span>Командная работа</span>
              </div>
              <div class="feature-item">
                <img src="/src/assets/images/ico/check_circle.svg" alt="" class="check-icon" />
                <span>Управление заказами</span>
              </div>
              <div class="feature-item">
                <img src="/src/assets/images/ico/check_circle.svg" alt="" class="check-icon" />
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
            <img src="/src/assets/images/product-2.png" alt="Улучшение контент-рейтинга" />
          </div>

          <div class="product-content">
            <h3 class="product-title">Улучшение контент рейтинга Товаров<br>на Яндекс Маркет</h3>
            <p class="product-description">ИИ - оптимизация карточек: автоматическое повышение контент-рейтинга и продаж.</p>

            <div class="product-features">
              <div class="feature-item">
                <img src="/src/assets/images/ico/check_circle.svg" alt="" class="check-icon" />
                <span>Анализ конкурентов с высоким рейтингом.</span>
              </div>
              <div class="feature-item">
                <img src="/src/assets/images/ico/check_circle.svg" alt="" class="check-icon" />
                <span>Заполнение ключевых характеристик.</span>
              </div>
              <div class="feature-item">
                <img src="/src/assets/images/ico/check_circle.svg" alt="" class="check-icon" />
                <span>Генерация названия и описания с помощью ИИ.</span>
              </div>
              <div class="feature-item">
                <img src="/src/assets/images/ico/check_circle.svg" alt="" class="check-icon" />
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

// ======= Blob parallax =======
const blobLeftStyle = computed(() => {
  const offset = scrollY.value - sectionTop.value
  return {
    transform: `translateY(${offset * 0.18}px)` // Enhanced parallax (was 0.12)
  }
})

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
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
  window.removeEventListener('resize', handleResize)
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
}

/* Gradient glow spots on card - enhanced and properly z-indexed */
.card-glow {
  position: absolute;
  border-radius: 50%;
  pointer-events: none;
  z-index: 0; /* Behind content (z-index: 1) but above card background */
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

/* Image holder — rounded, contained, not edge-to-edge */
/* Background matches content side */
.product-image-holder {
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 32px 24px;
  background: rgba(255, 255, 255, 0.04); /* Match content side background */
}

.product-image-holder img {
  width: 100%;
  height: auto;
  max-height: 380px;
  object-fit: contain;
  border-radius: 16px;
  display: block;
}

/* Content */
.product-content {
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 36px 40px;
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
  .section-title { font-size: 28px; }
  .product-features { grid-template-columns: 1fr; }
  .product-content { padding: 20px; }
  .blob-left {
    display: none;
  }
}
</style>
