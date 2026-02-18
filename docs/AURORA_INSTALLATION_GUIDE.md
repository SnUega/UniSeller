# Инструкция: Aurora Gradient Setup

## Проблема с npm install

Если `npm install ogl` не работает:

### Способ 1: Остановите dev server
```bash
# В терминале где запущен npm run dev нажмите:
Ctrl + C

# Затем установите:
npm install ogl

# Запустите снова:
npm run dev
```

### Способ 2: Откройте новый терминал
```bash
# Не закрывая dev server, откройте НОВЫЙ терминал
# Перейдите в папку проекта:
cd путь/к/uniseller-landing

# Установите пакет:
npm install ogl

# Dev server автоматически перезагрузится
```

### Способ 3: Через PowerShell/CMD
Если Git Bash не реагирует:
1. Откройте PowerShell или CMD
2. Перейдите в папку проекта
3. Выполните `npm install ogl`

## После установки ogl

### Создайте компонент Aurora.vue:

**Файл: `/src/components/AuroraBackground.vue`**

```vue
<template>
  <canvas ref="canvas" class="aurora-canvas"></canvas>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { Renderer, Camera, Transform, Plane, Program, Mesh } from 'ogl'

const canvas = ref(null)
let renderer, camera, scene, mesh
let animationId

onMounted(() => {
  if (!canvas.value) return

  // Setup WebGL
  renderer = new Renderer({ 
    canvas: canvas.value,
    alpha: true,
    dpr: 1
  })
  
  const gl = renderer.gl
  gl.clearColor(0, 0, 0, 0)
  
  camera = new Camera(gl, { fov: 45 })
  camera.position.z = 5
  
  scene = new Transform()
  
  const geometry = new Plane(gl, {
    width: 10,
    height: 6
  })
  
  // Aurora shader
  const vertex = `
    attribute vec2 uv;
    attribute vec3 position;
    uniform mat4 modelViewMatrix;
    uniform mat4 projectionMatrix;
    varying vec2 vUv;
    
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `
  
  const fragment = `
    precision highp float;
    uniform float uTime;
    varying vec2 vUv;
    
    void main() {
      vec2 uv = vUv;
      
      // Aurora colors from your palette
      vec3 color1 = vec3(0.882, 0.663, 0.173); // #E1A92C
      vec3 color2 = vec3(0.882, 0.835, 0.541); // #E1D58A
      vec3 color3 = vec3(0.376, 0.282, 0.082); // #604815
      
      float blend = 0.74;
      
      // Animated gradients
      float d1 = length(uv - vec2(0.5 + sin(uTime * 0.5) * 0.3, 0.2));
      float d2 = length(uv - vec2(0.8 + cos(uTime * 0.3) * 0.2, 0.5));
      float d3 = length(uv - vec2(0.2 + sin(uTime * 0.4) * 0.3, 0.6));
      
      vec3 color = mix(color1, color2, smoothstep(0.0, 1.0, d1));
      color = mix(color, color3, smoothstep(0.0, 0.8, d2));
      color = mix(color, color2, smoothstep(0.0, 1.2, d3));
      
      gl_FragColor = vec4(color, blend);
    }
  `
  
  const program = new Program(gl, {
    vertex,
    fragment,
    uniforms: {
      uTime: { value: 0 }
    },
    transparent: true
  })
  
  mesh = new Mesh(gl, { geometry, program })
  mesh.setParent(scene)
  
  // Animation loop
  const animate = (t) => {
    program.uniforms.uTime.value = t * 0.001
    renderer.render({ scene, camera })
    animationId = requestAnimationFrame(animate)
  }
  
  animate(0)
})

onUnmounted(() => {
  if (animationId) cancelAnimationFrame(animationId)
})
</script>

<style scoped>
.aurora-canvas {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 892px;
  z-index: 0;
  pointer-events: none;
}
</style>
```

### Добавьте в HeroSection.vue:

```vue
<script setup>
// Добавьте импорт:
import AuroraBackground from './AuroraBackground.vue'
</script>

<template>
  <section class="hero">
    <!-- Замените .aurora-bg на: -->
    <AuroraBackground />
    
    <!-- Остальной код без изменений -->
  </section>
</template>
```

## Альтернатива БЕЗ ogl (простая CSS)

Если не хотите использовать WebGL, вот готовая CSS анимация:

```css
.aurora-bg {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 892px;
  z-index: 0;
  pointer-events: none;
  background: 
    radial-gradient(ellipse 80% 50% at 50% -20%, rgba(225, 169, 44, 0.4), transparent),
    radial-gradient(ellipse 60% 50% at 80% 10%, rgba(225, 213, 138, 0.3), transparent),
    radial-gradient(ellipse 60% 50% at 20% 15%, rgba(96, 72, 21, 0.3), transparent);
  filter: blur(60px);
  animation: aurora-move 20s ease-in-out infinite;
}

@keyframes aurora-move {
  0%, 100% {
    transform: translateY(0) scale(1);
    opacity: 0.7;
  }
  33% {
    transform: translateY(-30px) scale(1.05);
    opacity: 0.85;
  }
  66% {
    transform: translateY(20px) scale(0.95);
    opacity: 0.6;
  }
}
```

Просто вставьте этот CSS в `.aurora-bg` в `HeroSection.vue`!
