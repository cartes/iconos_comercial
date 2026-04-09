<template>
  <!-- Overlay -->
  <Teleport to="body">
    <Transition name="overlay">
      <div
        v-if="show"
        class="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
        @click="$emit('close')"
      />
    </Transition>

    <!-- Panel -->
    <Transition name="slideover">
      <aside
        v-if="show"
        class="fixed top-0 right-0 h-full w-full sm:w-[440px] bg-white dark:bg-[#1e1e2d] shadow-2xl z-50 flex flex-col overflow-hidden"
        @click.stop
      >
        <!-- Header del panel -->
        <div class="bg-grad-primary text-white px-6 py-5 flex items-center justify-between shrink-0">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center font-bold text-lg uppercase">
              {{ initials }}
            </div>
            <div>
              <p class="font-bold text-base leading-tight">{{ authStore.user?.nombre || authStore.user?.email }}</p>
              <p class="text-white/70 text-xs capitalize">{{ authStore.user?.rol }}</p>
            </div>
          </div>
          <button
            @click="$emit('close')"
            class="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white/20 transition-colors"
            title="Cerrar"
          >
            <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M18 6L6 18M6 6l12 12"/>
            </svg>
          </button>
        </div>

        <!-- Tabs -->
        <div class="flex border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 shrink-0">
          <button
            v-for="tab in tabs"
            :key="tab.id"
            @click="activeTab = tab.id"
            :class="[
              'flex-1 py-3 text-xs font-bold uppercase tracking-wide flex flex-col items-center gap-1 transition-all border-b-2',
              activeTab === tab.id
                ? 'text-primary-600 dark:text-primary-400 border-primary-600 dark:border-primary-400 bg-white dark:bg-slate-800/50'
                : 'text-slate-400 border-transparent hover:text-slate-600 dark:hover:text-slate-200'
            ]"
          >
            <span v-html="tab.icon" class="w-4 h-4" />
            {{ tab.label }}
          </button>
        </div>

        <!-- Contenido scrollable -->
        <div class="flex-1 overflow-y-auto p-6">

          <!-- ── Tab: Datos personales ─────────────────────────── -->
          <div v-if="activeTab === 'datos'" class="flex flex-col gap-5">
            <form @submit.prevent="guardarDatos" class="flex flex-col gap-4">
              <div class="flex flex-col gap-1.5">
                <label class="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">Nombre</label>
                <input
                  v-model="formDatos.nombre"
                  type="text"
                  required
                  placeholder="Tu nombre completo"
                  class="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent transition-all"
                />
              </div>
              <div class="flex flex-col gap-1.5">
                <label class="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">Correo electrónico</label>
                <input
                  v-model="formDatos.email"
                  type="email"
                  required
                  placeholder="tu@correo.com"
                  class="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent transition-all"
                />
              </div>

              <FeedbackBanner :state="feedback.datos" />

              <button
                type="submit"
                :disabled="loading.datos"
                class="bg-primary-600 hover:bg-primary-700 disabled:opacity-60 text-white px-5 py-2.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all hover:-translate-y-0.5"
              >
                <span v-if="loading.datos" class="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <svg v-else class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z"/>
                  <polyline points="17 21 17 13 7 13 7 21"/>
                  <polyline points="7 3 7 8 15 8"/>
                </svg>
                Guardar cambios
              </button>
            </form>
          </div>

          <!-- ── Tab: Contraseña ───────────────────────────────── -->
          <div v-else-if="activeTab === 'password'" class="flex flex-col gap-4">
            <form @submit.prevent="guardarPassword" class="flex flex-col gap-4">
              <div class="flex flex-col gap-1.5">
                <label class="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">Contraseña actual</label>
                <input
                  v-model="formPassword.clave"
                  type="password"
                  required
                  placeholder="••••••••"
                  class="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent transition-all"
                />
              </div>
              <div class="flex flex-col gap-1.5">
                <label class="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">Nueva contraseña</label>
                <input
                  v-model="formPassword.nuevaClave"
                  type="password"
                  required
                  minlength="8"
                  placeholder="Mínimo 8 caracteres"
                  class="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent transition-all"
                />
              </div>
              <div class="flex flex-col gap-1.5">
                <label class="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">Confirmar nueva contraseña</label>
                <input
                  v-model="formPassword.confirmar"
                  type="password"
                  required
                  placeholder="Repite la nueva contraseña"
                  class="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent transition-all"
                />
              </div>

              <FeedbackBanner :state="feedback.password" />

              <button
                type="submit"
                :disabled="loading.password"
                class="bg-warning-500 hover:brightness-110 disabled:opacity-60 text-white px-5 py-2.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all hover:-translate-y-0.5"
              >
                <span v-if="loading.password" class="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <svg v-else class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                  <path d="M7 11V7a5 5 0 0110 0v4"/>
                </svg>
                Actualizar contraseña
              </button>
            </form>
          </div>

          <!-- ── Tab: Sesiones ─────────────────────────────────── -->
          <div v-else-if="activeTab === 'sesiones'" class="flex flex-col gap-4">
            <FeedbackBanner :state="feedback.sesiones" />

            <!-- Loading -->
            <div v-if="loading.sesiones" class="flex items-center justify-center py-10 gap-3 text-slate-400">
              <div class="w-5 h-5 border-2 border-slate-300 border-t-primary-500 rounded-full animate-spin" />
              <span class="text-sm">Cargando sesiones...</span>
            </div>

            <template v-else>
              <!-- Botón cerrar otras sesiones -->
              <button
                v-if="otherSessions > 0"
                @click="cerrarOtrasSesiones"
                :disabled="loading.revocarTodas"
                class="w-full border border-error-500/40 text-error-500 hover:bg-error-500/10 disabled:opacity-60 px-4 py-2.5 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all"
              >
                <span v-if="loading.revocarTodas" class="w-4 h-4 border-2 border-error-500/30 border-t-error-500 rounded-full animate-spin" />
                <svg v-else class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9"/>
                </svg>
                Cerrar {{ otherSessions }} sesión{{ otherSessions > 1 ? 'es' : '' }} en otros dispositivos
              </button>

              <!-- Lista -->
              <div v-if="sesiones.length" class="flex flex-col gap-3">
                <div
                  v-for="s in sesiones"
                  :key="s.id"
                  :class="[
                    'flex items-center gap-3 p-3.5 rounded-xl border transition-colors',
                    s.es_actual
                      ? 'border-primary-200 dark:border-primary-900 bg-primary-50/60 dark:bg-primary-900/10'
                      : 'border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/30'
                  ]"
                >
                  <div :class="['w-9 h-9 rounded-lg flex items-center justify-center shrink-0', s.es_actual ? 'bg-primary-500/15' : 'bg-slate-100 dark:bg-slate-800']">
                    <svg :class="['w-4.5 h-4.5', s.es_actual ? 'text-primary-600 dark:text-primary-400' : 'text-slate-400']" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <rect x="5" y="2" width="14" height="20" rx="2" ry="2"/>
                      <line x1="12" y1="18" x2="12.01" y2="18"/>
                    </svg>
                  </div>
                  <div class="flex-1 min-w-0">
                    <div class="flex items-center gap-2 flex-wrap">
                      <span class="font-semibold text-sm text-slate-800 dark:text-white truncate">{{ s.nombre }}</span>
                      <span v-if="s.es_actual" class="bg-primary-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full uppercase tracking-wide">Actual</span>
                    </div>
                    <p class="text-[11px] text-slate-400 mt-0.5 truncate">
                      {{ formatDate(s.creado_en) }}
                      <span v-if="s.ultimo_uso"> · Último uso {{ formatDate(s.ultimo_uso) }}</span>
                    </p>
                  </div>
                  <button
                    v-if="!s.es_actual"
                    @click="cerrarSesion(s.id)"
                    :disabled="loading.revocar[s.id]"
                    class="shrink-0 text-error-500 hover:bg-error-500/10 disabled:opacity-50 w-7 h-7 flex items-center justify-center rounded-lg transition-all"
                    title="Cerrar esta sesión"
                  >
                    <span v-if="loading.revocar[s.id]" class="w-3.5 h-3.5 border-2 border-error-500/30 border-t-error-500 rounded-full animate-spin" />
                    <svg v-else class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M18 6L6 18M6 6l12 12"/>
                    </svg>
                  </button>
                </div>
              </div>

              <p v-else class="text-center text-slate-400 italic text-sm py-8">Sin sesiones activas registradas.</p>
            </template>
          </div>

        </div>
      </aside>
    </Transition>
  </Teleport>
</template>

<script setup>
import { ref, reactive, computed, watch } from 'vue';
import { useAuthStore } from '@/stores/auth';
import { actualizarDatos, cambiarPassword, getSesiones, revocarSesion, revocarOtrasSesiones } from '@/api/perfil';

const props = defineProps({ show: Boolean });

const authStore = useAuthStore();

const activeTab = ref('datos');

const tabs = [
  {
    id: 'datos',
    label: 'Perfil',
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:1rem;height:1rem;display:inline"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>',
  },
  {
    id: 'password',
    label: 'Contraseña',
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:1rem;height:1rem;display:inline"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>',
  },
  {
    id: 'sesiones',
    label: 'Sesiones',
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:1rem;height:1rem;display:inline"><rect x="5" y="2" width="14" height="20" rx="2" ry="2"/><line x1="12" y1="18" x2="12.01" y2="18"/></svg>',
  },
];

const initials = computed(() => {
  const name = authStore.user?.nombre || authStore.user?.email || '?';
  return name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
});

// ── Forms ─────────────────────────────────────────────────────────
const formDatos = reactive({
  nombre: authStore.user?.nombre || '',
  email: authStore.user?.email || '',
});

const formPassword = reactive({ clave: '', nuevaClave: '', confirmar: '' });

// ── Loading ───────────────────────────────────────────────────────
const loading = reactive({ datos: false, password: false, sesiones: false, revocarTodas: false, revocar: {} });

// ── Feedback ──────────────────────────────────────────────────────
const feedback = reactive({ datos: null, password: null, sesiones: null });

function setFeedback(key, type, message) {
  feedback[key] = { type, message };
  if (type === 'success') setTimeout(() => { feedback[key] = null; }, 4000);
}

// ── Sesiones ──────────────────────────────────────────────────────
const sesiones = ref([]);
const otherSessions = computed(() => sesiones.value.filter(s => !s.es_actual).length);

async function cargarSesiones() {
  if (activeTab.value !== 'sesiones') return;
  loading.sesiones = true;
  feedback.sesiones = null;
  const res = await getSesiones();
  loading.sesiones = false;
  if (res.success) sesiones.value = res.sesiones;
  else setFeedback('sesiones', 'error', res.error || 'Error al cargar sesiones');
}

async function cerrarSesion(id) {
  loading.revocar[id] = true;
  const res = await revocarSesion(id);
  delete loading.revocar[id];
  if (res.success) {
    sesiones.value = sesiones.value.filter(s => s.id !== id);
    setFeedback('sesiones', 'success', res.mensaje);
  } else {
    setFeedback('sesiones', 'error', res.error || 'Error al cerrar sesión');
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
    setFeedback('sesiones', 'error', res.error || 'Error al cerrar otras sesiones');
  }
}

// ── Datos personales ──────────────────────────────────────────────
async function guardarDatos() {
  loading.datos = true;
  feedback.datos = null;
  const res = await actualizarDatos({ nombre: formDatos.nombre, email: formDatos.email });
  loading.datos = false;
  if (res.success) {
    authStore.actualizarPerfil({ nombre: res.usuario.nombre, email: res.usuario.email });
    setFeedback('datos', 'success', res.mensaje);
  } else {
    setFeedback('datos', 'error', res.error || 'Error al actualizar datos');
  }
}

// ── Contraseña ────────────────────────────────────────────────────
async function guardarPassword() {
  if (formPassword.nuevaClave !== formPassword.confirmar) {
    setFeedback('password', 'error', 'Las contraseñas nuevas no coinciden');
    return;
  }
  loading.password = true;
  feedback.password = null;
  const res = await cambiarPassword({ clave: formPassword.clave, nuevaClave: formPassword.nuevaClave });
  loading.password = false;
  if (res.success) {
    Object.assign(formPassword, { clave: '', nuevaClave: '', confirmar: '' });
    setFeedback('password', 'success', res.mensaje);
  } else {
    setFeedback('password', 'error', res.error || 'Error al actualizar contraseña');
  }
}

// ── Sincronizar form de datos y cargar sesiones al abrir ──────────
watch(() => props.show, (val) => {
  if (val) {
    formDatos.nombre = authStore.user?.nombre || '';
    formDatos.email = authStore.user?.email || '';
    activeTab.value = 'datos';
    Object.values(feedback).forEach((_, k) => { feedback[k] = null; });
  }
});

watch(activeTab, (tab) => {
  if (tab === 'sesiones' && sesiones.value.length === 0) cargarSesiones();
});

// ── Utils ─────────────────────────────────────────────────────────
function formatDate(iso) {
  if (!iso) return '—';
  return new Intl.DateTimeFormat('es', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(iso));
}
</script>

<!-- Componente de banner de feedback definido inline -->
<script>
import { defineComponent, h } from 'vue';

const FeedbackBanner = defineComponent({
  name: 'FeedbackBanner',
  props: { state: Object },
  setup(props) {
    return () => {
      if (!props.state) return null;
      const ok = props.state.type === 'success';
      return h('div', {
        class: `text-sm font-medium px-4 py-2.5 rounded-xl border flex items-center gap-2 ${
          ok ? 'bg-success-500/10 text-success-500 border-success-500/20' : 'bg-error-500/10 text-error-500 border-error-500/20'
        }`,
      }, [
        h('svg', { class: 'w-4 h-4 shrink-0', viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': '2' },
          ok
            ? [h('path', { d: 'M22 11.08V12a10 10 0 1 1-5.93-9.14' }), h('polyline', { points: '22 4 12 14.01 9 11.01' })]
            : [h('circle', { cx: '12', cy: '12', r: '10' }), h('line', { x1: '12', y1: '8', x2: '12', y2: '12' }), h('line', { x1: '12', y1: '16', x2: '12.01', y2: '16' })]
        ),
        props.state.message,
      ]);
    };
  },
});

export default { components: { FeedbackBanner } };
</script>

<style>
.slideover-enter-active,
.slideover-leave-active {
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
.slideover-enter-from,
.slideover-leave-to {
  transform: translateX(100%);
}

.overlay-enter-active,
.overlay-leave-active {
  transition: opacity 0.3s ease;
}
.overlay-enter-from,
.overlay-leave-to {
  opacity: 0;
}
</style>
