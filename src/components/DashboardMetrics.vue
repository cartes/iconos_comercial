<template>
  <div class="space-y-8">

    <!-- Skeleton loading -->
    <template v-if="loading">
      <div v-for="i in 3" :key="i" class="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6">
        <div class="h-5 w-40 bg-slate-200 dark:bg-slate-700 rounded-lg animate-pulse mb-5"></div>
        <div class="grid grid-cols-5 gap-3">
          <div v-for="j in 5" :key="j" class="aspect-square bg-slate-100 dark:bg-slate-700 rounded-xl animate-pulse"></div>
        </div>
      </div>
    </template>

    <template v-else>

      <!-- ─── Sección 1: Últimos íconos subidos ─────────────────────────── -->
      <div class="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 shadow-sm">
        <div class="flex items-center gap-3 mb-5">
          <div class="p-2 bg-primary-50 dark:bg-primary-900/20 rounded-xl">
            <svg class="w-5 h-5 text-primary-600 dark:text-primary-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M12 5v14M5 12l7-7 7 7"/>
            </svg>
          </div>
          <div>
            <h3 class="font-bold text-slate-800 dark:text-slate-100 text-base">Últimos íconos subidos</h3>
            <p class="text-xs text-slate-400 dark:text-slate-500">Los 10 más recientes</p>
          </div>
        </div>

        <div v-if="data.ultimos_iconos?.length" class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
          <div
            v-for="icon in data.ultimos_iconos"
            :key="icon.id"
            class="group relative bg-slate-50 dark:bg-slate-700/50 rounded-xl p-3 flex flex-col items-center gap-2 hover:bg-primary-50 dark:hover:bg-primary-900/10 transition-colors border border-transparent hover:border-primary-200 dark:hover:border-primary-800"
          >
            <div class="w-12 h-12 flex items-center justify-center">
              <img :src="icon.url" :alt="icon.etiqueta || 'ícono'" class="max-w-full max-h-full object-contain" loading="lazy" />
            </div>
            <span class="text-[10px] text-center text-slate-500 dark:text-slate-400 line-clamp-1 w-full">
              {{ icon.etiqueta || '—' }}
            </span>
            <span class="text-[9px] text-slate-400 dark:text-slate-500">
              {{ formatDate(icon.fechaSubida) }}
            </span>
            <!-- Clicks badge -->
            <span v-if="icon.clicks > 0" class="absolute top-1.5 right-1.5 bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 text-[9px] font-bold px-1.5 py-0.5 rounded-full">
              {{ icon.clicks }}
            </span>
          </div>
        </div>
        <p v-else class="text-sm text-slate-400 dark:text-slate-500 text-center py-8">
          Aún no hay íconos subidos.
        </p>
      </div>

      <!-- ─── Sección 2: Íconos más copiados ───────────────────────────── -->
      <div class="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 shadow-sm">
        <div class="flex items-center gap-3 mb-5">
          <div class="p-2 bg-amber-50 dark:bg-amber-900/20 rounded-xl">
            <svg class="w-5 h-5 text-amber-500 dark:text-amber-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"/>
            </svg>
          </div>
          <div>
            <h3 class="font-bold text-slate-800 dark:text-slate-100 text-base">Íconos más copiados</h3>
            <p class="text-xs text-slate-400 dark:text-slate-500">Ranking por número de copias</p>
          </div>
        </div>

        <div v-if="data.top_iconos?.length" class="space-y-2">
          <div
            v-for="(icon, index) in data.top_iconos"
            :key="icon.id"
            class="flex items-center gap-4 p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors group"
          >
            <!-- Ranking number -->
            <span class="w-7 h-7 flex items-center justify-center rounded-full text-sm font-bold shrink-0"
              :class="rankClass(index)">
              {{ index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : index + 1 }}
            </span>
            <!-- Thumbnail -->
            <div class="w-10 h-10 flex items-center justify-center bg-slate-100 dark:bg-slate-700 rounded-lg shrink-0">
              <img :src="icon.url" :alt="icon.etiqueta || 'ícono'" class="max-w-full max-h-full object-contain" loading="lazy" />
            </div>
            <!-- Name -->
            <span class="flex-1 text-sm text-slate-600 dark:text-slate-300 font-medium truncate">
              {{ icon.etiqueta || 'Sin nombre' }}
            </span>
            <!-- Click count -->
            <span class="flex items-center gap-1.5 text-sm font-bold text-amber-600 dark:text-amber-400 shrink-0">
              <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"/>
              </svg>
              {{ icon.clicks.toLocaleString() }}
            </span>
          </div>
        </div>
        <p v-else class="text-sm text-slate-400 dark:text-slate-500 text-center py-8">
          Aún no hay íconos copiados. Los datos aparecerán cuando los usuarios comiencen a copiar URLs.
        </p>
      </div>

      <!-- ─── Sección 3: Usuarios más activos ──────────────────────────── -->
      <div class="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 shadow-sm">
        <div class="flex items-center gap-3 mb-5">
          <div class="p-2 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl">
            <svg class="w-5 h-5 text-emerald-500 dark:text-emerald-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/>
              <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/>
            </svg>
          </div>
          <div>
            <h3 class="font-bold text-slate-800 dark:text-slate-100 text-base">Usuarios más activos</h3>
            <p class="text-xs text-slate-400 dark:text-slate-500">Ranking por interacciones totales</p>
          </div>
        </div>

        <div v-if="data.top_usuarios?.length" class="space-y-2">
          <div
            v-for="(usuario, index) in data.top_usuarios"
            :key="usuario.user_email"
            class="flex items-center gap-4 p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
          >
            <!-- Ranking number -->
            <span class="w-7 h-7 flex items-center justify-center rounded-full text-sm font-bold shrink-0"
              :class="rankClass(index)">
              {{ index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : index + 1 }}
            </span>
            <!-- Avatar inicial -->
            <div class="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold shrink-0"
              :class="avatarClass(index)">
              {{ (usuario.nombre || usuario.user_email).charAt(0).toUpperCase() }}
            </div>
            <!-- Info -->
            <div class="flex-1 min-w-0">
              <p class="text-sm font-semibold text-slate-700 dark:text-slate-200 truncate">{{ usuario.nombre }}</p>
              <p class="text-xs text-slate-400 dark:text-slate-500 truncate">{{ usuario.user_email }}</p>
            </div>
            <!-- Interaction count -->
            <span class="flex items-center gap-1.5 text-sm font-bold text-emerald-600 dark:text-emerald-400 shrink-0">
              <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
              </svg>
              {{ usuario.total_interacciones.toLocaleString() }}
            </span>
          </div>
        </div>
        <p v-else class="text-sm text-slate-400 dark:text-slate-500 text-center py-8">
          Aún no hay interacciones registradas.
        </p>
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
  loading: {
    type: Boolean,
    default: false
  }
});

const rankClass = (index) => {
  if (index === 0) return 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300';
  if (index === 1) return 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300';
  if (index === 2) return 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300';
  return 'bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400';
};

const avatarClass = (index) => {
  const colors = [
    'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300',
    'bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300',
    'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300',
    'bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300',
    'bg-rose-100 dark:bg-rose-900/30 text-rose-700 dark:text-rose-300',
  ];
  return colors[index % colors.length];
};

const formatDate = (dateStr) => {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  const now = new Date();
  const diffMs = now - d;
  const diffDays = Math.floor(diffMs / 86400000);
  if (diffDays === 0) return 'Hoy';
  if (diffDays === 1) return 'Ayer';
  if (diffDays < 7) return `Hace ${diffDays} días`;
  return d.toLocaleDateString('es-CL', { day: 'numeric', month: 'short' });
};
</script>
