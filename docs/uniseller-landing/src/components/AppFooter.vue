<template>
  <footer class="footer" ref="footerRef">

    <!-- Aurora - bottom of page -->
    <div class="aurora-wrap">
      <AuroraBackground
        :colorStops="['#e1a92c', '#e1d58a', '#604815']"
        :blend="0.6"
        :amplitude="0.8"
        :speed="2"
      />
    </div>

    <!-- Dots canvas - only right side -->
    <canvas ref="dotsCanvas" class="footer-dots"></canvas>

    <!-- Top section: CTA left + Form right -->
    <div class="footer-top">
      <div class="container">
        <div class="footer-top-inner">

          <!-- Left -->
          <div class="footer-left">
            <h2 class="cta-title">Готовы<br>к инновациям?<br>Начните свой путь<br>в CRM <img src="/src/assets/images/ico/footer-arrow.svg" alt="" class="arrow-icon" /></h2>

            <div class="social-links">
              <a href="#" class="social-link">
                <img src="/src/assets/images/ico/social-ico/1-tg.svg" alt="Telegram" />
              </a>
              <a href="#" class="social-link">
                <img src="/src/assets/images/ico/social-ico/2-yt.svg" alt="YouTube" />
              </a>
              <a href="#" class="social-link">
                <img src="/src/assets/images/ico/social-ico/3-insta.svg" alt="Instagram" />
              </a>
            </div>

            <div class="footer-address">
              <img src="/src/assets/images/ico/mark.svg" alt="" class="pin-icon" />
              <p>121087, г. Москва, вн.тер. г. Муниципальный округ Филёвский парк, Багратионовский проезд, д. 7, корп. 20В</p>
            </div>

            <div class="skolkovo-badge">
              <img src="/src/assets/images/Sk-footer.png" alt="Сколково" class="skolkovo-logo" />
              <span>Резидент<br>Сколково</span>
            </div>
          </div>

          <!-- Right: Form -->
          <div class="footer-right">
            <div class="form-grid">
              <input type="text" placeholder="Имя" class="form-input" v-model="formData.name" />
              <input type="text" placeholder="Компания" class="form-input" v-model="formData.company" />
              <input 
                type="tel" 
                placeholder="Телефон" 
                class="form-input" 
                :class="{ 'error': errors.phone }"
                v-model="formData.phone"
                @blur="validatePhone"
              />
              <input 
                type="email" 
                placeholder="Почта" 
                class="form-input"
                :class="{ 'error': errors.email }"
                v-model="formData.email"
                @blur="validateEmail"
              />
            </div>

            <div class="form-select-wrapper" @mouseenter="openDropdown" @mouseleave="closeDropdown">
              <button 
                class="form-select" 
                :class="{ 'active': dropdownOpen, 'has-selection': selectedProduct }"
                @click.prevent="toggleDropdown"
              >
                <span>{{ selectedProduct || 'Продукт' }}</span>
                <svg 
                  class="select-chevron" 
                  :class="{ 'rotated': dropdownOpen }"
                  width="12" 
                  height="8" 
                  viewBox="0 0 12 8" 
                  fill="none"
                >
                  <path d="M1 1L6 6L11 1" stroke="rgba(255,255,255,0.4)" stroke-width="1.5" stroke-linecap="round"/>
                </svg>
              </button>
              <transition name="dropdown">
                <div class="dropdown-menu" v-show="dropdownOpen">
                  <button class="dropdown-item" @click="selectProduct('Unicard')">Unicard</button>
                  <button class="dropdown-item" @click="selectProduct('MP Balance')">MP Balance</button>
                  <button class="dropdown-item" @click="selectProduct('Интеграция с 1С и МойСклад')">Интеграция с 1С и "МойСклад"</button>
                  <button class="dropdown-item" @click="selectProduct('Кастомная интеграция с CRM')">Кастомная интеграция с CRM</button>
                  <button class="dropdown-item" @click="selectProduct('Бот для работы с отзывами')">Бот для работы с отзывами</button>
                  <button class="dropdown-item" @click="selectProduct('Парсер товаров')">Парсер товаров</button>
                </div>
              </transition>
            </div>

            <textarea 
              placeholder="Комментарий" 
              class="form-textarea" 
              rows="3"
              v-model="formData.comment"
              maxlength="120"
            ></textarea>

            <label class="checkbox-label">
              <input type="checkbox" v-model="consent" class="checkbox-input" />
              <span class="checkbox-custom"></span>
              <span class="consent-text">Я даю согласие на обработку персональных данных в соответствии с <a href="#">Политикой конфиденциальности</a></span>
            </label>

            <div 
              class="btn-submit-wrapper"
              @mouseenter="showHint = true"
              @mouseleave="showHint = false"
            >
              <button 
                class="btn-submit" 
                :disabled="!isFormValid"
              >
                Отправить
              </button>
              <transition name="hint-fade">
                <div class="submit-hint" v-if="!isFormValid && showHint">
                  {{ getValidationHint() }}
                </div>
              </transition>
            </div>
          </div>

        </div>
      </div>
    </div>

    <!-- Bottom bar -->
    <div class="footer-bottom">
      <div class="container">
        <div class="footer-bottom-inner">
          <div class="footer-brand">
            <div class="footer-logo-wrap">
              <img src="/src/assets/images/logo-main.png" alt="Uniseller" class="footer-logo" />
            </div>
            <p class="footer-tagline">Начните работу за считанные минуты и узнайте, как CRM может оптимизировать управление вашими клиентами.</p>
          </div>
          <div class="footer-links">
            <a href="#">Договор-Оферта</a>
            <a href="#">Политика в отношении обработки данных «Cookie»</a>
            <a href="#">Политика в отношении обработки персональных данных</a>
            <a href="#">Согласие на обработку персональных данных</a>
            <span class="footer-copyright">© 2025 ООО «Uniseller.io»</span>
          </div>
        </div>
      </div>
    </div>

  </footer>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import AuroraBackground from './AuroraBackground.vue'

const footerRef = ref(null)
const dotsCanvas = ref(null)
const consent = ref(false)
const selectedProduct = ref('')
const dropdownOpen = ref(false)
const showHint = ref(false)

const formData = ref({
  name: '',
  company: '',
  phone: '',
  email: '',
  comment: ''
})

const errors = ref({
  phone: false,
  email: false
})

const validatePhone = () => {
  errors.value.phone = !formData.value.phone || formData.value.phone.trim() === ''
}

const validateEmail = () => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  errors.value.email = !formData.value.email || !emailRegex.test(formData.value.email)
}

const isFormValid = computed(() => {
  return consent.value && !errors.value.phone && !errors.value.email && 
         formData.value.phone.trim() !== '' && formData.value.email.trim() !== ''
})

const getValidationHint = () => {
  const missing = []
  if (!consent.value) missing.push('принять политику конфиденциальности')
  if (!formData.value.phone || formData.value.phone.trim() === '') missing.push('заполнить телефон')
  if (!formData.value.email || formData.value.email.trim() === '') missing.push(' почту')
  if (errors.value.email && formData.value.email) missing.push('указать корректную почту')
  return missing.length > 0 ? `Необходимо: ${missing.join(', ')}` : ''
}

const toggleDropdown = () => {
  dropdownOpen.value = !dropdownOpen.value
}

const openDropdown = () => {
  dropdownOpen.value = true
}

const closeDropdown = () => {
  dropdownOpen.value = false
}

const selectProduct = (product) => {
  selectedProduct.value = product
  dropdownOpen.value = false
}

let ctx = null
let animationId = null
const mouseX = ref(-1000)
const mouseY = ref(-1000)
const dots = []
const COLS = 60
const ROWS = 38

const handleMouseMove = (e) => {
  if (!footerRef.value) return
  const rect = footerRef.value.getBoundingClientRect()
  const x = e.clientX - rect.left
  const y = e.clientY - rect.top
  if (x >= 0 && y >= 0 && x <= rect.width && y <= rect.height) {
    mouseX.value = x
    mouseY.value = y
  } else {
    mouseX.value = -1000
    mouseY.value = -1000
  }
}

const initDots = (width, height) => {
  dots.length = 0
  const spacingX = width / (COLS - 1)
  // Calculate ROWS so that vertical spacing matches horizontal spacing
  const calculatedRows = Math.max(2, Math.round(height / spacingX) + 1)
  const spacingY = height / (calculatedRows - 1)
  for (let y = 0; y < calculatedRows; y++) {
    for (let x = 0; x < COLS; x++) {
      dots.push({ x: x * spacingX, y: y * spacingY })
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
  const maxDistSq = 100 * 100

  ctx.fillStyle = 'rgba(53, 53, 53, 0.4)'
  ctx.beginPath()
  dots.forEach(dot => {
    ctx.moveTo(dot.x + 1.5, dot.y)
    ctx.arc(dot.x, dot.y, 1.5, 0, Math.PI * 2)
  })
  ctx.fill()

  dots.forEach(dot => {
    const dx = mx - dot.x
    const dy = my - dot.y
    const distSq = dx * dx + dy * dy
    if (distSq < maxDistSq) {
      const inf = 1 - Math.sqrt(distSq) / 100
      const size = 2 + inf * inf * 8
      const opacity = inf * inf * 0.9
      const g = ctx.createRadialGradient(dot.x, dot.y, 0, dot.x, dot.y, size * 2.5)
      g.addColorStop(0, `rgba(255,213,138,${opacity * 0.8})`)
      g.addColorStop(0.4, `rgba(255,169,44,${opacity * 0.5})`)
      g.addColorStop(1, 'rgba(255,169,44,0)')
      ctx.fillStyle = g
      ctx.beginPath()
      ctx.arc(dot.x, dot.y, size * 2.5, 0, Math.PI * 2)
      ctx.fill()
      ctx.fillStyle = `rgba(255,213,138,${opacity})`
      ctx.beginPath()
      ctx.arc(dot.x, dot.y, size * 0.6, 0, Math.PI * 2)
      ctx.fill()
    }
  })

  animationId = requestAnimationFrame(draw)
}

const resizeCanvas = () => {
  if (!dotsCanvas.value || !footerRef.value) return
  const dpr = window.devicePixelRatio || 1
  const w = footerRef.value.offsetWidth
  const h = footerRef.value.offsetHeight
  dotsCanvas.value.width = w * dpr
  dotsCanvas.value.height = h * dpr
  dotsCanvas.value.style.width = w + 'px'
  dotsCanvas.value.style.height = h + 'px'
  ctx = dotsCanvas.value.getContext('2d', { alpha: true, desynchronized: true })
  ctx.scale(dpr, dpr)
  initDots(w, h)
}

let resizeObserver = null

onMounted(() => {
  resizeCanvas()
  draw()
  document.addEventListener('mousemove', handleMouseMove, { passive: true })
  window.addEventListener('resize', resizeCanvas)
  // Observe footer height changes
  resizeObserver = new ResizeObserver(() => resizeCanvas())
  if (footerRef.value) resizeObserver.observe(footerRef.value)
})

onUnmounted(() => {
  if (animationId) cancelAnimationFrame(animationId)
  document.removeEventListener('mousemove', handleMouseMove)
  window.removeEventListener('resize', resizeCanvas)
  if (resizeObserver) resizeObserver.disconnect()
})
</script>

<style scoped>
.footer {
  position: relative;
  margin-top: 40px; /* Reduced from 120px to bring content closer to reviews */
  overflow: hidden;
}

/* Aurora - grows from bottom up, flipped vertically */
.aurora-wrap {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 500px;
  z-index: 0;
  pointer-events: none;
  transform: scaleY(-1);
}

.aurora-wrap > * {
  position: absolute !important;
  inset: 0 !important;
  height: 100% !important;
  width: 100% !important;
}

/* Dots - full footer coverage */
.footer-dots {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
  pointer-events: none; /* document listener handles it */
}

/* Container */
.container {
  max-width: 1240px;
  margin: 0 auto;
  padding: 0 20px;
  position: relative;
  z-index: 2;
}

/* ===== TOP ===== */
.footer-top {
  padding: 20px 0 60px; /* Reduced top padding from 80px to bring content closer */
}

.footer-top-inner {
  display: grid;
  grid-template-columns: 1fr 1.4fr;
  gap: 80px;
  align-items: start;
}

.footer-left {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.cta-title {
  font-family: 'Benzin', 'Arial Black', sans-serif;
  font-weight: 400;
  font-size: 36px;
  line-height: 110%;
  letter-spacing: 0%;
  color: rgba(255, 255, 255, 0.9);
}

.arrow-icon {
  width: auto;
  height: 0.8em;
  margin-left: 0.2em;
  display: inline;
  vertical-align: baseline;
  white-space: nowrap;
}

.social-links {
  display: flex;
  gap: 12px;
}

.social-link {
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s;
  text-decoration: none;
  background: transparent;
  border: none;
  padding: 0;
}

.social-link:hover {
  opacity: 0.8;
}

.social-link img {
  width: 20px;
  height: 20px;
}

.footer-address {
  display: flex;
  gap: 10px;
  align-items: center;
}

.pin-icon {
  flex-shrink: 0;
  width: 32px;
  height: 32px;
  align-self: center;
}

.footer-address p {
  font-family: 'PP Mori', sans-serif;
  font-weight: 500;
  font-size: 13px;
  line-height: 150%;
  color: rgba(255, 255, 255, 0.45);
}

.skolkovo-badge {
  display: flex;
  align-items: center;
  gap: 12px;
  width: 156px;
  height: 74px;
  border-radius: 8px;
  padding: 8px 16px 8px 8px;
  background: rgba(255, 255, 255, 0.06);
  position: relative;
  border: none;
}

.skolkovo-badge::before {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: 8px;
  padding: 1px;
  background: linear-gradient(90deg, rgba(255, 255, 255, 0.2) 0%, rgba(255, 255, 255, 0.1) 100%);
  -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  -webkit-mask-composite: xor;
  mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  mask-composite: exclude;
  pointer-events: none;
  z-index: 0;
}

.skolkovo-logo {
  width: 57px;
  height: 57px;
  flex-shrink: 0;
  position: relative;
  z-index: 1;
  object-fit: contain;
}

.skolkovo-badge span {
  font-family: 'PP Mori', sans-serif;
  font-weight: 500;
  font-size: 13px;
  color: rgba(255, 255, 255, 0.55);
  line-height: 1.2;
  position: relative;
  z-index: 1;
}

/* Form */
.footer-right {
  display: flex;
  flex-direction: column;
  gap: 30px;
}

.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 14px 14px;
  row-gap: 30px;
}

.form-input,
.form-select,
.form-textarea {
  width: 100%;
  padding: 16px 20px;
  border-radius: 14px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.09);
  color: rgba(255, 255, 255, 0.9);
  font-family: 'PP Mori', sans-serif;
  font-weight: 500;
  font-size: 14px;
  outline: none;
  transition: border-color 0.3s;
  box-sizing: border-box;
}

.form-input::placeholder,
.form-textarea::placeholder {
  color: rgba(255, 255, 255, 0.3);
}

.form-input:focus,
.form-select:focus,
.form-textarea:focus {
  border-color: rgba(255, 213, 138, 0.35);
}

.form-input.error {
  border-color: rgba(255, 77, 77, 0.6);
}

.form-input.error:focus {
  border-color: rgba(255, 77, 77, 0.8);
}

.form-select-wrapper {
  position: relative;
}

.form-select {
  width: 100%;
  padding: 16px 20px;
  padding-right: 20px;
  border-radius: 14px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.09);
  color: rgba(255, 255, 255, 0.9);
  font-family: 'PP Mori', sans-serif;
  font-weight: 500;
  font-size: 14px;
  outline: none;
  transition: border-color 0.3s;
  box-sizing: border-box;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: space-between;
  text-align: left;
  position: relative;
}

.form-select span {
  flex: 1;
  color: rgba(255, 255, 255, 0.9);
}

.form-select:not(.has-selection) span {
  color: rgba(255, 255, 255, 0.3);
}

.form-select:focus,
.form-select.active {
  border-color: rgba(255, 213, 138, 0.35);
}

.select-chevron {
  width: 12px;
  height: 8px;
  flex-shrink: 0;
  transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  pointer-events: none;
  position: absolute;
  right: 20px;
  top: 50%;
  transform: translateY(-50%);
}

.select-chevron.rotated {
  transform: translateY(-50%) rotate(180deg);
}

.select-chevron.rotated {
  transform: rotate(180deg);
}

.dropdown-menu {
  position: absolute;
  top: calc(100% + 8px);
  left: 0;
  right: 0;
  background: rgba(25, 25, 25, 0.95);
  backdrop-filter: blur(24px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  padding: 8px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
  z-index: 10;
}

.dropdown-item {
  display: block;
  width: 100%;
  padding: 12px 16px;
  font-family: 'PP Mori', sans-serif;
  font-weight: 500;
  font-size: 14px;
  line-height: 140%;
  color: rgba(255, 255, 255, 0.6);
  text-decoration: none;
  border-radius: 10px;
  transition: all 0.2s;
  text-align: left;
  background: transparent;
  border: none;
  cursor: pointer;
}

.dropdown-item:hover {
  background: rgba(255, 255, 255, 0.05);
  color: rgba(255, 255, 255, 1);
}

/* Vue transition для плавной анимации */
.dropdown-enter-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.dropdown-leave-active {
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
}

.dropdown-enter-from {
  opacity: 0;
  transform: translateY(-12px);
}

.dropdown-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}

.dropdown-enter-to,
.dropdown-leave-from {
  opacity: 1;
  transform: translateY(0);
}

.form-textarea {
  resize: none;
  min-height: 80px;
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
  margin-top: 0;
  margin-bottom: 0;
}

.checkbox-input { display: none; }

.checkbox-custom {
  width: 20px;
  height: 20px;
  min-width: 20px;
  border-radius: 6px;
  border: 2px solid rgba(255, 213, 138, 0.35);
  background: transparent;
  margin: 0;
  margin-top: -2px;
  transition: all 0.2s;
  position: relative;
  flex-shrink: 0;
}

.checkbox-input:checked + .checkbox-custom {
  background: linear-gradient(90deg, #FFD58A 0%, #FFA92C 100%);
  border-color: rgba(255, 213, 138, 0.85);
}

.checkbox-input:checked + .checkbox-custom::after {
  content: '';
  position: absolute;
  left: 4px;
  top: 1px;
  width: 6px;
  height: 10px;
  border: 2px solid #191919;
  border-top: none;
  border-left: none;
  transform: rotate(45deg);
}

.consent-text {
  font-family: 'PP Mori', sans-serif;
  font-weight: 500;
  font-size: 12px;
  line-height: 150%;
  color: rgba(255, 255, 255, 0.38);
}

.consent-text a {
  color: rgba(255, 213, 138, 0.65);
  text-decoration: underline;
  text-underline-offset: 2px;
}

.btn-submit-wrapper {
  position: relative;
  display: inline-block;
}

.btn-submit {
  width: 301px;
  height: 56px;
  padding: 0 110px;
  border-radius: 48px;
  background: linear-gradient(90deg, #FFD58A 0%, #FFA92C 100%);
  border: 2px solid #FFD58A;
  box-shadow: 0px 0px 74px 0px rgba(255, 169, 44, 0.5), 0px 0px 38px 0px rgba(0, 0, 0, 0.25);
  font-family: 'PP Mori', sans-serif;
  font-weight: 600;
  font-size: 15px;
  color: rgba(0, 0, 0, 0.85);
  cursor: pointer;
  transition: all 0.3s;
  margin-top: -6px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.submit-hint {
  position: absolute;
  bottom: calc(100% + 12px);
  left: -20px;
  background: rgba(25, 25, 25, 0.95);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 14px 20px;
  font-family: 'PP Mori', sans-serif;
  font-weight: 500;
  font-size: 12px;
  line-height: 120%;
  letter-spacing: -0.02em;
  color: rgba(255, 255, 255, 0.85);
  pointer-events: none;
  z-index: 100;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.3);
  text-align: center;
  width: max-content;
  max-width: 350px;
  white-space: normal;
}

/* Vue transition для плавной анимации подсказки */
.hint-fade-enter-active {
  transition: opacity 0.4s cubic-bezier(0.4, 0, 0.2, 1),
              transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.hint-fade-leave-active {
  transition: opacity 0.3s cubic-bezier(0.4, 0, 0.2, 1),
              transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.hint-fade-enter-from {
  opacity: 0;
  transform: translateY(6px);
}

.hint-fade-enter-to {
  opacity: 1;
  transform: translateY(0);
}

.hint-fade-leave-from {
  opacity: 1;
  transform: translateY(0);
}

.hint-fade-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}

.submit-hint::after {
  content: '';
  position: absolute;
  top: 100%;
  left: 50%;
  transform: translateX(-50%);
  width: 0;
  height: 0;
  border-left: 6px solid transparent;
  border-right: 6px solid transparent;
  border-top: 6px solid rgba(25, 25, 25, 0.95);
}

.btn-submit:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(255, 169, 44, 0.4);
}

.btn-submit:disabled {
  opacity: 0.5;
  cursor: default;
}

/* ===== BOTTOM ===== */
.footer-bottom {
  padding: 28px 0 36px;
  border-top: 1px solid rgba(255, 255, 255, 0.06);
}

.footer-bottom-inner {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 60px;
}

.footer-brand {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.footer-logo-wrap {
  display: flex;
  align-items: center;
  gap: 10px;
}

.footer-logo {
  width: 244px;
  height: 37px;
}

.footer-tagline {
  font-family: 'PP Mori', sans-serif;
  font-weight: 500;
  font-size: 12px;
  line-height: 160%;
  color: rgba(255, 255, 255, 0.3);
  max-width: 280px;
}

.footer-links {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 12px;
  text-align: left;
}

.footer-links a {
  font-family: 'PP Mori', sans-serif;
  font-weight: 500;
  font-size: 12px;
  line-height: 120%;
  letter-spacing: -0.02em;
  color: rgba(255, 255, 255, 0.5);
  text-decoration: underline;
  text-underline-offset: 3px;
  text-decoration-color: rgba(255, 255, 255, 0.5);
  transition: color 0.3s;
}

.footer-copyright {
  font-family: 'PP Mori', sans-serif;
  font-weight: 500;
  font-size: 12px;
  line-height: 120%;
  letter-spacing: -0.02em;
  color: rgba(255, 255, 255, 0.5);
}

.footer-links a:hover {
  color: rgba(255, 213, 138, 1);
}

/* Responsive */
@media (max-width: 1024px) {
  /* Dots теперь видны на всех устройствах */

  .footer-top-inner {
    grid-template-columns: 1fr;
    gap: 48px;
  }

  /* Мобильный порядок через order на grid children */
  .footer-left {
    order: 1;
    display: flex;
    flex-direction: column;
  }

  .footer-right {
    order: 2; /* Форма идёт после заголовка */
  }

  /* Внутри footer-left переставляем элементы */
  .cta-title {
    order: 1;
  }

  .social-links {
    order: 3;
    margin-top: 24px;
  }

  .footer-address {
    order: 4;
  }

  .skolkovo-badge {
    order: 5;
  }

  .footer-bottom-inner {
    flex-direction: column;
    gap: 28px;
  }

  .footer-links { align-items: flex-start; }
}

@media (max-width: 640px) {
  .footer { margin-top: 80px; }
  .cta-title { font-size: 32px; }
  .form-grid { grid-template-columns: 1fr; }
  
  /* Центрировать кнопку отправки */
  .form-submit {
    margin-left: auto;
    margin-right: auto;
    display: block;
  }

  /* Aurora меньше на мобильных */
  .aurora-wrap {
    height: 300px;
  }
}
</style>
