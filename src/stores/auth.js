import { defineStore } from "pinia";
import { apiRequest } from "@/api/service";
import {
  clearStoredSession,
  getStoredTenantName,
  getStoredTenantSlug,
  getStoredToken,
  getStoredUser,
  persistSession,
  setStoredTenantName,
  setStoredTenantSlug,
  setStoredUser,
} from "@/api/session";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    user: getStoredUser(),
    tenantSlug: getStoredTenantSlug(),
    tenantName: getStoredTenantName(),
    isAuthenticated: !!getStoredToken(),
    loading: false,
    error: null,
  }),

  getters: {
    sessionTenantSlug: (state) => state.tenantSlug || state.user?.tenant_slug || state.user?.tenantId || null,
    homePath: (state) => {
      if (!state.user) return "/login";
      if (state.user?.rol === "super-admin") return "/super-admin/dashboard";

      const slug = state.tenantSlug || state.user?.tenant_slug || state.user?.tenantId;
      if (!slug) return "/login";

      if (state.user?.rol === "admin") {
        return `/agencia/${slug}/admin`;
      }
      return `/agencia/${slug}/portal`;
    },
  },

  actions: {
    async login(email, clave) {
      this.loading = true;
      this.error = null;
      try {
        const res = await apiRequest("login", { method: "POST", data: { email, clave } });

        if (res.success) {
          const userData = {
            email: res.usuario.email,
            nombre: res.usuario.nombre,
            rol: res.usuario.rol,
            empresa: res.usuario.empresaNombre || res.usuario.empresa,
            empresaId: res.usuario.empresaId,
            tenantId: res.usuario.tenantId,
            tenant_slug: res.usuario.tenant_slug,
            puedeEliminar: res.usuario.puedeEliminar !== false,
          };

          this.user = userData;
          this.tenantSlug = userData.tenant_slug || userData.tenantId || null;
          this.isAuthenticated = true;
          persistSession({ user: userData, token: res.token, tenantSlug: this.tenantSlug });

          // Las llamadas autenticadas de tenant siempre toman este slug persistido.
          if (userData.rol !== "super-admin" && this.tenantSlug) {
            await this.fetchTenantInfo();
          } else {
            this.tenantName = null;
            setStoredTenantName(null);
          }

          return { success: true };
        }

        this.error = res.error || "Credenciales inválidas";
        return { success: false, error: this.error, debug: res.debug };
      } finally {
        this.loading = false;
      }
    },

    clearSession() {
      this.user = null;
      this.tenantSlug = null;
      this.tenantName = null;
      this.isAuthenticated = false;
      clearStoredSession();
    },

    logout() {
      const authToken = getStoredToken();
      if (authToken) {
        apiRequest("logout", { method: "POST", authToken }).catch(() => {});
      }

      this.clearSession();
    },

    async fetchTenantInfo() {
      if (this.user?.rol === "super-admin" || !this.sessionTenantSlug) {
        this.tenantName = null;
        setStoredTenantName(null);
        return;
      }
      
      try {
        const res = await apiRequest("tenant-info");
        if (res.success) {
          this.tenantName = res.nombre;
          setStoredTenantName(res.nombre);
        }
      } catch (e) {
        console.error("Error al obtener info del tenant:", e);
      }
    },

    actualizarPerfil(usuario) {
      const updated = { ...this.user, ...usuario };
      this.user = updated;
      this.tenantSlug = updated.tenant_slug || this.tenantSlug;
      setStoredUser(updated);
      setStoredTenantSlug(this.tenantSlug);
    },

    async checkBootstrap() {
      const res = await apiRequest("estado");
      return res;
    },
  },
});
