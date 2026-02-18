<template>
  <div id="app">
    <OrientationOverlay />
    <AppHeader />
    <HeroSection />
    <MarketplacesSection />
    <StatsSection />
    <CRMBenefitsSection />
    <SecuritySection />
    <SolutionsSection />
    <ProductsSection />
    <PricingSection />
    <FAQSection />
    <ReviewsSection />
    <AppFooter />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import OrientationOverlay from './components/OrientationOverlay.vue'
import AppHeader from './components/AppHeader.vue'
import HeroSection from './components/HeroSection.vue'
import MarketplacesSection from './components/MarketplacesSection.vue'
import StatsSection from './components/StatsSection.vue'
import CRMBenefitsSection from './components/CRMBenefitsSection.vue'
import SecuritySection from './components/SecuritySection.vue'
import SolutionsSection from './components/SolutionsSection.vue'
import ProductsSection from './components/ProductsSection.vue'
import PricingSection from './components/PricingSection.vue'
import FAQSection from './components/FAQSection.vue'
import ReviewsSection from './components/ReviewsSection.vue'
import AppFooter from './components/AppFooter.vue'

// ======= Smooth wheel scroll =======
// Отключаем на мобильных для производительности
const isMobile = computed(() => {
  if (typeof window === 'undefined') return false
  return window.innerWidth <= 1024 || 'ontouchstart' in window || navigator.maxTouchPoints > 0
})

let targetScrollY = 0
let currentScrollY = 0
let scrollRafId = null
let isSmoothScrolling = false
const SMOOTH_FACTOR = 0.12

const lerpScroll = () => {
  currentScrollY += (targetScrollY - currentScrollY) * SMOOTH_FACTOR
  if (Math.abs(targetScrollY - currentScrollY) < 0.5) {
    currentScrollY = targetScrollY
    isSmoothScrolling = false
    window.scrollTo(0, currentScrollY)
    scrollRafId = null
    return
  }
  isSmoothScrolling = true
  window.scrollTo(0, currentScrollY)
  scrollRafId = requestAnimationFrame(lerpScroll)
}

const onWheel = (e) => {
  // На мобильных не используем smooth scroll
  if (isMobile.value) return
  e.preventDefault()
  let delta = e.deltaY
  if (e.deltaMode === 1) delta *= 40
  else if (e.deltaMode === 2) delta *= window.innerHeight
  targetScrollY += delta
  const maxScroll = document.documentElement.scrollHeight - window.innerHeight
  targetScrollY = Math.max(0, Math.min(targetScrollY, maxScroll))
  if (!scrollRafId) scrollRafId = requestAnimationFrame(lerpScroll)
}

// Throttle для нативного скролла на мобильных
let nativeScrollTimeout = null
const onNativeScroll = () => {
  // На мобильных throttle для производительности
  if (isMobile.value) {
    if (nativeScrollTimeout) return
    nativeScrollTimeout = requestAnimationFrame(() => {
      if (!isSmoothScrolling && !scrollRafId) {
        targetScrollY = window.scrollY
        currentScrollY = window.scrollY
      }
      nativeScrollTimeout = null
    })
  } else {
    if (!isSmoothScrolling && !scrollRafId) {
      targetScrollY = window.scrollY
      currentScrollY = window.scrollY
    }
  }
}

onMounted(() => {
  targetScrollY = window.scrollY
  currentScrollY = window.scrollY

  // На мобильных не добавляем smooth scroll обработчики
  if (!isMobile.value) {
    window.addEventListener('wheel', onWheel, { passive: false })
  }
  window.addEventListener('scroll', onNativeScroll, { passive: true })
})

onUnmounted(() => {
  window.removeEventListener('wheel', onWheel)
  window.removeEventListener('scroll', onNativeScroll)
  if (scrollRafId) cancelAnimationFrame(scrollRafId)
  if (nativeScrollTimeout) cancelAnimationFrame(nativeScrollTimeout)
})
</script>

<style scoped>
#app {
  min-height: 100vh;
  position: relative;
}
</style>
