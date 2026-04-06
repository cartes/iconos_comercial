# 🔧 Documentación Técnica Detallada - Aiconic Comercial

---

## Tabla de Contenidos

1. [Arquitectura General](#arquitectura-general)
2. [Flujos Principales](#flujos-principales)
3. [Integración con API Backend](#integración-con-api-backend)
4. [Sistema de Animaciones](#sistema-de-animaciones)
5. [Manejo de Errores](#manejo-de-errores)
6. [Almacenamiento Local](#almacenamiento-local)
7. [Mecanismos de Seguridad](#mecanismos-de-seguridad)
8. [Performance & Optimizaciones](#performance--optimizaciones)
9. [Debugging & Troubleshooting](#debugging--troubleshooting)

---

## Arquitectura General

### Capas de la Aplicación

```
┌─────────────────────────────────────────────────────────┐
│           Browser / Vue Components                       │
├─────────────────────────────────────────────────────────┤
│                  Vue Router                              │
│  (Gestión de rutas, guards, navegación)                 │
├─────────────────────────────────────────────────────────┤
│              Pinia State Management                       │
│  - useAuthStore (autenticación)                          │
│  - useSearchStore (búsqueda)                             │
├─────────────────────────────────────────────────────────┤
│              Capa de API (Axios)                         │
│  - Interceptores de request/response                     │
│  - Manejo de errores CORS, 401, 422, network            │
├─────────────────────────────────────────────────────────┤
│       Backend API (Laravel 11.9 en Railway)              │
│  https://apiiconos-production.up.railway.app/api        │
└─────────────────────────────────────────────────────────┘
```

### Flujo de Datos

```
Component Vue
    ↓ (dispatch action)
Pinia Store (useAuthStore)
    ↓ (async action)
API Service (axios)
    ↓ (HTTP request)
Backend Laravel API
    ↓ (HTTP response)
API Service Interceptor
    ↓ (parse/validate)
Pinia Store (commit state)
    ↓ (reactive update)
Component Vue (re-render)
```

---

## Flujos Principales

### 1. Flujo de Autenticación

**Archivo clave**: `src/stores/auth.js`

```javascript
// Paso 1: Usuario ingresa credenciales
await authStore.login('user@example.com', 'password123')

// Paso 2: API service
POST /login
{
  email: 'user@example.com',
  clave: 'password123'
}

// Paso 3: Respuesta exitosa
{
  success: true,
  token: 'eyJ0eXAiOiJKV1QiLCJhbGc...',
  usuario: {
    email: 'user@example.com',
    nombre: 'John Doe',
    rol: 'admin',
    empresa: 'Acme Corp',
    empresaId: '550e8400-e29b-41d4-a716-446655440000',
    puedeEliminar: true
  }
}

// Paso 4: Almacenamiento local
localStorage.setItem('auth_token', token)
localStorage.setItem('user', JSON.stringify(userData))
localStorage.setItem('tenantName', 'Acme Corp')

// Paso 5: Actualización del estado
authStore.user = userData
authStore.isAuthenticated = true

// Paso 6: Router guard redirige según rol
if (rol === 'super-admin') → /super-admin/dashboard
if (rol === 'admin') → /admin
if (rol === 'usuario') → /portal
```

**Guard de Navegación** (`src/router/index.js`):
```javascript
router.beforeEach((to, from) => {
  const auth = useAuthStore()
  
  // ❌ No autenticado + ruta protegida
  if (to.meta.requiresAuth && !auth.isAuthenticated) {
    return '/login'
  }
  
  // ✅ Ya autenticado + intentando ir a login
  if (to.path === '/login' && auth.isAuthenticated) {
    // Redirige al dashboard apropiado por rol
    return getRoleDefaultRoute(auth.user.rol)
  }
  
  // 🔐 Validar role específico
  if (to.meta.role && !isAllowedByRole(auth.user.rol, to.meta.role)) {
    return getRoleDefaultRoute(auth.user.rol)
  }
})
```

---

### 2. Flujo de Petición HTTP

**Archivo clave**: `src/api/service.js`

```javascript
// Paso 1: Crear instancia Axios
const api = axios.create({
  baseURL: 'https://apiiconos-production.up.railway.app/api',
  headers: {
    'Content-Type': 'application/json',
    'X-Tenant': '2310c96f-5a4e-4bde-8062-839c495b332a',
    // Authorization agregado por interceptor
  }
})

// Paso 2: Interceptor REQUEST (agregar token)
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token')
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`
  }
  return config
})

// Paso 3: Función wrapper
export const apiRequest = async (endpoint, options = {}) => {
  try {
    const response = await api({
      method: options.method || 'GET',
      url: endpoint,
      data: options.data
    })
    return response.data
  } catch (error) {
    return handleError(error)
  }
}

// Paso 4: Manejo de errores
if (error.response?.status === 401) {
  // Token expirado
  localStorage.clear()
  window.location.hash = '#/login'
} else if (error.response?.status === 422) {
  // Errores de validación Laravel
  return { errors: error.response.data.errors }
} else if (!error.response) {
  // Network error (CORS, no conectividad)
  return { isNetworkError: true, debug: {...} }
}

// Paso 5: Retornar dato parseado
return response.data
```

**Interceptores Disponibles**:
- ✅ **Request**: Agrega token de autenticación
- ✅ **Response**: Maneja 401 (expiración), 403 (permisos), 422 (validación)
- ✅ **Error**: Detecta network errors (CORS, conexión perdida)

---

### 3. Flujo de Cambio de Estado (Store)

**Ejemplo**: Actualización de perfil

```javascript
// Componente MiPerfil.vue
const onSaveProfile = async () => {
  // Acción del store
  await authStore.actualizarPerfil({
    nombre: 'Nuevo Nombre',
    email: 'newemail@example.com'
  })
  
  // Store actualiza el estado reactivo
  authStore.user = { ...authStore.user, nombre, email }
  
  // Store sincroniza localStorage
  localStorage.setItem('user', JSON.stringify(authStore.user))
  
  // Vue detecta cambio y re-renderiza componente
  // Componentes suscritos al store se actualizan automáticamente
}
```

**Patrón Pinia**:
```javascript
// store
export const useMyStore = defineStore('mystore', {
  state: () => ({ count: 0 }),
  actions: {
    increment() {
      this.count++  // Reactivo
    }
  }
})

// componente
<script setup>
const store = useMyStore()
const onClick = () => store.increment()
</script>

<template>
  <button @click="onClick">{{ store.count }}</button>
  <!-- Vue watcha store.count automáticamente -->
</template>
```

---

## Integración con API Backend

### Endpoints Disponibles

| Endpoint | Método | Auth | Headers Especiales | Descripción |
|----------|--------|------|-------------------|------------|
| `/login` | POST | ❌ | — | Autenticación |
| `/logout` | POST | ✅ | Authorization | Cierre sesión |
| `/estado` | GET | ❌ | — | Health check API |
| `/dashboard` | GET | ✅ | Authorization | Métricas dashboard |
| `/tenant-info` | GET | ✅ | Authorization | Info del tenant |
| `/iconos/{id}/click` | POST | ✅ | Authorization | Registrar clic |

### Headers Requeridos en Todas las Peticiones

```http
GET /api/dashboard HTTP/1.1
Host: apiiconos-production.up.railway.app
Content-Type: application/json
Accept: application/json
X-Tenant: 2310c96f-5a4e-4bde-8062-839c495b332a
Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGc...
```

### Formato de Respuestas

**Éxito**:
```json
{
  "success": true,
  "data": { ... },
  "message": "Operation successful"
}
```

**Error Validación (422)**:
```json
{
  "message": "The given data was invalid.",
  "errors": {
    "email": ["Email ya está en uso"],
    "nombre": ["Nombre es requerido"]
  }
}
```

**Error Autenticación (401)**:
```json
{
  "message": "Unauthenticated"
}
```

**Error Permisos (403)**:
```json
{
  "message": "This action is unauthorized."
}
```

---

## Sistema de Animaciones

### GSAP + ScrollTrigger en HomeView.vue

**Librerías**:
- GSAP 3.14.2 (motor de animaciones)
- ScrollTrigger (plugin para scroll-driven animations)
- FLIP (plugin para re-ordenamiento eficiente)

### Desktop Animation (lg breakpoint ≥ 1024px)

```javascript
gsap.matchMedia('(min-width: 1024px)', () => {
  // Solo corre en desktop
  
  const heroEl = document.querySelector('#hero')
  const cursorEl = document.querySelector('.cursor-sim')
  const msg1 = document.querySelector('.msg-1')
  const msg2 = document.querySelector('.msg-2')
  const msg3 = document.querySelector('.msg-3')
  const cards = gsap.utils.toArray('.icon-card')
  
  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: heroEl,
      start: 'top top',
      end: '+=220%',  // 220% de altura del viewport
      scrub: 1.2,    // 1.2 segundos de lag
      pin: true,     // Fija el hero mientras scrollea
      markers: false // Set true para debugging
    }
  })
  
  // Fase 1: Mensajes progresivos
  tl.to(msg1, { opacity: 1 }, 0)
    .to(msg1, { opacity: 0 }, '25%')
    .to(msg2, { opacity: 1 }, '25%')
    .to(msg2, { opacity: 0 }, '55%')
    .to(msg3, { opacity: 1 }, '55%')
  
  // Fase 2: Cursor simulado se mueve
  tl.to(cursorEl, {
    x: 200,
    y: 300,
    opacity: 1,
    duration: 0.5
  }, 0)
  
  // Fase 3: Cards se ordenan
  cards.forEach((card, idx) => {
    tl.to(card, {
      x: (idx % 3) * 120,  // Grid position x
      y: Math.floor(idx / 3) * 120,  // Grid position y
      rotation: 0,
      duration: 0.4,
      ease: 'back.out'
    }, 0.3)
  })
  
  // Limpiar timeline al unmount
  return () => tl.kill()
})
```

### Mobile Animation (max-width: 1023px)

```javascript
gsap.matchMedia('(max-width: 1023px)', () => {
  const mm = gsap.matchMedia()
  
  mm.add('(max-width: 1023px)', () => {
    const section = document.querySelector('.mobile-cards-section')
    const cards = gsap.utils.toArray('.mobile-icon-card')
    const skeletons = gsap.utils.toArray('.mobile-skeleton')
    const icons = gsap.utils.toArray('.mobile-icon-content')
    
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: 'top 68px',      // Cuando section top llega a 68px del viewport
        end: '+=220%',          // 220% de scroll
        scrub: 1.5,
        pin: true,              // Pina la sección
        anticipatePin: 1        // Evita saltos
      }
    })
    
    // Desorden inicial
    cards.forEach((card, idx) => {
      tl.set(card, {
        x: gsap.utils.random(-100, 100),
        y: gsap.utils.random(-100, 100),
        rotation: gsap.utils.random(-15, 15)
      }, 0)
    })
    
    // Skeleton fade out, icon fade in
    tl.to(skeletons, { opacity: 0 }, 0.25)
      .to(icons, { opacity: 1 }, 0.25, '<')
    
    // Cards se ordenan (FLIP)
    const onUpdate = () => {
      cards.forEach((card, idx) => {
        const row = Math.floor(idx / 4)
        const col = idx % 4
        gsap.to(card, {
          x: col * 80,
          y: row * 80,
          rotation: 0
        })
      })
    }
    
    tl.to(cards, { x: 0, y: 0, rotation: 0 }, '50%', onUpdate)
    
    return () => tl.kill()
  })
})
```

### Timeline Events

```javascript
// Escuchar eventos de la timeline
tl.eventCallback('onStart', () => console.log('Animation started'))
tl.eventCallback('onUpdate', () => console.log('Progress:', tl.progress()))
tl.eventCallback('onComplete', () => console.log('Animation finished'))
```

### Debugging de GSAP

```javascript
// Ver markers de ScrollTrigger
scrollTrigger: { markers: true }

// Inspeccionar elemento
console.log(element._gsap)

// Pausar/reanudar
tl.pause()
tl.play()

// Ir a posición específica
tl.seek('50%')

// Ver configuración
console.log(tl.vars)
```

---

## Manejo de Errores

### Niveles de Error

```
┌─────────────────────────────────────────┐
│  1. Network Error (conexión)             │
│     ↓ CORS, DNS, timeout, sin internet  │
├─────────────────────────────────────────┤
│  2. HTTP Status Error (servidor)         │
│     ↓ 401, 403, 422, 500, 503           │
├─────────────────────────────────────────┤
│  3. Logical Error (aplicación)           │
│     ↓ Validación, estado inválido       │
└─────────────────────────────────────────┘
```

### Manejo en API Service

```javascript
// src/api/service.js
export const apiRequest = async (endpoint, options = {}) => {
  try {
    const response = await api(config)
    return response.data
  } catch (error) {
    
    // 1️⃣ Network Error
    if (!error.response) {
      return {
        success: false,
        isNetworkError: true,
        error: 'Sin respuesta del servidor',
        debug: {
          code: error.code,        // ERR_NETWORK, ECONNABORTED
          message: error.message,
          url: error.config.url,
          method: error.config.method
        }
      }
    }
    
    // 2️⃣ HTTP Status Error
    const { status, data } = error.response
    
    if (status === 401) {
      // Token expirado
      localStorage.clear()
      window.location.hash = '#/login'
      return { success: false, error: 'Sesión expirada' }
    }
    
    if (status === 403) {
      return {
        success: false,
        forbidden: true,
        error: 'No tienes permisos'
      }
    }
    
    if (status === 422) {
      // Validación Laravel
      const firstError = Object.values(data.errors)[0][0]
      return {
        success: false,
        error: firstError,
        errors: data.errors
      }
    }
    
    if (status === 500) {
      return {
        success: false,
        error: 'Error del servidor',
        debug: { status, data }
      }
    }
    
    // 3️⃣ Otros errores
    return {
      success: false,
      error: data?.message || error.message,
      debug: { status, data }
    }
  }
}
```

### Manejo en Componentes

```vue
<script setup>
const onSubmit = async () => {
  const result = await authStore.login(email, password)
  
  if (!result.success) {
    // Network error
    if (result.isNetworkError) {
      showError(`Error de conexión: ${result.debug.message}`)
      console.error('Network details:', result.debug)
    }
    // Validación
    else if (result.errors) {
      showError('Verifica los campos:')
      Object.entries(result.errors).forEach(([field, msgs]) => {
        showError(`${field}: ${msgs[0]}`)
      })
    }
    // Error genérico
    else {
      showError(result.error)
    }
  } else {
    // Success
    showSuccess('Login exitoso')
    router.push('/admin')
  }
}
</script>
```

---

## Almacenamiento Local

### LocalStorage Keys

```javascript
// Autenticación
localStorage.setItem('auth_token', 'eyJ0eXAiOiJKV1QiLCJhbGc...')
localStorage.setItem('user', JSON.stringify({
  email: 'user@example.com',
  nombre: 'John Doe',
  rol: 'admin',
  empresa: 'Acme',
  empresaId: '550e8400-e29b-41d4-a716-446655440000',
  puedeEliminar: true
}))
localStorage.setItem('tenantName', 'Acme Corp')

// Búsqueda (Pinia persiste automáticamente si lo configuras)
// localStorage.setItem('search_query', 'icons')
```

### Ciclo de Vida

```javascript
// 🔓 Login
login() → response.token → localStorage.setItem('auth_token', token)

// 🔄 Page reload
mounted() → localStorage.getItem('auth_token') → restore session

// 🔐 Logout
logout() → localStorage.removeItem('auth_token') → session cleared

// ⏰ Token expira (401)
interceptor() → localStorage.clear() → redirect to login
```

### Persistencia con Pinia

Por defecto Pinia NO persiste en localStorage. Para hacerlo:

```javascript
// Opción 1: Manual (actual)
actions: {
  actualizarPerfil(usuario) {
    this.user = {...this.user, ...usuario}
    localStorage.setItem('user', JSON.stringify(this.user))
  }
}

// Opción 2: Plugin Pinia-persist (futuro)
import { createPinia } from 'pinia'
import piniaPluginPersist from 'pinia-plugin-persist'

const pinia = createPinia()
pinia.use(piniaPluginPersist)
```

---

## Mecanismos de Seguridad

### 1. Token JWT

```javascript
// Estructura JWT
Header.Payload.Signature

// Ejemplo decodificado
{
  "alg": "HS256",
  "typ": "JWT"
}
{
  "iat": 1234567890,
  "exp": 1234571490,  // Expiración
  "sub": "user-id",
  "email": "user@example.com",
  "rol": "admin"
}
Signature: HMACSHA256(...)
```

**Validación**:
- Token se envía en header: `Authorization: Bearer {token}`
- Backend valida firma y expiración
- Si es inválido o expirado → 401 → limpiar sesión

### 2. CORS (Cross-Origin Resource Sharing)

```
Frontend: http://localhost:5173 (dev) o https://cartes.github.io (prod)
Backend: https://apiiconos-production.up.railway.app

Backend debe tener CORS habilitado:
Access-Control-Allow-Origin: http://localhost:5173, https://cartes.github.io
Access-Control-Allow-Methods: GET, POST, PUT, DELETE
Access-Control-Allow-Headers: Content-Type, Authorization, X-Tenant
```

**Error CORS típico**:
```
Access to XMLHttpRequest at 'https://api.example.com/...' 
from origin 'http://localhost:5173' has been blocked by CORS policy
```

### 3. Header X-Tenant

```javascript
// Todas las peticiones incluyen:
'X-Tenant': '2310c96f-5a4e-4bde-8062-839c495b332a'

// Backend usa para:
// - Aislar datos por tenant
// - Validar permisos del usuario
// - Auditoría y logging
```

### 4. Role-Based Access Control (RBAC)

```javascript
// Router guard
meta: { requiresAuth: true, role: 'admin' }

// Validation
if (user.rol !== requiredRole && user.rol !== 'super-admin') {
  return 'unauthorized'
}

// Roles disponibles
'super-admin' > 'admin' > 'usuario'  // Jerarquía
```

### 5. Sanitización de Entrada

```javascript
// IMPORTANTE: Axios escapa automáticamente JSON
const data = { name: '<script>alert("xss")</script>' }
// Se envía como: "{\"name\":\"<script>...\"}"
// Backend debe deserializar y sanitizar

// En componentes: usar v-text o textContent para evitar XSS
// ❌ <div v-html="userInput"></div>  // UNSAFE
// ✅ <div>{{ userInput }}</div>      // SAFE (text interpolation)
// ✅ <div v-text="userInput"></div>  // SAFE (textContent)
```

---

## Performance & Optimizaciones

### 1. Code Splitting (Lazy Loading)

```javascript
// router/index.js
// ❌ Carga todo al inicio
import AdminDashboard from '../views/AdminDashboard.vue'

// ✅ Carga solo cuando se navega
component: () => import('../views/AdminDashboard.vue')

// Vite automáticamente crea chunks separados en build
```

### 2. Build Output

```bash
npm run build

dist/
  index.html                    # ~1KB
  assets/
    main-ABC123.js             # JS principal (lazy loaded)
    super-admin-DEF456.js       # Chunk Super Admin (lazy)
    AdminDashboard-GHI789.js    # Chunk Admin (lazy)
    main-XYZ789.css            # Estilos optimizados
```

### 3. Vue DevTools Plugin

```javascript
// vite.config.js
plugins: [
  vue(),
  vueDevTools(),  // Inspector de componentes en dev
  tailwindcss()
]
```

**En dev**:
- Hot Module Replacement (HMR): Cambios reflejan sin reload
- Component inspector: Ver props, state, events
- Timeline: Debuggear performance

### 4. Optimizaciones de Animaciones

```javascript
// ✅ Usar transform (GPU accelerated)
gsap.to(element, { x: 100 })  // ✅ GPU
gsap.to(element, { left: 100 })  // ❌ CPU

// ✅ Usar will-change para hints
.animated-card {
  will-change: transform, opacity;
}

// ✅ Reducir reflows
// Batch cambios:
gsap.to(cards, { x: 0, y: 0, rotation: 0 })

// ❌ No hacer en loops:
cards.forEach(card => {
  gsap.to(card, {...})  // Cada uno causa reflow
})

// ✅ Usar stagger
gsap.to(cards, {
  x: 0,
  stagger: 0.1  // Staggers internamente
})
```

### 5. Bundle Size

```bash
# Analizar tamaño de bundle
npm install -D rollup-plugin-visualizer
# Agregar a vite.config.js

# Resultado: dist/stats.html mostrará visualización
```

---

## Debugging & Troubleshooting

### 1. DevTools Chrome/Firefox

**Vue Tab**:
- Inspeccionar componentes
- Ver props, data, computed
- Trigger eventos

**Network Tab**:
- Ver todas las peticiones HTTP
- Headers, payload, response
- Status codes, timings

**Console**:
- Logs de error
- Ver estado de stores: `$pinia`
- Evaluar JavaScript

### 2. Debugging GSAP

```javascript
// En browser console
// Ver timeline actual
gsap.getTweensOf(element)

// Ver ScrollTrigger
ScrollTrigger.getAll()

// Ver si está pinned
ScrollTrigger.getAll().forEach(t => {
  console.log(t.trigger, t.isActive)
})

// Pausar todo
gsap.globalTimeline.pause()

// Jugar variable
gsap.globalTimeline.play()
```

### 3. Debugging de Rutas

```javascript
// router/index.js
router.beforeEach((to, from, next) => {
  console.log('Navigation:', from.path, '→', to.path)
  console.log('Auth:', useAuthStore().isAuthenticated)
  console.log('User role:', useAuthStore().user?.rol)
  return true
})
```

### 4. Errores Comunes

| Error | Causa | Solución |
|-------|-------|----------|
| `Cannot read property 'value' of null` | Vue ref null en matchMedia | Usar `document.querySelector()` |
| `CORS error` | Backend no permite origen | Configurar CORS en backend |
| `401 Unauthorized` | Token expirado/inválido | Limpiar localStorage, login nuevamente |
| `422 Unprocessable Entity` | Validación Laravel | Validar campos antes de enviar |
| `Network Error` | Sin conexión/CORS | Ver console.log del error |
| Cards no se animan en mobile | ScrollTrigger no inicia | Verificar `matchMedia` callback se ejecuta |
| GSAP kills animation | No return cleanup function | Agregar `return () => tl.kill()` |

### 5. Logs Estratégicos

```javascript
// API Service
console.log(`[API] ${method.toUpperCase()} ${endpoint}`)
console.log('[API Response]', response)

// Store Actions
console.log('[Auth] Login attempt:', email)
console.log('[Auth] Success:', userData)

// Router Guards
console.log('[Router] Navigating:', to.path, 'Auth:', auth.isAuthenticated)

// GSAP
console.log('[GSAP] Timeline duration:', tl.duration())
console.log('[GSAP] ScrollTrigger progress:', scrollTrigger.progress())
```

---

## Convenciones & Best Practices

### Naming Conventions

```javascript
// Stores
useAuthStore, useSearchStore        // Prefijo "use"

// Componentes
BaseButton, TopBar, DashboardMetrics  // PascalCase

// Variables booleanas
isAuthenticated, isLoading            // Prefijo "is"

// Handlers
onSubmit, onClick, onSuccess          // Prefijo "on"

// Props
@prop modelValue, @prop isOpen        // camelCase

// CSS Classes
.mobile-cards-section, .icon-card-skeleton  // kebab-case
```

### File Structure

```
src/
  ├── components/     # Componentes reutilizables (sin lógica de página)
  ├── views/          # Componentes de página (rutas)
  ├── stores/         # Pinia stores (estado global)
  ├── api/            # Servicios HTTP (axios)
  ├── composables/    # Lógica reutilizable
  ├── layouts/        # Layouts compartidos
  ├── assets/         # Estilos, imágenes
  ├── router/         # Vue Router config
  ├── App.vue         # Componente raíz
  └── main.js         # Punto de entrada
```

### Composition API Patterns

```vue
<script setup>
// ✅ Importar al inicio
import { ref, computed, watch, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'

// ✅ Props y Emits al inicio
defineProps({
  title: String
})
defineEmits(['submit'])

// ✅ Usar refs para estado
const count = ref(0)

// ✅ Computed properties
const doubled = computed(() => count.value * 2)

// ✅ Watchers
watch(() => count.value, (newVal) => {
  console.log('Count changed:', newVal)
})

// ✅ Store
const authStore = useAuthStore()

// ✅ Lifecycle
onMounted(() => {
  console.log('Component mounted')
})

// ✅ Event handlers
const onIncrement = () => count.value++

// ✅ Exponer al template
</script>
```

---

## Recursos para Profundizar

- [Vue 3 Composition API](https://vuejs.org/guide/extras/composition-api-faq.html)
- [Pinia Best Practices](https://pinia.vuejs.org/core-concepts/)
- [GSAP ScrollTrigger](https://greensock.com/docs/v3/Plugins/ScrollTrigger)
- [Tailwind CSS Performance](https://tailwindcss.com/docs/optimizing-for-production)
- [Vite Guide](https://vitejs.dev/guide/)
- [Web Security Academy](https://portswigger.net/web-security)

---

**Última actualización**: Abril 2026
