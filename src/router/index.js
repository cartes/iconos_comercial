import { createRouter, createWebHashHistory } from "vue-router";
import { useAuthStore } from "@/stores/auth";
import LoginView from "../views/LoginView.vue";

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/login",
      name: "login",
      component: LoginView,
    },
    {
      path: "/",
      redirect: "/login",
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
          path: "api-keys",
          name: "super-api-keys",
          component: () => import("../views/superadmin/ApiKeys.vue"),
        },
        {
          path: "seguridad",
          name: "super-seguridad",
          component: () => import("../views/superadmin/CambioPassword.vue"),
        },
      ],
    },
    // ── Admin de Tenant ─────────────────────────────────────────────
    {
      path: "/admin",
      name: "admin",
      component: () => import("../views/AdminDashboard.vue"),
      meta: { requiresAuth: true, role: "admin" },
    },
    {
      path: "/admin/explore/:id/:nombre",
      name: "admin-explore",
      component: () => import("../views/AdminExplorer.vue"),
      meta: { requiresAuth: true, role: "admin" },
    },
    {
      path: "/perfil",
      name: "perfil",
      component: () => import("../views/MiPerfil.vue"),
      meta: { requiresAuth: true },
    },
    {
      path: "/portal",
      name: "portal",
      component: () => import("../views/UserPortal.vue"),
      meta: { requiresAuth: true, role: "usuario" },
    },
  ],
});

router.beforeEach((to, _from) => {
  const auth = useAuthStore();

  if (to.meta.requiresAuth && !auth.isAuthenticated) {
    return "/login";
  } else if (to.path === "/login" && auth.isAuthenticated) {
    if (auth.user.rol === "super-admin") {
      return "/super-admin/dashboard";
    } else if (auth.user.rol === "admin") {
      return "/admin";
    } else {
      return "/portal";
    }
  } else if (to.meta.role) {
    const isAllowed =
      auth.user?.rol === to.meta.role ||
      (to.meta.role === "admin" && auth.user?.rol === "super-admin");

    if (!isAllowed) {
      if (auth.user?.rol === "super-admin") return "/super-admin/dashboard";
      if (auth.user?.rol === "admin") return "/admin";
      return "/portal";
    }
  }

  return true;
});

export default router;
