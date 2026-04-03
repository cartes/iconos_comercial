import { apiRequest } from './service';

export const actualizarDatos = (data) =>
  apiRequest('/perfil', { method: 'PUT', data });

export const cambiarPassword = (data) =>
  apiRequest('/perfil/password', { method: 'PUT', data });

export const getSesiones = () =>
  apiRequest('/perfil/sesiones');

export const revocarSesion = (tokenId) =>
  apiRequest(`/perfil/sesiones/${tokenId}`, { method: 'DELETE' });

export const revocarOtrasSesiones = () =>
  apiRequest('/perfil/sesiones', { method: 'DELETE' });
