import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const isMobile = () => typeof window !== 'undefined' && window.innerWidth <= 768

const trigger = (el, extra = {}) => ({
  trigger: el,
  start: isMobile() ? 'top 88%' : 'top 75%',
  once: true,
  ...extra,
})

/** Заголовок по центру — переиспользуется для всех секций с центрированным h2 */
export function animateCenterTitle(el) {
  if (!el) return
  gsap.fromTo(el,
    { opacity: 0, y: 70, scale: 0.94 },
    { opacity: 1, y: 0, scale: 1, duration: 1.2, ease: 'power3.out', scrollTrigger: trigger(el) }
  )
}

/** Заголовок справа налево — Solutions, Reviews */
export function animateTitleFromRight(el) {
  if (!el) return
  gsap.fromTo(el,
    { opacity: 0, x: 120 },
    { opacity: 1, x: 0, duration: 1.2, ease: 'power3.out', scrollTrigger: trigger(el) }
  )
}

/** Bubble-появление карточек */
export function animateBubbleCards(cards, { stagger = 0, delay = 0, triggerEl = null } = {}) {
  if (!cards || !cards.length) return
  gsap.fromTo(cards,
    { opacity: 0, scale: 0.78, y: 20 },
    {
      opacity: 1, scale: 1, y: 0,
      duration: 1.0,
      ease: 'back.out(1.5)',
      stagger: stagger,
      delay: delay,
      scrollTrigger: trigger(triggerEl || cards[0]),
    }
  )
}

/** Каскадное bubble-появление */
export function animateBubbleStagger(cards, { triggerEl = null } = {}) {
  if (!cards || !cards.length) return
  animateBubbleCards(cards, { stagger: 0.16, triggerEl })
}

/** Hero-каскад */
export function animateHeroCascade(elements) {
  elements.forEach((el, i) => {
    if (!el) return
    gsap.fromTo(el,
      { opacity: 0, y: 70, scale: 0.97 },
      { opacity: 1, y: 0, scale: 1, duration: 0.9, ease: 'power3.out', delay: i * 0.18 }
    )
  })
}

/** SlideUp — Pricing карточки */
export function animateSlideUp(els, { stagger = 0, delay = 0, triggerEl = null } = {}) {
  if (!els || !els.length) return
  gsap.fromTo(els,
    { opacity: 0, y: 80 },
    {
      opacity: 1, y: 0, duration: 0.95, ease: 'power3.out',
      stagger, delay, scrollTrigger: trigger(triggerEl || els[0]),
    }
  )
}

/** Slide справа налево — Products card 1 */
export function animateSlideFromRight(el, { triggerEl = null, delay = 0 } = {}) {
  if (!el) return
  gsap.fromTo(el,
    { opacity: 0, x: 200 },
    { opacity: 1, x: 0, duration: 1.2, ease: 'power3.out', delay, scrollTrigger: trigger(triggerEl || el) }
  )
}

/** Slide слева направо — Products card 2 */
export function animateSlideFromLeft(el, { triggerEl = null, delay = 0 } = {}) {
  if (!el) return
  gsap.fromTo(el,
    { opacity: 0, x: -200 },
    { opacity: 1, x: 0, duration: 1.2, ease: 'power3.out', delay, scrollTrigger: trigger(triggerEl || el) }
  )
}

/**
 * Feature items — направление задаётся через direction: 'right'|'left'|'down'
 * right = x: +28 (справа налево) — для карточки 1
 * left  = x: -28 (слева направо) — для карточки 2
 * down  = y: -22 (сверху вниз)   — для Pricing (узкие высокие карточки)
 */
export function animateFeatureItems(containerEl, { triggerEl = null, baseDelay = 0, direction = 'right' } = {}) {
  if (!containerEl) return
  const items = containerEl.querySelectorAll('.feature-item')
  if (!items.length) return

  const fromVars = direction === 'down'
    ? { opacity: 0, y: -22, x: 0 }
    : direction === 'left'
      ? { opacity: 0, x: -28, y: 0 }
      : { opacity: 0, x: 28, y: 0 }   // default 'right'

  items.forEach((item, i) => {
    const delay = baseDelay + i * 0.10
    gsap.fromTo(item, fromVars,
      { opacity: 1, x: 0, y: 0, duration: 0.58, ease: 'power2.out', delay, scrollTrigger: trigger(triggerEl || containerEl) }
    )
    const icon = item.querySelector('.check-icon')
    if (icon) {
      gsap.fromTo(icon,
        { scale: 0, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.35, ease: 'back.out(2)', delay: delay + 0.13, scrollTrigger: trigger(triggerEl || containerEl) }
      )
    }
  })
}

/** Pricing features — сверху вниз */
export function animatePricingFeatures(containerEl, { triggerEl = null, baseDelay = 0 } = {}) {
  if (!containerEl) return
  const items = containerEl.querySelectorAll('.features-list li')
  if (!items.length) return

  items.forEach((item, i) => {
    const delay = baseDelay + i * 0.07
    gsap.fromTo(item,
      { opacity: 0, y: -18 },
      { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out', delay, scrollTrigger: trigger(triggerEl || containerEl) }
    )
    const icon = item.querySelector('.check-icon')
    if (icon) {
      gsap.fromTo(icon,
        { scale: 0, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.32, ease: 'back.out(2)', delay: delay + 0.1, scrollTrigger: trigger(triggerEl || containerEl) }
      )
    }
  })
}

/** Cleanup ScrollTriggers при unmount */
export function killScrollTriggers(triggers) {
  triggers.forEach(t => t && t.kill())
}
