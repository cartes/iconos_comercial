<template>
  <div class="min-h-screen bg-grad-primary flex items-center justify-center p-5">
    <div class="w-full max-w-md bg-white dark:bg-[#1e1e2d] rounded-2xl shadow-2xl overflow-hidden">
      <!-- Header -->
      <div class="bg-grad-primary p-8 text-center">
        <div class="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-2xl mb-4">
          <svg class="w-8 h-8 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
            <circle cx="8.5" cy="7" r="4"/>
            <line x1="20" y1="8" x2="20" y2="14"/>
            <line x1="23" y1="11" x2="17" y2="11"/>
          </svg>
        </div>
        <h1 class="text-2xl font-bold text-white">Invitación de acceso</h1>
        <p class="text-white/70 text-sm mt-1">Configura tu cuenta para continuar</p>
      </div>

      <!-- Loading -->
      <div v-if="verifying" class="p-10 flex flex-col items-center gap-4 text-slate-400">
        <div class="w-8 h-8 border-4 border-primary-500/20 border-t-primary-500 rounded-full animate-spin"></div>
        <p class="text-sm">Verificando invitación…</p>
      </div>

      <!-- Error (invalid/expired token) -->
      <div v-else-if="tokenError" class="p-8 text-center">
        <div class="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg class="w-7 h-7 text-red-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/>
          </svg>
        </div>
        <h2 class="text-lg font-bold text-slate-800 dark:text-white mb-2">Invitación no válida</h2>
        <p class="text-slate-500 text-sm">{{ tokenError }}</p>
        <router-link to="/login" class="mt-5 inline-block text-primary-600 hover:underline text-sm font-semibold">
          Ir al inicio de sesión →
        </router-link>
      </div>

      <!-- Success state -->
      <div v-else-if="accepted" class="p-8 text-center">
        <div class="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg class="w-7 h-7 text-green-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>
          </svg>
        </div>
        <h2 class="text-lg font-bold text-slate-800 dark:text-white mb-2">¡Bienvenido!</h2>
        <p class="text-slate-500 text-sm">{{ successMsg }}</p>
        <router-link
          :to="invitationData ? `/login` : '/login'"
          class="mt-5 inline-block bg-grad-primary text-white font-bold px-6 py-2.5 rounded-lg text-sm shadow-md hover:brightness-110 transition-all"
        >
          Iniciar sesión
        </router-link>
      </div>

      <!-- Invitation form -->
      <div v-else-if="invitationData" class="p-8">
        <!-- Invitation details banner -->
        <div class="bg-primary-50 dark:bg-primary-900/20 border border-primary-200 dark:border-primary-800 rounded-xl p-4 mb-6">
          <div class="flex items-start gap-3">
            <svg class="w-5 h-5 text-primary-600 shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
            </svg>
            <div>
              <p class="text-sm font-semibold text-primary-700 dark:text-primary-300">
                {{ invitationData.tenant_nombre }}
              </p>
              <p class="text-xs text-primary-600/70 dark:text-primary-400 mt-0.5">
                Rol asignado:
                <span class="font-bold uppercase">{{ invitationData.rol }}</span>
                · Para: <span class="font-mono">{{ invitationData.email }}</span>
              </p>
            </div>
          </div>
        </div>

        <!-- Existing user: just confirm to join -->
        <div v-if="invitationData.usuario_existe">
          <p class="text-sm text-slate-600 dark:text-slate-400 mb-6">
            Tu cuenta (<strong>{{ invitationData.email }}</strong>) ya existe.
            Al confirmar quedarás asociado a <strong>{{ invitationData.tenant_nombre }}</strong>.
          </p>
          <button
            @click="handleAccept"
            :disabled="submitting"
            class="w-full bg-grad-primary text-white font-bold py-3 rounded-xl shadow-md hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-60"
          >
            <div v-if="submitting" class="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin"></div>
            {{ submitting ? 'Procesando…' : 'Confirmar y unirme' }}
          </button>
        </div>

        <!-- New user: registration form -->
        <form v-else @submit.prevent="handleAccept" class="flex flex-col gap-4">
          <p class="text-sm text-slate-500 dark:text-slate-400 -mt-2 mb-1">
            Crea tu contraseña para activar tu cuenta en <strong>{{ invitationData.tenant_nombre }}</strong>.
          </p>

          <div class="flex flex-col gap-1.5">
            <label class="text-sm font-semibold text-slate-700 dark:text-slate-300">Nombre completo</label>
            <input
              v-model="form.nombre"
              type="text"
              placeholder="Juan Pérez"
              required
              class="w-full px-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all text-sm"
            />
          </div>

          <div class="flex flex-col gap-1.5">
            <label class="text-sm font-semibold text-slate-700 dark:text-slate-300">Correo electrónico</label>
            <input
              :value="invitationData.email"
              type="email"
              disabled
              class="w-full px-4 py-2.5 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-500 dark:text-slate-400 text-sm cursor-not-allowed"
            />
          </div>

          <div class="flex flex-col gap-1.5">
            <label class="text-sm font-semibold text-slate-700 dark:text-slate-300">Contraseña</label>
            <input
              v-model="form.clave"
              type="password"
              placeholder="Mínimo 8 caracteres"
              required
              minlength="8"
              class="w-full px-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all text-sm"
            />
          </div>

          <div class="flex flex-col gap-1.5">
            <label class="text-sm font-semibold text-slate-700 dark:text-slate-300">Confirmar contraseña</label>
            <input
              v-model="form.clave_confirmation"
              type="password"
              placeholder="Repite la contraseña"
              required
              class="w-full px-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all text-sm"
              :class="{ 'border-red-400 focus:border-red-400 focus:ring-red-400/20': passwordMismatch }"
            />
            <p v-if="passwordMismatch" class="text-xs text-red-500 mt-0.5">Las contraseñas no coinciden.</p>
          </div>

          <!-- Submission error -->
          <div v-if="submitError" class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 text-sm rounded-lg px-4 py-3">
            {{ submitError }}
          </div>

          <button
            type="submit"
            :disabled="submitting || passwordMismatch"
            class="w-full bg-grad-primary text-white font-bold py-3 rounded-xl shadow-md hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-60 mt-1"
          >
            <div v-if="submitting" class="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin"></div>
            {{ submitting ? 'Creando cuenta…' : 'Crear cuenta y unirme' }}
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { useInvitationsStore } from '@/stores/invitations';

const route = useRoute();
const invStore = useInvitationsStore();

const verifying     = ref(true);
const tokenError    = ref(null);
const invitationData = ref(null);
const accepted      = ref(false);
const successMsg    = ref('');
const submitting    = ref(false);
const submitError   = ref(null);

const form = ref({
  nombre: '',
  clave: '',
  clave_confirmation: '',
});

const passwordMismatch = computed(
  () => form.value.clave_confirmation.length > 0 && form.value.clave !== form.value.clave_confirmation,
);

onMounted(async () => {
  const token = route.params.token;
  const res = await invStore.verifyToken(token);
  verifying.value = false;

  if (res.success) {
    invitationData.value = res.invitacion;
  } else {
    tokenError.value = res.error;
  }
});

async function handleAccept() {
  submitError.value = null;
  submitting.value = true;

  const token = route.params.token;
  const payload = invitationData.value?.usuario_existe
    ? {}
    : {
        nombre: form.value.nombre,
        clave: form.value.clave,
        clave_confirmation: form.value.clave_confirmation,
      };

  const res = await invStore.acceptInvitation(token, payload);
  submitting.value = false;

  if (res.success) {
    accepted.value = true;
    successMsg.value = res.mensaje || '¡Cuenta activada! Ya puedes iniciar sesión.';
  } else {
    submitError.value = res.error;
  }
}
</script>
