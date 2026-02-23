<template>
  <section class="stats">
    <div class="container">
      <div class="stats-grid">
        <div class="stat-item">
          <div class="stat-number">1200+</div>
          <div class="stat-label">активных клиентов</div>
        </div>
        <div class="stat-item">
          <div class="stat-number">30</div>
          <div class="stat-label">экспертов</div>
        </div>
        <div class="stat-item">
          <div class="stat-number">40%</div>
          <div class="stat-label">средний прирост продаж</div>
        </div>
        <div class="stat-item">
          <div class="stat-number">35%</div>
          <div class="stat-label">маржинальность</div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.stats {
  padding: 120px 0 0;
  position: relative;
  z-index: 2; /* выше секций с blobs при наложении */
}

.container {
  max-width: 1240px;
  margin: 0 auto;
  padding: 0 20px;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 40px;
}

.stat-item {
  text-align: center;
}

.stat-number {
  font-family: 'Benzin', 'Impact', 'Arial Black', sans-serif;
  font-weight: 400;
  font-size: 70px;
  line-height: 110%;
  background: linear-gradient(90deg, #FFD58A 0%, #FFA92C 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 20px;
  filter: drop-shadow(0 0 40px rgba(255, 169, 44, 0.6)) 
          drop-shadow(0 0 20px rgba(255, 213, 138, 0.4));
}

.stat-label {
  font-family: 'PP Mori', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  font-weight: 500;
  font-size: 16px;
  line-height: 100%;
  color: rgba(255, 255, 255, 0.7);
  text-transform: lowercase;
}

/* Tablet landscape */
@media (min-width: 768px) and (max-width: 1024px) and (orientation: landscape) {
  .stats {
    padding: 60px 0 0;
  }
  .stat-number {
    font-size: 44px;
    margin-bottom: 12px;
  }
  .stat-label {
    font-size: 13px;
  }
  .stats-grid {
    grid-template-columns: repeat(4, 1fr);
    gap: 16px;
  }
}

@media (max-width: 968px) {
  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 32px;
  }
  .stat-number {
    font-size: 60px;
  }
  .stat-label {
    font-size: 15px;
  }
}

@media (max-width: 640px) {
  .stats {
    padding: 100px 0 0;
  }
  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 24px;
  }
  .stat-number {
    font-size: 32px;
    margin-bottom: 12px;
  }
  .stat-label {
    font-size: 13px;
  }
}
</style>
