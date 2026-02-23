<template>
  <footer class="footer" ref="footerRef">
    <!-- Success popup -->
    <SuccessPopup :visible="showSuccessPopup" @close="showSuccessPopup = false" />

    <!-- Aurora - bottom of page -->
    <div class="aurora-wrap">
      <AuroraBackground
        :colorStops="['#e1a92c', '#e1d58a', '#604815']"
        :blend="0.6"
        :amplitude="0.8"
        :speed="4"
      />
    </div>

    <!-- Dots canvas - only right side -->
    <canvas ref="dotsCanvas" class="footer-dots"></canvas>

    <!-- Top section: CTA left + Form right -->
    <div class="footer-top">
      <div class="container">
        <div class="footer-top-inner">

          <!-- Left: Desktop order -->
          <div class="footer-left">
            <h2 class="cta-title">Готовы<br>к инновациям?<br>Начните свой путь<br>в CRM <img src="/src/assets/images/ico/footer-arrow.svg" alt="" class="arrow-icon" loading="lazy" /></h2>

            <div class="social-links desktop-social">
              <a href="tel:+79162178516" class="social-link social-link--phone" aria-label="Позвонить">
                <svg class="phone-icon-svg" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                  <defs>
                    <linearGradient id="footer-phone-grad" x1="0" y1="0" x2="24" y2="24" gradientUnits="userSpaceOnUse">
                      <stop stop-color="#FFD58A"/>
                      <stop offset="1" stop-color="#FFA92C"/>
                    </linearGradient>
                    <mask id="footer-phone-mask">
                      <circle cx="12" cy="12" r="11" fill="white"/>
                      <path fill="black" d="M15.22,20.64a20.37,20.37,0,0,0,7.4,4.79l3.77-3a.67.67,0,0,1,.76,0l7,4.51a2,2,0,0,1,.33,3.18l-3.28,3.24a4,4,0,0,1-3.63,1.07,35.09,35.09,0,0,1-17.15-9A33.79,33.79,0,0,1,1.15,8.6a3.78,3.78,0,0,1,1.1-3.55l3.4-3.28a2,2,0,0,1,3.12.32L13.43,9a.63.63,0,0,1,0,.75l-3.07,3.69A19.75,19.75,0,0,0,15.22,20.64Z" transform="translate(12,12) scale(0.4) translate(-18,-18)"/>
                    </mask>
                  </defs>
                  <circle cx="12" cy="12" r="11" fill="url(#footer-phone-grad)" stroke="rgba(255,255,255,0.15)" stroke-width="1" mask="url(#footer-phone-mask)"/>
                </svg>
              </a>
              <a href="http://youtube.com/uniseller" target="_blank" rel="noopener" class="social-link" aria-label="YouTube">
                <img src="/src/assets/images/ico/social-ico/2-yt.svg" alt="YouTube" loading="lazy" />
              </a>
              <a href="https://www.instagram.com/uniseller.io" target="_blank" rel="noopener" class="social-link" aria-label="Instagram">
                <img src="/src/assets/images/ico/social-ico/3-insta.svg" alt="Instagram" loading="lazy" />
              </a>
              <a href="https://t.me/uniseller_io" target="_blank" rel="noopener" class="social-link social-link--tg" aria-label="Telegram">
                <img src="/src/assets/images/ico/social-ico/1-tg.svg" alt="Telegram" loading="lazy" />
              </a>
            </div>

            <div class="footer-address desktop-address">
              <img src="/src/assets/images/ico/mark.svg" alt="" class="pin-icon" loading="lazy" />
              <p>121087, г. Москва, вн.тер. г. Муниципальный округ Филёвский парк, Багратионовский проезд, д. 7, корп. 20В</p>
            </div>

            <div class="skolkovo-badge desktop-skolkovo">
              <img src="/src/assets/images/Sk-footer.png" alt="Сколково" class="skolkovo-logo" loading="lazy" />
              <span>Резидент<br>Сколково</span>
            </div>
          </div>

          <!-- Right: Form -->
          <div class="footer-right">
            <div class="form-grid">
              <div class="input-glow-wrap card-glow-border">
                <input type="text" placeholder="Имя" class="form-input" v-model="formData.name" />
              </div>
              <div class="input-glow-wrap card-glow-border">
                <input type="text" placeholder="Компания" class="form-input" v-model="formData.company" />
              </div>
              <div class="input-glow-wrap card-glow-border">
                <input 
                  type="tel" 
                  placeholder="Телефон" 
                  class="form-input" 
                  :class="{ 'error': errors.phone }"
                  v-model="formData.phone"
                  @blur="validatePhone"
                />
              </div>
              <div class="input-glow-wrap card-glow-border">
                <input 
                  type="email" 
                  placeholder="Почта" 
                  class="form-input"
                  :class="{ 'error': errors.email }"
                  v-model="formData.email"
                  @blur="validateEmail"
                />
              </div>
            </div>

            <div class="form-select-wrapper" ref="dropdownWrapRef">
              <button 
                class="form-select card-glow-border" 
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

            <div class="input-glow-wrap card-glow-border textarea-wrap">
              <textarea 
                placeholder="Комментарий" 
                class="form-textarea" 
                rows="3"
                v-model="formData.comment"
                maxlength="120"
              ></textarea>
            </div>

            <label class="checkbox-label">
              <input type="checkbox" v-model="consent" class="checkbox-input" />
              <span class="checkbox-custom"></span>
              <span class="consent-text">Я даю согласие на обработку персональных данных в соответствии с <a href="#">Политикой конфиденциальности</a></span>
            </label>

            <div 
              class="btn-submit-wrapper"
              @mouseenter="showHint = true"
              @mouseleave="showHint = false"
              @touchstart.prevent="!isFormValid && (showHint = true)"
              @touchend="() => window.setTimeout(() => showHint = false, 2500)"
            >
              <button 
                class="btn-submit" 
                :disabled="!isFormValid"
                @click.prevent="submitForm"
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

          <!-- Mobile order: Social, Address, Skolkovo -->
          <div class="footer-mobile-extra">
            <div class="social-links mobile-social">
              <a href="tel:+79162178516" class="social-link social-link--phone" aria-label="Позвонить">
                <svg class="phone-icon-svg" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                  <defs>
                    <linearGradient id="footer-phone-grad-mob" x1="0" y1="0" x2="24" y2="24" gradientUnits="userSpaceOnUse">
                      <stop stop-color="#FFD58A"/>
                      <stop offset="1" stop-color="#FFA92C"/>
                    </linearGradient>
                    <mask id="footer-phone-mask-mob">
                      <circle cx="12" cy="12" r="11" fill="white"/>
                      <path fill="black" d="M15.22,20.64a20.37,20.37,0,0,0,7.4,4.79l3.77-3a.67.67,0,0,1,.76,0l7,4.51a2,2,0,0,1,.33,3.18l-3.28,3.24a4,4,0,0,1-3.63,1.07,35.09,35.09,0,0,1-17.15-9A33.79,33.79,0,0,1,1.15,8.6a3.78,3.78,0,0,1,1.1-3.55l3.4-3.28a2,2,0,0,1,3.12.32L13.43,9a.63.63,0,0,1,0,.75l-3.07,3.69A19.75,19.75,0,0,0,15.22,20.64Z" transform="translate(12,12) scale(0.4) translate(-18,-18)"/>
                    </mask>
                  </defs>
                  <circle cx="12" cy="12" r="11" fill="url(#footer-phone-grad-mob)" stroke="rgba(255,255,255,0.15)" stroke-width="1" mask="url(#footer-phone-mask-mob)"/>
                </svg>
              </a>
              <a href="http://youtube.com/uniseller" target="_blank" rel="noopener" class="social-link" aria-label="YouTube">
                <img src="/src/assets/images/ico/social-ico/2-yt.svg" alt="YouTube" loading="lazy" />
              </a>
              <a href="https://www.instagram.com/uniseller.io" target="_blank" rel="noopener" class="social-link" aria-label="Instagram">
                <img src="/src/assets/images/ico/social-ico/3-insta.svg" alt="Instagram" loading="lazy" />
              </a>
              <a href="https://t.me/uniseller_io" target="_blank" rel="noopener" class="social-link social-link--tg" aria-label="Telegram">
                <img src="/src/assets/images/ico/social-ico/1-tg.svg" alt="Telegram" loading="lazy" />
              </a>
        </div>

            <div class="footer-address mobile-address">
              <img src="/src/assets/images/ico/mark.svg" alt="" class="pin-icon" loading="lazy" />
              <p>121087, г. Москва, вн.тер. г. Муниципальный округ Филёвский парк, Багратионовский проезд, д. 7, корп. 20В</p>
            </div>

            <div class="skolkovo-badge mobile-skolkovo">
              <img src="/src/assets/images/Sk-footer.png" alt="Сколково" class="skolkovo-logo" loading="lazy" />
              <span>Резидент<br>Сколково</span>
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
              <img src="/src/assets/images/logo-main.png" alt="Uniseller" class="footer-logo" loading="lazy" />
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
import SuccessPopup from './SuccessPopup.vue'
import { useCardGlow } from '../composables/useCardGlow.js'

const footerRef = ref(null)
const dropdownWrapRef = ref(null)
const showSuccessPopup = ref(false)
const isSubmitting = ref(false)

useCardGlow({
  cardSelector: '.input-glow-wrap, .form-select',
  getSectionEl: () => footerRef.value,
})
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

const closeDropdown = () => {
  dropdownOpen.value = false
}

// Закрывать dropdown при клике/тапе за его пределами
const onDocumentClickDropdown = (e) => {
  if (dropdownWrapRef.value && !dropdownWrapRef.value.contains(e.target)) {
    dropdownOpen.value = false
  }
}

const selectProduct = (product) => {
  selectedProduct.value = product
  dropdownOpen.value = false
}

// ─── Отправка формы ───────────────────────────────────────────────
// true = Web3Forms (работает без PHP, письмо в стандартном виде).
// false = send.php (нужен PHP, письмо с HTML-версткой в стиле страницы).
const USE_WEB3FORMS = true
const W3F_ACCESS_KEY = '06f2700d-5f2c-4f2e-9667-7de9d40ab80e'

const submitForm = async () => {
  if (!isFormValid.value || isSubmitting.value) return
  isSubmitting.value = true

  const d = formData.value
  const product = selectedProduct.value || '—'

  const payload = USE_WEB3FORMS
    ? {
        access_key: W3F_ACCESS_KEY,
        subject: `Новая заявка от ${d.name || 'пользователя'} | Uniseller`,
        from_name: 'Uniseller',
        replyto: d.email,
        message: [
          'Новая заявка с сайта',
          '',
          `Имя: ${d.name || '—'}`,
          `Компания: ${d.company || '—'}`,
          `Телефон: ${d.phone}`,
          `Email: ${d.email}`,
          `Продукт: ${product}`,
          d.comment ? `Комментарий: ${d.comment}` : '',
        ].filter(Boolean).join('\n'),
        botcheck: '',
      }
    : {
        name: d.name,
        company: d.company,
        phone: d.phone,
        email: d.email,
        product,
        comment: d.comment,
      }

  const endpoint = USE_WEB3FORMS ? 'https://api.web3forms.com/submit' : '/send.php'

  try {
    const res = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify(payload),
    })
    const raw = await res.text()
    let data = {}
    try {
      data = JSON.parse(raw)
    } catch {
      if (!USE_WEB3FORMS) {
        console.error('Send error: ответ не JSON. Запустите PHP (php -S localhost:8080 -t public) или поставьте USE_WEB3FORMS = true.', raw.slice(0, 200))
      } else {
        console.error('Send error: ответ не JSON.', raw.slice(0, 200))
      }
      isSubmitting.value = false
      return
    }
    if (data.success) {
      showSuccessPopup.value = true
      formData.value = { name: '', company: '', phone: '', email: '', comment: '' }
      selectedProduct.value = ''
      consent.value = false
      errors.value = { phone: false, email: false }
    } else {
      console.error('Send error:', data.message || res.statusText)
    }
  } catch (e) {
    console.error('Network error:', e)
  } finally {
    isSubmitting.value = false
  }
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
  const isMobile = window.innerWidth <= 768
  const fixedSpacing = 20
  
  if (isMobile) {
    // На мобильных: равный интервал 20px по вертикали и горизонтали
    const cols = Math.ceil(width / fixedSpacing) + 1
    const rows = Math.ceil(height / fixedSpacing) + 1
    
    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < cols; x++) {
        dots.push({ x: x * fixedSpacing, y: y * fixedSpacing })
      }
    }
  } else {
    // На десктопе: Calculate horizontal spacing first
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
}

// Тач-обработчики для свайпов (как в hero DotsPlane)
const handleTouchMove = (e) => {
  if (!footerRef.value) return
  const touch = e.touches[0]
  if (!touch) return
  const rect = footerRef.value.getBoundingClientRect()
  const x = touch.clientX - rect.left
  const y = touch.clientY - rect.top
  if (x >= 0 && y >= 0 && x <= rect.width && y <= rect.height) {
    mouseX.value = x
    mouseY.value = y
  } else {
    mouseX.value = -1000
    mouseY.value = -1000
  }
}

const handleTouchStart = (e) => {
  if (!footerRef.value) return
  const touch = e.touches[0]
  if (!touch) return
  const rect = footerRef.value.getBoundingClientRect()
  const x = touch.clientX - rect.left
  const y = touch.clientY - rect.top
  if (x >= 0 && x <= rect.width && y >= 0 && y <= rect.height) {
    mouseX.value = x
    mouseY.value = y
  }
}

const handleTouchEnd = () => {
  mouseX.value = -1000
  mouseY.value = -1000
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
  const maxDistSq = 100 * 100

  // Batch rendering базовых точек для оптимизации
  ctx.fillStyle = 'rgba(53, 53, 53, 0.4)'
  ctx.beginPath()
  for (let i = 0; i < dots.length; i++) {
    const dot = dots[i]
    ctx.moveTo(dot.x + 1.5, dot.y)
    ctx.arc(dot.x, dot.y, 1.5, 0, Math.PI * 2)
  }
  ctx.fill()

  // Оптимизированный рендеринг активных точек
  for (let i = 0; i < dots.length; i++) {
    const dot = dots[i]
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
  }

  animationId = requestAnimationFrame(draw)
}

// Throttle для resize canvas на мобильных
let resizeCanvasTimeout = null
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

const throttledResizeCanvas = () => {
  if (resizeCanvasTimeout) {
    cancelAnimationFrame(resizeCanvasTimeout)
  }
  resizeCanvasTimeout = requestAnimationFrame(() => {
    resizeCanvas()
    resizeCanvasTimeout = null
  })
}

let resizeObserver = null

onMounted(() => {
  resizeCanvas()
  draw()
  document.addEventListener('mousemove', handleMouseMove, { passive: true })
  document.addEventListener('touchstart', handleTouchStart, { passive: true })
  document.addEventListener('touchmove', handleTouchMove, { passive: true })
  document.addEventListener('touchend', handleTouchEnd, { passive: true })
  document.addEventListener('touchcancel', handleTouchEnd, { passive: true })
  document.addEventListener('click', onDocumentClickDropdown)
  document.addEventListener('touchstart', onDocumentClickDropdown, { passive: true })
  window.addEventListener('resize', throttledResizeCanvas)
  // Observe footer height changes
  resizeObserver = new ResizeObserver(() => throttledResizeCanvas())
  if (footerRef.value) resizeObserver.observe(footerRef.value)
})

onUnmounted(() => {
  if (animationId) cancelAnimationFrame(animationId)
  document.removeEventListener('mousemove', handleMouseMove)
  document.removeEventListener('touchstart', handleTouchStart)
  document.removeEventListener('touchmove', handleTouchMove)
  document.removeEventListener('touchend', handleTouchEnd)
  document.removeEventListener('touchcancel', handleTouchEnd)
  document.removeEventListener('click', onDocumentClickDropdown)
  document.removeEventListener('touchstart', onDocumentClickDropdown)
  window.removeEventListener('resize', throttledResizeCanvas)
  if (resizeCanvasTimeout) cancelAnimationFrame(resizeCanvasTimeout)
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

@media (max-width: 1024px) {
  .aurora-wrap {
    height: 400px;
  }
}

@media (max-width: 768px) {
  .aurora-wrap {
    height: 350px;
  }
}

@media (max-width: 640px) {
  .aurora-wrap {
    height: 300px;
  }
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
  flex-direction: row;
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

.social-link img,
.social-link svg {
  width: 20px;
  height: 20px;
}
.social-link--phone .phone-icon-svg {
  flex-shrink: 0;
  display: block;
  width: 24px;
  height: 24px;
}

.social-link--tg {
  transform: translateY(1px);
}

.footer-address {
  display: flex;
  gap: 10px;
  align-items: flex-start;
}

@media (max-width: 640px) {
  .footer-address {
    align-items: flex-start;
    gap: 8px;
  }
  
  .footer-address p {
    font-size: 11px;
    line-height: 1.4;
    display: block;
  }
}

.pin-icon {
  flex-shrink: 0;
  width: 32px;
  height: 32px;
  align-self: flex-start;
  margin-top: 2px;
}

@media (max-width: 640px) {
  .pin-icon {
    width: 24px;
    height: 24px;
    margin-top: 0;
  }
}

.footer-address p {
  font-family: 'PP Mori', sans-serif;
  font-weight: 500;
  font-size: 13px;
  line-height: 150%;
  color: rgba(255, 255, 255, 0.45);
}

@media (max-width: 640px) {
  .pin-icon {
    width: 24px;
    height: 24px;
  }

  .footer-address p {
    font-size: 11px;
    line-height: 140%;
  }
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
  box-sizing: border-box;
  flex-direction: row;
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
  display: block;
}

.skolkovo-badge span {
  font-family: 'PP Mori', sans-serif;
  font-weight: 500;
  font-size: 13px;
  color: rgba(255, 255, 255, 0.55);
  line-height: 1.2;
  position: relative;
  z-index: 1;
  flex: 1;
  min-width: 0;
  word-wrap: break-word;
  display: block;
  text-align: left;
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
  background: rgba(255, 255, 255, 0.06);
  backdrop-filter: blur(24px) saturate(180%);
  -webkit-backdrop-filter: blur(24px) saturate(180%);
  border: 1px solid rgba(255, 255, 255, 0.09);
  color: rgba(255, 255, 255, 0.9);
  font-family: 'PP Mori', sans-serif;
  font-weight: 500;
  font-size: 14px;
  outline: none;
  transition: border-color 0.3s;
  box-sizing: border-box;
  position: relative;
  overflow: visible; /* нужно чтобы ::after card-glow-border был виден */
  resize: vertical;
}

/* Обёртка для <input> — т.к. ::after не работает на input-элементах */
.input-glow-wrap {
  position: relative;
  border-radius: 14px;
}

.textarea-wrap {
  display: block; /* растягивается по высоте textarea */
}

.textarea-wrap .form-textarea {
  display: block;
  width: 100%;
}

.input-glow-wrap .form-input {
  border-radius: inherit;
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

@media (max-width: 1024px) {
  .btn-submit-wrapper {
    display: flex;
    justify-content: center;
    width: 100%;
  }
}

.btn-submit {
  width: 301px;
  height: 56px;
  padding: 0 110px;
  border-radius: 48px;
  background: linear-gradient(90deg, #FFD58A 0%, #FFA92C 50%, #FFD58A 100%);
  background-size: 200% 100%; /* ← Для анимации */
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
  margin-bottom: -6px;
}

.hint-fade-enter-to {
  opacity: 1;
  margin-bottom: 0px;
}

.hint-fade-leave-from {
  opacity: 1;
  margin-bottom: 0px;
}

.hint-fade-leave-to {
  opacity: 0;
  margin-bottom: 4px;
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
  animation: gradientShift 3s ease infinite; /* ← Анимация градиента */
}

@keyframes gradientShift {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}

.btn-submit {
  background: linear-gradient(90deg, #FFD58A 0%, #FFA92C 50%, #FFD58A 100%);
  background-size: 200% 100%; /* ← Для анимации */
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
  /* На мобильных показываем dots */
  .footer-dots { 
    display: block;
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

  .footer-top-inner {
    grid-template-columns: 1fr;
    gap: 48px;
  }

  /* Скрываем desktop элементы на мобильных */
  .desktop-social,
  .desktop-address,
  .desktop-skolkovo {
    display: none;
  }

  /* Показываем mobile элементы */
  .footer-mobile-extra {
    display: flex;
    flex-direction: column;
    gap: 24px;
  }

  .mobile-social.social-links {
    display: flex !important;
    flex-direction: row !important;
    flex-wrap: nowrap !important;
    gap: 12px;
    justify-content: flex-start;
    align-items: center;
  }

  .mobile-social .social-link {
    display: flex;
    flex-shrink: 0;
  }

  .mobile-address,
  .mobile-skolkovo {
    display: block;
  }

  .mobile-address {
    display: flex;
    align-items: flex-start;
    gap: 8px;
  }

  .mobile-address p {
    font-size: 11px;
    line-height: 1.4;
    flex: 1;
  }

  .mobile-skolkovo {
    width: 156px;
    height: 74px;
    display: flex;
    flex-direction: row;
    align-items: center;
  }

  .mobile-skolkovo span {
    white-space: normal;
    word-wrap: break-word;
    display: block;
  }

  .footer-bottom-inner {
    flex-direction: column;
    gap: 28px;
  }

  .footer-links { align-items: flex-start; }
}

@media (min-width: 1025px) {
  /* Скрываем mobile элементы на десктопе */
  .footer-mobile-extra {
    display: none;
  }
}

@media (max-width: 640px) {
  .footer { margin-top: 80px; }
  .cta-title { font-size: 22px; }
  .form-grid { grid-template-columns: 1fr; }
  
  /* Tooltip на мобильных — поверх всего, по центру кнопки */
  .submit-hint {
    left: 50%;
    transform: translateX(-50%);
    max-width: 280px;
    z-index: 9999;
    bottom: calc(100% + 16px);
  }

  /* Стрелочка тоже центруется автоматически через left:50% выше */
  
  /* Порядок на мобильных: Заголовок → Форма → Соц.кнопки → Адрес → Сколково */
  .footer-top-inner {
    display: flex;
    flex-direction: column;
    gap: 32px;
  }
  
  .footer-left {
    order: 1;
  }
  
  .footer-right {
    order: 2;
  }
  
  .footer-mobile-extra {
    order: 3;
    gap: 20px;
  }
}
</style>
