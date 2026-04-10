import { apiRequest } from "@/api/service";

/**
 * Registra una nueva agencia (Tenant) junto con su usuario administrador.
 *
 * @param {{ nombre: string, email: string, password?: string, telefono?: string }} payload
 * @returns {Promise<{ success: boolean, agencia?: object, usuario?: object, password?: string, error?: string, errors?: object }>}
 */
export const registerAgencia = (payload) =>
  apiRequest("registrar-agencia", {
    method: "POST",
    data: payload,
    skipAuth: true,
  });
