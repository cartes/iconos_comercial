const STORAGE_KEYS = {
  user: "user",
  token: "auth_token",
  tenantSlug: "tenant_slug",
  tenantName: "tenantName",
};

function safeParse(value) {
  if (!value) return null;

  try {
    return JSON.parse(value);
  } catch {
    return null;
  }
}

function normalizeTenantSlug(value) {
  return typeof value === "string" && value.trim() ? value.trim() : null;
}

export function getStoredUser() {
  return safeParse(localStorage.getItem(STORAGE_KEYS.user));
}

export function setStoredUser(user) {
  if (user) {
    localStorage.setItem(STORAGE_KEYS.user, JSON.stringify(user));
    return;
  }

  localStorage.removeItem(STORAGE_KEYS.user);
}

export function getStoredToken() {
  return localStorage.getItem(STORAGE_KEYS.token);
}

export function setStoredToken(token) {
  if (token) {
    localStorage.setItem(STORAGE_KEYS.token, token);
    return;
  }

  localStorage.removeItem(STORAGE_KEYS.token);
}

export function getStoredTenantSlug() {
  const explicitSlug = normalizeTenantSlug(localStorage.getItem(STORAGE_KEYS.tenantSlug));
  if (explicitSlug) return explicitSlug;

  const user = getStoredUser();
  return normalizeTenantSlug(user?.tenant_slug);
}

export function setStoredTenantSlug(tenantSlug) {
  const normalized = normalizeTenantSlug(tenantSlug);

  if (normalized) {
    localStorage.setItem(STORAGE_KEYS.tenantSlug, normalized);
    return;
  }

  localStorage.removeItem(STORAGE_KEYS.tenantSlug);
}

export function getStoredTenantName() {
  return localStorage.getItem(STORAGE_KEYS.tenantName);
}

export function setStoredTenantName(tenantName) {
  if (tenantName) {
    localStorage.setItem(STORAGE_KEYS.tenantName, tenantName);
    return;
  }

  localStorage.removeItem(STORAGE_KEYS.tenantName);
}

export function persistSession({ user, token, tenantSlug }) {
  setStoredUser(user);
  setStoredToken(token);
  setStoredTenantSlug(tenantSlug ?? user?.tenant_slug);
}

export function clearStoredSession() {
  setStoredUser(null);
  setStoredToken(null);
  setStoredTenantSlug(null);
  setStoredTenantName(null);
}
