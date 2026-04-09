import axios from "axios";
import { useAuthStore } from "@/stores/auth";
import { getStoredTenantSlug, getStoredToken, getStoredUser } from "@/api/session";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "https://apiiconos-production.up.railway.app/api";

const CENTRAL_ROUTE_PREFIXES = ["estado", "primer-admin", "login", "invitar", "super-admin"];
const PUBLIC_ROUTE_PREFIXES = ["estado", "primer-admin", "login", "invitar"];
const DUPLICABLE_CONTEXT_PREFIXES = ["me", "logout", "cambiar-clave", "perfil", "tenant-info"];

function normalizeEndpoint(endpoint = "") {
  return String(endpoint).replace(/^\/+/, "");
}

function splitEndpoint(endpoint) {
  const normalized = normalizeEndpoint(endpoint);
  const [path, query = ""] = normalized.split("?");

  return {
    path,
    query: query ? `?${query}` : "",
  };
}

function startsWithPrefix(path, prefixes) {
  return prefixes.some((prefix) => path === prefix || path.startsWith(`${prefix}/`));
}

function isAlreadyTenantPrefixed(path, tenantSlug) {
  return Boolean(
    tenantSlug &&
      (path === tenantSlug ||
        path.startsWith(`${tenantSlug}/`) ||
        path.startsWith(`${tenantSlug}?`)),
  );
}

function resolveTenantSlug() {
  return getStoredTenantSlug();
}

function resolveRequestPath(endpoint, authToken) {
  const { path, query } = splitEndpoint(endpoint);
  const user = getStoredUser();
  const tenantSlug = resolveTenantSlug();
  const isSuperAdmin = user?.rol === "super-admin";
  const isCentralRoute = startsWithPrefix(path, CENTRAL_ROUTE_PREFIXES);

  if (isAlreadyTenantPrefixed(path, tenantSlug)) {
    return { path: `/${path}${query}`, isPublic: startsWithPrefix(path, PUBLIC_ROUTE_PREFIXES) };
  }

  if (isCentralRoute) {
    return { path: `/${path}${query}`, isPublic: startsWithPrefix(path, PUBLIC_ROUTE_PREFIXES) };
  }

  if (tenantSlug) {
    return { path: `/${tenantSlug}/${path}${query}`, isPublic: false };
  }

  if (isSuperAdmin || startsWithPrefix(path, DUPLICABLE_CONTEXT_PREFIXES)) {
    return { path: `/${path}${query}`, isPublic: false };
  }

  if (!authToken) {
    return { path: `/${path}${query}`, isPublic: false };
  }

  return {
    error: "No se pudo resolver el tenant de la sesión para construir la ruta de la API.",
  };
}

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// Centraliza auth y prefijo tenant. Ningún cliente debe enviar X-Tenant.
api.interceptors.request.use(
  (config) => {
    const token = config.authToken ?? getStoredToken();
    const resolvedPath = resolveRequestPath(config.url, token);

    if (resolvedPath.error) {
      return Promise.reject(new Error(resolvedPath.error));
    }

    if (token && !resolvedPath.isPublic && !config.skipAuth) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }

    delete config.headers["X-Tenant"];
    config.url = resolvedPath.path;

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

    // Ignorar 401 del propio endpoint de login y logout (para evitar bucles infinitos)
    if (status === 401 && !requestUrl.includes("login") && !requestUrl.includes("logout")) {
      const authStore = useAuthStore();
      authStore.clearSession();
      window.location.hash = "#/login";
    }

    return Promise.reject(error);
  },
);

// Mantenemos la función original para no romper ninguna llamada en otras partes del código
export const apiRequest = async (endpoint, options = {}) => {
  try {
    const authToken = options.authToken ?? getStoredToken();
    const resolvedPath = resolveRequestPath(endpoint, authToken);

    if (resolvedPath.error) {
      return {
        success: false,
        error: resolvedPath.error,
      };
    }

    const config = {
      method: options.method || "GET",
      url: endpoint,
      headers: options.headers || {},
      data: options.data,
      authToken,
      skipAuth: options.skipAuth ?? resolvedPath.isPublic,
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
      const requestUrl = error.config ? `${API_BASE_URL}${error.config.url || ""}` : endpoint;
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
        url: error.config?.url ? `${API_BASE_URL}${error.config.url}` : `${API_BASE_URL}/${normalizeEndpoint(endpoint)}`,
        responseData: data,
      },
    };
  }
};

// ── Dashboard de métricas ───────────────────────────────────────────
export const getDashboardStats = () => apiRequest("/dashboard");

export const trackIconClick = (iconId) => apiRequest(`/iconos/${iconId}/click`, { method: "POST" });
