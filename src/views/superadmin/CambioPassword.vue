<template>
  <div class="max-w-2xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
    
    <!-- Header Decorativo -->
    <div class="text-center space-y-2">
      <div class="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 mb-2">
        <svg class="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
        </svg>
      </div>
      <h1 class="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Seguridad de la Cuenta</h1>
      <p class="text-slate-500 dark:text-slate-400 text-sm">Actualiza tu contraseña periódicamente para mantener tu cuenta segura.</p>
    </div>

    <!-- Card del Formulario -->
    <div class="bg-white dark:bg-[#1a1a2e] border border-slate-200 dark:border-slate-800 rounded-3xl p-8 shadow-sm">
      <form @submit.prevent="handleSubmit" class="space-y-6">
        
        <!-- Campo: Contraseña Actual -->
        <div class="space-y-2">
          <label class="block text-xs font-black text-slate-400 uppercase tracking-widest px-1">Contraseña Actual</label>
          <div class="relative group">
            <span class="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary-500 transition-colors">
              <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
              </svg>
            </span>
            <input 
              v-model="form.clave" 
              :type="showClave ? 'text' : 'password'"
              placeholder="••••••••••••"
              required
              :disabled="loading"
              class="w-full pl-11 pr-12 py-3.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 transition-all outline-none text-slate-800 dark:text-slate-200"
            />
            <button 
              type="button" 
              @click="showClave = !showClave"
              class="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
            >
              <svg v-if="showClave" class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
              <svg v-else class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
            </button>
          </div>
          <p v-if="fieldError('clave')" class="text-rose-500 text-[10px] font-bold mt-1.5 px-1">{{ fieldError('clave') }}</p>
        </div>

        <hr class="border-slate-100 dark:border-slate-800" />

        <!-- Campo: Nueva Contraseña -->
        <div class="space-y-2">
          <label class="block text-xs font-black text-slate-400 uppercase tracking-widest px-1">Nueva Contraseña</label>
          <div class="relative group">
            <span class="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary-500 transition-colors">
              <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                <path d="M21 2l-2 2M3 21l2-2m4.5-12.5l2 2m4.5 4.5l2 2M15 3h6v6M9 21H3v-6"/><circle cx="12" cy="12" r="3"/>
              </svg>
            </span>
            <input 
              v-model="form.nuevaClave" 
              :type="showNuevaClave ? 'text' : 'password'"
              placeholder="Mínimo 8 caracteres"
              required
              :disabled="loading"
              class="w-full pl-11 pr-12 py-3.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 transition-all outline-none text-slate-800 dark:text-slate-200"
            />
            <button 
              type="button" 
              @click="showNuevaClave = !showNuevaClave"
              class="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
            >
              <svg v-if="showNuevaClave" class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
              <svg v-else class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
            </button>
          </div>
          <p v-if="fieldError('nuevaClave')" class="text-rose-500 text-[10px] font-bold mt-1.5 px-1">{{ fieldError('nuevaClave') }}</p>
        </div>

        <!-- Campo: Confirmar Contraseña -->
        <div class="space-y-2">
          <label class="block text-xs font-black text-slate-400 uppercase tracking-widest px-1">Confirmar Nueva Contraseña</label>
          <div class="relative group">
            <span class="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary-500 transition-colors">
              <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </span>
            <input 
              v-model="form.confirmarClave" 
              type="password"
              placeholder="••••••••••••"
              required
              :disabled="loading"
              class="w-full pl-11 pr-4 py-3.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 transition-all outline-none text-slate-800 dark:text-slate-200"
            />
          </div>
        </div>

        <!-- Alert de Feedback -->
        <div 
          v-if="error || successMessage" 
          class="p-4 rounded-2xl border text-xs font-bold animate-in zoom-in duration-300"
          :class="error 
            ? 'bg-rose-50 dark:bg-rose-900/20 border-rose-100 dark:border-rose-800 text-rose-600 dark:text-rose-400' 
            : 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-100 dark:border-emerald-800 text-emerald-600 dark:text-emerald-400'"
        >
          <div class="flex items-center gap-3">
            <svg v-if="error" class="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
            <svg v-else class="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12" /></svg>
            <span>{{ error || successMessage }}</span>
          </div>
        </div>

        <!-- Botón de Acción -->
        <button 
          type="submit" 
          :disabled="loading"
          class="w-full bg-primary-600 hover:bg-primary-700 text-white font-black py-4 rounded-2xl shadow-xl shadow-primary-500/20 transition-all active:scale-95 disabled:opacity-50 disabled:grayscale flex items-center justify-center gap-3"
        >
          <span v-if="loading" class="w-5 h-5 border-3 border-white/30 border-t-white rounded-full animate-spin"></span>
          <template v-else>
            <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
            Actualizar Contraseña
          </template>
        </button>
      </form>
    </div>

    <!-- Info Adicional -->
    <div class="bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 flex gap-4 items-start">
      <div class="w-10 h-10 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl flex items-center justify-center shrink-0">
        <svg class="w-5 h-5 text-amber-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
        </svg>
      </div>
      <div>
        <h4 class="text-sm font-bold text-slate-800 dark:text-slate-200">¿Qué pasa si olvido mi contraseña?</h4>
        <p class="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
          Como Super Administrador, si pierdes el acceso deberás contactar con el equipo de infraestructura para un reset manual del hash en la base de datos central.
        </p>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, reactive } from 'vue';
import { apiRequest } from '@/api/service';
import { useApiError } from '@/composables/useApiError';

// Composable de manejo de errores estandarizado
const { error, handleError, clearError, fieldError } = useApiError();

const loading = ref(false);
const successMessage = ref('');
const showClave = ref(false);
const showNuevaClave = ref(false);

const form = reactive({
  clave: '',
  nuevaClave: '',
  confirmarClave: ''
});

const handleSubmit = async () => {
  clearError();
  successMessage.value = '';

  // Validaciones del lado del cliente
  if (form.nuevaClave.length < 8) {
    error.value = 'La nueva contraseña debe tener al menos 8 caracteres.';
    return;
  }

  if (form.nuevaClave !== form.confirmarClave) {
    error.value = 'Las contraseñas nuevas no coinciden.';
    return;
  }

  loading.value = true;

  try {
    // LLamada a la API (PUT /api/perfil/password)
    const res = await apiRequest('perfil/password', {
      method: 'PUT',
      data: {
        clave: form.clave,
        nuevaClave: form.nuevaClave
      }
    });

    if (!handleError(res)) {
      successMessage.value = res.mensaje || '¡Contraseña actualizada con éxito!';
      // Limpiar campos de contraseña pero mantener el contexto
      form.clave = '';
      form.nuevaClave = '';
      form.confirmarClave = '';
      
      // Ocultar mensaje de éxito después de unos segundos
      setTimeout(() => {
        successMessage.value = '';
      }, 5000);
    }
  } catch {
    error.value = 'Ocurrió un error inesperado al procesar la solicitud.';
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
/* Transiciones suaves para el feedbak visual */
.animate-shake {
  animation: shake 0.5s cubic-bezier(.36,.07,.19,.97) both;
}

@keyframes shake {
  10%, 90% { transform: translate3d(-1px, 0, 0); }
  20%, 80% { transform: translate3d(2px, 0, 0); }
  30%, 50%, 70% { transform: translate3d(-4px, 0, 0); }
  40%, 60% { transform: translate3d(4px, 0, 0); }
}
</style>
