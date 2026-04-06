# 📚 Documentación - Aiconic Comercial

Bienvenido a la documentación completa del proyecto **Aiconic Comercial** (versión comercial de aiconic.cl).

---

## 📖 Guías Disponibles

### 🚀 [QUICK_REFERENCE.md](./QUICK_REFERENCE.md) - **COMIENZA AQUÍ**
**Para**: Desarrolladores nuevos, setup rápido, patrones comunes
- ⚡ 5 minutos: Instalación y primer `npm run dev`
- 📋 Librerías principales explicadas brevemente
- 🛠️ Crear componentes, stores, peticiones HTTP
- 🐛 Solución rápida de problemas comunes

### 📘 [README.md](./README.md) - **GUÍA GENERAL**
**Para**: Visión general del proyecto, estructura, configuración
- 📊 Tech stack completo
- 📦 Todas las librerías con versiones exactas
- 📂 Estructura de carpetas documentada
- 🎨 Componentes Vue (16 total)
- 🏪 Stores Pinia (auth, search)
- 🔌 Endpoints API disponibles
- 🛣️ Rutas y navegación
- ⚙️ Configuración (Vite, Tailwind, ESLint)

### 🔬 [TECHNICAL.md](./TECHNICAL.md) - **PROFUNDIDAD TÉCNICA**
**Para**: Arquitectura, debugging avanzado, optimizaciones
- 🏗️ Arquitectura de capas
- 🔄 Flujos principales (auth, peticiones, estado)
- 📡 Integración con backend Laravel
- 🎬 Sistema de animaciones GSAP (desktop + mobile)
- 🚨 Manejo de errores en 3 niveles
- 💾 Almacenamiento local (localStorage)
- 🔐 Mecanismos de seguridad (JWT, CORS, RBAC)
- ⚡ Performance y optimizaciones
- 🐛 Debugging y troubleshooting detallado

---

## 🎯 Por Caso de Uso

### "Acabo de clonar el repo y quiero comenzar"
→ [QUICK_REFERENCE.md](./QUICK_REFERENCE.md#instalación-rápida)

### "Necesito entender la estructura del proyecto"
→ [README.md](./README.md#estructura-del-proyecto)

### "¿Cómo agrego un nuevo componente?"
→ [QUICK_REFERENCE.md](./QUICK_REFERENCE.md#crear-componente-base)

### "¿Cuáles librerías usamos y por qué?"
→ [README.md](./README.md#-librerías-instaladas)

### "¿Cómo hago peticiones HTTP?"
→ [README.md](./README.md#-api--servicios) o [QUICK_REFERENCE.md](./QUICK_REFERENCE.md#hacer-petición-http)

### "La animación GSAP en mobile no funciona"
→ [TECHNICAL.md](./TECHNICAL.md#sistema-de-animaciones)

### "¿Cómo funcionan las rutas y protección?"
→ [README.md](./README.md#-rutas--navegación) o [TECHNICAL.md](./TECHNICAL.md#1-flujo-de-autenticación)

### "Tengo error de CORS"
→ [TECHNICAL.md](./TECHNICAL.md#2-cors-cross-origin-resource-sharing)

### "¿Cómo funciona el manejo de errores?"
→ [TECHNICAL.md](./TECHNICAL.md#manejo-de-errores)

### "Necesito debuggear la aplicación"
→ [TECHNICAL.md](./TECHNICAL.md#debugging--troubleshooting)

### "¿Cómo se despliega a GitHub Pages?"
→ [README.md](./README.md#-despliegue)

---

## 📋 Tabla de Contenidos Rápida

### Conceptos Principales
- **Frontend**: Vue 3 + Vite + Pinia + Tailwind CSS 4.0
- **API**: Backend Laravel 11.9 en Railway (`https://apiiconos-production.up.railway.app/api`)
- **Hosting**: GitHub Pages (Vite build)
- **Animaciones**: GSAP 3.14.2 + ScrollTrigger

### Librerías Instaladas (5)
1. **vue** (3.5.28) - Framework UI
2. **vite** (7.3.1) - Bundler
3. **pinia** (3.0.4) - State management
4. **vue-router** (5.0.2) - Routing (SPA)
5. **axios** (1.14.0) - HTTP client
6. **gsap** (3.14.2) - Animaciones
7. **tailwindcss** (4.2.2) - CSS framework

### Carpetas Principales
- `src/components/` - Componentes reutilizables (BaseButton, TopBar, etc.)
- `src/views/` - Páginas (HomeView, LoginView, AdminDashboard, etc.)
- `src/stores/` - Pinia stores (auth.js, search.js)
- `src/api/` - Cliente HTTP (service.js)
- `src/router/` - Configuración de rutas

### Rutas Clave
- `/` - Landing page (Home)
- `/login` - Autenticación
- `/admin` - Dashboard de admin
- `/super-admin/dashboard` - Super admin
- `/portal` - Portal de usuario

### Stores Pinia
- **useAuthStore** - Autenticación, usuario, tenant
- **useSearchStore** - Búsqueda de iconos

---

## 🔧 Stack Tecnológico en Detalle

| Componente | Tecnología | Versión | Rol |
|------------|-----------|---------|-----|
| Runtime | Node.js | 20.19+ / 22.12+ | Ejecución |
| Framework | Vue | 3.5.28 | UI Rendering |
| Bundler | Vite | 7.3.1 | Build & Dev Server |
| Estado | Pinia | 3.0.4 | State Management |
| Routing | Vue Router | 5.0.2 | SPA Navigation |
| HTTP | Axios | 1.14.0 | API Communication |
| Animaciones | GSAP | 3.14.2 | Scroll-driven animations |
| Estilos | Tailwind CSS | 4.2.2 | Utility-first CSS |
| Linting | ESLint + OXLint | 9.39.2 / 1.47.0 | Code Quality |
| DevTools | Vite DevTools | 8.0.6 | Debugging |
| Hospedaje | GitHub Pages | — | Static hosting |
| Backend | Laravel | 11.9 | API REST |

---

## 🎯 Flujo Principal de la Aplicación

```
1. Usuario accede a https://cartes.github.io/iconos_comercial/#/
   ↓
2. Home (Landing page) se carga con animaciones GSAP
   ↓
3. Usuario hace click en "Acceder" → Va a /login
   ↓
4. Ingresa credenciales → POST /login
   ↓
5. Backend devuelve token JWT + datos usuario
   ↓
6. Se guarda en localStorage (token + user data)
   ↓
7. Router redirige según rol (admin, super-admin, usuario)
   ↓
8. Usuario navega por dashboard/portal
   ↓
9. Todas las peticiones incluyen Authorization header con token
   ↓
10. Si token expira (401) → logout automático → back to login
```

---

## 🚀 Primeros Pasos

```bash
# 1. Clonar
git clone https://github.com/cartes/iconos_comercial.git
cd iconos_comercial

# 2. Instalar
npm install

# 3. Desarrollar
npm run dev
# Abre http://localhost:5173/iconos_comercial/#/

# 4. Buildear
npm run build
# Genera dist/ (listo para deploy)
```

---

## 📚 Documentación Adicional en el Repositorio

- **AGENTS.md** - Configuración de agentes Copilot
- **package.json** - Dependencias y scripts npm
- **vite.config.js** - Configuración Vite
- **tailwind.config.js** - Configuración Tailwind
- **.github/workflows/deploy.yml** - GitHub Actions (auto-deploy)

---

## 💡 Tips Importantes

1. **Always check `README.md` first** - Visión general del proyecto
2. **For quick patterns, use `QUICK_REFERENCE.md`** - Copypasta ready code
3. **For deep dive, check `TECHNICAL.md`** - Entender cómo funciona internamente
4. **Animations work differently on desktop vs mobile** - Ver TECHNICAL.md sección GSAP
5. **Todos los errores tienen debug info en console** - Abre DevTools → Console
6. **GitHub Pages requiere hash routing** - URLs con `/#/` no `/`
7. **Token JWT expira automáticamente** - Guard de navegación redirige a login

---

## 🔗 Enlaces Rápidos

- **GitHub Repo**: https://github.com/cartes/iconos_comercial
- **Live App**: https://cartes.github.io/iconos_comercial/#/
- **Backend API**: https://apiiconos-production.up.railway.app/api
- **Vue 3 Docs**: https://vuejs.org
- **Vite Docs**: https://vitejs.dev
- **Tailwind Docs**: https://tailwindcss.com
- **GSAP Docs**: https://greensock.com/gsap/

---

## 📞 Soporte

- **Errores comunes** → [QUICK_REFERENCE.md - Problemas Comunes](./QUICK_REFERENCE.md#problemas-comunes--soluciones)
- **Debugging** → [TECHNICAL.md - Debugging](./TECHNICAL.md#debugging--troubleshooting)
- **Rutas no funcionan** → [README.md - Rutas](./README.md#-rutas--navegación)
- **API errors** → [TECHNICAL.md - Integración API](./TECHNICAL.md#integración-con-api-backend)

---

## 📈 Estructura de Aprendizaje Recomendada

### Nivel 1: Usuario (5-10 min)
1. Lee QUICK_REFERENCE.md
2. Corre `npm run dev`
3. Navega por la app

### Nivel 2: Desarrollador (30-45 min)
1. Lee README.md completo
2. Explora `src/` en el editor
3. Ve los componentes principales (HomeView, LoginView)
4. Intenta crear un pequeño cambio

### Nivel 3: Arquitecto (1-2 horas)
1. Lee TECHNICAL.md completo
2. Debuggea con Vue DevTools + Network tab
3. Entiende flujos (auth, animaciones, errores)
4. Considera optimizaciones

---

**¿Listo para comenzar?** → [QUICK_REFERENCE.md](./QUICK_REFERENCE.md)

**¿Necesitas más detalle?** → [README.md](./README.md)

**¿Quieres profundizar?** → [TECHNICAL.md](./TECHNICAL.md)
