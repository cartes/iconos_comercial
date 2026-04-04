<template>
  <div class="min-h-screen bg-grad-primary p-5 flex justify-center items-start">
    <div class="max-w-7xl w-full bg-white dark:bg-[#1e1e2d] rounded-2xl shadow-2xl overflow-hidden flex flex-col min-h-[calc(100vh-40px)] transition-colors duration-300">
      <!-- Header -->
      <header class="bg-grad-primary text-white p-5 md:p-7 flex flex-col md:flex-row justify-between items-center gap-4 shrink-0 transition-all">
        <h1 class="text-2xl font-bold flex items-center gap-3">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="28" height="28">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          </svg>
          Super Admin
          <span class="text-[11px] font-bold bg-white/25 border border-white/40 px-2.5 py-1 rounded-full uppercase tracking-wider">
            Panel Global
          </span>
        </h1>
        <div class="flex items-center gap-4">
          <button @click="toggleTheme" class="p-2 hover:bg-white/15 rounded-lg transition-colors"
            :title="isDark ? 'Modo Claro' : 'Modo Oscuro'">
            <svg v-if="isDark" class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="5" /><line x1="12" y1="1" x2="12" y2="3" /><line x1="12" y1="21" x2="12" y2="23" />
              <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" /><line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
              <line x1="1" y1="12" x2="3" y2="12" /><line x1="21" y1="12" x2="23" y2="12" />
              <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" /><line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
            </svg>
            <svg v-else class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
            </svg>
          </button>
          <span class="hidden sm:inline font-medium">Hola, {{ authStore.user?.email || 'Super Admin' }}</span>
          <button class="p-2 hover:bg-white/15 rounded-lg transition-colors" @click="showPerfil = true" title="Mi Perfil">
            <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
            </svg>
          </button>
          <button class="bg-white text-primary-600 px-5 py-2.5 rounded-lg font-bold text-sm shadow-md hover:-translate-y-0.5 hover:shadow-lg transition-all flex items-center gap-2" @click="logout" title="Cerrar Sesión">
            <svg class="w-[18px] h-[18px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9" />
            </svg>
            Salir
          </button>
        </div>
      </header>

      <main class="p-5 md:p-8 flex-grow flex flex-col gap-8">
        <!-- Registrar nueva agencia -->
        <section>
          <h2 class="text-xl font-bold text-slate-800 dark:text-white mb-4">Registrar Nueva Agencia</h2>
          <div class="bg-slate-50 dark:bg-slate-800/50 p-6 border border-slate-200 dark:border-slate-800 rounded-xl">
            <form @submit.prevent="registrarTenant" class="flex flex-wrap items-end gap-4">
              <div class="flex-1 min-w-[200px] flex flex-col gap-1.5">
                <label class="text-xs font-bold text-slate-500 dark:text-slate-400">Nombre Comercial *</label>
                <input v-model="nuevoTenant.nombre" type="text" placeholder="Ej: Content 360" required :disabled="cargando"
                  class="w-full px-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-sm transition-all focus:ring-2 focus:ring-primary-500/15 focus:border-primary-500 outline-none disabled:opacity-60" />
              </div>
              <div class="flex-1 min-w-[200px] flex flex-col gap-1.5">
                <label class="text-xs font-bold text-slate-500 dark:text-slate-400">Dominio *</label>
                <input v-model="nuevoTenant.dominio" type="text" placeholder="content360.com" required :disabled="cargando"
                  class="w-full px-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-sm transition-all focus:ring-2 focus:ring-primary-500/15 focus:border-primary-500 outline-none disabled:opacity-60" />
              </div>
              <div class="flex-1 min-w-[200px] flex flex-col gap-1.5">
                <label class="text-xs font-bold text-slate-500 dark:text-slate-400">Email</label>
                <input v-model="nuevoTenant.email" type="email" placeholder="contacto@agencia.com" :disabled="cargando"
                  class="w-full px-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-sm transition-all focus:ring-2 focus:ring-primary-500/15 focus:border-primary-500 outline-none disabled:opacity-60" />
              </div>
              <div class="shrink-0">
                <button type="submit" class="bg-success-500 hover:bg-green-600 text-white font-bold py-2.5 px-6 rounded-lg text-sm shadow-md transition-all active:scale-95 disabled:opacity-60 flex items-center gap-2" :disabled="cargando">
                  <span v-if="cargando" class="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                  <svg v-else class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
                  </svg>
                  Registrar Agencia
                </button>
              </div>
            </form>
          </div>
        </section>

        <!-- Listado de tenants -->
        <section class="flex-grow flex flex-col gap-4">
          <div class="flex justify-between items-center">
            <h2 class="text-xl font-bold text-slate-800 dark:text-white">Agencias Registradas</h2>
            <button @click="fetchTenants" class="text-primary-500 dark:text-primary-400 border border-current px-4 py-1.5 rounded-lg text-sm font-semibold flex items-center gap-2 hover:bg-primary-500 hover:text-white transition-all disabled:opacity-60" :disabled="cargando">
              <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="23 4 23 10 17 10" /><polyline points="1 20 1 14 7 14" /><path d="M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15" />
              </svg>
              Actualizar
            </button>
          </div>

          <div v-if="cargando" class="flex-grow flex flex-col items-center justify-center py-20 text-slate-400 gap-4">
            <div class="w-10 h-10 border-4 border-primary-500/20 border-t-primary-500 rounded-full animate-spin"></div>
            <p>Cargando agencias...</p>
          </div>

          <div v-else class="overflow-x-auto rounded-xl shadow-sm border border-slate-200 dark:border-slate-800">
            <table class="w-full border-collapse bg-white dark:bg-slate-900 transition-colors">
              <thead>
                <tr class="bg-slate-50 dark:bg-slate-800/80 text-left border-b border-slate-200 dark:border-slate-800">
                  <th class="p-4 text-[11px] font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400">Nombre</th>
                  <th class="p-4 text-[11px] font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400">Dominio</th>
                  <th class="p-4 text-[11px] font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400">Email</th>
                  <th class="p-4 text-[11px] font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400">Estado</th>
                  <th class="p-4 text-[11px] font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-100 dark:divide-slate-800">
                <tr v-if="tenants.length === 0">
                  <td colspan="5" class="p-12 text-center text-slate-400 italic">No hay agencias registradas.</td>
                </tr>
                <tr v-for="tenant in tenants" :key="tenant.id" class="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors group">
                  <td class="p-4">
                    <div class="flex items-center gap-3">
                      <div class="w-9 h-9 bg-grad-primary rounded-lg flex items-center justify-center text-white font-bold text-sm uppercase shrink-0">
                        {{ (tenant.nombre || tenant.id)?.charAt(0)?.toUpperCase() || '?' }}
                      </div>
                      <span class="font-semibold text-slate-700 dark:text-slate-200">{{ tenant.nombre || '(sin nombre)' }}</span>
                    </div>
                  </td>
                  <td class="p-4 text-sm font-mono text-slate-500 dark:text-slate-400">{{ tenant.dominio || '—' }}</td>
                  <td class="p-4 text-sm font-mono text-slate-500 dark:text-slate-400">{{ tenant.email || '—' }}</td>
                  <td class="p-4">
                    <span :class="[
                      'text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-tight',
                      tenant.estado === 'suspendido' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' : 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                    ]">
                      {{ tenant.estado || 'activo' }}
                    </span>
                  </td>
                  <td class="p-4">
                    <div class="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity focus-within:opacity-100">
                      <button @click="editarTenant(tenant)" class="p-1.5 text-primary-500 border border-primary-500/20 hover:bg-primary-500 hover:text-white rounded-md transition-all" title="Editar">
                        <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                        </svg>
                      </button>
                      <button v-if="tenant.estado !== 'suspendido'" @click="suspenderTenant(tenant.id)" class="p-1.5 text-red-500 border border-red-500/20 hover:bg-red-500 hover:text-white rounded-md transition-all" title="Suspender">
                        <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                          <circle cx="12" cy="12" r="10" /><line x1="4.93" y1="4.93" x2="19.07" y2="19.07" />
                        </svg>
                      </button>
                      <button v-else @click="activarTenant(tenant.id)" class="p-1.5 text-green-500 border border-green-500/20 hover:bg-green-500 hover:text-white rounded-md transition-all" title="Reactivar">
                        <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      </button>
                      <button @click="borrarTenant(tenant.id)" class="p-1.5 text-red-600 border border-red-600/20 hover:bg-red-600 hover:text-white rounded-md transition-all" title="Eliminar">
                        <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                          <path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m3 0v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6h16zM10 11v6M14 11v6" />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>

    <!-- Modals -->
    <BaseModal :show="showEditarTenant" title="Editar Agencia" @close="cerrarEditarTenant">
      <form id="editarTenantForm" @submit.prevent="guardarEdicionTenant" class="flex flex-col gap-4">
        <BaseInput label="Nombre Comercial" v-model="editForm.nombre" required :disabled="cargando" />
        <BaseInput label="Dominio" v-model="editForm.dominio" :disabled="cargando" />
        <BaseInput label="Email" v-model="editForm.email" type="email" :disabled="cargando" />
        <BaseInput label="Teléfono" v-model="editForm.telefono" type="tel" :disabled="cargando" />
        <BaseInput label="Dirección" v-model="editForm.direccion" :disabled="cargando" />
        
        <div v-if="editError" class="p-3 bg-red-100 text-red-700 text-sm rounded-lg border border-red-200">{{ editError }}</div>
        <div v-if="editExito" class="p-3 bg-green-100 text-green-700 text-sm rounded-lg border border-green-200">{{ editExito }}</div>
      </form>
      <template #footer>
        <BaseButton variant="secondary" @click="cerrarEditarTenant" :disabled="cargando">Cancelar</BaseButton>
        <BaseButton form="editarTenantForm" type="submit" :loading="cargando">Guardar cambios</BaseButton>
      </template>
    </BaseModal>

    <PerfilSlideover :show="showPerfil" @close="showPerfil = false" />
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { apiRequest } from '@/api/service';
import { useAuthStore } from '@/stores/auth';
import BaseModal from '@/components/BaseModal.vue';
import BaseInput from '@/components/BaseInput.vue';
import BaseButton from '@/components/BaseButton.vue';
import PerfilSlideover from '@/components/PerfilSlideover.vue';

const router = useRouter();
const authStore = useAuthStore();

const tenants = ref([]);
const cargando = ref(false);
const nuevoTenant = reactive({ nombre: '', dominio: '', email: '', telefono: '', direccion: '' });
const isDark = ref(false);
const showPerfil = ref(false);

const showEditarTenant = ref(false);
const editError = ref('');
const editExito = ref('');
const editForm = reactive({ id: '', nombre: '', dominio: '', email: '', telefono: '', direccion: '' });

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
      data: { 
        nombre: nuevoTenant.nombre, 
        dominio: nuevoTenant.dominio,
        email: nuevoTenant.email,
        telefono: nuevoTenant.telefono,
        direccion: nuevoTenant.direccion
      }
    });
    if (res.success) {
      nuevoTenant.nombre = '';
      nuevoTenant.dominio = '';
      nuevoTenant.email = '';
      nuevoTenant.telefono = '';
      nuevoTenant.direccion = '';
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

const editarTenant = (tenant) => {
  editForm.id = tenant.id;
  editForm.nombre = tenant.nombre || '';
  editForm.dominio = tenant.dominio || '';
  editForm.email = tenant.email || '';
  editForm.telefono = tenant.telefono || '';
  editForm.direccion = tenant.direccion || '';
  editError.value = '';
  editExito.value = '';
  showEditarTenant.value = true;
};

const cerrarEditarTenant = () => {
  showEditarTenant.value = false;
  editError.value = '';
  editExito.value = '';
  Object.assign(editForm, { id: '', nombre: '', dominio: '', email: '', telefono: '', direccion: '' });
};

const guardarEdicionTenant = async () => {
  editError.value = '';
  editExito.value = '';
  if (!editForm.nombre.trim()) {
    editError.value = 'El nombre no puede estar vacío.';
    return;
  }
  cargando.value = true;
  try {
    const res = await apiRequest(`super-admin/tenants/${editForm.id}`, {
      method: 'PUT',
      data: { 
        nombre: editForm.nombre,
        dominio: editForm.dominio,
        email: editForm.email,
        telefono: editForm.telefono,
        direccion: editForm.direccion
      }
    });
    if (res.success) {
      editExito.value = '✓ Agencia actualizada correctamente.';
      setTimeout(async () => {
        cerrarEditarTenant();
        await fetchTenants();
      }, 800);
    } else {
      editError.value = res.error || 'No se pudo actualizar la agencia.';
    }
  } catch (err) {
    editError.value = 'Error de red. Intenta nuevamente.';
  } finally {
    cargando.value = false;
  }
};

const borrarTenant = async (id) => {
  if (!confirm('¿Está completamente seguro de que desea ELIMINAR esta agencia?\n\nEsta acción no se puede deshacer.')) return;
  cargando.value = true;
  try {
    const res = await apiRequest(`super-admin/tenants/${id}`, { method: 'DELETE' });
    if (res.success) {
      alert('Agencia eliminada correctamente');
      await fetchTenants();
    } else {
      alert(`Error: ${res.error || 'No se pudo eliminar la agencia'}`);
    }
  } catch (err) {
    console.error(err);
    alert('Error al procesar la eliminación');
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
/* All manual CSS replaced by Tailwind v4 utilities */
</style>
