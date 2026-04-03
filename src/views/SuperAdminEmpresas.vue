<template>
  <div class="legacy-body">
    <div class="legacy-container">
      <header class="legacy-header">
        <h1>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="24" height="24">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          </svg>
          Super Admin
          <span class="super-badge">Panel Global</span>
        </h1>
        <div class="legacy-header-actions">
          <button @click="toggleTheme" class="icon-btn theme-btn header-btn-icon"
            :title="isDark ? 'Modo Claro' : 'Modo Oscuro'">
            <svg v-if="isDark" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="20" height="20">
              <circle cx="12" cy="12" r="5" />
              <line x1="12" y1="1" x2="12" y2="3" /><line x1="12" y1="21" x2="12" y2="23" />
              <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" /><line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
              <line x1="1" y1="12" x2="3" y2="12" /><line x1="21" y1="12" x2="23" y2="12" />
              <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" /><line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
            </svg>
            <svg v-else viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="20" height="20">
              <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
            </svg>
          </button>
          <span class="user-info-text">Hola, {{ authStore.user?.email || 'Super Admin' }}</span>
          <button class="btn btn-cambiar-clave header-btn-icon" @click="showCambiarClave = true" title="Cambiar contraseña">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="18" height="18">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
              <path d="M7 11V7a5 5 0 0110 0v4"/>
            </svg>
          </button>
          <button class="btn btn-primary logout-btn-legacy" @click="logout" title="Cerrar Sesión">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="18" height="18">
              <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9" />
            </svg>
            Salir
          </button>
        </div>
      </header>

      <main class="legacy-content">
        <!-- Registrar nueva agencia -->
        <div class="section-header">
          <h2>Registrar Nueva Agencia</h2>
        </div>
        <div class="form-card">
          <form @submit.prevent="registrarTenant" class="register-form">
            <div class="form-group">
              <label class="label">Nombre Comercial</label>
              <input
                v-model="nuevoTenant.nombre"
                type="text"
                class="form-input"
                placeholder="Ej: Agencia Creativa"
                required
                :disabled="cargando"
              >
            </div>
            <div class="form-group">
              <label class="label">Dominio</label>
              <input
                v-model="nuevoTenant.dominio"
                type="text"
                class="form-input"
                placeholder="agencia.com"
                required
                :disabled="cargando"
              >
            </div>
            <div class="form-group form-group-action">
              <button type="submit" class="btn btn-success" :disabled="cargando">
                <span v-if="cargando" class="spinner-small"></span>
                <svg v-else viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16">
                  <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
                </svg>
                Registrar Agencia
              </button>
            </div>
          </form>
        </div>

        <!-- Listado de tenants -->
        <div class="section-header" style="margin-top: 30px;">
          <h2>Agencias Registradas</h2>
          <button @click="fetchTenants" class="btn btn-outline" :disabled="cargando">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="15" height="15">
              <polyline points="23 4 23 10 17 10" /><polyline points="1 20 1 14 7 14" />
              <path d="M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15" />
            </svg>
            Actualizar
          </button>
        </div>

        <div v-if="cargando" class="loading-container">
          <span class="spinner-large"></span>
          <p>Cargando agencias...</p>
        </div>

        <div v-else class="table-responsive">
          <table class="data-table">
            <thead>
              <tr>
                <th>Nombre</th>
                <th>ID / Slug</th>
                <th>Dominio</th>
                <th>Estado</th>
                <th style="text-align: right;">Acciones</th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="tenants.length === 0">
                <td colspan="5" class="empty-row">No hay agencias registradas.</td>
              </tr>
              <tr v-for="tenant in tenants" :key="tenant.id">
                <td>
                  <div class="entity-name">
                    <span class="avatar">{{ (tenant.nombre || tenant.id)?.charAt(0)?.toUpperCase() || '?' }}</span>
                    {{ tenant.nombre || '(sin nombre)' }}
                  </div>
                </td>
                <td class="id-cell">{{ tenant.id }}</td>
                <td class="id-cell">{{ tenant.dominio || '—' }}</td>
                <td>
                  <span :class="['badge', tenant.estado === 'suspendido' ? 'badge-suspendido' : 'badge-activo']">
                    {{ tenant.estado || 'activo' }}
                  </span>
                </td>
                <td style="text-align: right;">
                  <button
                    v-if="tenant.estado !== 'suspendido'"
                    @click="suspenderTenant(tenant.id)"
                    class="btn btn-delete btn-sm"
                    :disabled="cargando"
                    title="Suspender agencia"
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14">
                      <circle cx="12" cy="12" r="10" /><line x1="4.93" y1="4.93" x2="19.07" y2="19.07" />
                    </svg>
                    Suspender
                  </button>
                  <button
                    v-else
                    @click="activarTenant(tenant.id)"
                    class="btn btn-activar btn-sm"
                    :disabled="cargando"
                    title="Reactivar agencia"
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    Activar
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </main>
    </div>

    <!-- Modal Cambiar Contraseña -->
    <Transition name="modal">
      <div v-if="showCambiarClave" class="modal-overlay" @click.self="cerrarCambiarClave">
        <div class="modal-box">
          <div class="modal-header">
            <h3>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="20" height="20">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                <path d="M7 11V7a5 5 0 0110 0v4"/>
              </svg>
              Cambiar Contraseña
            </h3>
            <button class="modal-close" @click="cerrarCambiarClave">✕</button>
          </div>
          <form @submit.prevent="cambiarClave" class="modal-form">
            <div class="form-group">
              <label class="label">Contraseña actual</label>
              <input v-model="claveForm.actual" type="password" class="form-input" placeholder="••••••••" required :disabled="guardando">
            </div>
            <div class="form-group">
              <label class="label">Nueva contraseña</label>
              <input v-model="claveForm.nueva" type="password" class="form-input" placeholder="Mínimo 8 caracteres" required minlength="8" :disabled="guardando">
            </div>
            <div class="form-group">
              <label class="label">Confirmar nueva contraseña</label>
              <input v-model="claveForm.confirmar" type="password" class="form-input" placeholder="Repite la nueva contraseña" required :disabled="guardando">
            </div>
            <p v-if="claveError" class="clave-error">{{ claveError }}</p>
            <p v-if="claveExito" class="clave-exito">{{ claveExito }}</p>
            <div class="modal-actions">
              <button type="button" class="btn btn-outline" @click="cerrarCambiarClave" :disabled="guardando">Cancelar</button>
              <button type="submit" class="btn btn-success" :disabled="guardando">
                <span v-if="guardando" class="spinner-small"></span>
                Guardar cambios
              </button>
            </div>
          </form>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { apiRequest } from '@/api/service';
import { useAuthStore } from '@/stores/auth';

const router = useRouter();
const authStore = useAuthStore();

const tenants = ref([]);
const cargando = ref(false);
const nuevoTenant = reactive({ nombre: '', dominio: '' });
const isDark = ref(false);
const showCambiarClave = ref(false);
const guardando = ref(false);
const claveError = ref('');
const claveExito = ref('');
const claveForm = reactive({ actual: '', nueva: '', confirmar: '' });

const cerrarCambiarClave = () => {
  showCambiarClave.value = false;
  claveError.value = '';
  claveExito.value = '';
  Object.assign(claveForm, { actual: '', nueva: '', confirmar: '' });
};

const cambiarClave = async () => {
  claveError.value = '';
  claveExito.value = '';
  if (claveForm.nueva !== claveForm.confirmar) {
    claveError.value = 'Las contraseñas nuevas no coinciden.';
    return;
  }
  guardando.value = true;
  try {
    const res = await apiRequest('cambiar-clave', {
      method: 'POST',
      data: { clave: claveForm.actual, nuevaClave: claveForm.nueva }
    });
    if (res.success) {
      claveExito.value = '✓ Contraseña actualizada correctamente.';
      setTimeout(cerrarCambiarClave, 1800);
    } else {
      claveError.value = res.error || 'No se pudo actualizar la contraseña.';
    }
  } catch (err) {
    claveError.value = 'Error de red. Intenta nuevamente.';
  } finally {
    guardando.value = false;
  }
};

const toggleTheme = () => {
  isDark.value = !isDark.value;
  if (isDark.value) {
    document.documentElement.classList.add('dark');
    localStorage.setItem('theme', 'dark');
  } else {
    document.documentElement.classList.remove('dark');
    localStorage.setItem('theme', 'light');
  }
};

const logout = () => {
  authStore.logout();
  router.push('/login');
};

const fetchTenants = async () => {
  cargando.value = true;
  try {
    const res = await apiRequest('super-admin/tenants', { method: 'GET' });
    if (Array.isArray(res)) {
      tenants.value = res;
    } else if (res.success !== false) {
      tenants.value = res.data || res.tenants || [];
    } else {
      alert(`Error: ${res.error || 'No se pudo obtener el listado'}`);
    }
  } catch (err) {
    console.error(err);
    alert('Error crítico de red al obtener agencias');
  } finally {
    cargando.value = false;
  }
};

const registrarTenant = async () => {
  cargando.value = true;
  try {
    const res = await apiRequest('super-admin/tenants', {
      method: 'POST',
      data: { nombre: nuevoTenant.nombre, dominio: nuevoTenant.dominio }
    });
    if (res.success) {
      nuevoTenant.nombre = '';
      nuevoTenant.dominio = '';
      await fetchTenants();
    } else {
      alert(`Error al registrar: ${res.error || 'Datos inválidos'}`);
    }
  } catch (err) {
    console.error(err);
    alert('Fallo la conexión con el servidor');
  } finally {
    cargando.value = false;
  }
};

const suspenderTenant = async (id) => {
  if (!confirm('¿Está seguro de que desea suspender esta agencia?')) return;
  cargando.value = true;
  try {
    const res = await apiRequest(`super-admin/tenants/${id}/suspender`, { method: 'POST' });
    if (res.success) {
      await fetchTenants();
    } else {
      alert(`Error: ${res.error || 'No se pudo suspender la agencia'}`);
    }
  } catch (err) {
    console.error(err);
    alert('Error al procesar la suspensión');
  } finally {
    cargando.value = false;
  }
};

const activarTenant = async (id) => {
  if (!confirm('¿Reactivar esta agencia?')) return;
  cargando.value = true;
  try {
    const res = await apiRequest(`super-admin/tenants/${id}/activar`, { method: 'POST' });
    if (res.success) {
      await fetchTenants();
    } else {
      alert(`Error: ${res.error || 'No se pudo activar la agencia'}`);
    }
  } catch (err) {
    console.error(err);
  } finally {
    cargando.value = false;
  }
};

onMounted(() => {
  const savedTheme = localStorage.getItem('theme');
  isDark.value = savedTheme === 'dark';
  if (isDark.value) document.documentElement.classList.add('dark');
  fetchTenants();
});
</script>

<style scoped>
.legacy-body {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  min-height: 100vh;
  padding: 20px;
  display: flex;
  justify-content: center;
  align-items: flex-start;
}

.legacy-container {
  max-width: 1200px;
  width: 100%;
  margin: 0 auto;
  background: white;
  border-radius: 15px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  min-height: calc(100vh - 40px);
}

:global(.dark) .legacy-container {
  background: #1e1e2d !important;
}

.legacy-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 20px 30px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-shrink: 0;
}

.legacy-header h1 {
  font-size: 24px;
  display: flex;
  align-items: center;
  gap: 12px;
  margin: 0;
  color: white;
}

.super-badge {
  font-size: 11px;
  font-weight: 700;
  background: rgba(255, 255, 255, 0.25);
  border: 1px solid rgba(255, 255, 255, 0.4);
  padding: 3px 10px;
  border-radius: 20px;
  letter-spacing: 0.05em;
  text-transform: uppercase;
}

.legacy-header-actions {
  display: flex;
  gap: 15px;
  align-items: center;
}

.user-info-text {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 500;
}

.header-btn-icon {
  background: none;
  border: none;
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 8px;
  border-radius: 8px;
  transition: background 0.2s;
}

.header-btn-icon:hover {
  background: rgba(255, 255, 255, 0.15);
}

.btn-primary.logout-btn-legacy {
  background: #fff;
  color: #667eea;
  padding: 10px 20px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 600;
  transition: all 0.3s;
  display: flex;
  align-items: center;
  gap: 8px;
}

.btn-primary.logout-btn-legacy:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
}

.legacy-content {
  padding: 30px;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.section-header h2 {
  font-size: 20px;
  font-weight: 700;
  color: #333;
  margin: 0;
}

:global(.dark) .section-header h2 {
  color: #fff;
}

.form-card {
  background: #f8f9fa;
  border-radius: 12px;
  padding: 24px;
  border: 1px solid #e0e0e0;
}

:global(.dark) .form-card {
  background: #2a2a3e;
  border-color: #3a3a5c;
}

.register-form {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  align-items: flex-end;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
  flex: 1;
  min-width: 180px;
}

.form-group-action {
  flex: 0 0 auto;
}

.label {
  font-size: 13px;
  font-weight: 600;
  color: #555;
}

:global(.dark) .label {
  color: #ccc;
}

.form-input {
  padding: 10px 14px;
  border: 1px solid #d0d0d0;
  border-radius: 8px;
  font-size: 14px;
  color: #333;
  background: white;
  transition: border-color 0.2s, box-shadow 0.2s;
  outline: none;
}

.form-input:focus {
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.15);
}

.form-input:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

:global(.dark) .form-input {
  background: #1e1e2d;
  border-color: #3a3a5c;
  color: #fff;
}

.input-with-suffix {
  display: flex;
  align-items: center;
  border: 1px solid #d0d0d0;
  border-radius: 8px;
  overflow: hidden;
  background: white;
  transition: border-color 0.2s, box-shadow 0.2s;
}

.input-with-suffix:focus-within {
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.15);
}

.input-with-suffix .form-input {
  border: none;
  border-radius: 0;
  flex: 1;
  box-shadow: none;
}

.input-with-suffix .form-input:focus {
  box-shadow: none;
}

:global(.dark) .input-with-suffix {
  background: #1e1e2d;
  border-color: #3a3a5c;
}

.input-suffix {
  padding: 10px 12px;
  background: #f0f0f0;
  color: #777;
  font-size: 13px;
  font-weight: 500;
  white-space: nowrap;
  flex-shrink: 0;
}

:global(.dark) .input-suffix {
  background: #2a2a3e;
  color: #999;
}

/* BUTTONS */
.btn {
  padding: 10px 20px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 600;
  transition: all 0.3s;
  display: flex;
  align-items: center;
  gap: 8px;
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none !important;
}

.btn-success {
  background: #28a745;
  color: white;
}

.btn-success:hover:not(:disabled) {
  background: #218838;
  transform: translateY(-1px);
}

.btn-outline {
  background: transparent;
  color: #667eea;
  border: 1.5px solid #667eea;
}

.btn-outline:hover:not(:disabled) {
  background: #667eea;
  color: white;
}

:global(.dark) .btn-outline {
  color: #a78bfa;
  border-color: #a78bfa;
}

:global(.dark) .btn-outline:hover:not(:disabled) {
  background: #a78bfa;
  color: #1e1e2d;
}

.btn-activar {
  background-color: transparent;
  color: #28a745;
  border: 1px solid #28a745;
  padding: 6px 12px;
  font-size: 13px;
}

.btn-activar:hover:not(:disabled) {
  background-color: #28a745;
  color: white;
}

.btn-delete {
  background-color: transparent;
  color: #ef4444;
  border: 1px solid #ef4444;
  padding: 6px 12px;
  font-size: 13px;
}

.btn-delete:hover:not(:disabled) {
  background-color: #ef4444;
  color: white;
}

.btn-sm {
  padding: 6px 14px;
  font-size: 13px;
}

/* TABLE */
.table-responsive {
  overflow-x: auto;
  border-radius: 10px;
  flex-grow: 1;
}

.data-table {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
  background: white;
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  overflow: hidden;
}

:global(.dark) .data-table {
  background: #2a2a3e;
}

.data-table th {
  padding: 14px 16px;
  text-align: left;
  font-weight: 700;
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: #555;
  background: #f8f9fa;
  border-bottom: 2px solid #e0e0e0;
}

:global(.dark) .data-table th {
  background: #1e1e2d;
  color: #aaa;
  border-bottom-color: #3a3a5c;
}

.data-table td {
  padding: 14px 16px;
  border-bottom: 1px solid #e8e8e8;
  vertical-align: middle;
  color: #333;
}

:global(.dark) .data-table td {
  border-bottom-color: #3a3a5c;
  color: #ddd;
}

.data-table tr:last-child td {
  border-bottom: none;
}

.data-table tbody tr:hover td {
  background: #f9f9ff;
}

:global(.dark) .data-table tbody tr:hover td {
  background: #252538;
}

.entity-name {
  display: flex;
  align-items: center;
  gap: 10px;
  font-weight: 500;
}

.avatar {
  width: 34px;
  height: 34px;
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 14px;
  flex-shrink: 0;
  text-transform: uppercase;
}

.id-cell {
  font-family: SFMono-Regular, Menlo, Monaco, Consolas, "Courier New", monospace;
  font-size: 13px;
  color: #666;
}

:global(.dark) .id-cell {
  color: #aaa;
}

.badge {
  display: inline-block;
  padding: 5px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
}

.badge-activo {
  background: #d4edda;
  color: #155724;
}

.badge-suspendido {
  background: #f8d7da;
  color: #721c24;
}

.empty-row {
  text-align: center;
  padding: 40px !important;
  color: #999;
  font-style: italic;
}

/* LOADING */
.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px;
  color: #999;
  gap: 12px;
}

.spinner-large {
  display: inline-block;
  width: 36px;
  height: 36px;
  border: 4px solid rgba(102, 126, 234, 0.2);
  border-top-color: #667eea;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

.spinner-small {
  display: inline-block;
  width: 16px;
  height: 16px;
  border: 2px solid rgba(255, 255, 255, 0.4);
  border-top-color: white;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* Responsive */
@media (max-width: 600px) {
  .legacy-header {
    flex-direction: column;
    gap: 14px;
    align-items: flex-start;
  }

  .legacy-content {
    padding: 16px;
  }

  .register-form {
    flex-direction: column;
  }

  .form-group-action {
    width: 100%;
  }

  .form-group-action .btn {
    width: 100%;
    justify-content: center;
  }

  .user-info-text {
    display: none;
  }
}

/* MODAL */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.55);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
}

.modal-box {
  background: white;
  border-radius: 14px;
  padding: 28px;
  width: 100%;
  max-width: 440px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
}

:global(.dark) .modal-box {
  background: #1e1e2d;
  color: #fff;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 22px;
}

.modal-header h3 {
  font-size: 18px;
  font-weight: 700;
  color: #333;
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 0;
}

:global(.dark) .modal-header h3 {
  color: #fff;
}

.modal-close {
  background: none;
  border: none;
  font-size: 18px;
  cursor: pointer;
  color: #999;
  line-height: 1;
  padding: 4px 8px;
  border-radius: 6px;
  transition: background 0.2s;
}

.modal-close:hover {
  background: #f0f0f0;
  color: #333;
}

:global(.dark) .modal-close:hover {
  background: #2a2a3e;
  color: #fff;
}

.modal-form {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.modal-actions {
  display: flex;
  gap: 10px;
  justify-content: flex-end;
  margin-top: 6px;
}

.clave-error {
  color: #dc3545;
  font-size: 13px;
  margin: 0;
  background: #fff5f5;
  border: 1px solid #f5c6cb;
  border-radius: 6px;
  padding: 8px 12px;
}

.clave-exito {
  color: #155724;
  font-size: 13px;
  margin: 0;
  background: #d4edda;
  border: 1px solid #c3e6cb;
  border-radius: 6px;
  padding: 8px 12px;
}

.btn-cambiar-clave {
  color: white;
}

/* Transitions */
.modal-enter-active, .modal-leave-active {
  transition: opacity 0.2s ease;
}

.modal-enter-from, .modal-leave-to {
  opacity: 0;
}

.modal-enter-active .modal-box, .modal-leave-active .modal-box {
  transition: transform 0.2s ease;
}

.modal-enter-from .modal-box {
  transform: scale(0.95) translateY(-10px);
}

.modal-leave-to .modal-box {
  transform: scale(0.95) translateY(-10px);
}
</style>
