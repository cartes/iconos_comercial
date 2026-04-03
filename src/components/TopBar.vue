<template>
    <header class="h-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-6 sticky top-0 z-50 shadow-sm transition-colors duration-300">
        <div class="flex items-center gap-3">
            <div class="w-8 h-8 bg-grad-primary rounded-lg flex items-center justify-center text-white shadow-lg shadow-indigo-500/20">
                <svg class="w-4.5 h-4.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                </svg>
            </div>
            <span class="font-bold text-lg text-slate-900 dark:text-white tracking-tight">Sistema de Gestión</span>
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

            <button @click="showPasswordModal = true" class="w-9 h-9 flex items-center justify-center rounded-full border border-slate-200 dark:border-slate-800 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 dark:text-slate-400 transition-all" title="Cambiar Contraseña">
                <svg class="w-4.5 h-4.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4" />
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

    <ChangePasswordModal :show="showPasswordModal" @close="showPasswordModal = false"
        @success="handlePasswordSuccess" />
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useAuthStore } from '@/stores/auth';
import { useRouter } from 'vue-router';
import ChangePasswordModal from './ChangePasswordModal.vue';

const auth = useAuthStore();
const router = useRouter();

const isDark = ref(false);
const showPasswordModal = ref(false);

const handlePasswordSuccess = (message) => {
    alert(message);
};

const toggleTheme = () => {
    isDark.value = !isDark.value;
    updateTheme();
};

const updateTheme = () => {
    if (isDark.value) {
        document.documentElement.classList.add('dark');
        localStorage.setItem('theme', 'dark');
    } else {
        document.documentElement.classList.remove('dark');
        localStorage.setItem('theme', 'light');
    }
};

onMounted(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        isDark.value = savedTheme === 'dark';
    } else {
        isDark.value = false;
        localStorage.setItem('theme', 'light');
    }
    updateTheme();
});

const logout = () => {
    auth.logout();
    router.push('/login');
};
</script>

<style scoped>
/* All styles handled by Tailwind v4 */
</style>
