<template>
  <section class="hero">
    <AuroraBackground 
      :colorStops="['#e1a92c', '#e1d58a', '#604815']"
      :blend="0.74"
      :amplitude="1.0"
      :speed="3"
    />
    
    <DotsPlane />
    
    <div class="container">
      <p class="hero-subtitle">АВТОМАТИЗАЦИЯ БИЗНЕСА НА МАРКЕТПЛЕЙСАХ</p>
      <h1 class="hero-title">Платформа<br>для продвижения и управления<br>бизнесом на маркетплейсах</h1>
      <p class="hero-description">Уникальный инструмент, способный объединить в одном<br>окне управление продажами на всех доступных маркетплейсах.</p>
      
      <div class="hero-buttons">
        <button class="btn btn-primary">Начать бесплатно</button>
        <button class="btn btn-secondary">
          <img src="/src/assets/images/ico/solar_play-bold.svg" alt="" class="play-icon" loading="lazy" />
          Подробнее о нас
        </button>
      </div>
    </div>
    
    <!-- Dashboard вынесен ИЗ container для правильного z-index -->
    <div class="dashboard-wrapper">
      <img src="/src/assets/images/hero-panel.png" alt="Dashboard" class="dashboard-img" loading="lazy" />
    </div>
  </section>
</template>

<script setup>
import AuroraBackground from './AuroraBackground.vue'
import DotsPlane from './DotsPlane.vue'
</script>

<style scoped>
.hero {
  padding-top: 180px;
  padding-bottom: 0;
  text-align: center;
  position: relative;
  overflow: hidden;
}

.hero::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 120px;
  background: linear-gradient(180deg, transparent 0%, #191919 100%);
  pointer-events: none;
  z-index: 3;
}

@media (max-width: 640px) {
  .hero::after {
    height: 40px; /* Сильно уменьшаем сглаживание на мобильных */
  }
}

.container {
  position: relative;
  z-index: 3; /* Выше aurora (1), выше dashboard (0), выше dots (-1) */
  pointer-events: none;
}

/* Включаем pointer-events только для интерактивных элементов */
.hero-buttons {
  pointer-events: auto;
}

.dashboard-wrapper {
  pointer-events: none;
  position: relative;
  z-index: 0; /* Ниже aurora (1), ниже container (3), выше dots (-1) */
}

/* Текст не блокирует - эффект виден за ним */
.hero-subtitle,
.hero-title,
.hero-description {
  pointer-events: none;
  user-select: none; /* Нельзя выделить текст */
}

.hero-subtitle {
  font-family: 'PP Mori', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  font-weight: 500;
  font-size: 14px;
  line-height: 100%;
  letter-spacing: 0.56px;
  text-transform: uppercase;
  color: rgba(255, 213, 138, 0.8);
  margin-bottom: 24px;
}

.hero-title {
  font-family: 'Benzin', 'Impact', 'Arial Black', sans-serif;
  font-weight: 400;
  font-size: 44px;
  line-height: 110%;
  color: rgba(255, 255, 255, 0.8);
  margin-bottom: 24px;
}

.hero-description {
  font-family: 'PP Mori', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  font-weight: 500;
  font-size: 16px;
  line-height: 100%;
  color: rgba(255, 255, 255, 0.7);
  margin-bottom: 48px;
}

.hero-buttons {
  display: flex;
  gap: 16px;
  justify-content: center;
  margin-bottom: 0; /* ← Убрали, теперь dashboard вне container */
}

.btn {
  font-family: 'PP Mori', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  font-weight: 500;
  font-size: 16px;
  line-height: 100%;
  height: 56px;
  border-radius: 48px;
  cursor: pointer;
  transition: all 0.3s;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 0 28px;
}

.btn-primary {
  background: linear-gradient(90deg, #FFD58A 0%, #FFA92C 100%);
  border: 2px solid #FFD58A;
  color: rgba(0, 0, 0, 0.8);
  filter: drop-shadow(0 0 74px rgba(255, 169, 44, 0.6)) drop-shadow(0 0 38px rgba(0, 0, 0, 0.25));
}

.btn-primary:hover {
  transform: translateY(-2px);
}

.btn-secondary {
  background: rgba(255, 255, 255, 0.1);
  border: none;
  backdrop-filter: blur(10px);
  color: #FFD58A;
  position: relative;
  border-radius: 48px;
  overflow: hidden;
}

/* Gradient border для btn-secondary */
.btn-secondary::before {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: inherit;
  padding: 0.12rem;

  background: linear-gradient(
    90deg,
    transparent 0%,
    rgba(255, 213, 138, 0.2) 20%,
    #FFA92C 50%,
    rgba(255, 213, 138, 0.2) 80%,
    transparent 100%
  );

  background-size: 300% 100%;
  background-position: 0% 50%;

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

  opacity: 0;
  transition: opacity 0.2s ease;
}

/* ХОВЕР */
.btn-secondary:hover::before {
  opacity: 1;
  animation: borderRun 2s linear infinite;
}

@keyframes borderRun {
  from {
    background-position: 0% 50%;
  }
  to {
    background-position: 300% 50%;
  }
}

.btn-secondary:hover {
  background: rgba(255, 255, 255, 0.15);
}

.play-icon {
  width: 20px;
  height: 20px;
}

.dashboard-wrapper {
  max-width: 1050px;
  margin: 69px auto 0;
  padding: 0 20px;
  position: relative;
  z-index: 0;
  pointer-events: none;
}

.dashboard-img {
  width: 100%;
  height: auto;
  display: block;
  border-radius: 24px;
  box-shadow: 0 40px 100px rgba(0, 0, 0, 0.5);
  /* Fade маски для плавного перехода на краях */
  -webkit-mask: linear-gradient(
    to bottom,
    transparent 0%,
    black 3%,
    black 97%,
    transparent 100%
  ),
  linear-gradient(
    to right,
    transparent 0%,
    black 3%,
    black 97%,
    transparent 100%
  );
  -webkit-mask-composite: source-in;
  mask: linear-gradient(
    to bottom,
    transparent 0%,
    black 3%,
    black 97%,
    transparent 100%
  ),
  linear-gradient(
    to right,
    transparent 0%,
    black 3%,
    black 97%,
    transparent 100%
  );
  mask-composite: intersect;
}

/* Tablet landscape */
@media (min-width: 768px) and (max-width: 1024px) and (orientation: landscape) {
  .hero {
    padding-top: 110px;
  }
  .hero-subtitle {
    font-size: 12px;
    margin-bottom: 16px;
  }
  .hero-title {
    font-size: 28px;
    margin-bottom: 16px;
  }
  .hero-description {
    font-size: 13px;
    margin-bottom: 24px;
  }
  .hero-description br {
    display: none;
  }
  .hero-buttons {
    margin-bottom: 30px;
  }
  .btn {
    height: 48px;
    font-size: 14px;
    padding: 0 20px;
  }
  .dashboard-wrapper {
    max-width: 700px;
  }
}

@media (max-width: 968px) {
  .hero {
    padding-top: 150px;
  }
  .hero-title {
    font-size: 36px;
  }
}

@media (max-width: 640px) {
  .hero {
    padding-top: 130px;
  }
  .hero-title {
    font-size: 28px;
  }
  .hero-buttons {
    flex-direction: column;
    padding: 0 20px;
  }
  .btn {
    width: 100%;
  }
  .hero-description br {
    display: none;
  }
}
</style>
