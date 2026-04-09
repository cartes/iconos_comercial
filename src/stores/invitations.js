import { defineStore } from "pinia";
import { apiRequest } from "@/api/service";

export const useInvitationsStore = defineStore("invitations", {
  state: () => ({
    invitations: [],
    loading: false,
    sending: false,
    error: null,
  }),

  getters: {
    pendingInvitations: (state) =>
      state.invitations.filter((i) => i.status === "pending"),
    acceptedInvitations: (state) =>
      state.invitations.filter((i) => i.status === "accepted"),
  },

  actions: {
    async fetchInvitations() {
      this.loading = true;
      this.error = null;
      try {
        const res = await apiRequest("invitaciones");
        if (res.success) {
          this.invitations = res.invitaciones || [];
        } else {
          this.error = res.error || "Error al cargar las invitaciones.";
        }
      } finally {
        this.loading = false;
      }
    },

    async sendInvitation(email, rol) {
      this.sending = true;
      this.error = null;
      try {
        const res = await apiRequest("invitaciones", {
          method: "POST",
          data: { email, rol },
        });
        if (res.success) {
          await this.fetchInvitations();
          return { success: true, mensaje: res.mensaje };
        }
        return { success: false, error: res.error };
      } finally {
        this.sending = false;
      }
    },

    async cancelInvitation(id) {
      const res = await apiRequest(`invitaciones/${id}`, { method: "DELETE" });
      if (res.success) {
        this.invitations = this.invitations.filter((i) => i.id !== id);
      }
      return res;
    },

    /** Public: verify a token through the central API route. */
    async verifyToken(token) {
      const res = await apiRequest(`invitar/${token}`, { skipAuth: true });

      if (res.success !== false) return res;

      return {
        success: false,
        error: res.error || "La invitación no es válida o ha expirado.",
      };
    },

    /** Public: accept an invitation through the central API route. */
    async acceptInvitation(token, payload = {}) {
      const res = await apiRequest(`invitar/${token}/aceptar`, {
        method: "POST",
        data: payload,
        skipAuth: true,
      });

      if (res.success !== false) return res;

      return {
        success: false,
        error: res.error || "Error al procesar la invitación.",
        errors: res.errors,
      };
    },
  },
});
