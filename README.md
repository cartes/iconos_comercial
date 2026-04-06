# Aiconic - Sistema Comercial de Gestión de Iconografía

**Versión**: 0.0.0  
**Plataforma**: SaaS (Software as a Service)  
**Backend**: Laravel 11.9 API REST (Railway)  
**Frontend**: Vue 3 + Vite + Pinia + Tailwind CSS 4.0

---

## 📋 Tabla de Contenidos

1. [Descripción General](#descripción-general)
2. [Tech Stack](#tech-stack)
3. [Librerías Instaladas](#librerías-instaladas)
4. [Estructura del Proyecto](#estructura-del-proyecto)
5. [Componentes Vue](#componentes-vue)
6. [Stores (Pinia)](#stores-pinia)
7. [API & Servicios](#api--servicios)
8. [Rutas & Navegación](#rutas--navegación)
9. [Configuración](#configuración)
10. [Scripts NPM](#scripts-npm)
11. [Instalación & Desarrollo](#instalación--desarrollo)
12. [Despliegue](#despliegue)
13. [Notas Técnicas](#notas-técnicas)

---

## 📱 Descripción General

**Aiconic Comercial** es la versión empresarial de la plataforma [aiconic.cl](https://aiconic.cl) — un **gestor inteligente de iconografía** para organizaciones. 

**Características principales:**
- **Landing Page dinámica** con animaciones GSAP (scroll-driven, responsive)
- **Sistema de autenticación** multi-rol (Super Admin, Admin de Tenant, Usuario)
- **Dashboard de métricas** con estadísticas de uso
- **Explorador de iconos** con búsqueda y filtrado
- **Portal de usuario** para acceso a librería de iconos
- **Panel Super Admin** para gestión de empresas, planes, usuarios y configuración
- **Sistema de API Keys** para integración con terceros
- **Gestión de seguridad** (cambio de contraseña, permisos)
- **Responsive en todos los tamaños** (mobile, tablet, desktop)

---

## 🛠️ Tech Stack

| Categoría | Tecnologías |
|-----------|------------|
| **Runtime** | Node.js 20.19+ / 22.12+ |
| **Framework UI** | Vue 3.5.28 (Composition API + `<script setup>`) |
| **Bundler** | Vite 7.3.1 |
| **Gestión de Estado** | Pinia 3.0.4 |
| **Enrutamiento** | Vue Router 5.0.2 |
| **Estilos** | Tailwind CSS 4.2.2 + PostCSS |
| **Peticiones HTTP** | Axios 1.14.0 |
| **Animaciones** | GSAP 3.14.2 + ScrollTrigger |
| **Linting** | ESLint 9.39.2 + OXLint 1.47.0 |
| **DevTools** | Vite DevTools 8.0.6 |
| **Despliegue** | GitHub Pages (Vite build) |

---

## 📦 Librerías Instaladas

### Dependencias Directas (`dependencies`)

```json
{
  "axios": "^1.14.0",           // Cliente HTTP: peticiones a Laravel API
  "gsap": "^3.14.2",            // Animaciones: ScrollTrigger, Timeline, FLIP
  "pinia": "^3.0.4",            // State management (reemplazo de Vuex)
  "vue": "^3.5.28",             // Framework Vue 3
  "vue-router": "^5.0.2"        // Routing SPA
}
```

**Uso:**
- **axios**: Todas las peticiones a `https://apiiconos-production.up.railway.app/api/`
- **gsap**: Animación hero con scroll-driven (desktop + mobile), transforms de tarjetas
- **pinia**: Stores de autenticación y búsqueda
- **vue**: Core del framework
- **vue-router**: Hash-based routing (`/#/`, `/#/login`, `/#/admin`, etc.)

### Dependencias de Desarrollo (`devDependencies`)

```json
{
  "@eslint/js": "^9.39.2",                    // Configuración ESLint
  "@tailwindcss/vite": "^4.2.2",              // Plugin Tailwind para Vite
  "@vitejs/plugin-vue": "^6.0.4",             // Plugin Vue para Vite
  "autoprefixer": "^10.4.27",                 // Prefijos CSS automáticos
  "eslint": "^9.39.2",                        // Linter JavaScript
  "eslint-plugin-oxlint": "~1.46.0",          // Plugin OXLint para ESLint
  "eslint-plugin-vue": "~10.8.0",             // Reglas ESLint para Vue
  "globals": "^17.3.0",                       // Globales predefinidas
  "npm-run-all2": "^8.0.4",                   // Ejecutor de scripts (lint:oxlint && lint:eslint)
  "oxlint": "~1.47.0",                        // Linter rápido (Rust) para JS/TS
  "postcss": "^8.5.8",                        // Procesador CSS (necesario para Tailwind)
  "tailwindcss": "^4.2.2",                    // Utility-first CSS framework
  "vite": "^7.3.1",                           // Build tool + dev server
  "vite-plugin-vue-devtools": "^8.0.6"       // Vue DevTools integrado en Vite
}
```

**Herramientas de Calidad:**
- **ESLint + OXLint**: Detectan errores y malas prácticas en código
- **Tailwind CSS + PostCSS + Autoprefixer**: Generan CSS optimizado con prefijos cross-browser
- **Vue DevTools**: Debugging de componentes, stores y eventos

---

## 📂 Estructura del Proyecto

```
iconos_comercial/
├── src/
│   ├── assets/
│   │   └── main.css                 # Estilos globales (CSS de Tailwind)
│   ├── components/                   # Componentes reutilizables
│   │   ├── BaseButton.vue           # Botón genérico (Tailwind)
│   │   ├── BaseInput.vue            # Input genérico (Tailwind)
│   │   ├── BaseModal.vue            # Modal genérico
│   │   ├── BaseSwitch.vue           # Toggle switch
│   │   ├── TopBar.vue               # Navbar con logo y menú
│   │   ├── ChangePasswordModal.vue  # Modal para cambiar contraseña
│   │   ├── DashboardMetrics.vue     # Tarjetas de métricas
│   │   └── PerfilSlideover.vue      # Sideover de perfil de usuario
│   ├── composables/
│   │   └── useApiError.js           # Composable para manejo de errores API
│   ├── layouts/
│   │   └── SuperAdminLayout.vue     # Layout con sidebar para Super Admin
│   ├── views/                        # Páginas principales
│   │   ├── HomeView.vue             # Landing page + hero con GSAP
│   │   ├── LoginView.vue            # Formulario de login
│   │   ├── AdminDashboard.vue       # Dashboard de Admin
│   │   ├── AdminExplorer.vue        # Explorador de iconos (admin)
│   │   ├── MiPerfil.vue             # Perfil de usuario
│   │   ├── UserPortal.vue           # Portal de usuario final
│   │   ├── SuperAdminEmpresas.vue   # (Legacy/redirect)
│   │   └── superadmin/              # Vistas Super Admin
│   │       ├── Dashboard.vue        # Dashboard Super Admin
│   │       ├── Agencias.vue         # Gestión de agencias/empresas
│   │       ├── Usuarios.vue         # Gestión de usuarios
│   │       ├── Pagos.vue            # Historial de pagos
│   │       ├── Planes.vue           # Gestión de planes
│   │       ├── Configuracion.vue    # Configuración del sistema
│   │       ├── ApiKeys.vue          # Gestión de API Keys
│   │       └── CambioPassword.vue   # Cambio de contraseña (super admin)
│   ├── stores/                       # Pinia stores
│   │   ├── auth.js                  # Store de autenticación
│   │   └── search.js                # Store de búsqueda
│   ├── router/
│   │   └── index.js                 # Configuración de rutas Vue Router
│   ├── api/
│   │   ├── service.js               # Cliente Axios + interceptores
│   │   └── perfil.js                # Endpoints específicos de perfil
│   ├── App.vue                       # Componente raíz
│   └── main.js                       # Punto de entrada (Pinia + Router)
├── public/
│   └── (assets públicos estáticos)
├── vite.config.js                   # Configuración Vite (base path, plugins)
├── tailwind.config.js               # Configuración Tailwind (colores, temas)
├── eslint.config.js                 # Configuración ESLint
├── jsconfig.json                    # Alias de rutas JS (@)
├── .gitignore                        # Archivos ignorados por git
├── .github/workflows/
│   └── deploy.yml                   # GitHub Actions: build + deploy a GitHub Pages
├── package.json                      # Dependencias y scripts
├── package-lock.json                # Lock file de npm
├── index.html                        # HTML principal (SPA)
└── README.md                         # Este archivo
```

---

## 🎨 Componentes Vue

### Base Components (Reutilizables)

| Componente | Ubicación | Descripción |
|------------|-----------|------------|
| **BaseButton** | `src/components/BaseButton.vue` | Botón genérico con variantes (primary, secondary, danger), tamaños y estados |
| **BaseInput** | `src/components/BaseInput.vue` | Input de texto con validación, placeholder y error messages |
| **BaseModal** | `src/components/BaseModal.vue` | Modal reutilizable con header, body, footer y overlay |
| **BaseSwitch** | `src/components/BaseSwitch.vue` | Toggle/switch con v-model binding |
| **TopBar** | `src/components/TopBar.vue` | Navbar fija con logo, menú de navegación y perfil de usuario |
| **ChangePasswordModal** | `src/components/ChangePasswordModal.vue` | Modal especializado para cambiar contraseña |
| **DashboardMetrics** | `src/components/DashboardMetrics.vue` | Tarjetas de métricas (KPIs) del dashboard |
| **PerfilSlideover** | `src/components/PerfilSlideover.vue` | Sideover (panel lateral) con info del perfil y opciones |

### Vistas Principales

#### **HomeView.vue** - Landing Page
- **Líneas**: ~600+
- **Tecnologías**: Vue 3 Composition API, GSAP 3.14.2 (ScrollTrigger, Timeline, FLIP), Tailwind CSS 4.0
- **Secciones**:
  1. **Hero Section (Desktop)**
     - Texto de CTA con gradiente
     - Grid de 16 tarjetas simuladas (skeletons animados + iconos)
     - Cursor simulado que se mueve al hacer scroll
     - 3 mensajes flotantes: "Describe tu necesidad." → "Aiconic organiza..." → "Tu librería perfecta."
     - GSAP ScrollTrigger: `pin: true` en `#hero`, animación 0–220% de viewport
     - Desktop only: `lg:` breakpoint
  
  2. **Hero Section (Mobile)**
     - `.mobile-cards-section` con grid responsive
     - Misma animación que desktop pero con `pin: true` para mobile (`max-width: 1023px`)
     - GSAP matchMedia: `start: 'top 68px'`, `end: '+=220%'`, `scrub: 1.5`
     - Tarjetas comienzan scattered, se ordenan al scroll
  
  3. **Características** (Features Section)
     - Grid de 3 columnas con iconos y descripciones
  
  4. **Estadísticas** (Stats Section)
     - Números destacados (ej: "10K+", "500+")
  
  5. **Call-to-Action** (CTA Section)
     - Botones de signup/login
  
  6. **Footer**
     - Enlaces, copyright, redes sociales

#### **LoginView.vue** - Formulario de Autenticación
- Formulario con email y contraseña
- Integración con `useAuthStore` (store de Pinia)
- Validación de credenciales contra API
- Redirección condicional por rol (super-admin → dashboard, admin → admin, usuario → portal)

#### **AdminDashboard.vue** - Dashboard de Admin
- Métricas y estadísticas de la empresa/tenant
- Componente `DashboardMetrics` reutilizable
- Acceso a explorador de iconos

#### **AdminExplorer.vue** - Explorador de Iconos
- Grid de iconos filtrable y buscable
- Integración con `useSearchStore`
- Detalles e info de cada icono

#### **MiPerfil.vue** - Perfil de Usuario
- Edición de datos personales
- Cambio de contraseña
- Info de la empresa/tenant

#### **UserPortal.vue** - Portal de Usuario Final
- Acceso a librería de iconos (role: "usuario")
- Restricción de acceso por autenticación

#### **SuperAdminLayout.vue** - Layout con Sidebar
- Layout compartido por todas las vistas Super Admin
- Sidebar fijo con menú de navegación
- Contenedor principal para sub-rutas

#### **Vistas Super Admin** (en `src/views/superadmin/`)
- **Dashboard.vue**: Resumen de métricas globales
- **Agencias.vue**: CRUD de empresas/agencias
- **Usuarios.vue**: Gestión de usuarios (crear, editar, eliminar)
- **Pagos.vue**: Historial de transacciones
- **Planes.vue**: Gestión de planes de suscripción
- **Configuracion.vue**: Configuración del sistema
- **ApiKeys.vue**: Gestión de claves API para integración
- **CambioPassword.vue**: Cambio de contraseña para super admin

---

## 🏪 Stores (Pinia)

### **useAuthStore** - `src/stores/auth.js`

**Estado:**
```javascript
{
  user: {
    email: string,
    nombre: string,
    rol: "super-admin" | "admin" | "usuario",
    empresa: string,
    empresaId: string,
    puedeEliminar: boolean
  },
  tenantName: string | null,
  isAuthenticated: boolean,
  loading: boolean,
  error: string | null
}
```

**Acciones:**
- `login(email, clave)`: Autentica usuario contra API
- `logout()`: Limpia sesión (localStorage + API)
- `fetchTenantInfo()`: Obtiene info de la empresa/tenant
- `actualizarPerfil(usuario)`: Actualiza datos en store y localStorage
- `checkBootstrap()`: Verifica estado del API

### **useSearchStore** - `src/stores/search.js`

**Estado:**
```javascript
{
  query: ref('')  // Término de búsqueda de iconos
}
```

**Acciones:**
- `clear()`: Limpia el query de búsqueda

---

## 🔌 API & Servicios

### **API Base**
- **URL**: `https://apiiconos-production.up.railway.app/api`
- **Cliente**: Axios 1.14.0
- **Headers globales**:
  - `Content-Type: application/json`
  - `Accept: application/json`
  - `X-Tenant: 2310c96f-5a4e-4bde-8062-839c495b332a` (identificador de agencia)
  - `Authorization: Bearer {token}` (dinámico, del localStorage)

### **Interceptores**
- **Request**: Agrega token de autenticación (localStorage) si existe
- **Response**: 
  - `401`: Limpia sesión y redirige a login
  - `403`: Retorna error "Sin permisos"
  - `422`: Propaga errores de validación por campo (Laravel)
  - Network Error: Muestra detalles (tipo, mensaje, URL, método)

### **Endpoints Disponibles** (en `src/api/service.js`)

| Método | Endpoint | Descripción |
|--------|----------|------------|
| POST | `/login` | Autenticación |
| POST | `/logout` | Cierre de sesión |
| GET | `/estado` | Check de salud del API |
| GET | `/dashboard` | Métricas del dashboard |
| GET | `/tenant-info` | Info de la empresa actual |
| POST | `/iconos/{id}/click` | Registra click en icono |

**Nota**: Endpoints específicos pueden estar en `src/api/perfil.js` o directamente en componentes via `apiRequest()`.

---

## 🛣️ Rutas & Navegación

### Configuración en `src/router/index.js`

| Ruta | Componente | Auth | Rol | Descripción |
|------|-----------|------|-----|------------|
| `/` | `HomeView` | ❌ | — | Landing page pública |
| `/login` | `LoginView` | ❌ | — | Formulario de login |
| `/perfil` | `MiPerfil` | ✅ | any | Perfil del usuario |
| `/portal` | `UserPortal` | ✅ | usuario | Portal de usuario final |
| `/admin` | `AdminDashboard` | ✅ | admin | Dashboard de admin |
| `/admin/explore/:id/:nombre` | `AdminExplorer` | ✅ | admin | Explorador de iconos |
| `/super-admin/*` | `SuperAdminLayout` | ✅ | super-admin | Layout Super Admin |
| → `/super-admin/dashboard` | `Dashboard` | ✅ | super-admin | Dashboard general |
| → `/super-admin/agencias` | `Agencias` | ✅ | super-admin | Gestión de agencias |
| → `/super-admin/usuarios` | `Usuarios` | ✅ | super-admin | Gestión de usuarios |
| → `/super-admin/pagos` | `Pagos` | ✅ | super-admin | Historial de pagos |
| → `/super-admin/planes` | `Planes` | ✅ | super-admin | Gestión de planes |
| → `/super-admin/configuracion` | `Configuracion` | ✅ | super-admin | Configuración |
| → `/super-admin/api-keys` | `ApiKeys` | ✅ | super-admin | API Keys |
| → `/super-admin/seguridad` | `CambioPassword` | ✅ | super-admin | Cambio contraseña |

### Guard de Navegación (beforeEach)
- **Protege rutas**: Redirige a `/login` si no está autenticado y la ruta requiere auth
- **Rol-based access**: Verifica permisos por rol
- **Redirección post-login**: Redirige a dashboard apropiado según rol
- **Super-admin override**: Los super-admins pueden acceder a rutas admin

---

## ⚙️ Configuración

### **vite.config.js**
```javascript
{
  base: "/iconos_comercial/",          // Path para GitHub Pages
  plugins: [vue(), vueDevTools(), tailwindcss()],
  resolve: { alias: { "@": "./src" } } // Alias @ para imports
}
```

### **tailwind.config.js**
```javascript
{
  darkMode: 'class',                          // Dark mode por clase
  theme: {
    extend: {
      colors: {
        primary: { 500, 600, 700 },          // Indigo
        secondary: { 500 },                  // Pink
        success: { 500 },                    // Green
        error: { 500 },                      // Red
        warning: { 500 },                    // Amber
        info: { 500 }                        // Blue
      },
      backgroundImage: {
        'grad-primary': 'linear-gradient(135deg, #6366f1, #a855f7)',
        'grad-premium': 'linear-gradient(135deg, #4f46e5, #7c3aed)',
        'grad-dark': 'linear-gradient(135deg, #1e293b, #0f172a)'
      }
    }
  }
}
```

### **jsconfig.json**
```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": { "@/*": ["src/*"] }
  }
}
```

---

## 📝 Scripts NPM

```bash
# Instalación de dependencias
npm install

# Desarrollo (servidor hot-reload en http://localhost:5173)
npm run dev

# Build para producción (genera dist/)
npm run build

# Vista previa del build
npm run preview

# Linting (ESLint + OXLint con auto-fix)
npm run lint
npm run lint:oxlint   # Solo OXLint
npm run lint:eslint   # Solo ESLint
```

---

## 🚀 Instalación & Desarrollo

### Requisitos
- **Node.js**: 20.19.0 ≥ o 22.12.0+
- **npm**: 9+ (o pnpm/yarn)

### Pasos

1. **Clonar repositorio**
   ```bash
   git clone https://github.com/cartes/iconos_comercial.git
   cd iconos_comercial
   ```

2. **Instalar dependencias**
   ```bash
   npm install
   ```

3. **Variables de entorno** (opcional)
   - Por defecto usa `https://apiiconos-production.up.railway.app/api`
   - Para cambiar: editar `src/api/service.js` (línea 3)

4. **Servidor de desarrollo**
   ```bash
   npm run dev
   ```
   - Abre http://localhost:5173/iconos_comercial/#/

5. **Build para producción**
   ```bash
   npm run build
   ```
   - Genera archivos en `dist/`

6. **Linting**
   ```bash
   npm run lint
   ```

---

## 📦 Despliegue

### GitHub Pages (Vite)

El proyecto se despliega automáticamente a **GitHub Pages** via GitHub Actions.

**Workflow**: `.github/workflows/deploy.yml`
- Trigger: Push a `main` branch
- Build: `npm run build`
- Deploy: Artifacts a rama `gh-pages`
- URL en vivo: **https://cartes.github.io/iconos_comercial/**

**Configuración:**
- `vite.config.js`: `base: "/iconos_comercial/"`
- `src/router/index.js`: Hash-based history (`createWebHashHistory`)

---

## 🔍 Notas Técnicas

### Animaciones GSAP en HomeView.vue

**Desktop (lg breakpoint)**:
```javascript
gsap.matchMedia('(min-width: 1024px)', () => {
  const tl = gsap.timeline({ scrollTrigger: {...} });
  // - Hero pinned (position: fixed)
  // - Cards se transforman (x, y, rotation)
  // - Skeletons fade out, icons fade in
  // - Mensajes aparecen secuencialmente
  // - end: '+=220%' (220% de viewport height de scroll)
});
```

**Mobile (max-width: 1023px)**:
```javascript
gsap.matchMedia('(max-width: 1023px)', () => {
  const mm = gsap.matchMedia();
  mm.add('(max-width: 1023px)', () => {
    const tl = gsap.timeline({ scrollTrigger: {...} });
    // - .mobile-cards-section pinned
    // - Same animation as desktop
    // - Responsive grid layout
  });
});
```

**Características:**
- **Pin + Scrub**: `pin: true`, `scrub: 1.2–1.5` para animación suave
- **ScrollTrigger**: Vincula animación a scroll del usuario
- **FLIP**: Flip plugin de GSAP para re-ordenar elementos eficientemente
- **Document.querySelector()**: No Vue refs dentro de matchMedia (refs pueden ser null)

### Autenticación & Autorización

**Flow de Login:**
1. Usuario ingresa email + contraseña en `LoginView`
2. `useAuthStore.login()` llama a `/login` endpoint
3. API retorna token + datos del usuario
4. Se guarda en localStorage: `auth_token`, `user`, `tenantName`
5. Router guard redirige según rol

**Roles:**
- `super-admin`: Acceso a panel de administración general
- `admin`: Acceso a dashboard y explorador de iconos del tenant
- `usuario`: Acceso al portal de usuario final

**Token Refresh:**
- Si API retorna 401 → limpia localStorage y redirige a `/login`
- Interceptor de request: Agrega token a cada petición

### Estilos Tailwind CSS 4.0

**Características principales:**
- Utilidades de single-file CSS (en `src/assets/main.css`)
- Color scheme personalizado (primary indigo, secondary pink)
- Gradientes: `grad-primary`, `grad-premium`, `grad-dark`
- Dark mode por clase (`.dark`)
- Responsive: `sm:`, `md:`, `lg:`, `xl:`, `2xl:` breakpoints

### Componentes Base Reutilizables

Todos siguen patrón similar:
```vue
<script setup>
defineProps({ /* opciones */ });
defineEmits({ /* eventos */ });
</script>

<template>
  <!-- Estructura con Tailwind -->
</template>

<style scoped>
/* Estilos locales si es necesario */
</style>
```

### Pinia vs Vuex

Se usa **Pinia** (successor oficial de Vuex):
- Sintaxis más simple
- Composables directos
- Mejor TypeScript support
- State reactivo por defecto

### CORS & X-Tenant Header

- **X-Tenant**: Header obligatorio en todas las peticiones
- Valor actual: `2310c96f-5a4e-4bde-8062-839c495b332a` (ID de agencia)
- Definido en `src/api/service.js` (línea 10)
- El backend Laravel valida este header en cada request

### Hash-based Routing

Se usa `createWebHashHistory` para GitHub Pages:
- URLs: `/#/`, `/#/login`, `/#/admin`, etc.
- No requiere configuración de servidor
- Compatible con GitHub Pages (static hosting)

---

## 🎯 Próximos Pasos & Mantenimiento

- [ ] Integrar sistema de notificaciones (toast/alerts)
- [ ] Agregar soporte para múltiples idiomas (i18n)
- [ ] Implementar offline mode (service workers)
- [ ] Mejorar performance (code splitting, lazy loading)
- [ ] Agregar tests unitarios (Vitest)
- [ ] E2E tests (Playwright)

---

## 📚 Recursos & Referencias

- [Vue 3 Docs](https://vuejs.org/)
- [Vite Docs](https://vite.dev/)
- [Pinia Docs](https://pinia.vuejs.org/)
- [Tailwind CSS Docs](https://tailwindcss.com/)
- [GSAP Docs](https://greensock.com/gsap/)
- [Axios Docs](https://axios-http.com/)
- [Vue Router Docs](https://router.vuejs.org/)

---

**Última actualización**: Abril 2026  
**Mantenedor**: Equipo Aiconic  
**Licencia**: (Especificar si aplica)
