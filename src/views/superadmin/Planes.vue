<template>
  <div class="space-y-6">
    <section class="relative overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div class="absolute inset-y-0 right-0 hidden w-1/3 bg-grad-primary opacity-10 lg:block" />
      <div class="relative flex flex-col gap-5 px-6 py-6 lg:flex-row lg:items-center lg:justify-between">
        <div class="max-w-3xl space-y-2">
          <div class="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.18em] text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-300">
            Billing Catalog
          </div>
          <h2 class="text-2xl font-black tracking-tight text-slate-900 dark:text-white">
            Planes y almacenamiento
          </h2>
          <p class="text-sm leading-6 text-slate-600 dark:text-slate-300">
            Administra los planes comerciales preparados para suscripciones y Mercado Pago. El Tenant 1 se mantiene
            compatible como <span class="font-bold text-slate-800 dark:text-slate-100">Plan Medio</span>, con
            publicación por URL externa y <span class="font-bold text-slate-800 dark:text-slate-100">0 GB físicos</span>.
          </p>
        </div>

        <div class="flex flex-col gap-3 sm:flex-row">
          <button
            type="button"
            class="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-200 px-4 py-3 text-sm font-bold text-slate-700 transition-all hover:bg-slate-50 dark:border-slate-700 dark:text-slate-100 dark:hover:bg-slate-800"
            :disabled="loading"
            @click="loadPlans"
          >
            <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="23 4 23 10 17 10" />
              <polyline points="1 20 1 14 7 14" />
              <path d="M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15" />
            </svg>
            Actualizar
          </button>
          <button
            type="button"
            class="inline-flex items-center justify-center gap-2 rounded-2xl bg-primary-600 px-4 py-3 text-sm font-bold text-white shadow-sm transition-all hover:-translate-y-0.5 hover:bg-primary-700"
            @click="openCreate"
          >
            <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            Nuevo plan
          </button>
        </div>
      </div>
    </section>

    <section class="grid gap-4 xl:grid-cols-[1.25fr_0.75fr]">
      <article class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p class="text-xs font-bold uppercase tracking-[0.18em] text-slate-400">Compatibilidad</p>
            <h3 class="mt-1 text-lg font-black text-slate-900 dark:text-white">Tenant 1 conservado</h3>
          </div>
          <span class="inline-flex w-fit items-center rounded-full bg-violet-100 px-3 py-1 text-xs font-bold text-violet-700 dark:bg-violet-900/30 dark:text-violet-300">
            Modo heredado
          </span>
        </div>

        <div class="mt-5 grid gap-3 sm:grid-cols-3">
          <div class="rounded-2xl bg-slate-50 p-4 dark:bg-slate-800/60">
            <p class="text-[11px] font-bold uppercase tracking-[0.16em] text-slate-400">Plan</p>
            <p class="mt-2 text-sm font-bold text-slate-800 dark:text-slate-100">{{ legacyPlan.name }}</p>
          </div>
          <div class="rounded-2xl bg-slate-50 p-4 dark:bg-slate-800/60">
            <p class="text-[11px] font-bold uppercase tracking-[0.16em] text-slate-400">Storage físico</p>
            <p class="mt-2 text-sm font-bold text-slate-800 dark:text-slate-100">{{ formatStorage(legacyPlan.storage_limit_gb) }}</p>
          </div>
          <div class="rounded-2xl bg-slate-50 p-4 dark:bg-slate-800/60">
            <p class="text-[11px] font-bold uppercase tracking-[0.16em] text-slate-400">Operación</p>
            <p class="mt-2 text-sm font-bold text-slate-800 dark:text-slate-100">URLs externas</p>
          </div>
        </div>

        <p class="mt-4 text-sm leading-6 text-slate-600 dark:text-slate-300">
          {{ legacyPlan.description }}
        </p>
      </article>

      <article class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <p class="text-xs font-bold uppercase tracking-[0.18em] text-slate-400">Resumen</p>
        <div class="mt-4 space-y-4">
          <div class="rounded-2xl bg-slate-50 p-4 dark:bg-slate-800/60">
            <p class="text-[11px] font-bold uppercase tracking-[0.16em] text-slate-400">Planes activos</p>
            <p class="mt-2 text-3xl font-black text-slate-900 dark:text-white">{{ activeCount }}</p>
          </div>
          <div class="rounded-2xl bg-slate-50 p-4 dark:bg-slate-800/60">
            <p class="text-[11px] font-bold uppercase tracking-[0.16em] text-slate-400">Integración MP</p>
            <p class="mt-2 text-sm font-bold text-slate-800 dark:text-slate-100">{{ mercadopagoCount }} con `mp_plan_id`</p>
          </div>
          <div class="rounded-2xl bg-slate-50 p-4 dark:bg-slate-800/60">
            <p class="text-[11px] font-bold uppercase tracking-[0.16em] text-slate-400">API conectada</p>
            <p class="mt-2 text-sm font-bold text-slate-800 dark:text-slate-100">{{ endpointLabel }}</p>
          </div>
        </div>
      </article>
    </section>

    <div v-if="feedback.message" :class="feedbackClass" class="rounded-2xl border px-4 py-3 text-sm">
      {{ feedback.message }}
    </div>

    <div v-if="loading" class="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
      <div
        v-for="index in 3"
        :key="index"
        class="h-72 animate-pulse rounded-3xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900"
      />
    </div>

    <div v-else class="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
      <article
        v-for="plan in plans"
        :key="plan.id"
        class="flex h-full flex-col rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md dark:border-slate-800 dark:bg-slate-900"
      >
        <div class="flex items-start justify-between gap-3">
          <div class="space-y-2">
            <span class="inline-flex items-center rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-slate-500 dark:bg-slate-800 dark:text-slate-300">
              {{ plan.source === 'new' ? 'Nuevo catálogo' : 'Legacy' }}
            </span>
            <div>
              <h3 class="text-xl font-black tracking-tight text-slate-900 dark:text-white">{{ plan.name }}</h3>
              <p class="mt-1 text-sm leading-6 text-slate-500 dark:text-slate-300">
                {{ plan.description || 'Sin descripción configurada.' }}
              </p>
            </div>
          </div>

          <span
            class="inline-flex rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide"
            :class="plan.is_active
              ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300'
              : 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-300'"
          >
            {{ plan.is_active ? 'Activo' : 'Inactivo' }}
          </span>
        </div>

        <div class="mt-6 flex items-end justify-between gap-3 rounded-2xl bg-slate-50 p-4 dark:bg-slate-800/60">
          <div>
            <p class="text-[11px] font-bold uppercase tracking-[0.16em] text-slate-400">Precio</p>
            <p class="mt-1 text-3xl font-black text-primary-600 dark:text-primary-400">{{ formatCurrency(plan.price) }}</p>
          </div>
          <p class="text-xs font-semibold text-slate-400">por mes</p>
        </div>

        <div class="mt-4 grid grid-cols-2 gap-3">
          <div class="rounded-2xl border border-slate-200 p-4 dark:border-slate-800">
            <p class="text-[11px] font-bold uppercase tracking-[0.16em] text-slate-400">Storage</p>
            <p class="mt-2 text-sm font-bold text-slate-800 dark:text-slate-100">{{ formatStorage(plan.storage_limit_gb) }}</p>
          </div>
          <div class="rounded-2xl border border-slate-200 p-4 dark:border-slate-800">
            <p class="text-[11px] font-bold uppercase tracking-[0.16em] text-slate-400">Mercado Pago</p>
            <p class="mt-2 break-all text-sm font-bold text-slate-800 dark:text-slate-100">
              {{ plan.mp_plan_id || 'Pendiente' }}
            </p>
          </div>
        </div>

        <div class="mt-6 flex items-center gap-3 rounded-2xl border border-slate-200 px-4 py-3 dark:border-slate-800">
          <BaseSwitch
            :model-value="plan.is_active"
            :disabled="saving && activePlanId === plan.id"
            @update:model-value="togglePlan(plan, $event)"
          />
          <div class="min-w-0">
            <p class="text-sm font-bold text-slate-800 dark:text-slate-100">
              {{ plan.is_active ? 'Visible para asignación' : 'Oculto para asignación' }}
            </p>
            <p class="text-xs text-slate-500 dark:text-slate-400">
              {{ plan.is_active ? 'Disponible para nuevos tenants y suscripciones.' : 'No aparecerá en asignaciones nuevas.' }}
            </p>
          </div>
        </div>

        <div class="mt-auto flex gap-2 pt-6">
          <button
            type="button"
            class="flex-1 rounded-2xl border border-primary-200 px-4 py-3 text-sm font-bold text-primary-700 transition-all hover:bg-primary-50 dark:border-primary-900 dark:text-primary-300 dark:hover:bg-primary-950/30"
            @click="openEdit(plan)"
          >
            Editar
          </button>
          <button
            type="button"
            class="rounded-2xl border border-red-200 px-4 py-3 text-sm font-bold text-red-600 transition-all hover:bg-red-50 dark:border-red-900 dark:text-red-300 dark:hover:bg-red-950/30"
            :disabled="saving && activePlanId === plan.id"
            @click="removePlan(plan)"
          >
            Eliminar
          </button>
        </div>
      </article>

      <article
        v-if="!plans.length"
        class="col-span-full rounded-3xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center dark:border-slate-700 dark:bg-slate-900"
      >
        <p class="text-lg font-bold text-slate-700 dark:text-slate-200">No hay planes disponibles todavía.</p>
        <p class="mt-2 text-sm text-slate-500 dark:text-slate-400">
          Crea el primer plan comercial para empezar a gestionar suscripciones.
        </p>
      </article>
    </div>

    <BaseModal :show="showModal" :title="editingId ? 'Editar plan' : 'Nuevo plan'" @close="closeModal">
      <form id="plan-form" class="space-y-4" @submit.prevent="savePlan">
        <BaseInput v-model="form.name" label="Nombre del plan" placeholder="Ej: Plan Pro" required />

        <div class="flex flex-col gap-1.5">
          <label class="text-xs font-bold uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">Descripción</label>
          <textarea
            v-model.trim="form.description"
            rows="4"
            placeholder="Describe qué tipo de suscripción representa este plan."
            class="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800 outline-none transition-all focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
          />
        </div>

        <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div class="flex flex-col gap-1.5">
            <label class="text-xs font-bold uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">Precio mensual</label>
            <input
              v-model.number="form.price"
              type="number"
              min="0"
              step="0.01"
              required
              class="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800 outline-none transition-all focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
            />
          </div>

          <div class="flex flex-col gap-1.5">
            <label class="text-xs font-bold uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">Storage físico (GB)</label>
            <input
              v-model.number="form.storage_limit_gb"
              type="number"
              min="0"
              step="1"
              required
              class="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800 outline-none transition-all focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
            />
          </div>
        </div>

        <BaseInput
          v-model="form.mp_plan_id"
          label="Mercado Pago Plan ID"
          placeholder="Opcional hasta conectar MP"
        />

        <div class="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 dark:border-slate-800 dark:bg-slate-800/60">
          <div class="flex items-center gap-3">
            <BaseSwitch v-model="form.is_active" />
            <div>
              <p class="text-sm font-bold text-slate-800 dark:text-slate-100">Plan activo</p>
              <p class="text-xs text-slate-500 dark:text-slate-400">Disponible para asignación desde el panel global.</p>
            </div>
          </div>
        </div>

        <div v-if="formError" class="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/30 dark:text-red-300">
          {{ formError }}
        </div>
      </form>

      <template #footer>
        <BaseButton variant="secondary" @click="closeModal">Cancelar</BaseButton>
        <BaseButton form="plan-form" type="submit" :loading="saving">
          {{ editingId ? 'Guardar cambios' : 'Crear plan' }}
        </BaseButton>
      </template>
    </BaseModal>
  </div>
</template>

<script setup>
defineOptions({ name: 'SuperadminPlanesView' });

import { computed, onMounted, reactive, ref } from 'vue';
import { apiRequest } from '@/api/service';
import BaseButton from '@/components/BaseButton.vue';
import BaseInput from '@/components/BaseInput.vue';
import BaseModal from '@/components/BaseModal.vue';
import BaseSwitch from '@/components/BaseSwitch.vue';

const loading = ref(true);
const saving = ref(false);
const activePlanId = ref(null);
const showModal = ref(false);
const editingId = ref(null);
const plans = ref([]);
const endpointMode = ref('new');
const feedback = reactive({
  type: '',
  message: '',
});

const legacyPlan = reactive({
  name: 'Plan Medio',
  description: 'Compatibilidad heredada para Tenant 1: publica iconos mediante URLs externas y no consume almacenamiento físico.',
  storage_limit_gb: 0,
});

const form = reactive({
  name: '',
  description: '',
  price: 0,
  storage_limit_gb: 0,
  mp_plan_id: '',
  is_active: true,
});

const formError = ref('');

const endpointLabel = computed(() => endpointMode.value === 'new' ? '`super-admin/plans`' : '`super-admin/planes`');
const activeCount = computed(() => plans.value.filter((plan) => plan.is_active).length);
const mercadopagoCount = computed(() => plans.value.filter((plan) => !!plan.mp_plan_id).length);
const feedbackClass = computed(() => {
  if (feedback.type === 'error') {
    return 'border-red-200 bg-red-50 text-red-700 dark:border-red-900 dark:bg-red-950/30 dark:text-red-300';
  }

  return 'border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950/30 dark:text-emerald-300';
});

function resetFeedback() {
  feedback.type = '';
  feedback.message = '';
}

function setFeedback(type, message) {
  feedback.type = type;
  feedback.message = message;
}

function normalizePlan(rawPlan, source = 'new') {
  return {
    id: rawPlan.id,
    name: rawPlan.name ?? rawPlan.nombre ?? '',
    description: rawPlan.description ?? '',
    price: Number(rawPlan.price ?? rawPlan.precio_mensual ?? 0),
    storage_limit_gb: Number(rawPlan.storage_limit_gb ?? 0),
    mp_plan_id: rawPlan.mp_plan_id ?? '',
    is_active: Boolean(rawPlan.is_active ?? rawPlan.activo ?? false),
    source,
    raw: rawPlan,
  };
}

function buildRequestPayload(plan) {
  if (endpointMode.value === 'new') {
    return {
      name: plan.name.trim(),
      description: plan.description.trim() || null,
      price: Number(plan.price) || 0,
      storage_limit_gb: Number(plan.storage_limit_gb) || 0,
      mp_plan_id: plan.mp_plan_id.trim() || null,
      is_active: !!plan.is_active,
    };
  }

  return {
    nombre: plan.name.trim(),
    precio_mensual: Number(plan.price) || 0,
    max_usuarios: null,
    max_iconos: null,
    activo: !!plan.is_active,
  };
}

async function fetchLegacyProfile() {
  const response = await apiRequest('super-admin/plans/legacy-tenant-one');

  if (!response?.success && response?.data) {
    Object.assign(legacyPlan, response.data);
    return;
  }

  if (response?.data) {
    Object.assign(legacyPlan, response.data);
  }
}

async function loadPlans() {
  loading.value = true;
  resetFeedback();

  const newResponse = await apiRequest('super-admin/plans');

  if (!newResponse?.forbidden && !newResponse?.isNetworkError && !newResponse?.debug?.status && newResponse?.data) {
    endpointMode.value = 'new';
    plans.value = newResponse.data.map((plan) => normalizePlan(plan, 'new'));
    if (newResponse.meta?.legacy_tenant_plan) {
      Object.assign(legacyPlan, newResponse.meta.legacy_tenant_plan);
    } else {
      await fetchLegacyProfile();
    }
    loading.value = false;
    return;
  }

  const legacyResponse = await apiRequest('super-admin/planes');
  endpointMode.value = 'legacy';

  if (legacyResponse?.planes || legacyResponse?.data || Array.isArray(legacyResponse)) {
    const items = legacyResponse.planes || legacyResponse.data || legacyResponse;
    plans.value = items.map((plan) => normalizePlan(plan, 'legacy'));
    loading.value = false;
    setFeedback('success', 'Se cargó el catálogo legacy de planes mientras el endpoint nuevo aún no está disponible.');
    return;
  }

  plans.value = [];
  loading.value = false;
  setFeedback('error', newResponse?.error || legacyResponse?.error || 'No fue posible cargar los planes.');
}

function openCreate() {
  editingId.value = null;
  formError.value = '';
  Object.assign(form, {
    name: '',
    description: '',
    price: 0,
    storage_limit_gb: 0,
    mp_plan_id: '',
    is_active: true,
  });
  showModal.value = true;
}

function openEdit(plan) {
  editingId.value = plan.id;
  formError.value = '';
  Object.assign(form, {
    name: plan.name,
    description: plan.description || '',
    price: plan.price,
    storage_limit_gb: plan.storage_limit_gb,
    mp_plan_id: plan.mp_plan_id || '',
    is_active: plan.is_active,
  });
  showModal.value = true;
}

function closeModal() {
  showModal.value = false;
  formError.value = '';
  editingId.value = null;
}

async function savePlan() {
  if (!form.name.trim()) {
    formError.value = 'El nombre del plan es obligatorio.';
    return;
  }

  saving.value = true;
  formError.value = '';
  resetFeedback();

  const endpoint = endpointMode.value === 'new'
    ? editingId.value ? `super-admin/plans/${editingId.value}` : 'super-admin/plans'
    : editingId.value ? `super-admin/planes/${editingId.value}` : 'super-admin/planes';

  const method = editingId.value ? 'PUT' : 'POST';
  const response = await apiRequest(endpoint, {
    method,
    data: buildRequestPayload(form),
  });

  saving.value = false;

  if (response?.success === false && !response?.id && !response?.data) {
    formError.value = response.error || 'No fue posible guardar el plan.';
    return;
  }

  closeModal();
  setFeedback('success', editingId.value ? 'Plan actualizado correctamente.' : 'Plan creado correctamente.');
  await loadPlans();
}

async function togglePlan(plan, nextValue) {
  saving.value = true;
  activePlanId.value = plan.id;
  resetFeedback();

  const payload = buildRequestPayload({
    ...plan,
    is_active: nextValue,
  });

  const endpoint = endpointMode.value === 'new'
    ? `super-admin/plans/${plan.id}`
    : `super-admin/planes/${plan.id}`;

  const response = await apiRequest(endpoint, {
    method: 'PUT',
    data: payload,
  });

  saving.value = false;
  activePlanId.value = null;

  if (response?.success === false && !response?.data) {
    setFeedback('error', response.error || 'No fue posible actualizar el estado del plan.');
    return;
  }

  setFeedback('success', `Plan ${nextValue ? 'activado' : 'desactivado'} correctamente.`);
  await loadPlans();
}

async function removePlan(plan) {
  if (!window.confirm(`¿Eliminar el plan "${plan.name}"?`)) {
    return;
  }

  saving.value = true;
  activePlanId.value = plan.id;
  resetFeedback();

  const endpoint = endpointMode.value === 'new'
    ? `super-admin/plans/${plan.id}`
    : `super-admin/planes/${plan.id}`;

  const response = await apiRequest(endpoint, {
    method: 'DELETE',
  });

  saving.value = false;
  activePlanId.value = null;

  if (response?.success === false && !response?.message) {
    setFeedback('error', response.error || 'No fue posible eliminar el plan.');
    return;
  }

  setFeedback('success', 'Plan eliminado correctamente.');
  await loadPlans();
}

function formatCurrency(value) {
  return new Intl.NumberFormat('es-CL', {
    style: 'currency',
    currency: 'CLP',
    maximumFractionDigits: 0,
  }).format(Number(value) || 0);
}

function formatStorage(value) {
  const amount = Number(value) || 0;
  return amount === 0 ? '0 GB' : `${amount} GB`;
}

onMounted(loadPlans);
</script>
