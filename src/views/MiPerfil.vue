<template>
  <div class="min-h-screen bg-grad-primary p-5 flex justify-center items-start overflow-auto transition-colors duration-300">
    <div class="max-w-3xl w-full">

      <!-- Header -->
      <div class="flex items-center gap-4 mb-6">
        <RouterLink
          :to="backRoute"
          class="w-9 h-9 flex items-center justify-center rounded-xl bg-white/20 text-white hover:bg-white/30 transition-all"
          title="Volver"
        >
          <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M19 12H5M12 5l-7 7 7 7"/>
          </svg>
        </RouterLink>
        <div>
          <h1 class="text-2xl font-bold text-white flex items-center gap-3">
            <svg class="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
            </svg>
            Mi Perfil
          </h1>
          <p class="text-white/70 text-sm mt-0.5">Gestiona tus datos personales y sesiones</p>
        </div>
      </div>

      <!-- Sección 1: Datos personales -->
      <section class="bg-white dark:bg-[#1e1e2d] rounded-2xl shadow-xl mb-5 overflow-hidden transition-colors">
        <div class="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center gap-3">
          <div class="w-8 h-8 rounded-lg bg-primary-500/10 flex items-center justify-center">
            <svg class="w-4 h-4 text-primary-600 dark:text-primary-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
            </svg>
          </div>
          <h2 class="font-bold text-slate-800 dark:text-white">Datos Personales</h2>
        </div>
        <form @submit.prevent="guardarDatos" class="p-6 flex flex-col gap-4">
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div class="flex flex-col gap-1.5">
              <label class="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">Nombre</label>
              <input
                v-model="form.datos.nombre"
                type="text"
                required
                placeholder="Tu nombre completo"
                class="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-white placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent transition-all"
              />
            </div>
            <div class="flex flex-col gap-1.5">
              <label class="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">Correo electrónico</label>
              <input
                v-model="form.datos.email"
                type="email"
                required
                placeholder="tu@correo.com"
                class="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-white placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent transition-all"
              />
            </div>
          </div>

          <Feedback :state="feedback.datos" />

          <div class="flex justify-end">
            <button
              type="submit"
              :disabled="loading.datos"
              class="bg-primary-600 hover:bg-primary-700 disabled:opacity-60 text-white px-6 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 transition-all hover:-translate-y-0.5 active:translate-y-0"
            >
              <span v-if="loading.datos" class="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
              <svg v-else class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>
              Guardar cambios
            </button>
          </div>
        </form>
      </section>

      <!-- Sección 2: Cambio de contraseña -->
      <section class="bg-white dark:bg-[#1e1e2d] rounded-2xl shadow-xl mb-5 overflow-hidden transition-colors">
        <div class="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center gap-3">
          <div class="w-8 h-8 rounded-lg bg-warning-500/10 flex items-center justify-center">
            <svg class="w-4 h-4 text-warning-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4"/>
            </svg>
          </div>
          <h2 class="font-bold text-slate-800 dark:text-white">Cambiar Contraseña</h2>
        </div>
        <form @submit.prevent="guardarPassword" class="p-6 flex flex-col gap-4">
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div class="flex flex-col gap-1.5">
              <label class="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">Contraseña actual</label>
              <input
                v-model="form.password.clave"
                type="password"
                required
                placeholder="••••••••"
                class="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-white placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent transition-all"
              />
            </div>
            <div class="flex flex-col gap-1.5">
              <label class="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">Nueva contraseña</label>
              <input
                v-model="form.password.nuevaClave"
                type="password"
                required
                minlength="8"
                placeholder="Mín. 8 caracteres"
                class="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-white placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent transition-all"
              />
            </div>
            <div class="flex flex-col gap-1.5">
              <label class="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">Confirmar nueva</label>
              <input
                v-model="form.password.confirmar"
                type="password"
                required
                placeholder="Repite la nueva"
                class="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-white placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent transition-all"
              />
            </div>
          </div>

          <Feedback :state="feedback.password" />

          <div class="flex justify-end">
            <button
              type="submit"
              :disabled="loading.password"
              class="bg-warning-500 hover:brightness-110 disabled:opacity-60 text-white px-6 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 transition-all hover:-translate-y-0.5 active:translate-y-0"
            >
              <span v-if="loading.password" class="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
              <svg v-else class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
              </svg>
              Actualizar contraseña
            </button>
          </div>
        </form>
      </section>

      <!-- Sección 3: Sesiones activas -->
      <section class="bg-white dark:bg-[#1e1e2d] rounded-2xl shadow-xl overflow-hidden transition-colors">
        <div class="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between gap-3">
          <div class="flex items-center gap-3">
            <div class="w-8 h-8 rounded-lg bg-info-500/10 flex items-center justify-center">
              <svg class="w-4 h-4 text-info-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="5" y="2" width="14" height="20" rx="2" ry="2"/><line x1="12" y1="18" x2="12.01" y2="18"/>
              </svg>
            </div>
            <h2 class="font-bold text-slate-800 dark:text-white">Sesiones Activas</h2>
            <span v-if="sesiones.length" class="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-bold px-2 py-0.5 rounded-full">{{ sesiones.length }}</span>
          </div>
          <button
            v-if="otherSessions > 0"
            @click="cerrarOtrasSesiones"
            :disabled="loading.revocarTodas"
            class="text-error-500 hover:bg-error-500/10 disabled:opacity-60 px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all"
          >
            <span v-if="loading.revocarTodas" class="w-3.5 h-3.5 border-2 border-error-500/30 border-t-error-500 rounded-full animate-spin"></span>
            <svg v-else class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9"/>
            </svg>
            Cerrar otras sesiones ({{ otherSessions }})
          </button>
        </div>

        <div class="p-6">
          <Feedback :state="feedback.sesiones" />

          <!-- Loading sesiones -->
          <div v-if="loading.sesiones" class="flex items-center justify-center py-8 gap-3 text-slate-400">
            <div class="w-5 h-5 border-2 border-slate-300 border-t-primary-500 rounded-full animate-spin"></div>
            <span class="text-sm">Cargando sesiones...</span>
          </div>

          <!-- Lista de sesiones -->
          <div v-else-if="sesiones.length" class="flex flex-col gap-3">
            <div
              v-for="sesion in sesiones"
              :key="sesion.id"
              :class="['flex items-center gap-4 p-4 rounded-xl border transition-colors', sesion.es_actual ? 'border-primary-200 dark:border-primary-900 bg-primary-50/50 dark:bg-primary-900/10' : 'border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/30']"
            >
              <div :class="['w-10 h-10 rounded-xl flex items-center justify-center shrink-0', sesion.es_actual ? 'bg-primary-500/15' : 'bg-slate-100 dark:bg-slate-800']">
                <svg :class="['w-5 h-5', sesion.es_actual ? 'text-primary-600 dark:text-primary-400' : 'text-slate-400']" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <rect x="5" y="2" width="14" height="20" rx="2" ry="2"/><line x1="12" y1="18" x2="12.01" y2="18"/>
                </svg>
              </div>
              <div class="flex-1 min-w-0">
                <div class="flex items-center gap-2 flex-wrap">
                  <span class="font-semibold text-sm text-slate-800 dark:text-white truncate">{{ sesion.nombre }}</span>
                  <span v-if="sesion.es_actual" class="bg-primary-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide">Actual</span>
                </div>
                <p class="text-xs text-slate-400 mt-0.5">
                  Iniciado {{ formatDate(sesion.creado_en) }}
                  <span v-if="sesion.ultimo_uso"> · Último uso {{ formatDate(sesion.ultimo_uso) }}</span>
                </p>
              </div>
              <button
                v-if="!sesion.es_actual"
                @click="cerrarSesion(sesion.id)"
                :disabled="loading.revocar[sesion.id]"
                class="shrink-0 text-error-500 hover:bg-error-500/10 disabled:opacity-50 w-8 h-8 flex items-center justify-center rounded-lg transition-all"
                title="Cerrar esta sesión"
              >
                <span v-if="loading.revocar[sesion.id]" class="w-4 h-4 border-2 border-error-500/30 border-t-error-500 rounded-full animate-spin"></span>
                <svg v-else class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M18 6L6 18M6 6l12 12"/>
                </svg>
              </button>
            </div>
          </div>

          <p v-else class="text-center text-slate-400 italic text-sm py-6">No hay sesiones activas registradas.</p>
        </div>
      </section>

      <p class="text-center text-white/40 text-xs mt-6 pb-4">Iconos · Mi Perfil</p>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref, computed, onMounted } from 'vue';
import { RouterLink } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import { actualizarDatos, cambiarPassword, getSesiones, revocarSesion, revocarOtrasSesiones } from '@/api/perfil';

const authStore = useAuthStore();

// ── Ruta de regreso según rol ──────────────────────────────────────
const backRoute = computed(() => {
  const rol = authStore.user?.rol;
  if (rol === 'super-admin') return '/admin/empresas';
  if (rol === 'admin') return '/admin';
  return '/portal';
});

// ── Formularios ────────────────────────────────────────────────────
const form = reactive({
  datos: {
    nombre: authStore.user?.nombre || '',
    email: authStore.user?.email || '',
  },
  password: {
    clave: '',
    nuevaClave: '',
    confirmar: '',
  },
});

// ── Estado de loading ──────────────────────────────────────────────
const loading = reactive({
  datos: false,
  password: false,
  sesiones: false,
  revocarTodas: false,
  revocar: {},
});

// ── Feedback por sección ──────────────────────────────────────────
const feedback = reactive({
  datos: null,
  password: null,
  sesiones: null,
});

function setFeedback(section, type, message) {
  feedback[section] = { type, message };
  if (type === 'success') {
    setTimeout(() => { feedback[section] = null; }, 4000);
  }
}

// ── Sesiones ──────────────────────────────────────────────────────
const sesiones = ref([]);
const otherSessions = computed(() => sesiones.value.filter(s => !s.es_actual).length);

async function cargarSesiones() {
  loading.sesiones = true;
  feedback.sesiones = null;
  const res = await getSesiones();
  loading.sesiones = false;
  if (res.success) {
    sesiones.value = res.sesiones;
  } else {
    setFeedback('sesiones', 'error', res.error || 'No se pudieron cargar las sesiones');
  }
}

async function cerrarSesion(id) {
  loading.revocar[id] = true;
  const res = await revocarSesion(id);
  loading.revocar[id] = false;
  if (res.success) {
    sesiones.value = sesiones.value.filter(s => s.id !== id);
    setFeedback('sesiones', 'success', res.mensaje);
  } else {
    setFeedback('sesiones', 'error', res.error || 'No se pudo cerrar la sesión');
  }
}

async function cerrarOtrasSesiones() {
  loading.revocarTodas = true;
  const res = await revocarOtrasSesiones();
  loading.revocarTodas = false;
  if (res.success) {
    sesiones.value = sesiones.value.filter(s => s.es_actual);
    setFeedback('sesiones', 'success', res.mensaje);
  } else {
    setFeedback('sesiones', 'error', res.error || 'No se pudieron cerrar las sesiones');
  }
}

// ── Guardar datos personales ──────────────────────────────────────
async function guardarDatos() {
  loading.datos = true;
  feedback.datos = null;
  const res = await actualizarDatos({ nombre: form.datos.nombre, email: form.datos.email });
  loading.datos = false;
  if (res.success) {
    authStore.actualizarPerfil({ nombre: res.usuario.nombre, email: res.usuario.email });
    setFeedback('datos', 'success', res.mensaje);
  } else {
    setFeedback('datos', 'error', res.error || 'No se pudieron actualizar los datos');
  }
}

// ── Cambiar contraseña ────────────────────────────────────────────
async function guardarPassword() {
  if (form.password.nuevaClave !== form.password.confirmar) {
    setFeedback('password', 'error', 'Las contraseñas nuevas no coinciden');
    return;
  }
  loading.password = true;
  feedback.password = null;
  const res = await cambiarPassword({
    clave: form.password.clave,
    nuevaClave: form.password.nuevaClave,
  });
  loading.password = false;
  if (res.success) {
    form.password.clave = '';
    form.password.nuevaClave = '';
    form.password.confirmar = '';
    setFeedback('password', 'success', res.mensaje);
  } else {
    setFeedback('password', 'error', res.error || 'No se pudo actualizar la contraseña');
  }
}

// ── Utils ──────────────────────────────────────────────────────────
function formatDate(isoString) {
  if (!isoString) return '—';
  return new Intl.DateTimeFormat('es', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(isoString));
}

onMounted(cargarSesiones);
</script>

<!-- Componente de feedback inline definido localmente -->
<script>
import { defineComponent, h } from 'vue';

const Feedback = defineComponent({
  name: 'Feedback',
  props: { state: Object },
  setup(props) {
    return () => {
      if (!props.state) return null;
      const isSuccess = props.state.type === 'success';
      return h('div', {
        class: `text-sm font-medium px-4 py-2.5 rounded-xl border flex items-center gap-2 ${
          isSuccess
            ? 'bg-success-500/10 text-success-500 border-success-500/20'
            : 'bg-error-500/10 text-error-500 border-error-500/20'
        }`,
      }, [
        h('svg', { class: 'w-4 h-4 shrink-0', viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': '2' },
          isSuccess
            ? [h('path', { d: 'M22 11.08V12a10 10 0 1 1-5.93-9.14' }), h('polyline', { points: '22 4 12 14.01 9 11.01' })]
            : [h('circle', { cx: '12', cy: '12', r: '10' }), h('line', { x1: '12', y1: '8', x2: '12', y2: '12' }), h('line', { x1: '12', y1: '16', x2: '12.01', y2: '16' })]
        ),
        props.state.message,
      ]);
    };
  },
});

export default { components: { Feedback } };
</script>
