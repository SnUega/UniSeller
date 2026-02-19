<template>
  <header class="header">
    <div class="glass-panel">
      <div class="logo">
        <img src="/src/assets/images/logo-main.png" alt="Uniseller" class="logo-img" loading="eager" />
      </div>

      <ul class="nav-menu" :class="{ 'mobile-open': mobileMenuOpen }">
        <!-- Решения dropdown/accordion -->
        <li class="nav-item dropdown" @mouseenter="!isMobile && openDropdown('solutions')" @mouseleave="!isMobile && closeDropdown('solutions')">
          <a href="#" class="nav-link" @click.prevent="isMobile ? toggleMobileAccordion('solutions') : null">
            Решения
            <svg 
              class="chevron" 
              :class="{ 'rotated': openedDropdown === 'solutions' || mobileAccordion === 'solutions' }"
              width="12" 
              height="8" 
              viewBox="0 0 12 8" 
              fill="none"
            >
              <path d="M1 1L6 6L11 1" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
            </svg>
          </a>
          <transition name="dropdown" v-if="!isMobile">
            <div class="dropdown-menu" v-show="openedDropdown === 'solutions'">
              <a href="#unicard" class="dropdown-item">Unicard</a>
              <a href="#mp-balance" class="dropdown-item">MP Balance</a>
            </div>
          </transition>
          <transition name="accordion" v-if="isMobile">
            <div class="accordion-menu" v-show="mobileAccordion === 'solutions'">
              <a href="#unicard" class="accordion-item" @click="toggleMobileMenu">Unicard</a>
              <a href="#mp-balance" class="accordion-item" @click="toggleMobileMenu">MP Balance</a>
            </div>
          </transition>
        </li>

        <!-- Продукты dropdown/accordion -->
        <li class="nav-item dropdown" @mouseenter="!isMobile && openDropdown('products')" @mouseleave="!isMobile && closeDropdown('products')">
          <a href="#" class="nav-link" @click.prevent="isMobile ? toggleMobileAccordion('products') : null">
            Продукты
            <svg 
              class="chevron" 
              :class="{ 'rotated': openedDropdown === 'products' || mobileAccordion === 'products' }"
              width="12" 
              height="8" 
              viewBox="0 0 12 8" 
              fill="none"
            >
              <path d="M1 1L6 6L11 1" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
            </svg>
          </a>
          <transition name="dropdown" v-if="!isMobile">
            <div class="dropdown-menu" v-show="openedDropdown === 'products'">
              <a href="#integration-1c" class="dropdown-item">Интеграция с 1C и "Мой Склад"</a>
              <a href="#crm-integration" class="dropdown-item">Кастомная интеграция с CRM</a>
              <a href="#reviews-bot" class="dropdown-item">Бот для работы с отзывами WB, OZON и Яндекс.Маркет</a>
              <a href="#parser" class="dropdown-item">Парсер товаров</a>
            </div>
          </transition>
          <transition name="accordion" v-if="isMobile">
            <div class="accordion-menu" v-show="mobileAccordion === 'products'">
              <a href="#integration-1c" class="accordion-item" @click="toggleMobileMenu">Интеграция с 1C и "Мой Склад"</a>
              <a href="#crm-integration" class="accordion-item" @click="toggleMobileMenu">Кастомная интеграция с CRM</a>
              <a href="#reviews-bot" class="accordion-item" @click="toggleMobileMenu">Бот для работы с отзывами WB, OZON и Яндекс.Маркет</a>
              <a href="#parser" class="accordion-item" @click="toggleMobileMenu">Парсер товаров</a>
            </div>
          </transition>
        </li>

        <!-- Блог -->
        <li class="nav-item">
          <a href="#blog" class="nav-link" @click="isMobile && toggleMobileMenu()">Блог</a>
        </li>

        <!-- Кнопка Войти в мобильном меню -->
        <li class="nav-item mobile-login-item" v-if="isMobile">
          <button class="btn-login-mobile">Войти</button>
        </li>
      </ul>

      <div class="nav-actions">
        <button class="btn-login">Войти</button>
        <button 
          class="mobile-menu-toggle" 
          :class="{ 'active': mobileMenuOpen }"
          @click="toggleMobileMenu"
          aria-label="Toggle menu"
        >
          <span></span>
        </button>
      </div>
    </div>
  </header>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'

const mobileMenuOpen = ref(false)
const openedDropdown = ref(null)
const mobileAccordion = ref(null) // для мобильных аккордеонов
const windowWidth = ref(typeof window !== 'undefined' ? window.innerWidth : 1440)

const isMobile = computed(() => windowWidth.value <= 968)

const toggleMobileMenu = () => {
  const menu = document.querySelector('.nav-menu')
  if (mobileMenuOpen.value) {
    // Закрываем меню с анимацией
    if (menu) menu.classList.add('closing')
    setTimeout(() => {
      mobileMenuOpen.value = false
      mobileAccordion.value = null
      if (menu) menu.classList.remove('closing')
    }, 300)
  } else {
    mobileMenuOpen.value = true
  }
}

const toggleMobileAccordion = (name) => {
  // Разрешаем раскрывать оба аккордеона одновременно
  if (mobileAccordion.value === name) {
    mobileAccordion.value = null
  } else {
    mobileAccordion.value = name
  }
}

const openDropdown = (name) => {
  if (!isMobile.value) {
    openedDropdown.value = name
  }
}

const closeDropdown = (name) => {
  if (!isMobile.value && openedDropdown.value === name) {
    openedDropdown.value = null
  }
}

const handleResize = () => {
  windowWidth.value = window.innerWidth
  if (!isMobile.value) {
    mobileMenuOpen.value = false
    mobileAccordion.value = null
  }
}

onMounted(() => {
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
})
</script>

<style scoped>
.header {
  position: fixed;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 1000;
  width: 100%;
  max-width: 1240px;
  padding: 0 20px;
}

.glass-panel {
  background: rgba(25, 25, 25, 0.6);
  backdrop-filter: blur(24px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 100px;
  padding: 12px 16px 12px 32px;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  gap: 24px; /* ← БЫЛО 25px, СТАЛО 24px */
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  position: relative;
  z-index: 1001;
}

.logo {
  display: flex;
  align-items: center;
  flex-shrink: 0;
  transform: translateY(-2.5px);
}

.logo-img {
  width: 143px;
  height: 22px;
}

.nav-menu {
  display: flex;
  gap: 16px; /* ← БЫЛО 32px, СТАЛО 16px */
  list-style: none;
  margin: 0;
  padding: 0;
  flex: 1;
  justify-content: flex-start;
}

.nav-item {
  position: relative;
}

.nav-item.dropdown::after {
  /* Невидимая область для плавного перехода к dropdown */
  content: '';
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  height: 20px;
  pointer-events: auto;
}

.nav-link {
  font-family: 'PP Mori', sans-serif;
  font-weight: 500;
  font-size: 14px;
  line-height: 100%;
  color: rgba(255, 255, 255, 0.6);
  text-decoration: none;
  transition: color 0.3s;
  white-space: nowrap;
  display: flex;
  align-items: center;
  gap: 6px;
  cursor: pointer;
  padding: 8px 0;
}

.nav-link:hover {
  color: rgba(255, 255, 255, 1);
}

.chevron {
  transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.chevron.rotated {
  transform: rotate(180deg);
}

.dropdown-menu {
  position: absolute;
  top: calc(100% + 28px);
  left: 50%;
  transform: translateX(-50%);
  background: rgba(25, 25, 25, 0.95);
  backdrop-filter: blur(24px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  padding: 8px;
  min-width: 280px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
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
  transform: translateX(-50%) translateY(-12px);
}

.dropdown-leave-to {
  opacity: 0;
  transform: translateX(-50%) translateY(-8px);
}

.dropdown-enter-to,
.dropdown-leave-from {
  opacity: 1;
  transform: translateX(-50%) translateY(0);
}

.dropdown-item {
  display: block;
  padding: 12px 16px;
  font-family: 'PP Mori', sans-serif;
  font-weight: 500;
  font-size: 14px;
  line-height: 140%;
  color: rgba(255, 255, 255, 0.6);
  text-decoration: none;
  border-radius: 10px;
  transition: all 0.2s;
  white-space: normal;
}

.dropdown-item:hover {
  background: rgba(255, 255, 255, 0.05);
  color: rgba(255, 255, 255, 1);
}

.nav-actions {
  display: flex;
  align-items: center;
  flex-shrink: 0;
  margin-left: auto;
}

.btn-login {
  font-family: 'PP Mori', sans-serif;
  font-weight: 500;
  font-size: 14px;
  line-height: 100%;
  letter-spacing: 0%;
  text-align: center;
  color: rgba(255, 255, 255, 0.6);
  
  height: 40px;
  padding: 0 16px;
  border-radius: 38px;
  
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(184, 220, 244, 0.2);
  backdrop-filter: blur(24px);
  
  cursor: pointer;
  transition: all 0.3s;
}

.btn-login:hover {
  background: rgba(255, 255, 255, 0.15);
  color: rgba(255, 255, 255, 1);
}

.mobile-menu-toggle {
  display: none;
  background: none;
  border: none;
  color: var(--text-white);
  cursor: pointer;
  padding: 8px;
  line-height: 1;
  width: 32px;
  height: 32px;
  position: relative;
  margin-left: 8px; /* Смещаем бургер левее */
  transition: transform 0.3s ease;
}

/* Бургер иконка */
.mobile-menu-toggle::before,
.mobile-menu-toggle::after {
  content: '';
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  width: 20px;
  height: 2px;
  background: currentColor;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border-radius: 2px;
}

.mobile-menu-toggle::before {
  top: 10px;
}

.mobile-menu-toggle::after {
  bottom: 10px;
}

.mobile-menu-toggle span {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  width: 20px;
  height: 2px;
  background: currentColor;
  transition: opacity 0.3s ease;
  border-radius: 2px;
}

/* Анимация бургера в крестик */
.mobile-menu-toggle.active::before {
  top: 50%;
  transform: translate(-50%, -50%) rotate(45deg);
}

.mobile-menu-toggle.active::after {
  bottom: 50%;
  transform: translate(-50%, 50%) rotate(-45deg);
}

.mobile-menu-toggle.active span {
  opacity: 0;
}

@media (max-width: 1280px) {
  .header {
    max-width: 95%;
  }
  
  .glass-panel {
    gap: 20px;
    padding: 12px 24px;
  }
  
  .nav-menu {
    gap: 24px;
  }
  
  .nav-link {
    font-size: 13px;
  }
}

/* Tablet landscape — tighter nav */
@media (min-width: 768px) and (max-width: 1024px) and (orientation: landscape) {
  .header {
    top: 12px;
    max-width: 96%;
  }
  
  .glass-panel {
    padding: 8px 16px 8px 20px;
    gap: 14px;
  }
  
  .logo-img {
    width: 120px;
    height: 18px;
  }
  
  .nav-menu {
    gap: 16px;
  }
  
  .nav-link {
    font-size: 12px;
    padding: 6px 0;
  }
  
  .btn-login {
    font-size: 12px;
    height: 34px;
    padding: 0 12px;
  }
}

@media (max-width: 968px) {
  .nav-menu {
    display: none;
  }

  .nav-menu.mobile-open {
    display: flex;
    flex-direction: column;
    position: fixed;
    top: 71px; /* 20px (header top) + 46px (glass-panel) + 5px (чуть ниже) */
    left: 50%;
    transform: translateX(-50%);
    width: 85%; /* Уменьшили ширину (было 90%) */
    max-width: 380px; /* Уменьшили максимальную ширину (было 400px) */
    background: rgba(25, 25, 25, 0.85); /* Усилен для лучшего блюра */
    backdrop-filter: blur(32px) saturate(180%); /* ← УСИЛЕН БЛЮР */
    -webkit-backdrop-filter: blur(32px) saturate(180%); /* Safari поддержка */
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-top: none;
    border-radius: 0 0 20px 20px;
    padding: 20px;
    padding-top: 20px;
    gap: 0;
    z-index: 900;
    margin: 0;
    /* Анимация появления меню - выезжает из header */
    animation: slideDown 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    overflow: hidden;
    /* Дополнительная глубина */
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5);
  }

  @media (max-width: 640px) {
    .nav-menu.mobile-open {
      top: 53px; /* 10px (header top) + 38px (glass-panel) + 5px (чуть ниже) */
    }
  }

  .nav-menu.mobile-open.closing {
    animation: slideUp 0.3s cubic-bezier(0.4, 0, 0.2, 1) forwards;
  }
  
  @keyframes slideDown {
    from {
      opacity: 0;
      transform: translateX(-50%) translateY(-20px);
      max-height: 0;
    }
    to {
      opacity: 1;
      transform: translateX(-50%) translateY(0);
      max-height: 1000px;
    }
  }

  @keyframes slideUp {
    from {
      opacity: 1;
      transform: translateX(-50%) translateY(0);
      max-height: 1000px;
    }
    to {
      opacity: 0;
      transform: translateX(-50%) translateY(-20px);
      max-height: 0;
    }
  }
  
  .nav-menu.mobile-open .nav-item {
    border-bottom: 1px solid rgba(255, 255, 255, 0.05);
    padding-bottom: 0;
  }
  
  .nav-menu.mobile-open .nav-item:last-child {
    border-bottom: none;
  }
  
  .nav-menu.mobile-open .nav-link {
    padding: 16px 0;
    justify-content: space-between;
    width: 100%;
    transition: color 0.2s ease;
  }

  .nav-menu.mobile-open .nav-link:hover {
    color: rgba(255, 255, 255, 1);
  }
  
  /* Аккордеон меню для мобильных */
  .accordion-menu {
    overflow: hidden;
    margin-top: 8px;
    margin-bottom: 8px;
    /* Динамическое изменение высоты */
    transition: max-height 0.3s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.3s ease;
  }

  .accordion-item {
    display: block;
    padding: 12px 16px;
    font-family: 'PP Mori', sans-serif;
    font-weight: 500;
    font-size: 14px;
    line-height: 140%;
    color: rgba(255, 255, 255, 0.6);
    text-decoration: none;
    border-radius: 10px;
    transition: all 0.2s;
    white-space: normal;
  }

  .accordion-item:hover {
    background: rgba(255, 255, 255, 0.05);
    color: rgba(255, 255, 255, 1);
  }

  /* Анимация аккордеона */
  .accordion-enter-active {
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    max-height: 500px;
  }

  .accordion-leave-active {
    transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
    max-height: 500px;
  }

  .accordion-enter-from {
    opacity: 0;
    max-height: 0;
    transform: translateY(-10px);
  }

  .accordion-leave-to {
    opacity: 0;
    max-height: 0;
    transform: translateY(-5px);
  }

  .accordion-enter-to,
  .accordion-leave-from {
    opacity: 1;
    max-height: 500px;
    transform: translateY(0);
  }

  /* Кнопка Войти в мобильном меню */
  .mobile-login-item {
    margin-top: 8px;
    padding-top: 16px;
    border-top: 1px solid rgba(255, 255, 255, 0.05);
  }

  .btn-login-mobile {
    width: 100%;
    font-family: 'PP Mori', sans-serif;
    font-weight: 500;
    font-size: 14px;
    line-height: 100%;
    text-align: center;
    color: rgba(255, 255, 255, 0.6);
    height: 40px;
    padding: 0 16px;
    border-radius: 38px;
    background: rgba(255, 255, 255, 0.1);
    border: 1px solid rgba(184, 220, 244, 0.2);
    backdrop-filter: blur(24px);
    cursor: pointer;
    transition: all 0.3s;
  }

  .btn-login-mobile:hover {
    background: rgba(255, 255, 255, 0.15);
    color: rgba(255, 255, 255, 1);
  }
  
  .nav-menu.mobile-open .dropdown-menu {
    display: none; /* Скрываем dropdown на мобильных */
  }

  .mobile-menu-toggle {
    display: block;
  }
}

@media (max-width: 640px) {
  .header {
    top: 10px;
  }
  
  .glass-panel {
    padding: 10px 16px;
    border-radius: 50px;
    gap: 12px;
  }

  .logo-img {
    width: 120px;
    height: 18px;
    transform: translateY(-2.5px), translateX(-2.5px);
  }

  .btn-login {
    display: none;
  }
}
</style>
