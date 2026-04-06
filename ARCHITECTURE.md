# 🏗️ Arquitectura - Aiconic Comercial

Diagrama de arquitectura y flujos del sistema.

---

## 📊 Diagrama de Capas

```
┌─────────────────────────────────────────────────────────────────┐
│                        NAVEGADOR (Browser)                       │
│                    https://cartes.github.io/                    │
│                   iconos_comercial/#/ (SPA)                      │
├─────────────────────────────────────────────────────────────────┤
│                      Vue 3 Components                            │
│   (HomeView, LoginView, AdminDashboard, etc.)                  │
├─────────────────────────────────────────────────────────────────┤
│                     Vue Router (5.0.2)                           │
│  RoutePath: /login, /admin, /super-admin/...                   │
│  Hash: /#/login, /#/admin                                       │
│  Guards: Auth check, role validation                             │
├─────────────────────────────────────────────────────────────────┤
│                   Pinia Store (3.0.4)                            │
│  ┌─────────────────────────────────────────────────────┐       │
│  │ useAuthStore                useSearchStore           │       │
│  │ - user                      - query                  │       │
│  │ - isAuthenticated           - clear()               │       │
│  │ - login() / logout()                                │       │
│  │ - fetchTenantInfo()                                 │       │
│  └─────────────────────────────────────────────────────┘       │
├─────────────────────────────────────────────────────────────────┤
│              Axios Client + Interceptors (1.14.0)               │
│  BaseURL: https://apiiconos-production.up.railway.app/api      │
│  Headers: Authorization, X-Tenant, Content-Type                │
│  Interceptors: Request (JWT token), Response (401/422/500)     │
├─────────────────────────────────────────────────────────────────┤
│            INTERNET / Network (CORS enabled)                    │
├─────────────────────────────────────────────────────────────────┤
│          Laravel 11.9 API (Backend)                             │
│     https://apiiconos-production.up.railway.app/api             │
│  Endpoints: /login, /logout, /dashboard, /tenant-info, ...     │
│  Middleware: JWT validation, tenant isolation, CORS             │
├─────────────────────────────────────────────────────────────────┤
│              PostgreSQL Database (Backend)                       │
│     (users, companies, api_keys, payments, etc.)                │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🔄 Flujo de Autenticación

```
┌─────────────┐
│   Usuario   │
└──────┬──────┘
       │ 1. Ingresa email + contraseña
       ▼
┌────────────────────────┐
│  LoginView.vue         │
│  Form inputs           │
└──────────┬─────────────┘
           │ 2. submitForm()
           ▼
┌────────────────────────┐
│ useAuthStore.login()   │
│ (Pinia Action)         │
└──────────┬─────────────┘
           │ 3. apiRequest('login', {...})
           ▼
┌────────────────────────┐
│ Axios HTTP Client      │
│ POST /login            │
│ Headers: X-Tenant      │
└──────────┬─────────────┘
           │ 4. Network request
           ▼
┌────────────────────────┐
│ Backend Laravel API    │
│ Route: /login          │
│ Validates credentials  │
└──────────┬─────────────┘
           │ 5. Success response
           │ {
           │   token: 'eyJ...',
           │   usuario: {...},
           │   success: true
           │ }
           ▼
┌────────────────────────┐
│ Axios Response Handler │
│ Parse JWT token        │
└──────────┬─────────────┘
           │ 6. Save to localStorage
           │    - auth_token
           │    - user
           │    - tenantName
           ▼
┌────────────────────────┐
│ Pinia Store Update     │
│ - authStore.user       │
│ - authStore.isAuth.    │
└──────────┬─────────────┘
           │ 7. Reactive update
           │ (components re-render)
           ▼
┌────────────────────────┐
│ Router Guard           │
│ beforeEach() hook      │
│ Redirect by role:      │
│ - admin → /admin       │
│ - super-admin → /...   │
│ - usuario → /portal    │
└──────────┬─────────────┘
           │ 8. Navigate
           ▼
┌────────────────────────┐
│ Dashboard Page         │
│ ✅ Usuario autenticado│
└────────────────────────┘
```

---

## 🏗️ Estructura de Componentes

```
App.vue
└── RouterView (Dynamic)
    ├── HomeView (public)
    │   ├── Hero Section
    │   │   └── GSAP animations (desktop + mobile)
    │   ├── Features Section
    │   ├── Stats Section
    │   ├── CTA Section
    │   └── Footer
    │
    ├── LoginView (public)
    │   ├── BaseInput (email)
    │   ├── BaseInput (password)
    │   └── BaseButton (submit)
    │
    ├── AdminDashboard (protected, role:admin)
    │   ├── TopBar
    │   ├── DashboardMetrics
    │   └── AdminExplorer (nested route)
    │
    ├── SuperAdminLayout (protected, role:super-admin)
    │   ├── Sidebar
    │   ├── TopBar
    │   └── RouterView (nested)
    │       ├── Dashboard
    │       ├── Agencias
    │       ├── Usuarios
    │       ├── Pagos
    │       ├── Planes
    │       ├── Configuracion
    │       ├── ApiKeys
    │       └── CambioPassword
    │
    ├── MiPerfil (protected, any role)
    │   ├── Profile form
    │   └── ChangePasswordModal
    │
    └── UserPortal (protected, role:usuario)
        └── Icon library access
```

---

## 📡 Flujo de Petición HTTP

```
Component
    │
    ├── 1. Trigger action
    │   await authStore.login(email, password)
    │
    ▼
Store (Pinia)
    │
    ├── 2. Call API
    │   apiRequest('login', {method: 'POST', data: {...}})
    │
    ▼
API Service
    │
    ├── 3. Prepare request
    │   - URL: https://api.../login
    │   - Headers: Auth, X-Tenant, Content-Type
    │   - Data: JSON
    │
    ▼
Axios Instance
    │
    ├── 4. Request Interceptor
    │   - Add Authorization header
    │   - Add X-Tenant header
    │
    ├── 5. HTTP POST
    │   → Network request
    │
    ├── 6. Backend processes
    │   - Validate CORS origin
    │   - Check X-Tenant
    │   - Verify credentials
    │   - Generate JWT token
    │
    ├── 7. Response received
    │   - Status: 200, 401, 422, 500, etc.
    │   - Body: JSON data
    │
    ├── 8. Response Interceptor
    │   if (status === 401) {
    │     localStorage.clear()
    │     redirect to /login
    │   }
    │   if (status === 422) {
    │     return validation errors
    │   }
    │
    ▼
API Service
    │
    ├── 9. Parse response
    │   - Extract data
    │   - Handle errors
    │
    ▼
Store (Pinia)
    │
    ├── 10. Update state
    │   this.user = userData
    │   this.isAuthenticated = true
    │   localStorage.setItem(...)
    │
    ▼
Component
    │
    └── 11. Re-render (reactive)
        - Display user info
        - Trigger navigation
```

---

## 🎬 Animación GSAP (Desktop)

```
Hero Section
    │
    ├── 1. Mount: scroll starts
    │
    ├── 2. ScrollTrigger initializes
    │   - trigger: #hero
    │   - start: 'top top'
    │   - pin: true (fixes position)
    │   - scrub: 1.2 (smooth follow)
    │
    ├── 3. User scrolls ↓
    │
    ├── 4. Timeline progress updates (0% → 100%)
    │
    ├── 5a. Phase 1 (0-25%): Messages appear
    │   msg1 (opacity 1)
    │   → fade out at 25%
    │   → msg2 fade in
    │
    ├── 5b. Phase 2 (25-55%): Skeletons → Icons
    │   skeletons (opacity 1)
    │   → fade to 0
    │   → icons fade in (opacity 1)
    │
    ├── 5c. Phase 3 (55-100%): Cards order
    │   card positions: scatter → grid
    │   card rotations: random → 0
    │   cursor moves across screen
    │
    ├── 6. Cards reach grid (100%)
    │
    └── 7. Unpin: hero returns to normal flow
```

---

## 📊 Diagrama de Rutas (Vue Router)

```
Root (/)
├── HomeView (public)
│
├── LoginView (public)
│
├── AdminDashboard (private, role: admin)
│   └── AdminExplorer (private, role: admin)
│
├── MiPerfil (private, any role)
│
├── UserPortal (private, role: usuario)
│
└── SuperAdminLayout (private, role: super-admin)
    ├── Dashboard
    ├── Agencias
    ├── Usuarios
    ├── Pagos
    ├── Planes
    ├── Configuracion
    ├── ApiKeys
    └── CambioPassword

Routes Redirect:
/admin/empresas → /super-admin/agencias (legacy)

Route Guards:
- requiresAuth: true
  → Check auth, redirect /login if not authenticated
  
- role: 'admin'
  → Check user.rol, redirect to default page if not allowed
```

---

## 💾 Almacenamiento Local (localStorage)

```
localStorage
    │
    ├── auth_token: 'eyJ0eXAiOiJKV1QiLCJhbGc...'
    │   (JWT token, needed for API requests)
    │
    ├── user: JSON.stringify({
    │   email: 'user@example.com',
    │   nombre: 'John Doe',
    │   rol: 'admin',
    │   empresa: 'Acme Corp',
    │   empresaId: 'uuid',
    │   puedeEliminar: true
    │ })
    │
    └── tenantName: 'Acme Corp'
        (Optional, for non super-admin users)

When Browser Closes:
- localStorage persists
- On next visit: restore from localStorage
- useAuthStore reads localStorage in state()

When Logout:
- localStorage.clear()
- All 3 keys removed
```

---

## 🔐 Seguridad - Flujo de Validación

```
Request arrives
    │
    ├─ Check: CORS headers match?
    │  ├─ NO → Return CORS error
    │  └─ YES → Continue
    │
    ├─ Check: X-Tenant header valid?
    │  ├─ NO → Return 403 Forbidden
    │  └─ YES → Continue
    │
    ├─ Check: Authorization header present?
    │  ├─ NO (public endpoint) → Process without auth
    │  ├─ YES → Continue
    │  └─ YES (private endpoint) → Continue
    │
    ├─ Validate: JWT token signature valid?
    │  ├─ NO → Return 401 Unauthorized
    │  └─ YES → Continue
    │
    ├─ Check: Token not expired?
    │  ├─ EXPIRED → Return 401 Unauthorized
    │  └─ VALID → Continue
    │
    ├─ Extract: User ID from token
    │  └─ Continue
    │
    ├─ Check: User role has permission?
    │  ├─ NO → Return 403 Forbidden
    │  └─ YES → Continue
    │
    └─ ✅ Request allowed → Process and return 200
```

---

## 🐛 Error Handling Layers

```
Error occurs at any level
    │
    ├─ Layer 1: Network (Client-side)
    │  ├─ CORS blocked
    │  ├─ No internet
    │  ├─ DNS fail
    │  └─ Timeout
    │  → Axios: No response
    │  → Return: { isNetworkError: true, debug: {...} }
    │
    ├─ Layer 2: HTTP (Server response)
    │  ├─ 401: Token expired
    │  ├─ 403: No permission
    │  ├─ 422: Validation error
    │  ├─ 500: Server error
    │  └─ 503: Service unavailable
    │  → Axios: Response with status
    │  → Return: { success: false, error: '...', status: 401 }
    │
    └─ Layer 3: Application Logic (Business rules)
       ├─ Invalid data
       ├─ Missing fields
       ├─ Conflict with existing
       └─ Permission denied
       → Backend validation (422)
       → Return: { errors: { field: ['message'] } }

Component handles error:
    if (result.isNetworkError) → show network error
    else if (result.errors) → show field errors
    else → show generic error
```

---

## ⚡ Performance Optimization Strategy

```
Build Phase:
    ├─ Vite tree-shaking
    │  └─ Remove unused code
    │
    ├─ Code splitting
    │  └─ Lazy load views (AdminDashboard, SuperAdmin, etc.)
    │
    ├─ Minification
    │  └─ Uglify JS, purge CSS
    │
    └─ Asset optimization
       └─ Compress, optimize images

Runtime Optimization:
    ├─ Component splitting
    │  └─ Small components = better re-renders
    │
    ├─ Computed properties
    │  └─ Cache derived data
    │
    ├─ Lazy loading routes
    │  └─ Load only when needed
    │
    ├─ GSAP optimization
    │  ├─ use transform (GPU)
    │  └─ will-change hints
    │
    └─ Network optimization
       ├─ Compress requests/responses
       └─ Cache with localStorage
```

---

## 🔗 Integration Points

### Frontend → Backend

```
GET /api/estado
  ├─ Check API health
  └─ Called on app load (bootstrap)

POST /api/login
  ├─ Email, password
  └─ Response: token, user data

POST /api/logout
  ├─ Clear session
  └─ Response: success message

GET /api/dashboard
  ├─ Fetch metrics
  └─ Response: stats data

GET /api/tenant-info
  ├─ Get company info
  └─ Response: nombre, id, etc.

POST /api/iconos/{id}/click
  ├─ Track icon views
  └─ Response: success
```

### Backend → Database

```
Laravel API
    ├─ Query users table
    ├─ Check companies
    ├─ Validate permissions
    ├─ Log activities
    └─ Store/retrieve data

PostgreSQL
    ├─ users (email, password_hash, rol)
    ├─ companies (nombre, plan, estado)
    ├─ api_keys (key, secret, tenant_id)
    └─ activities (log)
```

---

## 🚀 Deployment Flow

```
Developer
    │
    ├─ 1. git push origin main
    │
    ▼
GitHub Repository
    │
    ├─ 2. Webhook: push detected
    │
    ▼
GitHub Actions Workflow
    │
    ├─ 3. Job: build
    │  ├─ npm install
    │  └─ npm run build
    │
    ├─ 4. Job: deploy
    │  ├─ Upload dist/ to gh-pages branch
    │  └─ Publish to GitHub Pages
    │
    ▼
GitHub Pages
    │
    ├─ 5. CDN cache
    │
    ▼
Browser (User)
    │
    └─ https://cartes.github.io/iconos_comercial/#/
```

---

## 📋 Component Dependency Graph

```
App.vue
    ├─ RouterView
    │   │
    │   ├─ HomeView
    │   │   ├─ (GSAP animations)
    │   │   └─ (No child components)
    │   │
    │   ├─ LoginView
    │   │   ├─ BaseInput
    │   │   └─ BaseButton
    │   │
    │   ├─ AdminDashboard
    │   │   ├─ TopBar
    │   │   └─ DashboardMetrics
    │   │
    │   ├─ SuperAdminLayout
    │   │   ├─ TopBar
    │   │   ├─ Sidebar
    │   │   └─ RouterView (nested)
    │   │       └─ SubPages (Dashboard, Agencias, etc.)
    │   │           ├─ BaseButton
    │   │           ├─ BaseInput
    │   │           └─ BaseModal
    │   │
    │   └─ MiPerfil
    │       ├─ BaseInput
    │       ├─ BaseButton
    │       └─ ChangePasswordModal
    │
    └─ Global Styles (Tailwind)
```

---

## 🔄 State Flow (Pinia)

```
Component A needs data
    │
    ├─ 1. Import: const store = useAuthStore()
    │
    ├─ 2. Read: const user = store.user
    │     (Vue watches this reference)
    │
    ├─ 3. Call action: await store.login(email, pw)
    │
    ├─ 4. Store updates state
    │     this.user = userData
    │     this.isAuthenticated = true
    │
    ├─ 5. Vue detects change (reactivity)
    │
    ├─ 6. Component A re-renders (computed/watch trigger)
    │
    └─ 7. Any other component using store also re-renders
        (Pinia automatically syncs)
```

---

## 📊 API Response Patterns

### Success (200)

```json
{
  "success": true,
  "data": { ... },
  "message": "Operation successful"
}
```

### Validation Error (422)

```json
{
  "success": false,
  "errors": {
    "email": ["Email already exists"],
    "nombre": ["Name is required"]
  }
}
```

### Auth Error (401)

```json
{
  "success": false,
  "message": "Unauthenticated"
}
```

### Permission Error (403)

```json
{
  "success": false,
  "message": "This action is unauthorized."
}
```

---

## 🎯 Key Design Decisions

| Decision | Reason |
|----------|--------|
| **Vue 3 + Composition API** | Modern, flexible, better TypeScript support |
| **Pinia over Vuex** | Simpler API, less boilerplate, official recommendation |
| **Hash routing** | Required for GitHub Pages static hosting |
| **Axios + Interceptors** | Centralized error handling, automatic token injection |
| **GSAP for animations** | Powerful scroll-driven animations, GPU optimized |
| **Tailwind CSS v4** | Utility-first, fast development, smaller bundle |
| **Lazy loading routes** | Faster initial load, code splitting |
| **localStorage for auth** | Simple persistence, no server-side sessions |

---

## 📈 Scalability Considerations

**Current architecture supports:**
- ✅ 5+ concurrent users
- ✅ 1000+ API calls/hour
- ✅ 100+ components
- ✅ Multi-role system (super-admin, admin, usuario)

**Future improvements:**
- Add Redis caching (backend)
- Implement PWA (service workers)
- Add WebSocket for real-time updates
- Migrate to TypeScript for type safety
- Add automated tests (Vitest, Playwright)
- Implement analytics (Sentry for monitoring)

---

**Last Updated**: April 2026
