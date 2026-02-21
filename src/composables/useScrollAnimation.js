/**
 * useScrollAnimation
 * Scroll-triggered CSS animations via IntersectionObserver.
 *
 * Animation types:
 *   fade        — opacity only
 *   fadeUp      — opacity + translateY (up)
 *   slideLeft   — opacity + translateX (from right → left, horizontal)
 *   slideRight  — opacity + translateX (from left → right, horizontal)
 *
 * Usage:
 *   const { observeEl, observeChildren } = useScrollAnimation()
 *
 *   // Single element
 *   observeEl(el, 'fadeUp')
 *
 *   // Cascading children
 *   observeChildren(parentEl, '.card', 'slideLeft', { stagger: 120 })
 */

import { onUnmounted } from 'vue'

// Desktop-only — mobile gets no scroll animations for performance
const isMobile = () =>
  typeof window !== 'undefined' &&
  window.innerWidth <= 1024

// How far into the viewport the element must be before triggering (0–1)
// 0.18 = element 18% visible → animate. Feels "earned" without being too late.
const THRESHOLD = 0.18

// CSS injected once
let cssInjected = false
function injectCSS() {
  if (cssInjected || typeof document === 'undefined') return
  cssInjected = true

  const style = document.createElement('style')
  style.textContent = `
    /* ── Scroll animation base ─────────────────────────── */

    /* Initial (hidden) states — transition defined here so browser animates the change */
    [data-anim="fade"] {
      opacity: 0;
      transition: opacity 0.75s cubic-bezier(0.22, 1, 0.36, 1);
    }
    [data-anim="fadeUp"] {
      opacity: 0;
      transform: translateY(40px);
      transition:
        opacity 0.75s cubic-bezier(0.22, 1, 0.36, 1),
        transform 0.75s cubic-bezier(0.22, 1, 0.36, 1);
    }
    [data-anim="slideLeft"] {
      opacity: 0;
      transform: translateX(80px);
      transition:
        opacity 0.70s cubic-bezier(0.22, 1, 0.36, 1),
        transform 0.80s cubic-bezier(0.22, 1, 0.36, 1);
    }
    [data-anim="slideRight"] {
      opacity: 0;
      transform: translateX(-80px);
      transition:
        opacity 0.70s cubic-bezier(0.22, 1, 0.36, 1),
        transform 0.80s cubic-bezier(0.22, 1, 0.36, 1);
    }

    /* Visible (final) state — browser uses transition already defined above */
    [data-anim].anim-visible {
      opacity: 1 !important;
      transform: none !important;
    }

    /* Disable all scroll animations on mobile / reduced-motion */
    @media (max-width: 1024px) {
      [data-anim] {
        opacity: 1 !important;
        transform: none !important;
        transition: none !important;
      }
    }
    @media (prefers-reduced-motion: reduce) {
      [data-anim] {
        opacity: 1 !important;
        transform: none !important;
        transition: none !important;
      }
    }
  `
  document.head.appendChild(style)
}

export function useScrollAnimation() {
  const observers = []

  function createObserver(callback, threshold = THRESHOLD) {
    const obs = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            callback(entry.target)
            obs.unobserve(entry.target) // fire once
          }
        })
      },
      { threshold }
    )
    observers.push(obs)
    return obs
  }

  /**
   * Observe a single element.
   * @param {HTMLElement} el
   * @param {'fade'|'fadeUp'|'slideLeft'|'slideRight'} type
   * @param {number} delay  — ms delay before transition starts
   */
  function observeEl(el, type = 'fadeUp', delay = 0) {
    if (!el || isMobile()) return
    injectCSS()

    el.setAttribute('data-anim', type)
    if (delay) el.style.transitionDelay = `${delay}ms`

    const obs = createObserver(target => {
      target.classList.add('anim-visible')
    })
    obs.observe(el)
  }

  /**
   * Observe cascading children inside a parent.
   * @param {HTMLElement} parent
   * @param {string} childSelector  — CSS selector for children
   * @param {'fade'|'fadeUp'|'slideLeft'|'slideRight'} type
   * @param {{ stagger?: number, baseDelay?: number, threshold?: number }} opts
   */
  function observeChildren(parent, childSelector, type = 'fadeUp', opts = {}) {
    if (!parent || isMobile()) return
    injectCSS()

    const {
      stagger = 100,      // ms between each child
      baseDelay = 0,      // ms before the first child
      threshold = THRESHOLD
    } = opts

    const children = Array.from(parent.querySelectorAll(childSelector))
    children.forEach((child, i) => {
      child.setAttribute('data-anim', type)
      child.style.transitionDelay = `${baseDelay + i * stagger}ms`
    })

    // Observe the parent — when it enters, trigger all children
    const obs = createObserver(target => {
      const items = Array.from(target.querySelectorAll('[data-anim]'))
      items.forEach(item => item.classList.add('anim-visible'))
    }, threshold)
    obs.observe(parent)
  }

  onUnmounted(() => {
    observers.forEach(obs => obs.disconnect())
  })

  return { observeEl, observeChildren }
}
