<template>
    <header class="h-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-6 sticky top-0 z-50 shadow-sm transition-colors duration-300">
        <div class="flex items-center gap-3">
            <div class="w-8 h-8 bg-grad-primary rounded-lg flex items-center justify-center text-white shadow-lg shadow-indigo-500/20">
                <svg class="w-4.5 h-4.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                </svg>
            </div>
            <span class="font-bold text-lg text-slate-900 dark:text-white tracking-tight">{{ auth.tenantName || 'Content 360' }}</span>
        </div>

        <!-- Buscador central -->
        <div class="flex-1 max-w-md mx-6">
            <div class="relative">
                <svg class="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
                </svg>
                <input
                    v-model="searchStore.query"
                    type="text"
                    placeholder="Buscar íconos..."
                    class="w-full pl-9 pr-4 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-700 dark:text-slate-300 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent transition-all"
                />
                <button v-if="searchStore.query" @click="searchStore.clear()" class="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors">
                    <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M18 6L6 18M6 6l12 12"/></svg>
                </button>
            </div>
        </div>

        <div class="flex items-center gap-4">
            <button @click="toggleTheme" class="w-9 h-9 flex items-center justify-center rounded-full border border-slate-200 dark:border-slate-800 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 dark:text-slate-400 transition-all" :title="isDark ? 'Modo Claro' : 'Modo Oscuro'">
                <svg v-if="isDark" class="w-4.5 h-4.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="12" cy="12" r="5" />
                    <line x1="12" y1="1" x2="12" y2="3" /><line x1="12" y1="21" x2="12" y2="23" />
                    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" /><line x1="18.36" y1="19.36" x2="19.78" y2="19.78" />
                    <line x1="1" y1="12" x2="3" y2="12" /><line x1="21" y1="12" x2="23" y2="12" />
                    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" /><line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
                </svg>
                <svg v-else class="w-4.5 h-4.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
                </svg>
            </button>

            <div class="hidden sm:flex flex-col items-end">
                <span class="text-xs font-bold text-slate-900 dark:text-slate-100">{{ auth.user?.nombre }}</span>
                <span class="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{{ auth.user?.rol === 'admin' ? 'Administrador' : 'Usuario' }}</span>
            </div>

            <button @click="showPerfil = true" class="w-9 h-9 flex items-center justify-center rounded-full border border-slate-200 dark:border-slate-800 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 dark:text-slate-400 transition-all" title="Mi Perfil">
                <svg class="w-4.5 h-4.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
                </svg>
            </button>

            <button @click="logout" class="bg-red-500/10 text-red-600 hover:bg-red-500/20 px-4 py-2 rounded-lg font-bold text-sm flex items-center gap-2 transition-all" title="Cerrar Sesión">
                <svg class="w-4.5 h-4.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9" />
                </svg>
                <span class="hidden md:inline">Cerrar Sesión</span>
            </button>
        </div>
    </header>

    <PerfilSlideover :show="showPerfil" @close="showPerfil = false" />
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import { useSearchStore } from '@/stores/search';
import PerfilSlideover from '@/components/PerfilSlideover.vue';

const auth = useAuthStore();
const searchStore = useSearchStore();
const router = useRouter();

const isDark = ref(false);
const showPerfil = ref(false);

const toggleTheme = () => {
    isDark.value = !isDark.value;
    updateTheme();
};

const updateTheme = () => {
    const root = document.documentElement;
    if (isDark.value) {
        root.classList.add('dark');
        root.classList.remove('light');
        localStorage.setItem('theme', 'dark');
    } else {
        root.classList.remove('dark');
        root.classList.add('light');
        localStorage.setItem('theme', 'light');
    }
};

onMounted(() => {
    const savedTheme = localStorage.getItem('theme') || 'light';
    isDark.value = savedTheme === 'dark';
    
    const root = document.documentElement;
    if (isDark.value) {
        root.classList.add('dark');
        root.classList.remove('light');
    } else {
        root.classList.remove('dark');
        root.classList.add('light');
    }
});

const logout = () => {
    auth.logout();
    router.push('/login');
};
</script>

<style scoped>
/* All styles handled by Tailwind v4 */
</style>

