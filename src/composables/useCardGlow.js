import { onMounted, onUnmounted } from 'vue'

/**
 * useCardGlow — динамическая оранжевая рамка на карточках,
 * позиционированная по курсору + персистентное свечение при клике/тапе.
 */
export function useCardGlow({ cardSelector, getSectionEl, radius = 480 }) {
  const proximity = radius * 0.5
  const fadeDistance = radius * 0.75

  const lockedCards = new WeakSet()

  // Флаг: только что сработал touchend — блокируем следующий синтетический click
  let suppressNextClick = false

  function setGlowProps(card, relX, relY, intensity) {
    card.style.setProperty('--glow-x', `${relX}%`)
    card.style.setProperty('--glow-y', `${relY}%`)
    card.style.setProperty('--glow-intensity', intensity.toString())
    card.style.setProperty('--glow-radius', `${radius}px`)
  }

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
      const relX = ((e.clientX - rect.left) / rect.width) * 100
      const relY = ((e.clientY - rect.top) / rect.height) * 100

      if (lockedCards.has(card)) {
        const rawIntensity = effective <= proximity ? 1
          : effective <= fadeDistance ? (fadeDistance - effective) / (fadeDistance - proximity)
          : 0
        setGlowProps(card, relX, relY, Math.max(0.55, rawIntensity))
        return
      }

      let intensity = 0
      if (effective <= proximity) intensity = 1
      else if (effective <= fadeDistance) intensity = (fadeDistance - effective) / (fadeDistance - proximity)
      setGlowProps(card, relX, relY, intensity)
    })
  }

  function onMouseLeave() {
    const section = getSectionEl()
    if (!section) return
    section.querySelectorAll(cardSelector).forEach(card => {
      if (!lockedCards.has(card)) card.style.setProperty('--glow-intensity', '0')
    })
  }

  function toggleLock(card, clientX, clientY) {
    const rect = card.getBoundingClientRect()
    const relX = ((clientX - rect.left) / rect.width) * 100
    const relY = ((clientY - rect.top) / rect.height) * 100

    if (lockedCards.has(card)) {
      lockedCards.delete(card)
      card.style.setProperty('--glow-intensity', '0')
      card.classList.remove('glow-locked')
    } else {
      lockedCards.add(card)
      card.classList.add('glow-locked')
      setGlowProps(card, relX, relY, 0.7)
    }
  }

  function onCardClick(e) {
    // Пропускаем синтетический click после touchend
    if (suppressNextClick) {
      suppressNextClick = false
      return
    }
    toggleLock(e.currentTarget, e.clientX, e.clientY)
  }

  function onCardTouchEnd(e) {
    // Помечаем что нужно подавить следующий синтетический click (приходит ~300ms спустя)
    suppressNextClick = true
    setTimeout(() => { suppressNextClick = false }, 600)

    const touch = e.changedTouches[0]
    const clientX = touch?.clientX ?? e.currentTarget.getBoundingClientRect().left
    const clientY = touch?.clientY ?? e.currentTarget.getBoundingClientRect().top
    toggleLock(e.currentTarget, clientX, clientY)
  }

  function onDocumentClick(e) {
    const section = getSectionEl()
    if (!section) return
    section.querySelectorAll(cardSelector).forEach(card => {
      if (lockedCards.has(card) && !card.contains(e.target)) {
        lockedCards.delete(card)
        card.style.setProperty('--glow-intensity', '0')
        card.classList.remove('glow-locked')
      }
    })
  }

  let registeredCards = []

  function attachCardListeners() {
    const section = getSectionEl()
    if (!section) return
    const cards = section.querySelectorAll(cardSelector)
    cards.forEach(card => {
      card.addEventListener('click', onCardClick)
      card.addEventListener('touchend', onCardTouchEnd, { passive: true })
      registeredCards.push(card)
    })
  }

  onMounted(() => {
    document.addEventListener('mousemove', onMouseMove)
    document.addEventListener('mouseleave', onMouseLeave)
    document.addEventListener('click', onDocumentClick)
    // Небольшая задержка — DOM точно отрендерен
    setTimeout(attachCardListeners, 150)
  })

  onUnmounted(() => {
    document.removeEventListener('mousemove', onMouseMove)
    document.removeEventListener('mouseleave', onMouseLeave)
    document.removeEventListener('click', onDocumentClick)
    registeredCards.forEach(card => {
      card.removeEventListener('click', onCardClick)
      card.removeEventListener('touchend', onCardTouchEnd)
    })
    registeredCards = []
  })
}
