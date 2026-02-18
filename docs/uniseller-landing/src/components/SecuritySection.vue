<template>
  <section class="security">
    <div class="container">
      <h2 class="section-title">Обеспечиваем безопасную работу<br>с вашими данными</h2>

      <div class="security-grid">
        <div class="security-card">
          <img src="/src/assets/images/ico/ri_shield-fill.svg" alt="" class="security-icon" />
          <h3 class="security-title">Контроль 24/7</h3>
          <p class="security-text">Регулярные аудиты, тесты безопасности, сквозное шифрование, 2FA, авто-создание резервных копий</p>
        </div>

        <div class="security-card">
          <img src="/src/assets/images/ico/lets-icons_file-dock-light.svg" alt="" class="security-icon" />
          <h3 class="security-title">Соблюдение 152-ФЗ РФ</h3>
          <p class="security-text">Следуем индустриальным стандартам ISO, вовремя получая все сертификаты и лицензии</p>
        </div>

        <div class="security-card with-border">
          <img src="/src/assets/images/ico/hugeicons_chat-secure-01.svg" alt="" class="security-icon" />
          <h3 class="security-title">Внимательная тех поддержка</h3>
          <p class="security-text">Ваши данные защищены на собственных серверах с полной конфиденциальностью.</p>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.security {
  padding: 120px 0 0;
  position: relative;
}

.container {
  max-width: 1240px;
  margin: 0 auto;
  padding: 0 20px;
}

.section-title {
  font-family: 'Benzin', 'Arial Black', sans-serif;
  font-weight: 400;
  font-size: 36px;
  line-height: 110%;
  text-align: center;
  color: rgba(255, 255, 255, 0.8);
  margin-bottom: 60px;
}

.security-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
}

/* Base card — same as CRM plain cards */
.security-card {
  border-radius: 24px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  background: rgba(255, 255, 255, 0.06);
  backdrop-filter: blur(8px);
}

/* With-border card — same pseudo-element technique as CRM */
.security-card.with-border {
  position: relative;
  background: rgba(255, 255, 255, 0.06);
  backdrop-filter: blur(8px);
}

.security-card.with-border::before {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: 24px;
  padding: 2px;
  background: 
    linear-gradient(93.85deg, rgba(255, 213, 138, 0.3) 0%, rgba(255, 213, 138, 0.12) 100%),
    linear-gradient(64.18deg, rgba(255, 169, 44, 0) 72.93%, #FFA92C 93.92%);
  -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  -webkit-mask-composite: xor;
  mask-composite: exclude;
  pointer-events: none;
}

.security-icon {
  width: 48px;
  height: 48px;
  position: relative;
  z-index: 1;
}

.security-title {
  font-family: 'Benzin', 'Arial Black', sans-serif;
  font-weight: 400;
  font-size: 18px;
  line-height: 130%;
  color: rgba(255, 255, 255, 0.9);
  position: relative;
  z-index: 1;
}

.security-text {
  font-family: 'PP Mori', sans-serif;
  font-weight: 500;
  font-size: 15px;
  line-height: 130%;
  color: rgba(255, 255, 255, 0.7);
  position: relative;
  z-index: 1;
}

@media (max-width: 968px) {
  .security-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 640px) {
  .security { padding: 80px 0 0; }
  .section-title { font-size: 28px; }
}
</style>
