<template>
  <section class="marketplaces">
    <h2 class="section-title">Оптимизация продаж на всех маркетплейсах</h2>
    
    <div class="carousel">
      <div class="carousel-track">
        <template v-for="n in 20" :key="n">
          <img src="/src/assets/images/logo-carousel/ozon.png" alt="OZON" loading="lazy" />
          <img src="/src/assets/images/logo-carousel/WB.png" alt="Wildberries" loading="lazy" />
          <img src="/src/assets/images/logo-carousel/ya-market.png" alt="Яндекс.Маркет" loading="lazy" />
          <img src="/src/assets/images/logo-carousel/megamarket.png" alt="МегаМаркет" loading="lazy" />
        </template>
      </div>
    </div>
  </section>
</template>

<style scoped>
.marketplaces {
  padding: 180px 0 0;
  width: 100%;
  position: relative;
  z-index: 4;
  margin-top: -40px;
}

.section-title {
  font-family: 'Benzin', 'Arial Black', sans-serif;
  font-weight: 400;
  font-size: 36px;
  line-height: 110%;
  text-align: center;
  color: rgba(255, 255, 255, 0.8);
  margin-bottom: 66px;
}

.carousel {
  height: 30px;
  overflow: hidden;
  width: 100vw;
  position: relative;
  left: 50%;
  right: 50%;
  margin-left: -50vw;
  margin-right: -50vw;
}

.carousel-track {
  display: flex;
  align-items: center;
  gap: 48px;
  width: max-content;
  animation: scroll 12s linear infinite;
}

.carousel-track img {
  height: 30px;
  width: auto;
  opacity: 0.4;
  filter: brightness(2) grayscale(0.3);
  transition: opacity 0.3s;
  flex-shrink: 0;
}

.carousel-track:hover {
  animation-play-state: paused;
}

.carousel-track img:hover {
  opacity: 0.8;
}

@keyframes scroll {
  0% {
    transform: translateX(0);
  }
  100% {
    transform: translateX(-5%);
  }
}

/* Tablet landscape */
@media (min-width: 768px) and (max-width: 1024px) and (orientation: landscape) {
  .marketplaces {
    padding: 80px 0 0;
    margin-top: -20px;
  }
  .section-title {
    font-size: 26px;
    margin-bottom: 32px;
  }
  .carousel-track img {
    height: 24px;
  }
  .carousel-track {
    gap: 32px;
  }
}

@media (max-width: 640px) {
  .section-title {
    font-size: 28px;
    padding: 0 20px;
  }
  .carousel-track img {
    height: 24px;
  }
  .carousel-track {
    gap: 32px;
  }
}
</style>
