<script setup>
import { ref, reactive } from "vue";
import { registerAgencia } from "@/api/registro";

// ── Estado del formulario ──────────────────────────────────────────
const form = reactive({
  nombre: "",
  email: "",
  password: "",
  telefono: "",
});

const loading = ref(false);
const fieldErrors = reactive({});
const globalError = ref("");
const result = ref(null);

// ── Envío ──────────────────────────────────────────────────────────
async function handleSubmit() {
  Object.keys(fieldErrors).forEach((k) => delete fieldErrors[k]);
  globalError.value = "";
  loading.value = true;

  const payload = {
    nombre: form.nombre.trim(),
    email: form.email.trim(),
    ...(form.telefono.trim() && { telefono: form.telefono.trim() }),
    ...(form.password.trim() && { password: form.password.trim() }),
  };

  const data = await registerAgencia(payload);
  loading.value = false;

  if (data.success) {
    result.value = data;
    return;
  }

  if (data.errors) {
    Object.assign(fieldErrors, data.errors);
    const firstMsg = Object.values(data.errors)[0];
    globalError.value = Array.isArray(firstMsg) ? firstMsg[0] : firstMsg;
  } else {
    globalError.value = data.error || "Ocurrió un error inesperado. Intenta de nuevo.";
  }
}

function fieldError(key) {
  const err = fieldErrors[key];
  return Array.isArray(err) ? err[0] : err || "";
}

function copyToClipboard(text) {
  navigator.clipboard.writeText(text).catch(() => {});
}
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 via-white to-violet-50 flex flex-col">

    <!-- ── Navbar ──────────────────────────────────────────────────── -->
    <header class="sticky top-0 z-50 bg-white/90 backdrop-blur border-b border-slate-100">
      <div class="max-w-5xl mx-auto px-6 h-[64px] flex items-center justify-between">
        <RouterLink to="/" class="flex items-center gap-2.5 group">
          <div
            class="w-8 h-8 rounded-xl flex items-center justify-center shadow-md shadow-violet-400/30 flex-shrink-0"
            style="background: linear-gradient(135deg, #0e2458, #219e83, #68e4c7)"
          >
            <svg class="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
              <path d="M4 6h16M4 12h10M4 18h7" />
            </svg>
          </div>
          <span class="font-bold text-[1.1rem] tracking-tight text-slate-900">
            aiconic<span class="text-violet-500">.</span>
          </span>
        </RouterLink>

        <RouterLink
          to="/login"
          class="text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors"
        >
          Ya tengo cuenta →
        </RouterLink>
      </div>
    </header>

    <!-- ── Contenido principal ─────────────────────────────────────── -->
    <main class="flex-1 flex items-center justify-center px-4 py-14">

      <!-- Estado de Éxito -->
      <Transition
        enter-active-class="transition duration-500 ease-out"
        enter-from-class="opacity-0 translate-y-4 scale-95"
        enter-to-class="opacity-100 translate-y-0 scale-100"
      >
        <div v-if="result" class="w-full max-w-md">
          <div class="bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden">

            <!-- Cabecera éxito -->
            <div
              class="px-8 py-7 text-white"
              style="background: linear-gradient(135deg, #0e2458, #219e83)"
            >
              <div class="flex items-center gap-3 mb-1">
                <div class="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center">
                  <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M20 6L9 17l-5-5" />
                  </svg>
                </div>
                <h2 class="text-xl font-bold">¡Agencia creada!</h2>
              </div>
              <p class="text-sm text-white/80 ml-12">
                Tu período de prueba de 14 días ha comenzado.
              </p>
            </div>

            <!-- Datos de acceso -->
            <div class="px-8 py-6 space-y-4">
              <p class="text-sm font-semibold text-slate-700 uppercase tracking-wider">
                Tus credenciales de acceso
              </p>

              <!-- Agencia -->
              <div class="rounded-xl bg-slate-50 border border-slate-100 px-4 py-3">
                <p class="text-xs text-slate-400 mb-0.5">Agencia</p>
                <p class="font-semibold text-slate-800">{{ result.agencia.nombre }}</p>
              </div>

              <!-- Email -->
              <div class="rounded-xl bg-slate-50 border border-slate-100 px-4 py-3">
                <p class="text-xs text-slate-400 mb-0.5">Email</p>
                <p class="font-semibold text-slate-800">{{ result.usuario.email }}</p>
              </div>

              <!-- Contraseña -->
              <div class="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3">
                <div class="flex items-center justify-between mb-0.5">
                  <p class="text-xs text-amber-600 font-medium">Contraseña — guárdala ahora</p>
                  <button
                    type="button"
                    class="text-xs text-violet-600 hover:text-violet-800 font-medium transition-colors"
                    @click="copyToClipboard(result.password)"
                  >
                    Copiar
                  </button>
                </div>
                <p class="font-mono font-bold text-slate-900 text-lg tracking-wider">
                  {{ result.password }}
                </p>
              </div>

              <p class="text-xs text-slate-400 leading-relaxed">
                ⚠️ Esta contraseña no se mostrará de nuevo. Guárdala en un lugar seguro antes de continuar.
              </p>
            </div>

            <!-- Acción -->
            <div class="px-8 pb-7">
              <RouterLink
                :to="`/login`"
                class="block w-full text-center py-3 px-6 rounded-xl font-semibold text-white text-sm transition-all shadow-md shadow-violet-400/30 hover:shadow-violet-400/50 hover:-translate-y-0.5 active:translate-y-0"
                style="background: linear-gradient(135deg, #7c3aed, #5b21b6)"
              >
                Iniciar sesión →
              </RouterLink>
            </div>
          </div>
        </div>
      </Transition>

      <!-- Formulario de Registro -->
      <Transition
        enter-active-class="transition duration-300 ease-out"
        enter-from-class="opacity-0 translate-y-4"
        enter-to-class="opacity-100 translate-y-0"
      >
        <div v-if="!result" class="w-full max-w-md">

          <!-- Encabezado -->
          <div class="text-center mb-8">
            <div
              class="inline-flex w-14 h-14 rounded-2xl items-center justify-center mb-4 shadow-lg shadow-violet-400/25"
              style="background: linear-gradient(135deg, #0e2458, #219e83, #68e4c7)"
            >
              <svg class="w-7 h-7 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
                <polyline points="9 22 9 12 15 12 15 22" />
              </svg>
            </div>
            <h1 class="text-2xl font-bold text-slate-900 tracking-tight">Crea tu agencia</h1>
            <p class="text-slate-500 text-sm mt-1.5">14 días de prueba gratis · Sin tarjeta de crédito</p>
          </div>

          <!-- Card -->
          <div class="bg-white rounded-2xl shadow-xl border border-slate-100 p-8 space-y-5">

            <!-- Error global -->
            <Transition
              enter-active-class="transition duration-200 ease-out"
              enter-from-class="opacity-0 -translate-y-2"
              enter-to-class="opacity-100 translate-y-0"
            >
              <div
                v-if="globalError"
                class="flex items-start gap-3 rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700"
              >
                <svg class="w-4 h-4 mt-0.5 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
                <span>{{ globalError }}</span>
              </div>
            </Transition>

            <form class="space-y-5" novalidate @submit.prevent="handleSubmit">

              <!-- Nombre de la agencia -->
              <div>
                <label class="block text-sm font-medium text-slate-700 mb-1.5" for="nombre">
                  Nombre de la agencia <span class="text-violet-500">*</span>
                </label>
                <input
                  id="nombre"
                  v-model="form.nombre"
                  type="text"
                  placeholder="Ej. Agencia Central S.A."
                  autocomplete="organization"
                  :class="[
                    'w-full rounded-xl border px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400',
                    'outline-none transition focus:ring-2',
                    fieldError('nombre')
                      ? 'border-red-300 bg-red-50 focus:border-red-400 focus:ring-red-200'
                      : 'border-slate-200 bg-slate-50 focus:border-violet-400 focus:ring-violet-100 focus:bg-white',
                  ]"
                />
                <p v-if="fieldError('nombre')" class="mt-1.5 text-xs text-red-600">
                  {{ fieldError("nombre") }}
                </p>
              </div>

              <!-- Email del administrador -->
              <div>
                <label class="block text-sm font-medium text-slate-700 mb-1.5" for="email">
                  Email del administrador <span class="text-violet-500">*</span>
                </label>
                <input
                  id="email"
                  v-model="form.email"
                  type="email"
                  placeholder="admin@tuagencia.com"
                  autocomplete="email"
                  :class="[
                    'w-full rounded-xl border px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400',
                    'outline-none transition focus:ring-2',
                    fieldError('email')
                      ? 'border-red-300 bg-red-50 focus:border-red-400 focus:ring-red-200'
                      : 'border-slate-200 bg-slate-50 focus:border-violet-400 focus:ring-violet-100 focus:bg-white',
                  ]"
                />
                <p v-if="fieldError('email')" class="mt-1.5 text-xs text-red-600">
                  {{ fieldError("email") }}
                </p>
              </div>

              <!-- Contraseña (opcional) -->
              <div>
                <label class="block text-sm font-medium text-slate-700 mb-1.5" for="password">
                  Contraseña
                  <span class="text-slate-400 font-normal">(opcional)</span>
                </label>
                <input
                  id="password"
                  v-model="form.password"
                  type="password"
                  placeholder="Se generará automáticamente si la omites"
                  autocomplete="new-password"
                  :class="[
                    'w-full rounded-xl border px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400',
                    'outline-none transition focus:ring-2',
                    fieldError('password')
                      ? 'border-red-300 bg-red-50 focus:border-red-400 focus:ring-red-200'
                      : 'border-slate-200 bg-slate-50 focus:border-violet-400 focus:ring-violet-100 focus:bg-white',
                  ]"
                />
                <p v-if="fieldError('password')" class="mt-1.5 text-xs text-red-600">
                  {{ fieldError("password") }}
                </p>
                <p v-else class="mt-1.5 text-xs text-slate-400">
                  Mínimo 8 caracteres. Si no proporcionas una, el sistema generará una segura.
                </p>
              </div>

              <!-- Teléfono (opcional) -->
              <div>
                <label class="block text-sm font-medium text-slate-700 mb-1.5" for="telefono">
                  Teléfono
                  <span class="text-slate-400 font-normal">(opcional)</span>
                </label>
                <input
                  id="telefono"
                  v-model="form.telefono"
                  type="tel"
                  placeholder="+56 9 1234 5678"
                  autocomplete="tel"
                  :class="[
                    'w-full rounded-xl border px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400',
                    'outline-none transition focus:ring-2',
                    fieldError('telefono')
                      ? 'border-red-300 bg-red-50 focus:border-red-400 focus:ring-red-200'
                      : 'border-slate-200 bg-slate-50 focus:border-violet-400 focus:ring-violet-100 focus:bg-white',
                  ]"
                />
              </div>

              <!-- Botón submit -->
              <button
                type="submit"
                :disabled="loading"
                class="w-full py-3 px-6 rounded-xl font-semibold text-white text-sm transition-all shadow-md shadow-violet-400/30 hover:shadow-violet-400/50 hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-md mt-2"
                style="background: linear-gradient(135deg, #7c3aed, #5b21b6)"
              >
                <span v-if="loading" class="inline-flex items-center gap-2">
                  <svg class="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Creando agencia…
                </span>
                <span v-else>Crear mi agencia →</span>
              </button>
            </form>

            <p class="text-center text-xs text-slate-400 pt-1">
              ¿Ya tienes cuenta?
              <RouterLink to="/login" class="text-violet-600 hover:text-violet-800 font-medium transition-colors">
                Inicia sesión
              </RouterLink>
            </p>
          </div>

          <!-- Trust badges -->
          <div class="flex items-center justify-center gap-5 mt-6 text-xs text-slate-400">
            <span class="flex items-center gap-1.5">
              <svg class="w-3.5 h-3.5 text-emerald-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <path d="M20 6L9 17l-5-5" />
              </svg>
              Sin tarjeta de crédito
            </span>
            <span class="flex items-center gap-1.5">
              <svg class="w-3.5 h-3.5 text-emerald-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <path d="M20 6L9 17l-5-5" />
              </svg>
              14 días de prueba gratis
            </span>
            <span class="flex items-center gap-1.5">
              <svg class="w-3.5 h-3.5 text-emerald-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <path d="M20 6L9 17l-5-5" />
              </svg>
              Cancelación inmediata
            </span>
          </div>
        </div>
      </Transition>

    </main>

    <!-- ── Footer mínimo ───────────────────────────────────────────── -->
    <footer class="py-5 text-center text-xs text-slate-400 border-t border-slate-100">
      © {{ new Date().getFullYear() }} aiconic. Todos los derechos reservados.
    </footer>

  </div>
</template>
