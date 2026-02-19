import { ref, computed, onMounted, onUnmounted } from 'vue'

/**
 * Composable для управления слайдерами
 * @param {Object} options - Опции слайдера
 * @param {number} options.itemsCount - Количество элементов
 * @param {number} options.cardWidth - Ширина карточки (для десктопа)
 * @param {number} options.gap - Отступ между карточками
 * @param {number} options.mobileBreakpoint - Брейкпоинт для мобильных (по умолчанию 640)
 * @param {boolean} options.enableTouch - Включить touch-навигацию
 */
export function useSlider(options = {}) {
  const {
    itemsCount = 0,
    cardWidth = 340,
    gap = 24,
    mobileBreakpoint = 640,
    enableTouch = true
  } = options

  const currentSlide = ref(0)
  const viewportW = ref(typeof window !== 'undefined' ? window.innerWidth : 1920)
  const sliderEl = ref(null)
  const mobileSliderEl = ref(null)

  // Определение мобильного устройства
  const isMobile = computed(() => viewportW.value <= mobileBreakpoint)

  // Максимальный слайд
  const maxSlide = computed(() => {
    if (isMobile.value) {
      // На мобильных показываем одну карточку за раз
      return Math.max(0, itemsCount - 1)
    }
    // На десктопе рассчитываем в зависимости от ширины экрана
    const visibleCards = Math.floor((viewportW.value - 20) / (cardWidth + gap))
    return Math.max(0, itemsCount - visibleCards)
  })

  // Переход к следующему слайду
  const nextSlide = () => {
    if (currentSlide.value < maxSlide.value) {
      currentSlide.value++
    }
  }

  // Переход к предыдущему слайду
  const prevSlide = () => {
    if (currentSlide.value > 0) {
      currentSlide.value--
    }
  }

  // Переход к конкретному слайду
  const goToSlide = (index) => {
    if (index >= 0 && index <= maxSlide.value) {
      currentSlide.value = index
    }
  }

  // Touch navigation для мобильных
  let touchStartX = 0
  let touchStartY = 0
  let touchEndX = 0
  let touchEndY = 0
  const MIN_SWIPE_DISTANCE = 50

  const handleTouchStart = (e) => {
    if (!enableTouch || !isMobile.value) return
    touchStartX = e.touches[0].clientX
    touchStartY = e.touches[0].clientY
  }

  const handleTouchMove = (e) => {
    if (!enableTouch || !isMobile.value) return
    e.preventDefault()
  }

  const handleTouchEnd = (e) => {
    if (!enableTouch || !isMobile.value) return
    touchEndX = e.changedTouches[0].clientX
    touchEndY = e.changedTouches[0].clientY
    handleSwipe()
  }

  const handleSwipe = () => {
    const deltaX = touchEndX - touchStartX
    const deltaY = touchEndY - touchStartY
    const absDeltaX = Math.abs(deltaX)
    const absDeltaY = Math.abs(deltaY)

    // Проверяем, что это горизонтальный свайп
    if (absDeltaX > absDeltaY && absDeltaX > MIN_SWIPE_DISTANCE) {
      if (deltaX > 0) {
        prevSlide()
      } else {
        nextSlide()
      }
    }
  }

  // Обновление ширины viewport
  const updateViewport = () => {
    viewportW.value = window.innerWidth
  }

  // Throttle для resize
  let resizeTimeout = null
  const throttledResize = () => {
    if (resizeTimeout) {
      cancelAnimationFrame(resizeTimeout)
    }
    resizeTimeout = requestAnimationFrame(() => {
      updateViewport()
      resizeTimeout = null
    })
  }

  // Стиль для transform слайдера
  const sliderTransform = computed(() => {
    if (isMobile.value) {
      return `translateX(calc(-${currentSlide.value * 100}% - ${currentSlide.value * 16}px))`
    }
    return `translateX(-${currentSlide.value * (cardWidth + gap)}px)`
  })

  onMounted(() => {
    updateViewport()
    window.addEventListener('resize', throttledResize, { passive: true })

    // Touch events для мобильного слайдера
    if (enableTouch && mobileSliderEl.value) {
      mobileSliderEl.value.addEventListener('touchstart', handleTouchStart, { passive: true })
      mobileSliderEl.value.addEventListener('touchmove', handleTouchMove, { passive: false })
      mobileSliderEl.value.addEventListener('touchend', handleTouchEnd, { passive: true })
    }
  })

  onUnmounted(() => {
    window.removeEventListener('resize', throttledResize)
    if (resizeTimeout) cancelAnimationFrame(resizeTimeout)

    if (enableTouch && mobileSliderEl.value) {
      mobileSliderEl.value.removeEventListener('touchstart', handleTouchStart)
      mobileSliderEl.value.removeEventListener('touchmove', handleTouchMove)
      mobileSliderEl.value.removeEventListener('touchend', handleTouchEnd)
    }
  })

  return {
    currentSlide,
    maxSlide,
    isMobile,
    viewportW,
    sliderEl,
    mobileSliderEl,
    nextSlide,
    prevSlide,
    goToSlide,
    sliderTransform
  }
}
