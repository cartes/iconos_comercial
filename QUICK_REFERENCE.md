# 🚀 Quick Reference - Aiconic Comercial

---

## Instalación Rápida

```bash
# Clonar + instalar
git clone https://github.com/cartes/iconos_comercial.git
cd iconos_comercial
npm install

# Desarrollo
npm run dev              # http://localhost:5173/iconos_comercial/#/

# Build
npm run build            # Genera dist/

# Linting
npm run lint             # ESLint + OXLint
```

---

## Librerías Principales

| Librería | Versión | Uso |
|----------|---------|-----|
| Vue | 3.5.28 | Framework |
| Vite | 7.3.1 | Bundler + dev server |
| Pinia | 3.0.4 | State management |
| Vue Router | 5.0.2 | Routing (SPA) |
| Axios | 1.14.0 | HTTP client |
| GSAP | 3.14.2 | Animaciones |
| Tailwind CSS | 4.2.2 | Utility-first CSS |

---

## Estructura de Carpetas (Esencial)

```
src/
  ├── components/      # BaseButton, BaseInput, TopBar, etc.
  ├── views/           # HomeView, LoginView, AdminDashboard, etc.
  ├── stores/          # auth.js (Pinia)
  ├── api/             # service.js (Axios)
  ├── router/          # index.js (Vue Router)
  ├── App.vue          # Raíz
  └── main.js          # Entry point
```

---

## Rutas Principales

| Ruta | Página | Auth | Rol |
|------|--------|------|-----|
| `/` | Home (Landing) | ❌ | — |
| `/login` | Login | ❌ | — |
| `/admin` | Admin Dashboard | ✅ | admin |
| `/super-admin/dashboard` | Super Admin | ✅ | super-admin |
| `/portal` | User Portal | ✅ | usuario |
| `/perfil` | Mi Perfil | ✅ | any |

---

## Crear Componente Base

```vue
<!-- src/components/MyComponent.vue -->
<script setup>
import { ref, computed } from 'vue'

defineProps({
  title: String
})

defineEmits(['submit'])

const count = ref(0)
const double = computed(() => count.value * 2)

const increment = () => count.value++
</script>

<template>
  <div class="flex flex-col gap-4 p-6">
    <h1 class="text-2xl font-bold">{{ title }}</h1>
    <p>Count: {{ double }}</p>
    <button @click="increment" class="bg-primary-500 text-white px-4 py-2 rounded">
      Increment
    </button>
  </div>
</template>

<style scoped>
/* Estilos locales si necesitas */
</style>
```

---

## Usar Store Pinia

```vue
<script setup>
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()

const login = async () => {
  const res = await authStore.login('user@example.com', 'password')
  if (res.success) {
    console.log('Login exitoso!')
  }
}

const logout = () => {
  authStore.logout()
}
</script>

<template>
  <div v-if="authStore.isAuthenticated">
    <p>{{ authStore.user.nombre }}</p>
    <button @click="logout">Logout</button>
  </div>
  <div v-else>
    <button @click="login">Login</button>
  </div>
</template>
```

---

## Hacer Petición HTTP

```vue
<script setup>
import { apiRequest } from '@/api/service'
import { ref } from 'vue'

const loading = ref(false)
const data = ref(null)
const error = ref(null)

const fetchData = async () => {
  loading.value = true
  const res = await apiRequest('/dashboard')
  
  if (res.success) {
    data.value = res.data
  } else {
    error.value = res.error
  }
  
  loading.value = false
}
</script>

<template>
  <div>
    <button @click="fetchData">Fetch</button>
    <p v-if="loading">Cargando...</p>
    <p v-if="error" class="text-red-500">{{ error }}</p>
    <pre v-if="data">{{ data }}</pre>
  </div>
</template>
```

---

## Tailwind CSS (Clases Comunes)

```html
<!-- Flex layout -->
<div class="flex gap-4 items-center justify-between"></div>

<!-- Grid -->
<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"></div>

<!-- Text -->
<h1 class="text-3xl font-bold text-primary-500"></h1>
<p class="text-sm text-gray-600"></p>

<!-- Buttons -->
<button class="bg-primary-500 hover:bg-primary-600 text-white px-4 py-2 rounded"></button>

<!-- Colors (Custom) -->
<div class="bg-grad-primary text-white p-6"></div>

<!-- Responsive -->
<div class="block md:hidden"></div>  <!-- Visible solo mobile -->
<div class="hidden md:block"></div>  <!-- Oculto en mobile -->

<!-- Dark Mode -->
<div class="dark:bg-gray-900 dark:text-white"></div>
```

---

## GSAP Quick Start

```vue
<script setup>
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'
import { onMounted, ref } from 'vue'

gsap.registerPlugin(ScrollTrigger)

const boxRef = ref(null)

onMounted(() => {
  // Timeline básica
  gsap.to(boxRef.value, {
    x: 100,
    duration: 1,
    ease: 'power2.inOut'
  })
  
  // Con ScrollTrigger
  gsap.to(boxRef.value, {
    x: 200,
    scrollTrigger: {
      trigger: boxRef.value,
      start: 'top center',
      end: 'bottom center',
      scrub: 1.5,
      markers: true
    }
  })
})
</script>

<template>
  <div ref="boxRef" class="w-24 h-24 bg-primary-500"></div>
</template>
```

---

## Debugging

```javascript
// En browser console

// Ver store Pinia
const { useAuthStore } = window.__pinia_modules__
console.log(useAuthStore())

// Ver componente Vue
console.log($el)  // En Vue DevTools

// Ver request/response
// Abre Network tab en DevTools

// Pausar GSAP
gsap.globalTimeline.pause()

// Ver ScrollTrigger
ScrollTrigger.getAll().forEach(t => console.log(t))
```

---

## Agregar Nueva Vista

```javascript
// 1. Crear componente src/views/MyView.vue
<template>
  <div>Mi Nueva Vista</div>
</template>

// 2. Agregar ruta en src/router/index.js
{
  path: '/my-view',
  name: 'my-view',
  component: () => import('../views/MyView.vue'),
  meta: { requiresAuth: true }  // Si necesita auth
}

// 3. Navegar
router.push('/my-view')
// O usar en template
<router-link to="/my-view">Link</router-link>
```

---

## Variables de Entorno (si lo necesitas)

Crear `.env.local`:
```env
VITE_API_URL=https://apiiconos-production.up.railway.app/api
VITE_TENANT_ID=2310c96f-5a4e-4bde-8062-839c495b332a
```

Usar en código:
```javascript
const apiUrl = import.meta.env.VITE_API_URL
const tenantId = import.meta.env.VITE_TENANT_ID
```

---

## Despliegue a GitHub Pages

```bash
# Ya está configurado en .github/workflows/deploy.yml
# Solo: git push a main y GitHub Actions hace el build + deploy

git add .
git commit -m "feat: my changes"
git push origin main

# Ver deploy en https://cartes.github.io/iconos_comercial/
```

---

## Comandos Git Útiles

```bash
# Ver status
git status

# Ver cambios
git diff

# Agregar cambios
git add .
git commit -m "feat: description"

# Empujar a remoto
git push origin main

# Crear rama nueva
git checkout -b feature/my-feature

# Mergear
git checkout main
git merge feature/my-feature

# Ver commits
git log --oneline -10
```

---

## Problemas Comunes & Soluciones

| Problema | Solución |
|----------|----------|
| **"Cannot GET /"** | Navega a `/#/` en GitHub Pages (hash routing) |
| **CORS error** | Verificar backend tiene CORS habilitado |
| **Token expirado** | Limpia localStorage y haz login nuevamente |
| **Animación GSAP no funciona** | Verifica `document.querySelector()` devuelve elemento |
| **Tailwind CSS no aplica** | Run `npm run build` (genera CSS completo) |
| **Hot-reload no funciona** | Reinicia `npm run dev` |

---

## Recursos

- [Vue 3 Docs](https://vuejs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [GSAP](https://greensock.com/gsap/)
- [Pinia](https://pinia.vuejs.org/)
- [Vite](https://vitejs.dev/)

---

**¿Algo más?** Revisa `README.md` y `TECHNICAL.md` para documentación detallada.
