/**
 * Брейкпоинты для адаптивного дизайна
 */
export const BREAKPOINTS = {
  MOBILE: 640,
  TABLET: 968,
  DESKTOP: 1024,
  LARGE_DESKTOP: 1280
}

/**
 * Проверка, является ли устройство мобильным
 */
export const isMobileDevice = () => {
  if (typeof window === 'undefined') return false
  return window.innerWidth <= BREAKPOINTS.MOBILE || 
         'ontouchstart' in window || 
         navigator.maxTouchPoints > 0
}

/**
 * Проверка, является ли устройство планшетом
 */
export const isTabletDevice = () => {
  if (typeof window === 'undefined') return false
  const width = window.innerWidth
  return width > BREAKPOINTS.MOBILE && width <= BREAKPOINTS.TABLET
}

/**
 * Проверка, является ли устройство десктопом
 */
export const isDesktopDevice = () => {
  if (typeof window === 'undefined') return false
  return window.innerWidth > BREAKPOINTS.DESKTOP
}
