<template>
  <div class="dashboard-wrapper">
    <div class="dashboard-preview">
      <img src="/src/assets/images/hero-panel.png" alt="Dashboard Preview" loading="lazy" />
    </div>
  </div>
</template>

<script setup>
</script>

<style scoped>
.dashboard-wrapper {
  max-width: 1240px;
  margin: 0 auto;
  padding: 0 var(--container-padding);
  margin-top: 60px;
}

.dashboard-preview {
  border-radius: 24px;
  overflow: hidden;
  box-shadow: 0 40px 100px rgba(0, 0, 0, 0.5);
}

.dashboard-preview img {
  width: 100%;
  height: auto;
  display: block;
}

@media (max-width: 640px) {
  .dashboard-wrapper {
    margin-top: 40px;
  }
  
  .dashboard-preview {
    border-radius: 16px;
  }
}
</style>
