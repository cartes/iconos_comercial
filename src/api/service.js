import axios from "axios";
import router from "@/router";
import { useAuthStore } from "@/stores/auth";

const API_BASE_URL = "https://apiiconos-production.up.railway.app/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// Interceptor de peticiones para agregar el token dinámico y el Tenant (slug) en la URL
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("auth_token");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }

    // Obtener el tenant desde los parámetros de la ruta activa de Vue Router
    const tenantSlug = router.currentRoute.value?.params?.tenant;

    // Si hay un tenant en la ruta y no es una ruta global omitida, lo inyectamos en la URL
    // Evitamos duplicar si ya viene en la URL o si es una ruta central
    const isGlobalRoute =
      config.url.startsWith("/login") || config.url.startsWith("login") ||
      config.url.startsWith("/estado") || config.url.startsWith("estado") ||
      config.url.startsWith("/super-admin") || config.url.startsWith("super-admin") ||
      config.url.startsWith("/me") || config.url.startsWith("me");

    if (tenantSlug && !isGlobalRoute && !config.url.includes(`/${tenantSlug}/`)) {
      // Limpiar slash inicial si existe para evitar doble slash
      const cleanUrl = config.url.startsWith("/") ? config.url.substring(1) : config.url;
      config.url = `/${tenantSlug}/${cleanUrl}`;
    }

    return config;
  },
  (error) => Promise.reject(error),
);

// Interceptor de respuestas: captura 401 global para limpiar sesión y redirigir
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const requestUrl = error.config?.url || "";

    // Ignorar 401 del propio endpoint de login (credenciales incorrectas)
    if (status === 401 && !requestUrl.includes("login")) {
      const authStore = useAuthStore();
      authStore.logout();
      window.location.hash = "#/login";
    }

    return Promise.reject(error);
  },
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
