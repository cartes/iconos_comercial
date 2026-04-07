import { defineStore } from "pinia";
import { apiRequest } from "@/api/service";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    user: JSON.parse(localStorage.getItem("user")) || null,
    tenantName: localStorage.getItem("tenantName") || null,
    isAuthenticated: !!localStorage.getItem("user"),
    loading: false,
    error: null,
  }),

  actions: {
    async login(email, clave) {
      this.loading = true;
      this.error = null;

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
        this.isAuthenticated = true;
        localStorage.setItem("user", JSON.stringify(userData));
        localStorage.setItem("auth_token", res.token);
        
        // Cargar info del tenant inmediatamente tras el login (si no es super-admin)
        if (userData.rol !== 'super-admin') {
          await this.fetchTenantInfo();
        } else {
          this.tenantName = null;
          localStorage.removeItem("tenantName");
        }

        return { success: true };
      } else {
        this.error = res.error || "Credenciales inválidas";
        return { success: false, error: this.error, debug: res.debug };
      }
    },

    logout() {
      this.user = null;
      this.tenantName = null;
      this.isAuthenticated = false;
      localStorage.removeItem("user");
      localStorage.removeItem("tenantName");
      localStorage.removeItem("auth_token");
      apiRequest("logout", { method: "POST" }).catch(() => {});
    },

    async fetchTenantInfo() {
      if (this.user?.rol === 'super-admin') {
        this.tenantName = null;
        return;
      }
      
      try {
        const res = await apiRequest("tenant-info");
        if (res.success) {
          this.tenantName = res.nombre;
          localStorage.setItem("tenantName", res.nombre);
        }
      } catch (e) {
        console.error("Error al obtener info del tenant:", e);
      }
    },

    actualizarPerfil(usuario) {
      const updated = { ...this.user, ...usuario };
      this.user = updated;
      localStorage.setItem("user", JSON.stringify(updated));
    },

    async checkBootstrap() {
      const res = await apiRequest("estado");
      return res;
    },
  },
});
