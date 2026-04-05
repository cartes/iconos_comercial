<template>
  <div class="min-h-screen flex bg-slate-100 dark:bg-[#0f0f17] transition-colors duration-300" :class="{ dark: isDark }">

    <!-- ══ SIDEBAR ══════════════════════════════════════════════════ -->
    <aside class="w-60 shrink-0 bg-white dark:bg-[#1a1a2e] border-r border-slate-200 dark:border-slate-800 flex flex-col h-screen sticky top-0 shadow-sm z-20">

      <!-- Brand -->
      <div class="h-16 px-5 flex items-center gap-3 border-b border-slate-100 dark:border-slate-800 shrink-0">
        <div class="w-8 h-8 bg-grad-primary rounded-xl flex items-center justify-center text-white shadow-md shadow-indigo-500/30 shrink-0">
          <svg class="w-4.5 h-4.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          </svg>
        </div>
        <div class="min-w-0">
          <p class="font-black text-sm text-slate-900 dark:text-white leading-tight tracking-tight">Content 360</p>
          <p class="text-[9px] font-bold uppercase tracking-widest text-primary-500 leading-tight">Panel Global</p>
        </div>
      </div>

      <!-- Nav -->
      <nav class="flex-1 overflow-y-auto px-3 py-4 space-y-0.5">
        <p class="text-[9px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-600 px-3 mb-2">Administración</p>

        <RouterLink
          v-for="item in navItems"
          :key="item.to"
          :to="item.to"
          class="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all group"
          :class="isActive(item.to)
            ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300 shadow-sm'
            : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:text-slate-800 dark:hover:text-slate-100'"
        >
          <span
            class="w-8 h-8 flex items-center justify-center rounded-lg shrink-0 transition-colors"
            :class="isActive(item.to)
              ? 'bg-primary-100 dark:bg-primary-900/40 text-primary-600 dark:text-primary-400'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-400 group-hover:bg-slate-200 dark:group-hover:bg-slate-700 group-hover:text-slate-600 dark:group-hover:text-slate-200'"
            v-html="item.icon"
          />
          <span class="flex-1">{{ item.label }}</span>
          <!-- Badge opcional -->
          <span
            v-if="item.badge"
            class="text-[10px] font-bold px-1.5 py-0.5 rounded-full"
            :class="item.badgeClass || 'bg-rose-100 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400'"
          >{{ item.badge }}</span>
        </RouterLink>
      </nav>

      <!-- Footer del sidebar -->
      <div class="px-4 py-4 border-t border-slate-100 dark:border-slate-800 shrink-0 space-y-3">
        <!-- Info usuario -->
        <div class="flex items-center gap-2.5 px-2">
          <div class="w-8 h-8 rounded-full bg-grad-primary flex items-center justify-center text-white text-xs font-bold shrink-0 shadow-sm">
            {{ initials }}
          </div>
          <div class="min-w-0">
            <p class="text-xs font-semibold text-slate-700 dark:text-slate-200 truncate">{{ authStore.user?.nombre || authStore.user?.email }}</p>
            <p class="text-[10px] text-slate-400 truncate">{{ authStore.user?.email }}</p>
          </div>
        </div>

        <!-- Acciones -->
        <div class="flex gap-2">
          <button
            @click="showPerfil = true"
            class="flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs font-semibold text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
            title="Mi Perfil"
          >
            <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
            </svg>
            Perfil
          </button>
          <button
            @click="logout"
            class="flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs font-semibold text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/20 transition-all"
            title="Cerrar Sesión"
          >
            <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9" />
            </svg>
            Salir
          </button>
        </div>
      </div>
    </aside>

    <!-- ══ MAIN AREA ════════════════════════════════════════════════ -->
    <div class="flex-1 flex flex-col min-h-screen min-w-0">

      <!-- Topbar -->
      <header class="h-16 bg-white dark:bg-[#1a1a2e] border-b border-slate-200 dark:border-slate-800 px-6 flex items-center justify-between shrink-0 z-10 sticky top-0">
        <div class="flex items-center gap-2">
          <h1 class="font-bold text-slate-900 dark:text-white text-base">{{ currentSection }}</h1>
          <span class="hidden sm:inline text-[10px] font-bold bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 px-2 py-0.5 rounded-full uppercase tracking-wide">Panel Global</span>
        </div>
        <div class="flex items-center gap-3">
          <button
            @click="toggleTheme"
            class="w-8 h-8 flex items-center justify-center rounded-full border border-slate-200 dark:border-slate-700 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
            :title="isDark ? 'Modo Claro' : 'Modo Oscuro'"
          >
            <svg v-if="isDark" class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/>
              <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
              <line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/>
              <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
            </svg>
            <svg v-else class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/>
            </svg>
          </button>
          <span class="text-xs text-slate-400 hidden md:inline">{{ authStore.user?.email }}</span>
        </div>
      </header>

      <!-- Page content -->
      <main class="flex-1 p-6 overflow-y-auto">
        <RouterView />
      </main>
    </div>

    <!-- Slideover de Perfil -->
    <PerfilSlideover :show="showPerfil" @close="showPerfil = false" />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { RouterLink, RouterView, useRoute, useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import PerfilSlideover from '@/components/PerfilSlideover.vue';

const authStore = useAuthStore();
const router = useRouter();
const route = useRoute();

const isDark = ref(false);
const showPerfil = ref(false);

// Definición de la navegación
const navItems = [
  {
    to: '/super-admin/dashboard',
    label: 'Dashboard',
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:1rem;height:1rem">
      <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
      <rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>
    </svg>`,
  },
  {
    to: '/super-admin/agencias',
    label: 'Agencias',
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:1rem;height:1rem">
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
      <polyline points="9 22 9 12 15 12 15 22"/>
    </svg>`,
  },
  {
    to: '/super-admin/usuarios',
    label: 'Usuarios y Roles',
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:1rem;height:1rem">
      <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/>
      <circle cx="9" cy="7" r="4"/>
      <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/>
    </svg>`,
  },
  {
    to: '/super-admin/pagos',
    label: 'Control de Pagos',
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:1rem;height:1rem">
      <rect x="1" y="4" width="22" height="16" rx="2" ry="2"/>
      <line x1="1" y1="10" x2="23" y2="10"/>
    </svg>`,
  },
  {
    to: '/super-admin/planes',
    label: 'Planes y Precios',
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:1rem;height:1rem">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
    </svg>`,
  },
  {
    to: '/super-admin/api-keys',
    label: 'API Keys',
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" style="width:1rem;height:1rem">
      <path d="M21 2l-2 2M3 21l2-2m4.5-12.5l2 2m4.5 4.5l2 2M15 3h6v6M9 21H3v-6"/><circle cx="12" cy="12" r="3"/>
    </svg>`,
  },
  {
    to: '/super-admin/seguridad',
    label: 'Seguridad',
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" style="width:1rem;height:1rem">
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
    </svg>`,
  },
  {
    to: '/super-admin/configuracion',
    label: 'Configuración',
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:1rem;height:1rem">
      <circle cx="12" cy="12" r="3"/>
      <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/>
    </svg>`,
  },
];

// Sección activa en la topbar
const currentSection = computed(() => {
  const match = navItems.find(item => isActive(item.to));
  return match?.label || 'Panel Global';
});

// Iniciales del usuario
const initials = computed(() => {
  const name = authStore.user?.nombre || authStore.user?.email || '?';
  return name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
});

// Detectar ruta activa
function isActive(path) {
  return route.path === path || route.path.startsWith(path + '/');
}

// Tema
function toggleTheme() {
  isDark.value = !isDark.value;
  document.documentElement.classList.toggle('dark', isDark.value);
  localStorage.setItem('theme', isDark.value ? 'dark' : 'light');
}

function logout() {
  authStore.logout();
  router.push('/login');
}

onMounted(() => {
  const saved = localStorage.getItem('theme');
  isDark.value = saved === 'dark';
  document.documentElement.classList.toggle('dark', isDark.value);
});
</script>
