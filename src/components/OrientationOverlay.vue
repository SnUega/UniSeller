<template>
  <Teleport to="body">
    <!-- Orientation Overlay for Tablets in Portrait -->
    <div class="orient-overlay orient-overlay--tablet">
      <div class="orient-overlay__bg" v-if="isTabletPortrait">
        <AuroraBackground 
          :colorStops="['#e1a92c', '#e1d58a', '#604815']"
          :blend="0.74"
          :amplitude="1.0"
          :speed="3"
        />
        <DotsPlane :fullScreen="true" />
      </div>
      <div class="orient-overlay__content">
        <svg class="orient-overlay__icon orient-overlay__icon--tablet" viewBox="0 0 100 140" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="5" y="5" width="90" height="130" rx="8" stroke="currentColor" stroke-width="3" fill="none"/>
          <circle cx="50" cy="120" r="6" stroke="currentColor" stroke-width="2" fill="none"/>
          <rect x="35" y="12" width="30" height="4" rx="2" fill="currentColor" opacity="0.5"/>
        </svg>
        <p class="orient-overlay__text">Пожалуйста, поверните устройство горизонтально для наилучшего пользовательского опыта</p>
      </div>
    </div>

    <!-- Orientation Overlay for Phones in Landscape -->
    <div class="orient-overlay orient-overlay--phone">
      <div class="orient-overlay__bg" v-if="isPhoneLandscape">
        <AuroraBackground 
          :colorStops="['#e1a92c', '#e1d58a', '#604815']"
          :blend="0.74"
          :amplitude="1.0"
          :speed="3"
        />
        <DotsPlane :fullScreen="true" />
      </div>
      <div class="orient-overlay__content">
        <svg class="orient-overlay__icon orient-overlay__icon--phone" viewBox="0 0 70 140" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="5" y="5" width="60" height="130" rx="8" stroke="currentColor" stroke-width="3" fill="none"/>
          <circle cx="35" cy="120" r="6" stroke="currentColor" stroke-width="2" fill="none"/>
          <rect x="20" y="12" width="30" height="4" rx="2" fill="currentColor" opacity="0.5"/>
        </svg>
        <p class="orient-overlay__text">Пожалуйста, поверните устройство вертикально для наилучшего пользовательского опыта</p>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue'
import AuroraBackground from './AuroraBackground.vue'
import DotsPlane from './DotsPlane.vue'

const isTabletPortrait = ref(false)
const isPhoneLandscape = ref(false)

let tabletMQ = null
let phoneMQ = null

const onTabletChange = (e) => {
  isTabletPortrait.value = e.matches
}

const onPhoneChange = (e) => {
  isPhoneLandscape.value = e.matches
}

onMounted(() => {
  // Breakpoints matching beauty-clinik CSS exactly:
  // Tablet portrait: min-width 600px, max-width 1024px, portrait orientation
  tabletMQ = window.matchMedia('(min-width: 600px) and (max-width: 1024px) and (orientation: portrait)')
  // Phone landscape: landscape orientation, max-height 500px, coarse pointer (touch device)
  phoneMQ = window.matchMedia('(orientation: landscape) and (max-height: 500px) and (pointer: coarse)')
  
  tabletMQ.addEventListener('change', onTabletChange)
  phoneMQ.addEventListener('change', onPhoneChange)
  
  // Initial check
  isTabletPortrait.value = tabletMQ.matches
  isPhoneLandscape.value = phoneMQ.matches
})

onUnmounted(() => {
  if (tabletMQ) tabletMQ.removeEventListener('change', onTabletChange)
  if (phoneMQ) phoneMQ.removeEventListener('change', onPhoneChange)
  document.body.style.overflow = ''
  document.documentElement.style.overflow = ''
})

// Block body scroll when overlay is shown
watch([isTabletPortrait, isPhoneLandscape], ([tablet, phone]) => {
  if (tablet || phone) {
    document.body.style.overflow = 'hidden'
    document.documentElement.style.overflow = 'hidden'
  } else {
    document.body.style.overflow = ''
    document.documentElement.style.overflow = ''
  }
})
</script>

<!-- 
  NOT scoped — global styles with BEM naming to avoid conflicts.
  This is critical: scoped styles can break with <Teleport> in some Vue builds.
-->
<style>
/* ============================================
   Orientation Overlay — Uniseller
   Uses CSS media queries for reliable show/hide
   (same breakpoints as beauty-clinik)
   ============================================ */

/* Base — hidden by default */
.orient-overlay {
  display: none;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 99999;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  background: #191919;
}

/* Background container */
.orient-overlay__bg {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
}

/* Aurora MUST fill full overlay regardless of its own media queries */
.orient-overlay__bg .aurora-container {
  width: 100% !important;
  height: 100% !important;
  max-height: none !important;
  z-index: 1 !important; /* Выше фона, ниже контента (z-index: 10) */
}

/* DotsPlane in overlay - ниже Aurora */
.orient-overlay__bg .dots-canvas {
  z-index: 0 !important; /* Ниже Aurora (1), но выше фона */
}

/* Content layer */
.orient-overlay__content {
  position: relative;
  z-index: 10;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 2rem;
}

/* Tablet Icon Animation — same as beauty-clinik */
.orient-overlay__icon--tablet {
  width: 80px;
  height: auto;
  color: #FFD58A;
  margin-bottom: 2rem;
  animation: orient-rotate-tablet 2.5s ease-in-out infinite;
  transform-origin: center center;
}

@keyframes orient-rotate-tablet {
  0%, 15% {
    transform: rotate(0deg);
  }
  40%, 60% {
    transform: rotate(-90deg);
  }
  85%, 100% {
    transform: rotate(0deg);
  }
}

/* Phone Icon Animation — same as beauty-clinik */
.orient-overlay__icon--phone {
  width: 60px;
  height: auto;
  color: #FFD58A;
  margin-bottom: 2rem;
  animation: orient-rotate-phone 2.5s ease-in-out infinite;
  transform-origin: center center;
}

@keyframes orient-rotate-phone {
  0%, 15% {
    transform: rotate(90deg);
  }
  40%, 60% {
    transform: rotate(0deg);
  }
  85%, 100% {
    transform: rotate(90deg);
  }
}

.orient-overlay__text {
  font-family: 'PP Mori', sans-serif;
  font-size: clamp(1rem, 3vw, 1.5rem);
  font-weight: 400;
  color: rgba(255, 255, 255, 0.9);
  line-height: 1.6;
  max-width: 80%;
}

/* ============================================
   Show overlays via CSS media queries
   (primary mechanism — works even if JS is slow)
   ============================================ */

/* Tablet portrait: 600px - 1024px, portrait orientation */
@media (min-width: 600px) and (max-width: 1024px) and (orientation: portrait) {
  .orient-overlay--tablet {
    display: flex;
  }
}

/* Phone landscape: landscape, max-height 500px, touch device */
@media (orientation: landscape) and (max-height: 500px) and (pointer: coarse) {
  .orient-overlay--phone {
    display: flex;
  }
}
</style>
