import { createRouter, createWebHashHistory } from "vue-router";
import { useAuthStore } from "@/stores/auth";
import LoginView from "../views/LoginView.vue";
import HomeView from "../views/HomeView.vue";
import PricingView from "../views/PricingView.vue";

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: HomeView,
    },
    {
      path: "/login",
      name: "login",
      component: LoginView,
    },
    {
      path: "/planes",
      name: "pricing",
      component: PricingView,
    },
    {
      path: "/registrar",
      name: "register-agencia",
      component: () => import("../views/RegisterAgencia.vue"),
      meta: { public: true },
    },
    // ── Redirect de compatibilidad ──────────────────────────────────
    {
      path: "/admin/empresas",
      redirect: "/super-admin/agencias",
    },
    // ── Super Admin (con layout propio con sidebar) ─────────────────
    {
      path: "/super-admin",
      component: () => import("../layouts/SuperAdminLayout.vue"),
      meta: { requiresAuth: true, role: "super-admin" },
      redirect: "/super-admin/dashboard",
      children: [
        {
          path: "dashboard",
          name: "super-dashboard",
          component: () => import("../views/superadmin/Dashboard.vue"),
        },
        {
          path: "agencias",
          name: "super-agencias",
          component: () => import("../views/superadmin/Agencias.vue"),
        },
        {
          path: "usuarios",
          name: "super-usuarios",
          component: () => import("../views/superadmin/Usuarios.vue"),
        },
        {
          path: "pagos",
          name: "super-pagos",
          component: () => import("../views/superadmin/Pagos.vue"),
        },
        {
          path: "planes",
          name: "super-planes",
          component: () => import("../views/superadmin/Planes.vue"),
        },
        {
          path: "configuracion",
          name: "super-configuracion",
          component: () => import("../views/superadmin/Configuracion.vue"),
        },
        {
          path: "seguridad",
          name: "super-seguridad",
          component: () => import("../views/superadmin/CambioPassword.vue"),
        },
        {
          path: "api-keys",
          name: "super-api-keys",
          component: () => import("../views/superadmin/ApiKeys.vue"),
        },
      ],
    },
    // ── Rutas de Agencia (Multi-tenant) ────────────────────────────
    {
      path: "/agencia/:tenant",
      children: [
        {
          path: "admin",
          name: "admin",
          component: () => import("../views/AdminDashboard.vue"),
          meta: { requiresAuth: true, role: "admin" },
        },
        {
          path: "admin/explore/:id/:nombre",
          name: "admin-explore",
          component: () => import("../views/AdminExplorer.vue"),
          meta: { requiresAuth: true, role: "admin" },
        },
        {
          path: "portal",
          name: "portal",
          component: () => import("../views/UserPortal.vue"),
          meta: { requiresAuth: true, role: "usuario" },
        },
        {
          path: "perfil",
          name: "perfil-agencia",
          component: () => import("../views/MiPerfil.vue"),
          meta: { requiresAuth: true },
        },
      ],
    },
    // ── Rutas Globales ──────────────────────────────────────────────
    {
      path: "/perfil",
      name: "perfil",
      component: () => import("../views/MiPerfil.vue"),
      meta: { requiresAuth: true },
    },
    // ── Invitaciones (ruta pública) ─────────────────────────────────
    {
      path: "/invitacion/:token",
      name: "accept-invitation",
      component: () => import("../views/AcceptInvitation.vue"),
      meta: { requiresAuth: false, public: true },
    },
  ],
});

router.beforeEach((to, _from) => {
  const auth = useAuthStore();

  // Rutas marcadas como públicas pasan siempre (ej. aceptar invitación)
  if (to.meta.public) return true;

  // Si requiere auth y no está autenticado, al login
  if (to.meta.requiresAuth && !auth.isAuthenticated) {
    return "/login";
  }

  // Redirección inteligente al loguearse o intentar ir a rutas raíz/obsoletas
  const legacyPaths = ["/", "/login", "/admin", "/portal"];
  if (auth.isAuthenticated && legacyPaths.includes(to.path)) {
    return auth.homePath;
  }

  // Validación de roles
  if (to.meta.role) {
    const isAllowed =
      auth.user?.rol === to.meta.role ||
      (to.meta.role === "admin" && auth.user?.rol === "super-admin");

    if (!isAllowed) {
      if (auth.user?.rol === "super-admin") return "/super-admin/dashboard";

      const tenantSlug = auth.sessionTenantSlug;
      if (!tenantSlug) return "/login";

      if (auth.user?.rol === "admin") return `/agencia/${tenantSlug}/admin`;
      return `/agencia/${tenantSlug}/portal`;
    }
  }

  if (auth.isAuthenticated && auth.user?.rol !== "super-admin" && to.params.tenant) {
    const routeTenant = String(to.params.tenant);
    const sessionTenant = auth.sessionTenantSlug;

    if (sessionTenant && routeTenant !== sessionTenant) {
      return to.fullPath.replace(`/agencia/${routeTenant}`, `/agencia/${sessionTenant}`);
    }
  }

  return true;
});

export default router;
