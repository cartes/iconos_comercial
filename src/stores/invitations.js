import { defineStore } from "pinia";
import { apiRequest } from "@/api/service";
import axios from "axios";

const API_BASE = "https://apiiconos-production.up.railway.app/api";

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

    /** Public: verify a token — uses direct axios call (no tenant prefix needed). */
    async verifyToken(token) {
      try {
        const res = await axios.get(`${API_BASE}/invitar/${token}`, {
          headers: { Accept: "application/json" },
        });
        return res.data;
      } catch (error) {
        const data = error.response?.data;
        return {
          success: false,
          error: data?.error || "La invitación no es válida o ha expirado.",
        };
      }
    },

    /** Public: accept an invitation — uses direct axios call (no tenant prefix needed). */
    async acceptInvitation(token, payload = {}) {
      try {
        const res = await axios.post(`${API_BASE}/invitar/${token}/aceptar`, payload, {
          headers: { Accept: "application/json", "Content-Type": "application/json" },
        });
        return res.data;
      } catch (error) {
        const status = error.response?.status;
        const data = error.response?.data;

        if (status === 422 && data?.errors) {
          const firstField = Object.values(data.errors)[0];
          const firstMsg = Array.isArray(firstField) ? firstField[0] : firstField;
          return { success: false, error: firstMsg, errors: data.errors };
        }

        return {
          success: false,
          error: data?.error || "Error al procesar la invitación.",
        };
      }
    },
  },
});
