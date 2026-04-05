import axios from "axios";

const API_BASE_URL = "https://apiiconos-production.up.railway.app/api"; //import.meta.env.VITE_API_URL || "http://localhost:8004/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
    "X-Tenant": "2310c96f-5a4e-4bde-8062-839c495b332a", // <-- Inyección permanente del identificador de la agencia para cada petición
  },
});

// Interceptor de peticiones para agregar el token dinámico
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("auth_token");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// Mantenemos la función original para no romper ninguna llamada en otras partes del código
export const apiRequest = async (endpoint, options = {}) => {
  try {
    const config = {
      method: options.method || "GET",
      url: endpoint, // axios resuelve automáticamente con la baseURL
      headers: options.headers || {},
      data: options.data, // axios se encarga del JSON.stringify automáticamente
    };

    const response = await api(config);

    if (response.status === 204) {
      return { success: true };
    }

    // En Axios los datos ya vienen parseados como objeto JSON en `response.data`
    return response.data;
  } catch (error) {
    console.error(`API Request Error [${endpoint}]:`, error);

    const status = error.response ? error.response.status : null;
    const data = error.response ? error.response.data : null;

    // 401 — Sesión expirada
    if (status === 401 && endpoint !== "login") {
      localStorage.removeItem("user");
      localStorage.removeItem("auth_token");
      window.location.hash = "#/login";
      return { success: false, error: "Sesión expirada o token inválido" };
    }

    // 403 — Sin permisos
    if (status === 403) {
      return {
        success: false,
        error: "No tienes permisos para realizar esta acción.",
        forbidden: true,
      };
    }

    // 422 — Errores de validación de Laravel: propagar los errors por campo
    if (status === 422 && data?.errors) {
      const firstField = Object.values(data.errors)[0];
      const firstMsg = Array.isArray(firstField) ? firstField[0] : firstField;
      return {
        success: false,
        error: firstMsg || "Datos inválidos. Revisa los campos.",
        errors: data.errors,
      };
    }

    // Network Error (sin respuesta del servidor): CORS, server caído, sin conectividad
    if (!error.response) {
      const requestUrl = error.config ? `${API_BASE_URL}/${endpoint}` : endpoint;
      const networkDetail = [
        `Tipo: ${error.code || "ERR_NETWORK"}`,
        `Mensaje: ${error.message}`,
        `URL: ${requestUrl}`,
        error.config?.method ? `Método: ${error.config.method.toUpperCase()}` : null,
      ]
        .filter(Boolean)
        .join(" | ");

      return {
        success: false,
        error: `Sin respuesta del servidor — ${networkDetail}`,
        isNetworkError: true,
        debug: {
          code: error.code,
          message: error.message,
          url: requestUrl,
          method: error.config?.method,
        },
      };
    }

    const errorMessage =
      data?.error || data?.message || error.message || `Error del servidor (${status})`;

    return {
      success: false,
      error: errorMessage,
      debug: {
        status,
        url: `${API_BASE_URL}/${endpoint}`,
        responseData: data,
      },
    };
  }
};

// ── Dashboard de métricas ───────────────────────────────────────────
export const getDashboardStats = () => apiRequest("/dashboard");

export const trackIconClick = (iconId) => apiRequest(`/iconos/${iconId}/click`, { method: "POST" });
