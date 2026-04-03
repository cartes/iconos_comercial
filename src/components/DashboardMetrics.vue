<template>
  <div class="space-y-5">

    <!-- Skeleton loading -->
    <template v-if="loading">
      <div class="h-36 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 animate-pulse"></div>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div class="h-56 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 animate-pulse"></div>
        <div class="h-56 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 animate-pulse"></div>
      </div>
    </template>

    <template v-else>

      <!-- Sección 1: Últimos íconos — fila horizontal con scroll -->
      <div class="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-5 shadow-sm">
        <div class="flex items-center gap-2 mb-4">
          <div class="p-1.5 bg-primary-50 dark:bg-primary-900/20 rounded-lg">
            <svg class="w-4 h-4 text-primary-600 dark:text-primary-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 5v14M5 12l7-7 7 7"/></svg>
          </div>
          <div>
            <h3 class="font-bold text-slate-800 dark:text-slate-100 text-sm">Últimos íconos subidos</h3>
            <p class="text-[11px] text-slate-400">Los 10 más recientes</p>
          </div>
        </div>

        <div v-if="data.ultimos_iconos?.length" class="flex gap-3 overflow-x-auto pb-1 scrollbar-thin">
          <div
            v-for="icon in data.ultimos_iconos"
            :key="icon.id"
            class="relative bg-slate-50 dark:bg-slate-700/50 rounded-xl p-2.5 flex flex-col items-center gap-1 hover:bg-primary-50 dark:hover:bg-primary-900/10 border border-transparent hover:border-primary-200 dark:hover:border-primary-800 transition-colors shrink-0 w-[70px]"
          >
            <div class="w-9 h-9 flex items-center justify-center">
              <img :src="icon.url" :alt="icon.etiqueta || 'ícono'" class="max-w-full max-h-full object-contain" loading="lazy" />
            </div>
            <span class="text-[9px] text-center text-slate-500 dark:text-slate-400 line-clamp-1 w-full leading-tight">{{ icon.etiqueta || '—' }}</span>
            <span class="text-[9px] text-slate-400">{{ formatDate(icon.fechaSubida) }}</span>
            <span v-if="icon.clicks > 0" class="absolute -top-1 -right-1 bg-primary-500 text-white text-[8px] font-bold px-1 py-0.5 rounded-full leading-none min-w-[14px] text-center">{{ icon.clicks }}</span>
          </div>
        </div>
        <p v-else class="text-xs text-slate-400 text-center py-5">Aún no hay íconos subidos.</p>
      </div>

      <!-- Secciones 2 y 3: dos columnas -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-5">

        <!-- Íconos más copiados -->
        <div class="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-5 shadow-sm">
          <div class="flex items-center gap-2 mb-4">
            <div class="p-1.5 bg-amber-50 dark:bg-amber-900/20 rounded-lg">
              <svg class="w-4 h-4 text-amber-500 dark:text-amber-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"/></svg>
            </div>
            <div>
              <h3 class="font-bold text-slate-800 dark:text-slate-100 text-sm">Íconos más copiados</h3>
              <p class="text-[11px] text-slate-400">Por número de copias</p>
            </div>
          </div>

          <div v-if="data.top_iconos?.length" class="space-y-1">
            <div v-for="(icon, i) in data.top_iconos" :key="icon.id"
              class="flex items-center gap-2.5 px-2 py-1.5 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
              <span class="text-sm w-5 text-center shrink-0">{{ i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `${i+1}.` }}</span>
              <div class="w-8 h-8 flex items-center justify-center bg-slate-100 dark:bg-slate-700 rounded-lg shrink-0">
                <img :src="icon.url" :alt="icon.etiqueta || 'ícono'" class="max-w-full max-h-full object-contain" loading="lazy" />
              </div>
              <span class="flex-1 text-xs text-slate-600 dark:text-slate-300 font-medium truncate">{{ icon.etiqueta || 'Sin nombre' }}</span>
              <span class="text-xs font-bold text-amber-600 dark:text-amber-400 shrink-0">{{ icon.clicks.toLocaleString() }}</span>
            </div>
          </div>
          <p v-else class="text-xs text-slate-400 text-center py-6">Los datos aparecerán cuando se comiencen a copiar íconos.</p>
        </div>

        <!-- Usuarios más activos -->
        <div class="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-5 shadow-sm">
          <div class="flex items-center gap-2 mb-4">
            <div class="p-1.5 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg">
              <svg class="w-4 h-4 text-emerald-500 dark:text-emerald-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/></svg>
            </div>
            <div>
              <h3 class="font-bold text-slate-800 dark:text-slate-100 text-sm">Usuarios más activos</h3>
              <p class="text-[11px] text-slate-400">Por interacciones totales</p>
            </div>
          </div>

          <div v-if="data.top_usuarios?.length" class="space-y-1">
            <div v-for="(u, i) in data.top_usuarios" :key="u.user_email"
              class="flex items-center gap-2.5 px-2 py-1.5 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
              <span class="text-sm w-5 text-center shrink-0">{{ i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `${i+1}.` }}</span>
              <div class="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0" :class="avatarClass(i)">
                {{ (u.nombre || u.user_email).charAt(0).toUpperCase() }}
              </div>
              <div class="flex-1 min-w-0">
                <p class="text-xs font-semibold text-slate-700 dark:text-slate-200 truncate">{{ u.nombre }}</p>
                <p class="text-[10px] text-slate-400 truncate">{{ u.user_email }}</p>
              </div>
              <span class="text-xs font-bold text-emerald-600 dark:text-emerald-400 shrink-0">{{ u.total_interacciones.toLocaleString() }}</span>
            </div>
          </div>
          <p v-else class="text-xs text-slate-400 text-center py-6">Aún no hay interacciones registradas.</p>
        </div>

      </div>
    </template>
  </div>
</template>

<script setup>
defineProps({
  data: {
    type: Object,
    default: () => ({ ultimos_iconos: [], top_iconos: [], top_usuarios: [] })
  },
  loading: { type: Boolean, default: false }
});

const avatarClass = (i) => {
  const c = [
    'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300',
    'bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300',
    'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300',
    'bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300',
    'bg-rose-100 dark:bg-rose-900/30 text-rose-700 dark:text-rose-300',
  ];
  return c[i % c.length];
};

const formatDate = (d) => {
  if (!d) return '';
  const diff = Math.floor((Date.now() - new Date(d)) / 86400000);
  if (diff === 0) return 'Hoy';
  if (diff === 1) return 'Ayer';
  if (diff < 7) return `${diff}d`;
  return new Date(d).toLocaleDateString('es-CL', { day: 'numeric', month: 'short' });
};
</script>
