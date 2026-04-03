<template>
    <div class="h-screen flex flex-col bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
        <TopBar />

        <div class="flex-1 flex overflow-hidden">
            <!-- Sidebar: Folders -->
            <aside class="w-80 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col py-8 shadow-sm transition-colors duration-300">
                <div class="px-6 pb-4 flex justify-between items-center">
                    <h2 class="text-xs font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">Carpetas</h2>
                    <button v-if="auth.user.puedeEliminar" @click="showAddFolder = true" class="p-1.5 text-primary-500 hover:bg-primary-50 dark:hover:bg-primary-900/10 rounded-lg transition-all" title="Nueva Carpeta">
                        <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                            <path d="M12 5v14M5 12h14" />
                        </svg>
                    </button>
                </div>

                <nav class="flex-1 overflow-y-auto px-3 space-y-0.5 custom-scrollbar">
                    <button 
                        class="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all group"
                        :class="[!selectedFolderId ? 'bg-primary-50 text-primary-600 dark:bg-primary-900/10 dark:text-primary-400' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50']"
                        @click="selectedFolderId = null"
                    >
                        <div v-if="auth.user.puedeEliminar" class="w-4 shrink-0"></div>
                        <svg class="w-5 h-5 shrink-0 transition-colors" :class="[!selectedFolderId ? 'text-primary-500' : 'text-slate-400 group-hover:text-slate-600']" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z" />
                        </svg>
                        <span class="flex-1 text-left line-clamp-2">Todas las carpetas</span>
                        <span class="px-2 py-0.5 bg-slate-100 dark:bg-slate-800 text-[10px] font-bold rounded-full transition-colors" :class="[!selectedFolderId ? 'bg-primary-100 text-primary-700 dark:bg-primary-900/20 dark:text-primary-300' : 'text-slate-500']">
                            {{ icons.length }}
                        </span>
                    </button>

                    <button 
                        v-for="(folder, index) in folders" 
                        :key="folder.id"
                        class="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all group"
                        :class="[
                            selectedFolderId === folder.id ? 'bg-primary-50 text-primary-600 dark:bg-primary-900/10 dark:text-primary-400' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50',
                            { 'opacity-50 scale-[0.98]': dragFolderIndex === index, 'border-t-2 border-primary-500': dragOverFolderIndex === index }
                        ]"
                        @click="selectedFolderId = folder.id"
                        :draggable="auth.user.puedeEliminar"
                        @dragstart="auth.user.puedeEliminar && onFolderDragStart($event, index)"
                        @dragover.prevent="auth.user.puedeEliminar && onFolderDragOver($event, index)"
                        @dragenter.prevent="auth.user.puedeEliminar && onFolderDragEnter($event, index)"
                        @drop.prevent="auth.user.puedeEliminar && onFolderDrop($event, index)" 
                        @dragend="onDragEnd"
                    >
                        <svg v-if="auth.user.puedeEliminar" class="w-4 h-4 cursor-grab active:cursor-grabbing text-slate-300 hover:text-slate-500 transition-colors opacity-0 group-hover:opacity-100 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <circle cx="9" cy="5" r="1.5" /><circle cx="15" cy="5" r="1.5" />
                            <circle cx="9" cy="12" r="1.5" /><circle cx="15" cy="12" r="1.5" />
                            <circle cx="9" cy="19" r="1.5" /><circle cx="15" cy="19" r="1.5" />
                        </svg>
                        
                        <svg class="w-5 h-5 shrink-0 transition-colors" :class="[selectedFolderId === folder.id ? 'text-primary-500' : 'text-slate-400 group-hover:text-slate-600']" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                        </svg>
                        <span class="flex-1 text-left line-clamp-2">{{ folder.nombre }}</span>
                        <span class="px-2.5 py-0.5 bg-slate-100 dark:bg-slate-800 text-[10px] font-bold rounded-full transition-colors whitespace-nowrap ml-2 shrink-0" :class="[selectedFolderId === folder.id ? 'bg-primary-100 text-primary-700 dark:bg-primary-900/20 dark:text-primary-300' : 'text-slate-500']">
                            {{ iconCountByFolder[folder.id] || 0 }}
                        </span>

                        <div class="flex gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity" v-if="auth.user.puedeEliminar">
                            <button @click.stop="openRenameFolderModal(folder)" class="p-1.5 text-slate-400 hover:text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/10 rounded-lg transition-all shrink-0" title="Renombrar">
                                <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
                                </svg>
                            </button>
                            <button v-if="(iconCountByFolder[folder.id] || 0) === 0" @click.stop="handleDeleteFolder(folder)" class="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-lg transition-all shrink-0" title="Eliminar">
                                <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" />
                                </svg>
                            </button>
                        </div>
                    </button>
                </nav>
            </aside>

            <!-- Main Content: Icons Grid -->
            <main class="flex-1 flex flex-col p-10 overflow-y-auto custom-scrollbar transition-colors">
                <header class="flex justify-between items-end mb-10 shrink-0">
                    <div class="flex flex-col gap-1">
                        <span class="text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">Mi Empresa</span>
                        <div class="flex items-center gap-4">
                            <h1 class="text-3xl font-black text-slate-900 dark:text-white tracking-tight">{{ auth.user?.empresa }}</h1>
                            <template v-if="selectedFolderName">
                                <span class="text-slate-300 dark:text-slate-700 text-2xl font-light">/</span>
                                <span class="px-4 py-1.5 bg-primary-100 dark:bg-primary-900/20 text-primary-700 dark:text-primary-400 rounded-full text-sm font-bold shadow-sm shadow-primary-500/10">{{ selectedFolderName }}</span>
                            </template>
                        </div>
                    </div>

                    <BaseButton v-if="auth.user.puedeEliminar" variant="primary" @click="showUpload = true">
                        <svg class="w-4.5 h-4.5 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                            <path d="M12 5v14M5 12h14" />
                        </svg>
                        Agregar Icono
                    </BaseButton>
                </header>

                <div v-if="loading" class="flex-1 flex flex-col items-center justify-center p-20 gap-4 text-slate-400">
                    <div class="w-10 h-10 border-4 border-primary-500/20 border-t-primary-500 rounded-full animate-spin"></div>
                    <p class="font-medium">Cargando catálogo...</p>
                </div>

                <div v-else-if="filteredIcons.length === 0" class="flex-1 flex flex-col items-center justify-center p-20 text-center gap-6 animate-in fade-in zoom-in duration-500">
                    <div class="w-24 h-24 bg-slate-100 dark:bg-slate-900 rounded-3xl flex items-center justify-center text-slate-300 dark:text-slate-700">
                        <svg class="w-12 h-12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                            <rect x="3" y="3" width="18" height="18" rx="3" ry="3" />
                            <circle cx="8.5" cy="8.5" r="1.5" />
                            <path d="M21 15l-5-5L5 21" />
                        </svg>
                    </div>
                    <div>
                        <h3 class="text-xl font-bold text-slate-800 dark:text-white mb-2">No hay iconos disponibles</h3>
                        <p class="text-slate-500 max-w-xs">Contacta con tu administrador o sube tus propios iconos para comenzar a utilizarlos.</p>
                    </div>
                    <BaseButton v-if="auth.user.puedeEliminar" variant="primary" @click="showUpload = true">Subir mi primer icono</BaseButton>
                </div>

                <div v-else class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 2xl:grid-cols-8 gap-6 auto-rows-max animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div v-for="(icon, index) in filteredIcons" :key="icon.id" 
                        class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm group hover:shadow-xl hover:-translate-y-1 transition-all duration-300 relative"
                        :draggable="auth.user.puedeEliminar"
                        @dragstart="auth.user.puedeEliminar && onIconDragStart($event, index)"
                        @dragover.prevent="auth.user.puedeEliminar && onIconDragOver($event, index)"
                        @dragenter.prevent="auth.user.puedeEliminar && onIconDragEnter($event, index)"
                        @drop.prevent="auth.user.puedeEliminar && onIconDrop($event, index)" 
                        @dragend="onDragEnd"
                        :class="{ 'opacity-50 scale-95': dragIconIndex === index, 'ring-2 ring-primary-500 ring-inset ring-offset-4 ring-offset-slate-50 dark:ring-offset-slate-950': dragOverIconIndex === index }"
                        @mouseenter="showTooltip(icon, $event)" @mousemove="moveTooltip($event)"
                        @mouseleave="hideTooltip"
                    >
                        <!-- Drag Handle -->
                        <div v-if="auth.user.puedeEliminar" class="absolute top-2 left-2 z-10 p-1 bg-white/90 dark:bg-slate-800/90 backdrop-blur rounded opacity-0 group-hover:opacity-100 transition-opacity cursor-grab active:cursor-grabbing border border-slate-200 dark:border-slate-700 shadow-sm">
                            <svg class="w-3.5 h-3.5 text-slate-500" viewBox="0 0 24 24" fill="currentColor">
                                <circle cx="9" cy="5" r="1.5" /><circle cx="15" cy="5" r="1.5" />
                                <circle cx="9" cy="12" r="1.5" /><circle cx="15" cy="12" r="1.5" />
                                <circle cx="9" cy="19" r="1.5" /><circle cx="15" cy="19" r="1.5" />
                            </svg>
                        </div>

                        <!-- Preview -->
                        <div class="aspect-square p-6 flex items-center justify-center relative cursor-pointer group/preview" @click="copyUrl(icon.url)">
                            <img :src="icon.url" :alt="icon.etiqueta" class="max-w-full max-h-full object-contain filter group-hover/preview:scale-110 transition-transform duration-300">
                            <div class="absolute inset-0 bg-primary-600/10 opacity-0 group-hover/preview:opacity-100 transition-opacity flex items-center justify-center">
                                <span class="bg-primary-600 text-white text-[10px] font-bold px-2 py-1 rounded-full shadow-lg translate-y-2 group-hover/preview:translate-y-0 transition-transform">Copiar URL</span>
                            </div>
                        </div>

                        <!-- Info -->
                        <div class="px-4 py-3 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 flex flex-col gap-2">
                            <div class="flex justify-between items-start gap-2">
                                <span class="text-xs font-bold text-slate-700 dark:text-slate-200 truncate flex-1" :title="icon.etiqueta">{{ icon.etiqueta || 'S/N' }}</span>
                                <span class="text-[9px] font-black uppercase text-slate-400 bg-slate-200 dark:bg-slate-800 px-1.5 py-0.5 rounded shrink-0">{{ icon.extension }}</span>
                            </div>
                            
                            <div class="flex justify-between items-center mt-1">
                                <button v-if="auth.user.puedeEliminar" class="p-1 text-slate-400 hover:text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/10 rounded transition-all" @click="openRenameModal(icon)" title="Editar Etiqueta">
                                    <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                        <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
                                        <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
                                    </svg>
                                </button>
                                <button v-if="auth.user.puedeEliminar" @click="handleDeleteIcon(icon)" class="p-1 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 rounded transition-all" title="Eliminar">
                                    <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                        <path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" />
                                    </svg>
                                </button>
                                <span v-else class="text-[9px] font-bold text-slate-400 uppercase italic">Solo Lectura</span>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>

        <!-- Modals -->
        <BaseModal :show="showAddFolder" title="Nueva Carpeta" @close="showAddFolder = false">
            <form id="addFolderFormUser" @submit.prevent="saveFolder" class="flex flex-col gap-4">
                <BaseInput label="Nombre de la Carpeta" v-model="folderForm.nombre" placeholder="Ej. Social Media" required />
            </form>
            <template #footer>
                <BaseButton variant="secondary" @click="showAddFolder = false">Cancelar</BaseButton>
                <BaseButton form="addFolderFormUser" type="submit" :loading="saving">Crear Carpeta</BaseButton>
            </template>
        </BaseModal>

        <BaseModal :show="showUpload" title="Agregar Icono" @close="showUpload = false">
            <form id="uploadIconFormUser" @submit.prevent="saveIcon" class="flex flex-col gap-4">
                <div class="flex flex-col gap-1.5">
                    <label class="text-sm font-semibold text-slate-700 dark:text-slate-300">Carpeta</label>
                    <select v-model="iconForm.carpetaId" class="w-full px-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-900 dark:text-slate-100 outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all font-medium" required>
                        <option value="" disabled>Selecciona una carpeta</option>
                        <option v-for="f in folders" :key="f.id" :value="f.id">{{ f.nombre }}</option>
                    </select>
                </div>

                <BaseInput label="URL de la Imagen" v-model="iconForm.url" placeholder="https://ejemplo.com/icono.png" required />
                <BaseInput label="Etiqueta" v-model="iconForm.nombre" placeholder="Ej. Instagram Logo" />
            </form>
            <template #footer>
                <BaseButton variant="secondary" @click="showUpload = false">Cancelar</BaseButton>
                <BaseButton form="uploadIconFormUser" type="submit" :loading="saving">Agregar Icono</BaseButton>
            </template>
        </BaseModal>

        <BaseModal :show="showRenameModal" title="Editar Etiqueta" @close="showRenameModal = false">
            <form id="renameIconFormUser" @submit.prevent="handleRename" class="flex flex-col gap-4">
                <BaseInput label="Nueva Etiqueta" v-model="renameForm.nombre" required />
            </form>
            <template #footer>
                <BaseButton variant="secondary" @click="showRenameModal = false">Cancelar</BaseButton>
                <BaseButton form="renameIconFormUser" type="submit" :loading="saving">Actualizar</BaseButton>
            </template>
        </BaseModal>

        <BaseModal :show="showRenameFolderModal" title="Renombrar Carpeta" @close="showRenameFolderModal = false">
            <form id="renameFolderFormUser" @submit.prevent="handleRenameFolder" class="flex flex-col gap-4">
                <BaseInput label="Nuevo Nombre" v-model="renameFolderForm.nombre" required />
            </form>
            <template #footer>
                <BaseButton variant="secondary" @click="showRenameFolderModal = false">Cancelar</BaseButton>
                <BaseButton form="renameFolderFormUser" type="submit" :loading="saving">Guardar</BaseButton>
            </template>
        </BaseModal>

        <!-- Tooltip -->
        <div v-if="tooltip.show" class="fixed pointer-events-none bg-slate-900/90 text-white text-[10px] font-bold px-2 py-1 rounded shadow-xl z-[9999] backdrop-blur transition-opacity duration-200" :style="tooltipStyle">
            {{ tooltip.text }}
        </div>

        <!-- Toast Notification -->
        <Transition enter-active-class="transform transition ease-out duration-300" enter-from-class="translate-y-2 opacity-0 sm:translate-y-0 sm:translate-x-2" enter-to-class="translate-y-0 opacity-100 sm:translate-x-0" leave-active-class="transition ease-in duration-100" leave-from-class="opacity-100" leave-to-class="opacity-0">
            <div v-if="toast" class="fixed bottom-6 right-6 bg-slate-900 dark:bg-primary-600 text-white px-6 py-3 rounded-xl shadow-2xl flex items-center gap-3 z-[10000] border border-white/10">
                <svg class="w-5 h-5 text-green-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><path d="M20 6L9 17l-5-5" /></svg>
                <span class="text-sm font-bold">{{ toast }}</span>
            </div>
        </Transition>
    </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue';
import { useAuthStore } from '@/stores/auth';
import { apiRequest } from '@/api/service';
import TopBar from '@/components/TopBar.vue';
import BaseModal from '@/components/BaseModal.vue';
import BaseInput from '@/components/BaseInput.vue';
import BaseButton from '@/components/BaseButton.vue';

const auth = useAuthStore();

const folders = ref([]);
const icons = ref([]);
const selectedFolderId = ref(null);
const loading = ref(false);
const saving = ref(false);
const toast = ref(null);

const showAddFolder = ref(false);
const showUpload = ref(false);

const folderForm = reactive({ nombre: '' });
const iconForm = reactive({ nombre: '', carpetaId: '', url: '' });

const showRenameModal = ref(false);
const renameForm = reactive({ id: null, nombre: '' });

const showRenameFolderModal = ref(false);
const renameFolderForm = reactive({ id: null, nombre: '' });

const tooltip = reactive({
    show: false,
    text: '',
    x: 0,
    y: 0
});

const tooltipStyle = computed(() => ({
    top: `${tooltip.y + 15}px`,
    left: `${tooltip.x + 15}px`,
    opacity: tooltip.show ? 1 : 0
}));

const selectedFolderName = computed(() => {
    const f = folders.value.find(f => f.id === selectedFolderId.value);
    return f ? f.nombre : null;
});

const filteredIcons = computed(() => {
    if (!selectedFolderId.value) return icons.value;
    return icons.value.filter(i => i.carpetaId === selectedFolderId.value);
});

const iconCountByFolder = computed(() => {
    const counts = {};
    for (const icon of icons.value) {
        counts[icon.carpetaId] = (counts[icon.carpetaId] || 0) + 1;
    }
    return counts;
});

const fetchData = async () => {
    loading.value = true;
    try {
        const [fRes, iRes] = await Promise.all([
            apiRequest('carpetas'),
            apiRequest('iconos')
        ]);
        if (fRes.success) folders.value = fRes.carpetas || [];
        if (iRes.success) icons.value = iRes.iconos || [];
    } catch (e) {
        console.error(e);
    } finally {
        loading.value = false;
    }
};

onMounted(fetchData);

const copyUrl = (url) => {
    navigator.clipboard.writeText(url);
    showToast('URL copiada al portapapeles');
};

const showTooltip = (icon, e) => {
    tooltip.text = icon.etiqueta || '';
    tooltip.x = e.pageX;
    tooltip.y = e.pageY;
    tooltip.show = true;
};

const moveTooltip = (e) => {
    tooltip.x = e.pageX;
    tooltip.y = e.pageY;
};

const hideTooltip = () => {
    tooltip.show = false;
};

const saveFolder = async () => {
    saving.value = true;
    const res = await apiRequest('carpetas', {
        method: 'POST',
        data: { nombre: folderForm.nombre }
    });
    if (res.success) {
        showAddFolder.value = false;
        folderForm.nombre = '';
        fetchData();
        showToast('Carpeta creada');
    } else alert(res.error);
    saving.value = false;
};

const saveIcon = async () => {
    saving.value = true;
    const res = await apiRequest('iconos', {
        method: 'POST',
        data: {
            nombre: iconForm.nombre,
            carpetaId: iconForm.carpetaId,
            url: iconForm.url
        }
    });
    if (res.success) {
        showUpload.value = false;
        Object.assign(iconForm, { nombre: '', carpetaId: '', url: '' });
        fetchData();
        showToast('Icono agregado');
    } else alert(res.error);
    saving.value = false;
};

const openRenameFolderModal = (folder) => {
    renameFolderForm.id = folder.id;
    renameFolderForm.nombre = folder.nombre;
    showRenameFolderModal.value = true;
};

const handleRenameFolder = async () => {
    saving.value = true;
    const res = await apiRequest(`carpetas/${renameFolderForm.id}`, {
        method: 'PUT',
        data: { nombre: renameFolderForm.nombre }
    });

    if (res.success) {
        showRenameFolderModal.value = false;
        fetchData();
        showToast('Carpeta renombrada');
    } else {
        alert(res.error || 'Error al renombrar');
    }
    saving.value = false;
};

const openRenameModal = (icon) => {
    renameForm.id = icon.id;
    renameForm.nombre = icon.etiqueta;
    showRenameModal.value = true;
};

const handleRename = async () => {
    saving.value = true;
    const res = await apiRequest(`iconos/${renameForm.id}`, {
        method: 'PUT',
        data: { nuevaEtiqueta: renameForm.nombre }
    });

    if (res.success) {
        showRenameModal.value = false;
        fetchData();
        showToast('Etiqueta actualizada');
    } else {
        alert(res.error || 'Error al actualizar etiqueta');
    }
    saving.value = false;
};

const handleDeleteFolder = async (folder) => {
    if (confirm(`¿Estás seguro de eliminar la carpeta "${folder.nombre}"?`)) {
        const res = await apiRequest(`carpetas/${folder.id}`, { method: 'DELETE' });
        if (res.success) {
            if (selectedFolderId.value === folder.id) selectedFolderId.value = null;
            fetchData();
            showToast('Carpeta eliminada');
        } else {
            alert(res.error || 'Error al eliminar la carpeta');
        }
    }
};

const handleDeleteIcon = async (icon) => {
    if (confirm(`¿Estás seguro de eliminar el icono "${icon.etiqueta || icon.url}"?`)) {
        const res = await apiRequest(`iconos/${icon.id}`, { method: 'DELETE' });
        if (res.success) {
            fetchData();
            showToast('Icono eliminado');
        } else {
            alert(res.error || 'Error al eliminar el icono');
        }
    }
};

const showToast = (msg) => {
    toast.value = msg;
    setTimeout(() => { toast.value = null; }, 2000);
};

// --- DRAG AND DROP LOGIC PARA CARPETAS ---
const dragFolderIndex = ref(null);
const dragOverFolderIndex = ref(null);

const onFolderDragStart = (event, index) => {
    dragFolderIndex.value = index;
    event.dataTransfer.effectAllowed = 'move';
    event.dataTransfer.dropEffect = 'move';
};
const onFolderDragEnter = (event, index) => {
    dragOverFolderIndex.value = index;
};
const onFolderDragOver = () => { };
const onFolderDrop = async (event, dropIndex) => {
    if (dragFolderIndex.value !== null && dragFolderIndex.value !== dropIndex) {
        const movedItem = folders.value.splice(dragFolderIndex.value, 1)[0];
        folders.value.splice(dropIndex, 0, movedItem);

        folders.value.forEach((folder, idx) => {
            folder.orden = idx + 1;
        });

        const payload = folders.value.map(f => ({ id: f.id, orden: f.orden }));

        try {
            const res = await apiRequest('carpetas/reorder', { method: 'PUT', data: { carpetas: payload } });
            if (!res.success) throw new Error(res.error);
        } catch (error) {
            console.error('Error reordenando carpetas', error);
            fetchData();
        }
    }
    dragFolderIndex.value = null;
    dragOverFolderIndex.value = null;
};

// --- DRAG AND DROP LOGIC PARA ICONOS ---
const dragIconIndex = ref(null);
const dragOverIconIndex = ref(null);

const onIconDragStart = (event, index) => {
    dragIconIndex.value = index;
    event.dataTransfer.effectAllowed = 'move';
    event.dataTransfer.dropEffect = 'move';
};
const onIconDragEnter = (event, index) => {
    dragOverIconIndex.value = index;
};
const onIconDragOver = () => { };
const onIconDrop = async (event, dropIndex) => {
    if (dragIconIndex.value !== null && dragIconIndex.value !== dropIndex) {

        const currentFilteredIcons = [...filteredIcons.value];
        const draggedGlobalIcon = currentFilteredIcons[dragIconIndex.value];
        const destGlobalIcon = currentFilteredIcons[dropIndex];

        const globalDragIndex = icons.value.findIndex(i => i.id === draggedGlobalIcon.id);
        const globalDropIndex = icons.value.findIndex(i => i.id === destGlobalIcon.id);

        const movedItem = icons.value.splice(globalDragIndex, 1)[0];
        icons.value.splice(globalDropIndex, 0, movedItem);

        currentFilteredIcons.splice(dragIconIndex.value, 1);
        currentFilteredIcons.splice(dropIndex, 0, movedItem);

        currentFilteredIcons.forEach((icon, idx) => {
            icon.orden = idx + 1;
        });

        const payload = currentFilteredIcons.map(i => ({ id: i.id, orden: i.orden }));

        try {
            const res = await apiRequest('iconos/reorder', { method: 'PUT', data: { iconos: payload } });
            if (res.success) {
                // Sucess
            } else throw new Error(res.error);
        } catch (error) {
            console.error('Error reordenando iconos', error);
            fetchData();
        }
    }
    dragIconIndex.value = null;
    dragOverIconIndex.value = null;
};

const onDragEnd = () => {
    dragIconIndex.value = null;
    dragOverIconIndex.value = null;
    dragFolderIndex.value = null;
    dragOverFolderIndex.value = null;
};
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
    width: 6px;
}
.custom-scrollbar::-webkit-scrollbar-track {
    background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
    background: rgba(0, 0, 0, 0.05);
    border-radius: 10px;
}
.dark .custom-scrollbar::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.05);
}
.custom-scrollbar:hover::-webkit-scrollbar-thumb {
    background: rgba(0, 0, 0, 0.1);
}
.dark .custom-scrollbar:hover::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.1);
}
</style>
