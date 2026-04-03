<template>
  <div class="min-h-screen bg-grad-primary p-5 flex justify-center items-start overflow-auto transition-colors duration-300">
    <div class="max-w-7xl w-full bg-white dark:bg-[#1e1e2d] rounded-2xl shadow-2xl overflow-hidden flex flex-col min-h-[90vh] transition-colors duration-300">
      <!-- Header -->
      <header class="bg-grad-primary text-white p-5 md:p-7 flex justify-between items-center shrink-0 transition-all">
        <h1 class="text-2xl font-bold flex items-center gap-4">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="28" height="28">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          </svg>
          Panel {{ authStore.user?.rol === 'super-admin' ? 'Administrativo' : (authStore.tenantName || 'Administrativo') }}
        </h1>
        <div class="flex items-center gap-4">
          <button @click="toggleTheme" class="p-2 hover:bg-white/15 rounded-lg transition-colors"
            :title="isDark ? 'Modo Claro' : 'Modo Oscuro'">
            <svg v-if="isDark" class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="5" /><line x1="12" y1="1" x2="12" y2="3" /><line x1="12" y1="21" x2="12" y2="23" />
              <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" /><line x1="18.36" y1="19.36" x2="19.78" y2="19.78" />
              <line x1="1" y1="12" x2="3" y2="12" /><line x1="21" y1="12" x2="23" y2="12" />
              <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" /><line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
            </svg>
            <svg v-else class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
            </svg>
          </button>
          <span class="hidden sm:inline font-medium">Hola, {{ authStore.user?.email || 'Admin' }}</span>
          <button class="bg-white text-primary-600 px-5 py-2.5 rounded-lg font-bold text-sm shadow-md hover:-translate-y-0.5 hover:shadow-lg transition-all flex items-center gap-2" @click="logout" title="Cerrar Sesión">
            <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9" />
            </svg>
            Salir
          </button>
        </div>
      </header>

      <main class="p-5 md:p-8 flex-grow flex flex-col overflow-hidden">
        <!-- Tabs -->
        <div class="flex gap-4 mb-8 border-b border-slate-200 dark:border-slate-800 transition-colors">
          <button v-for="tab in ['dashboard', 'empresas', 'usuarios']" :key="tab"
            :class="['px-6 py-4 font-semibold text-sm transition-all border-b-2 capitalize flex items-center gap-2', 
                    activeTab === tab ? 'text-primary-600 border-primary-600 dark:text-primary-400 dark:border-primary-400 bg-slate-50 dark:bg-slate-800/50 rounded-t-lg' : 'text-slate-400 border-transparent hover:text-primary-500 hover:bg-slate-50/50 dark:hover:bg-slate-800/30']"
            @click="activeTab = tab">
            <svg v-if="tab === 'dashboard'" class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 20V10M12 20V4M6 20v-4" /></svg>
            <svg v-if="tab === 'empresas'" class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="4" y="2" width="16" height="20" rx="2" ry="2" /><path d="M9 22v-4h6v4M8 6h.01M16 6h.01M12 6h.01M12 10h.01M16 10h.01M8 10h.01M8 14h.01M12 14h.01M16 14h.01" /></svg>
            <svg v-if="tab === 'usuarios'" class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 00-3-3.87" /><path d="M16 3.13a4 4 0 010 7.75" /></svg>
            {{ tab }}
          </button>
        </div>

        <div v-if="loading" class="flex-grow flex flex-col items-center justify-center p-20 gap-4 text-slate-400 transition-opacity">
            <div class="w-10 h-10 border-4 border-primary-500/20 border-t-primary-500 rounded-full animate-spin"></div>
            <p class="font-medium">Sincronizando datos...</p>
        </div>

        <div v-else class="flex-grow flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-2 duration-300">
            <!-- Dashboard Tab -->
            <div v-if="activeTab === 'dashboard'" class="flex flex-col gap-8">
                <div class="grid grid-cols-1 sm:grid-cols-3 gap-6">
                    <div class="bg-grad-primary p-6 rounded-xl text-white shadow-lg shadow-indigo-500/20 text-center">
                        <h3 class="text-3xl font-bold mb-1">{{ companies.length }}</h3>
                        <p class="text-sm font-medium opacity-90">Empresas Activas</p>
                    </div>
                    <div class="bg-grad-primary p-6 rounded-xl text-white shadow-lg shadow-indigo-500/20 text-center">
                        <h3 class="text-3xl font-bold mb-1">{{ users.length }}</h3>
                        <p class="text-sm font-medium opacity-90">Total Usuarios</p>
                    </div>
                    <div class="bg-grad-primary p-6 rounded-xl text-white shadow-lg shadow-indigo-500/20 text-center">
                        <h3 class="text-3xl font-bold mb-1">{{users.filter(u => u.rol === 'admin').length}}</h3>
                        <p class="text-sm font-medium opacity-90">Administradores</p>
                    </div>
                </div>

                <div class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-sm">
                    <div class="p-5 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
                        <h3 class="font-bold text-slate-800 dark:text-white">Últimas Empresas</h3>
                    </div>
                    <div class="overflow-x-auto">
                        <table class="w-full text-left">
                            <thead class="bg-slate-50 dark:bg-slate-800/50">
                                <tr>
                                    <th class="p-4 text-[11px] font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400">Nombre</th>
                                    <th class="p-4 text-[11px] font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400 w-[150px]">Acciones</th>
                                </tr>
                            </thead>
                            <tbody class="divide-y divide-slate-100 dark:divide-slate-800">
                                <tr v-for="company in companies.slice(0, 5)" :key="company.id" class="group hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                                    <td class="p-4">
                                        <div class="flex items-center gap-3">
                                            <div class="w-9 h-9 bg-grad-primary rounded-lg flex items-center justify-center text-white font-bold text-sm uppercase shrink-0">
                                                {{ company.nombre.charAt(0) }}
                                            </div>
                                            <span class="font-semibold text-slate-700 dark:text-slate-200">{{ company.nombre }}</span>
                                        </div>
                                    </td>
                                    <td class="p-4">
                                        <button @click="exploreCompany(company)" class="bg-primary-500 text-white px-4 py-1.5 rounded-lg text-xs font-bold shadow-sm hover:brightness-110 active:scale-95 transition-all">
                                            Explorar
                                        </button>
                                    </td>
                                </tr>
                                <tr v-if="companies.length === 0">
                                    <td colspan="2" class="p-10 text-center text-slate-400 italic">No hay empresas registradas</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                <!-- Métricas del dashboard (solo para admins de tenant) -->
                <DashboardMetrics
                    v-if="authStore.user?.rol !== 'super-admin'"
                    :data="dashboardStats"
                    :loading="loadingStats"
                />
            </div>

            <!-- Empresas Tab -->
            <div v-else-if="activeTab === 'empresas'" class="flex flex-col gap-6">
                <div class="flex justify-between items-center">
                    <h2 class="text-xl font-bold text-slate-800 dark:text-white">Gestión de Empresas</h2>
                    <button class="bg-success-500 hover:bg-green-600 text-white font-bold py-2 px-5 rounded-lg text-sm shadow-md transition-all active:scale-95 flex items-center gap-2" @click="showAddCompanyModal = true">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
                        Nueva Empresa
                    </button>
                </div>
                <div class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-sm">
                    <table class="w-full text-left">
                        <thead class="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800">
                            <tr>
                                <th class="p-4 text-[11px] font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400">Nombre</th>
                                <th class="p-4 text-[11px] font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400">ID</th>
                                <th class="p-4 text-[11px] font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400">Acciones</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-slate-100 dark:divide-slate-800">
                            <tr v-for="company in companies" :key="company.id" class="group hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                                <td class="p-4">
                                    <div class="flex items-center gap-3">
                                        <div class="w-9 h-9 bg-grad-primary rounded-lg flex items-center justify-center text-white font-bold text-sm uppercase shrink-0">
                                            {{ company.nombre.charAt(0) }}
                                        </div>
                                        <span class="font-semibold text-slate-700 dark:text-slate-200">{{ company.nombre }}</span>
                                    </div>
                                </td>
                                <td class="p-4 text-xs font-mono text-slate-500 dark:text-slate-400">{{ company.id }}</td>
                                <td class="p-4">
                                    <button @click="exploreCompany(company)" class="bg-primary-500 text-white px-4 py-1.5 rounded-lg text-xs font-bold shadow-sm hover:brightness-110 active:scale-95 transition-all">
                                        Explorar
                                    </button>
                                </td>
                            </tr>
                            <tr v-if="companies.length === 0">
                                <td colspan="3" class="p-10 text-center text-slate-400 italic">No hay empresas registradas</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

            <!-- Usuarios Tab -->
            <div v-else-if="activeTab === 'usuarios'" class="flex flex-col gap-6">
                <div class="flex justify-between items-center">
                    <h2 class="text-xl font-bold text-slate-800 dark:text-white">Gestión de Usuarios</h2>
                    <button class="bg-success-500 hover:bg-green-600 text-white font-bold py-2 px-5 rounded-lg text-sm shadow-md transition-all active:scale-95 flex items-center gap-2" @click="showAddUserModal = true">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16"><path d="M16 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" /><circle cx="8.5" cy="7" r="4" /><line x1="20" y1="8" x2="20" y2="14" /><line x1="23" y1="11" x2="17" y2="11" /></svg>
                        Nuevo Usuario
                    </button>
                </div>
                <div class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-sm flex flex-col flex-grow">
                    <div class="overflow-x-auto flex-grow">
                        <table class="w-full text-left">
                            <thead class="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800">
                                <tr>
                                    <th class="p-4 text-[11px] font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400">Usuario</th>
                                    <th class="p-4 text-[11px) font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400">Rol</th>
                                    <th class="p-4 text-[11px] font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400">Empresa</th>
                                    <th class="p-4 text-[11px] font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400">Permisos</th>
                                    <th class="p-4 text-[11px] font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400 text-center w-[100px]">Acciones</th>
                                </tr>
                            </thead>
                            <tbody class="divide-y divide-slate-100 dark:divide-slate-800">
                                <tr v-for="user in paginatedUsers" :key="user.email" class="group hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                                    <td class="p-4">
                                        <div class="flex flex-col">
                                            <span class="font-bold text-slate-700 dark:text-slate-200">{{ user.nombre }}</span>
                                            <span class="text-xs text-slate-500 dark:text-slate-400 italic underline">{{ user.email }}</span>
                                        </div>
                                    </td>
                                    <td class="p-4">
                                        <span :class="[
                                            'text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-tighter',
                                            user.rol === 'admin' ? 'bg-red-500 text-white' : 
                                            user.rol === 'editor' ? 'bg-orange-500 text-white' : 'bg-green-500 text-white'
                                        ]">
                                            {{ user.rol === 'admin' ? 'admin' : (user.rol === 'editor' ? 'editor' : 'usuario') }}
                                        </span>
                                    </td>
                                    <td class="p-4">
                                        <span v-if="user.empresaNombre || user.empresa" class="text-xs font-semibold px-2 py-1 bg-slate-100 dark:bg-slate-800 rounded text-slate-600 dark:text-slate-300">
                                            {{ user.empresaNombre || user.empresa }}
                                        </span>
                                        <span v-else class="text-slate-300">—</span>
                                    </td>
                                    <td class="p-4">
                                        <div class="flex items-center" v-if="user.rol !== 'admin'">
                                            <BaseSwitch :modelValue="!!user.puedeEliminar" @update:modelValue="toggleDeletePermission(user, $event)" title="Permiso para eliminar" />
                                            <span class="ml-2 text-[10px] text-slate-400 uppercase font-bold tracking-tighter">Eliminar</span>
                                        </div>
                                        <div v-else class="text-red-500" title="Administrador tiene permisos totales">
                                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="20" height="20">
                                                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                                            </svg>
                                        </div>
                                    </td>
                                    <td class="p-4">
                                        <div class="flex justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button @click="deleteUser(user)" v-if="user.email !== authStore.user?.email" class="p-2 text-red-500 hover:bg-red-500 hover:text-white rounded-lg border border-red-500/20 transition-all" title="Eliminar usuario">
                                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16">
                                                    <path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2M10 11v6M14 11v6" />
                                                </svg>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                                <tr v-if="paginatedUsers.length === 0">
                                    <td colspan="5" class="p-10 text-center text-slate-400 italic">No hay usuarios registrados</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    <div class="p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 flex justify-between items-center" v-if="totalPages > 1">
                        <button class="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-4 py-1.5 rounded-lg text-sm font-bold shadow-sm hover:bg-slate-50 dark:hover:bg-slate-700 disabled:opacity-40 transition-all" @click="prevPage" :disabled="currentPage === 1">Anterior</button>
                        <span class="text-xs font-bold text-slate-500 uppercase tracking-widest">Página {{ currentPage }} de {{ totalPages }}</span>
                        <button class="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-4 py-1.5 rounded-lg text-sm font-bold shadow-sm hover:bg-slate-50 dark:hover:bg-slate-700 disabled:opacity-40 transition-all" @click="nextPage" :disabled="currentPage === totalPages">Siguiente</button>
                    </div>
                </div>
            </div>
        </div>
      </main>
    </div>

    <!-- Modals -->
    <BaseModal :show="showAddCompanyModal" title="Nueva Empresa" @close="showAddCompanyModal = false">
        <form id="addCompanyForm" @submit.prevent="saveCompany" class="flex flex-col gap-6">
            <BaseInput label="Nombre de la Empresa" v-model="newCompany.nombre" placeholder="Ej. Content 360" required />
        </form>
        <template #footer>
            <BaseButton variant="secondary" @click="showAddCompanyModal = false">Cancelar</BaseButton>
            <BaseButton form="addCompanyForm" type="submit" :loading="saving">Guardar Empresa</BaseButton>
        </template>
    </BaseModal>

    <BaseModal :show="showAddUserModal" title="Nuevo Usuario" @close="showAddUserModal = false">
        <form id="addUserForm" @submit.prevent="saveUser" class="flex flex-col gap-4">
            <BaseInput label="Nombre Completo" v-model="newUser.nombre" placeholder="Juan Pérez" required />
            <BaseInput label="Email" type="email" v-model="newUser.email" placeholder="juan@empresa.com" required />
            <BaseInput label="Contraseña" type="password" v-model="newUser.clave" placeholder="••••••••" required />

            <div class="flex flex-col gap-1.5">
                <label class="text-sm font-semibold text-slate-700 dark:text-slate-300">Rol</label>
                <select v-model="newUser.rol" class="w-full px-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-900 dark:text-slate-100 outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all">
                    <option value="usuario">Usuario Estándar</option>
                    <option value="editor">Editor</option>
                    <option value="admin">Administrador</option>
                </select>
            </div>

            <div class="flex flex-col gap-1.5" v-if="newUser.rol === 'usuario' || newUser.rol === 'editor'">
                <label class="text-sm font-semibold text-slate-700 dark:text-slate-300">Empresa</label>
                <select v-model="newUser.empresaId" class="w-full px-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-900 dark:text-slate-100 outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all" required>
                    <option value="" disabled>Selecciona una empresa</option>
                    <option v-for="c in companies" :key="c.id" :value="c.id">
                        {{ c.nombre }}
                    </option>
                </select>
            </div>
        </form>
        <template #footer>
            <BaseButton variant="secondary" @click="showAddUserModal = false">Cancelar</BaseButton>
            <BaseButton form="addUserForm" type="submit" :loading="saving">Crear Usuario</BaseButton>
        </template>
    </BaseModal>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import { apiRequest, getDashboardStats } from '@/api/service';
import BaseInput from '@/components/BaseInput.vue';
import BaseButton from '@/components/BaseButton.vue';
import BaseSwitch from '@/components/BaseSwitch.vue';
import BaseModal from '@/components/BaseModal.vue';
import DashboardMetrics from '@/components/DashboardMetrics.vue';
import { useAuthStore } from '@/stores/auth';

const router = useRouter();
const authStore = useAuthStore();
const companies = ref([]);
const users = ref([]);
const loading = ref(false);
const saving = ref(false);
const activeTab = ref('dashboard');

// Dashboard metrics
const dashboardStats = ref({ ultimos_iconos: [], top_iconos: [], top_usuarios: [] });
const loadingStats = ref(false);

const currentPage = ref(1);
const itemsPerPage = 8;

const paginatedUsers = computed(() => {
    const start = (currentPage.value - 1) * itemsPerPage;
    return users.value.slice(start, start + itemsPerPage);
});

const totalPages = computed(() => Math.ceil(users.value.length / itemsPerPage));

const nextPage = () => {
    if (currentPage.value < totalPages.value) currentPage.value++;
};

const prevPage = () => {
    if (currentPage.value > 1) currentPage.value--;
};

const showAddCompanyModal = ref(false);
const showAddUserModal = ref(false);

const newCompany = reactive({ nombre: '' });
const newUser = reactive({
    nombre: '',
    email: '',
    clave: '',
    rol: 'usuario',
    empresaId: ''
});

// Theme
const isDark = ref(false);

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

const logout = () => {
    authStore.logout();
    router.push('/login');
};

const fetchData = async () => {
    loading.value = true;
    try {
        const [compRes, userRes] = await Promise.all([
            apiRequest('empresas'),
            apiRequest('usuarios')
        ]);

        if (compRes.success) companies.value = compRes.empresas || [];
        if (userRes.success) users.value = userRes.usuarios || [];
    } catch (error) {
        console.error('Error fetching data:', error);
    } finally {
        loading.value = false;
    }
};

const fetchDashboardStats = async () => {
    loadingStats.value = true;
    try {
        const res = await getDashboardStats();
        if (res.success) {
            dashboardStats.value = {
                ultimos_iconos: res.ultimos_iconos || [],
                top_iconos: res.top_iconos || [],
                top_usuarios: res.top_usuarios || [],
            };
        }
    } catch (error) {
        console.error('Error fetching dashboard stats:', error);
    } finally {
        loadingStats.value = false;
    }
};

onMounted(async () => {
    fetchData();
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        isDark.value = savedTheme === 'dark';
    } else {
        isDark.value = false;
    }
    updateTheme();

    // Cargar info del tenant si falta (para usuarios no super-admin)
    if (authStore.isAuthenticated && authStore.user?.rol !== 'super-admin' && !authStore.tenantName) {
        await authStore.fetchTenantInfo();
    }

    // Cargar métricas del dashboard (solo para admins de tenant, no super-admin)
    if (authStore.user?.rol !== 'super-admin') {
        fetchDashboardStats();
    }
});

const saveCompany = async () => {
    saving.value = true;
    const res = await apiRequest('empresas', { method: 'POST', data: { nombre: newCompany.nombre } });
    if (res.success) {
        showAddCompanyModal.value = false;
        newCompany.nombre = '';
        fetchData();
    } else {
        alert(res.error);
    }
    saving.value = false;
};

const saveUser = async () => {
    saving.value = true;
    const res = await apiRequest('usuarios', { method: 'POST', data: { ...newUser } });
    if (res.success) {
        showAddUserModal.value = false;
        Object.assign(newUser, { nombre: '', email: '', clave: '', rol: 'usuario', empresaId: '' });
        fetchData();
    } else {
        alert(res.error);
    }
    saving.value = false;
};

const exploreCompany = (company) => {
    router.push({
        name: 'admin-explore',
        params: { id: company.id, nombre: company.nombre }
    });
};

const toggleDeletePermission = async (user, newValue) => {
    const originalValue = user.puedeEliminar;
    user.puedeEliminar = newValue;

    try {
        const res = await apiRequest(`usuarios/${user.email}`, {
            method: 'PUT',
            data: { puedeEliminar: newValue }
        });

        if (!res.success) {
            alert(res.error || 'Error al actualizar permiso');
            user.puedeEliminar = originalValue;
        }
    } catch {
        alert('Error de conexión');
        user.puedeEliminar = originalValue;
    }
};

const deleteUser = async (user) => {
    if (!confirm(`¿Estás seguro que deseas eliminar al usuario ${user.nombre}? Esta acción no se puede deshacer.`)) {
        return;
    }

    try {
        const res = await apiRequest(`usuarios/${user.email}`, { method: 'DELETE' });
        if (res.success) {
            fetchData();
        } else {
            alert(res.error || 'Error al eliminar usuario');
        }
    } catch {
        alert('Error de conexión al eliminar usuario');
    }
};
</script>

<style scoped>
/* All manual legacy CSS replaced by Tailwind v4 utilities */
</style>
