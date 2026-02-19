<template>
  <section class="partners">
    <div class="container">
      <div class="partners-grid">
        <img src="/src/assets/images/logo-carousel/ozon.png" alt="OZON" class="partner-logo" loading="lazy" />
        <img src="/src/assets/images/logo-carousel/WB.png" alt="Wildberries" class="partner-logo" loading="lazy" />
        <img src="/src/assets/images/logo-carousel/ya-market.png" alt="Яндекс.Маркет" class="partner-logo" loading="lazy" />
        <img src="/src/assets/images/logo-carousel/megamarket.png" alt="МегаМаркет" class="partner-logo" loading="lazy" />
      </div>
    </div>
  </section>
</template>

<script setup>
</script>

<style scoped>
.partners {
  padding: 100px 0 80px;
}

.partners-grid {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 80px;
  flex-wrap: wrap;
}

.partner-logo {
  height: 40px;
  width: auto;
  opacity: 0.4;
  filter: brightness(2) grayscale(0.5);
  transition: all 0.3s;
}

.partner-logo:hover {
  opacity: 0.8;
  filter: brightness(2) grayscale(0);
}

@media (max-width: 640px) {
  .partners {
    padding: 80px 0 60px;
  }

  .partners-grid {
    gap: 40px;
  }

  .partner-logo {
    height: 32px;
  }
}
</style>
