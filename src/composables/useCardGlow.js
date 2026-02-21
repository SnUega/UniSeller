import { onMounted, onUnmounted } from 'vue'

/**
 * useCardGlow — динамическая оранжевая рамка на карточках,
 * позиционированная по курсору (аналог MagicBento GlobalSpotlight).
 *
 * @param {Object} options
 * @param {string} options.cardSelector   — CSS-селектор карточек внутри секции
 * @param {Function} options.getSectionEl — геттер, возвращающий DOM-элемент секции
 * @param {number} [options.radius=300]   — радиус spotlight'а в px
 */
export function useCardGlow({ cardSelector, getSectionEl, radius = 480 }) {
  const proximity = radius * 0.5
  const fadeDistance = radius * 0.75

  function onMouseMove(e) {
    const section = getSectionEl()
    if (!section) return

    const cards = section.querySelectorAll(cardSelector)

    cards.forEach(card => {
      const rect = card.getBoundingClientRect()
      const centerX = rect.left + rect.width / 2
      const centerY = rect.top + rect.height / 2
      const dist = Math.hypot(e.clientX - centerX, e.clientY - centerY)
        - Math.max(rect.width, rect.height) / 2
      const effective = Math.max(0, dist)

      let intensity = 0
      if (effective <= proximity) {
        intensity = 1
      } else if (effective <= fadeDistance) {
        intensity = (fadeDistance - effective) / (fadeDistance - proximity)
      }

      const relX = ((e.clientX - rect.left) / rect.width) * 100
      const relY = ((e.clientY - rect.top) / rect.height) * 100

      card.style.setProperty('--glow-x', `${relX}%`)
      card.style.setProperty('--glow-y', `${relY}%`)
      card.style.setProperty('--glow-intensity', intensity.toString())
      card.style.setProperty('--glow-radius', `${radius}px`)
    })
  }

  function onMouseLeave() {
    const section = getSectionEl()
    if (!section) return
    section.querySelectorAll(cardSelector).forEach(card => {
      card.style.setProperty('--glow-intensity', '0')
    })
  }

  onMounted(() => {
    document.addEventListener('mousemove', onMouseMove)
    document.addEventListener('mouseleave', onMouseLeave)
  })

  onUnmounted(() => {
    document.removeEventListener('mousemove', onMouseMove)
    document.removeEventListener('mouseleave', onMouseLeave)
  })
}
