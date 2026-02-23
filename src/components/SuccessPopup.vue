<template>
  <Teleport to="body">
    <Transition name="popup-fade">
      <div v-if="visible" class="popup-overlay" @click.self="close">
        <div
          class="popup-card"
          ref="cardRef"
          @mousemove="onMouseMove"
          @mouseleave="onMouseLeave"
        >
          <!-- Magic-bento glow border -->
          <div class="popup-glow-border" :style="glowStyle"></div>

          <!-- Animated check icon -->
          <div class="popup-icon" :class="{ 'icon-visible': iconVisible }">
            <!-- Расходящееся кольцо (акцентный градиент, fade out) -->
            <svg class="popup-icon-ring" width="64" height="64" viewBox="0 0 64 64" fill="none" aria-hidden="true">
              <defs>
                <linearGradient id="ring-grad" x1="0" y1="0" x2="64" y2="64" gradientUnits="userSpaceOnUse">
                  <stop stop-color="#FFD58A"/>
                  <stop offset="1" stop-color="#FFA92C"/>
                </linearGradient>
              </defs>
              <circle cx="32" cy="32" r="28" fill="none" stroke="url(#ring-grad)" stroke-width="2" stroke-opacity="0.9"/>
            </svg>
            <svg class="check-svg" width="64" height="64" viewBox="0 0 64 64" fill="none">
              <defs>
                <linearGradient id="icon-grad" x1="0" y1="0" x2="64" y2="64" gradientUnits="userSpaceOnUse">
                  <stop stop-color="#FFD58A"/>
                  <stop offset="1" stop-color="#FFA92C"/>
                </linearGradient>
              </defs>
              <!-- Circle — draws via stroke-dashoffset -->
              <circle
                class="check-circle"
                cx="32" cy="32" r="28"
                fill="none"
                stroke="url(#icon-grad)"
                stroke-width="2.5"
                stroke-linecap="round"
                :stroke-dasharray="circleLen"
                :stroke-dashoffset="circleDash"
                transform="rotate(-90 32 32)"
              />
              <!-- Checkmark — draws via stroke-dashoffset, starts after circle -->
              <path
                class="check-mark"
                d="M20 33L28 41L44 23"
                fill="none"
                stroke="url(#icon-grad)"
                stroke-width="3"
                stroke-linecap="round"
                stroke-linejoin="round"
                :stroke-dasharray="checkLen"
                :stroke-dashoffset="checkDash"
              />
            </svg>
          </div>

          <p class="popup-text">Спасибо, ваша заявка принята.</p>

          <!-- Radial progress timer + close -->
          <div class="popup-progress-wrap">
            <svg class="popup-progress-svg" viewBox="0 0 64 64" width="64" height="64">
              <defs>
                <linearGradient id="progress-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stop-color="#FFD58A"/>
                  <stop offset="100%" stop-color="#FFA92C"/>
                </linearGradient>
              </defs>
              <circle cx="32" cy="32" r="27" fill="none" stroke="rgba(255,255,255,0.08)" stroke-width="3"/>
              <circle
                cx="32" cy="32" r="27"
                fill="none"
                stroke="url(#progress-grad)"
                stroke-width="3"
                stroke-linecap="round"
                :stroke-dasharray="circumference"
                :stroke-dashoffset="dashOffset"
                transform="rotate(-90 32 32)"
              />
            </svg>
            <button class="popup-close-btn" @click="close" aria-label="Закрыть">
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path d="M1 1L11 11M11 1L1 11" stroke="rgba(255,255,255,0.55)" stroke-width="1.8" stroke-linecap="round"/>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { ref, computed, watch, onUnmounted } from 'vue'

const props = defineProps({ visible: Boolean })
const emit = defineEmits(['close'])

const DURATION = 3500

const cardRef = ref(null)
const glowX = ref(50)
const glowY = ref(50)
const glowIntensity = ref(0)
const iconVisible = ref(false)

// ── Анимация иконки ──────────────────────────────────────────────
const circleLen = 2 * Math.PI * 28   // ~175.9
const checkLen  = 36                  // примерная длина path галочки

const circleDash = ref(circleLen)   // 0 = полностью нарисовано
const checkDash  = ref(checkLen)

let iconRaf = null

function animateIcon() {
  // Фаза 1: рисуем круг (0 → 400ms)
  // Фаза 2: рисуем галочку (350ms → 750ms)
  const CIRCLE_DUR = 450
  const CHECK_DELAY = 320
  const CHECK_DUR   = 380
  const start = performance.now()

  const tick = (now) => {
    const t = now - start

    // Круг
    const cp = Math.min(t / CIRCLE_DUR, 1)
    const ce = easeOutCubic(cp)
    circleDash.value = circleLen * (1 - ce)

    // Галочка с задержкой
    if (t >= CHECK_DELAY) {
      const tp = Math.min((t - CHECK_DELAY) / CHECK_DUR, 1)
      const te = easeOutCubic(tp)
      checkDash.value = checkLen * (1 - te)
    }

    if (t < CIRCLE_DUR + CHECK_DUR) {
      iconRaf = requestAnimationFrame(tick)
    }
  }
  iconRaf = requestAnimationFrame(tick)
}

function resetIcon() {
  if (iconRaf) { cancelAnimationFrame(iconRaf); iconRaf = null }
  circleDash.value = circleLen
  checkDash.value  = checkLen
  iconVisible.value = false
}

function easeOutCubic(t) {
  return 1 - Math.pow(1 - t, 3)
}

// ── Таймер прогресса ─────────────────────────────────────────────
const circumference = 2 * Math.PI * 27
const elapsed = ref(0)
let rafId = null
let startTime = null

const dashOffset = computed(() => {
  const progress = Math.min(elapsed.value / DURATION, 1)
  return circumference * (1 - progress)
})

function startTimer() {
  elapsed.value = 0
  startTime = performance.now()
  const tick = (now) => {
    elapsed.value = now - startTime
    if (elapsed.value < DURATION) {
      rafId = requestAnimationFrame(tick)
    } else {
      close()
    }
  }
  rafId = requestAnimationFrame(tick)
}

function stopTimer() {
  if (rafId) { cancelAnimationFrame(rafId); rafId = null }
  elapsed.value = 0
  startTime = null
}

watch(() => props.visible, (val) => {
  if (val) {
    startTimer()
    // Иконка появляется чуть позже карточки
    setTimeout(() => {
      iconVisible.value = true
      animateIcon()
      glowIntensity.value = 0.6
    }, 180)
  } else {
    stopTimer()
    resetIcon()
    glowIntensity.value = 0
  }
})

function close() {
  stopTimer()
  emit('close')
}

// ── Magic-bento glow ─────────────────────────────────────────────
function onMouseMove(e) {
  if (!cardRef.value) return
  const rect = cardRef.value.getBoundingClientRect()
  glowX.value = ((e.clientX - rect.left) / rect.width) * 100
  glowY.value = ((e.clientY - rect.top) / rect.height) * 100
  glowIntensity.value = 0.85
}
function onMouseLeave() { glowIntensity.value = 0.6 }

const glowStyle = computed(() => ({
  background: `radial-gradient(
    320px circle at ${glowX.value}% ${glowY.value}%,
    rgba(255, 169, 44, ${glowIntensity.value * 0.9}) 0%,
    rgba(255, 213, 138, ${glowIntensity.value * 0.5}) 30%,
    transparent 60%
  )`,
}))

onUnmounted(() => { stopTimer(); resetIcon() })
</script>

<style scoped>
.popup-overlay {
  position: fixed;
  inset: 0;
  z-index: 9000;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);
}

.popup-card {
  position: relative;
  font-family: 'PP Mori', sans-serif;
  background: rgba(25, 25, 25, 0.92);
  backdrop-filter: blur(24px) saturate(180%);
  -webkit-backdrop-filter: blur(24px) saturate(180%);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 24px;
  padding: 40px 48px 36px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  min-width: 320px;
  max-width: 420px;
  box-shadow:
    0 24px 80px rgba(0, 0, 0, 0.5),
    0 0 0 1px rgba(255, 255, 255, 0.06) inset;
  overflow: hidden;
}

.popup-glow-border {
  position: absolute;
  inset: 0;
  border-radius: inherit;
  padding: 2px;
  -webkit-mask:
    linear-gradient(#fff 0 0) content-box,
    linear-gradient(#fff 0 0);
  -webkit-mask-composite: xor;
  mask:
    linear-gradient(#fff 0 0) content-box,
    linear-gradient(#fff 0 0);
  mask-composite: exclude;
  pointer-events: none;
  z-index: 0;
  transition: background 0.15s ease;
}

/* ── Icon ── */
.popup-icon {
  position: relative;
  z-index: 1;
  transform: scale(0.4);
  opacity: 0;
  transition: transform 0.5s cubic-bezier(0.34, 1.5, 0.64, 1), opacity 0.35s ease;
}

.popup-icon.icon-visible {
  transform: scale(1);
  opacity: 1;
}

.popup-icon-ring {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  transform: scale(1);
  opacity: 0;
  pointer-events: none;
}

.popup-icon.icon-visible .popup-icon-ring {
  animation: popup-ring-expand 0.9s ease-out forwards;
}

@keyframes popup-ring-expand {
  from {
    transform: scale(1);
    opacity: 0.85;
  }
  to {
    transform: scale(1.85);
    opacity: 0;
  }
}

.check-svg {
  position: relative;
  z-index: 1;
  display: block;
  /* SVG stroke transitions handled via JS dashoffset */
}

/* ── Text ── */
.popup-text {
  position: relative;
  z-index: 1;
  font-family: 'PP Mori', sans-serif;
  font-weight: 600;
  font-size: 18px;
  line-height: 130%;
  letter-spacing: -0.02em;
  color: rgba(255, 255, 255, 0.92);
  text-align: center;
  margin: 0;
}

/* ── Progress ── */
.popup-progress-wrap {
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 64px;
  height: 64px;
}

.popup-progress-svg {
  position: absolute;
  inset: 0;
}

.popup-close-btn {
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border: none;
  background: rgba(255, 255, 255, 0.06);
  border-radius: 50%;
  cursor: pointer;
  transition: background 0.2s, transform 0.2s;
}
.popup-close-btn:hover {
  background: rgba(255, 255, 255, 0.13);
  transform: scale(1.1);
}
.popup-close-btn:hover svg path {
  stroke: rgba(255, 255, 255, 0.9);
}

/* ── Transition ── */
.popup-fade-enter-active {
  transition: opacity 0.35s ease, transform 0.35s cubic-bezier(0.34, 1.4, 0.64, 1);
}
.popup-fade-leave-active {
  transition: opacity 0.25s ease, transform 0.25s ease;
}
.popup-fade-enter-from {
  opacity: 0;
  transform: scale(0.88) translateY(12px);
}
.popup-fade-leave-to {
  opacity: 0;
  transform: scale(0.94) translateY(-8px);
}

@media (max-width: 480px) {
  .popup-card {
    min-width: 280px;
    max-width: calc(100vw - 40px);
    padding: 32px 28px 28px;
  }
}
</style>
