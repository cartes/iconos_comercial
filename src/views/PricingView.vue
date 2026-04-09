<template>
  <div class="pricing-root min-h-screen bg-[linear-gradient(180deg,#f8fbff_0%,#ffffff_34%,#f8fafc_100%)] text-slate-900">
    <header class="sticky top-0 z-40 border-b border-slate-200/80 bg-white/92 backdrop-blur-md">
      <div class="mx-auto flex h-[72px] max-w-7xl items-center justify-between px-6 xl:px-10">
        <RouterLink to="/" class="flex items-center gap-3">
          <div
            class="flex h-9 w-9 items-center justify-center rounded-xl shadow-md shadow-emerald-200/50"
            style="background: linear-gradient(135deg, #0e2458, #00674f, #68e4c7)"
          >
            <svg class="h-4 w-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.3">
              <path d="M4 6h16M4 12h10M4 18h7" />
            </svg>
          </div>
          <div>
            <p class="pricing-brand text-lg font-black tracking-tight">aiconic<span class="text-emerald-500">.</span></p>
            <p class="text-[10px] font-bold uppercase tracking-[0.22em] text-slate-400">Planes comerciales</p>
          </div>
        </RouterLink>

        <nav class="hidden items-center gap-7 text-sm font-semibold text-slate-500 md:flex">
          <a href="#comparativa" class="transition-colors hover:text-slate-900">Comparativa</a>
          <a href="#beneficios" class="transition-colors hover:text-slate-900">Beneficios</a>
          <a href="#faq" class="transition-colors hover:text-slate-900">FAQ</a>
        </nav>

        <div class="flex items-center gap-3">
          <RouterLink
            to="/"
            class="hidden rounded-full border border-slate-200 px-4 py-2 text-sm font-bold text-slate-600 transition-colors hover:bg-slate-50 sm:inline-flex"
          >
            Volver al sitio
          </RouterLink>
          <RouterLink
            to="/login"
            class="inline-flex items-center rounded-full bg-slate-900 px-4 py-2 text-sm font-bold text-white transition-colors hover:bg-slate-800"
          >
            Iniciar sesión
          </RouterLink>
        </div>
      </div>
    </header>

    <main>
      <section class="relative overflow-hidden">
        <div class="absolute inset-0 pointer-events-none">
          <div class="absolute -left-28 top-10 h-72 w-72 rounded-full bg-emerald-200/30 blur-3xl" />
          <div class="absolute right-0 top-0 h-96 w-96 rounded-full bg-sky-200/30 blur-3xl" />
          <div class="pricing-grid absolute inset-0 opacity-40" />
        </div>

        <div class="relative mx-auto max-w-7xl px-6 pb-16 pt-16 xl:px-10 xl:pb-20 xl:pt-20">
          <div class="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
            <div class="max-w-2xl">
              <div class="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-1.5 text-[11px] font-black uppercase tracking-[0.22em] text-emerald-700">
                Suscripciones Aiconic
              </div>
              <h1 class="pricing-display mt-6 text-4xl font-black leading-none tracking-tight text-slate-950 sm:text-5xl xl:text-6xl">
                Planes claros,
                <span class="pricing-gradient block">sin fricción</span>
              </h1>
              <p class="mt-6 max-w-xl text-lg leading-8 text-slate-600">
                Elige el nivel que mejor se ajusta a tu operación. Todos los planes incluyen acceso al panel,
                organización visual, gestión multi-tenant y una experiencia lista para evolucionar hacia cobro online.
              </p>

              <div class="mt-8 flex flex-wrap gap-3">
                <a
                  href="#comparativa"
                  class="inline-flex items-center rounded-full bg-primary-600 px-6 py-3 text-sm font-black text-white shadow-lg shadow-emerald-200 transition-all hover:-translate-y-0.5 hover:bg-primary-700"
                >
                  Ver planes
                </a>
                <button
                  type="button"
                  disabled
                  class="inline-flex cursor-not-allowed items-center rounded-full border border-slate-300 px-6 py-3 text-sm font-bold text-slate-400"
                  title="Próximamente"
                >
                  Ir al pago
                </button>
              </div>

              <div class="mt-10 grid gap-3 sm:grid-cols-3">
                <div class="rounded-2xl border border-white/80 bg-white/90 p-4 shadow-sm backdrop-blur">
                  <p class="text-[11px] font-bold uppercase tracking-[0.16em] text-slate-400">Implementación</p>
                  <p class="mt-2 text-sm font-black text-slate-800">Panel listo</p>
                </div>
                <div class="rounded-2xl border border-white/80 bg-white/90 p-4 shadow-sm backdrop-blur">
                  <p class="text-[11px] font-bold uppercase tracking-[0.16em] text-slate-400">Cobro</p>
                  <p class="mt-2 text-sm font-black text-slate-800">Mercado Pago-ready</p>
                </div>
                <div class="rounded-2xl border border-white/80 bg-white/90 p-4 shadow-sm backdrop-blur">
                  <p class="text-[11px] font-bold uppercase tracking-[0.16em] text-slate-400">Tenant 1</p>
                  <p class="mt-2 text-sm font-black text-slate-800">Compatibilidad total</p>
                </div>
              </div>
            </div>

            <div class="grid gap-4 md:grid-cols-3">
              <article
                v-for="plan in plans"
                :key="plan.name"
                class="relative flex h-full flex-col overflow-hidden rounded-[28px] border p-6 shadow-sm transition-transform duration-200 hover:-translate-y-1"
                :class="plan.featured
                  ? 'border-slate-900 bg-slate-900 text-white shadow-xl shadow-slate-300/30'
                  : 'border-slate-200 bg-white text-slate-900'"
              >
                <div
                  v-if="plan.badge"
                  class="mb-4 inline-flex w-fit rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-[0.18em]"
                  :class="plan.featured ? 'bg-white/12 text-emerald-200' : 'bg-emerald-50 text-emerald-700'"
                >
                  {{ plan.badge }}
                </div>

                <div class="space-y-2">
                  <h2 class="text-2xl font-black tracking-tight">{{ plan.name }}</h2>
                  <p
                    class="text-sm leading-6"
                    :class="plan.featured ? 'text-slate-300' : 'text-slate-600'"
                  >
                    {{ plan.description }}
                  </p>
                </div>

                <div class="mt-6 rounded-2xl px-4 py-4" :class="plan.featured ? 'bg-white/6' : 'bg-slate-50'">
                  <p class="text-[11px] font-bold uppercase tracking-[0.16em]" :class="plan.featured ? 'text-slate-400' : 'text-slate-400'">
                    Precio mensual
                  </p>
                  <div class="mt-2 flex items-end gap-2">
                    <span class="text-4xl font-black tracking-tight">{{ plan.price }}</span>
                    <span class="pb-1 text-sm font-semibold" :class="plan.featured ? 'text-slate-400' : 'text-slate-500'">/ mes</span>
                  </div>
                </div>

                <div class="mt-5 grid grid-cols-2 gap-3">
                  <div class="rounded-2xl border px-4 py-3" :class="plan.featured ? 'border-white/10 bg-white/4' : 'border-slate-200 bg-white'">
                    <p class="text-[11px] font-bold uppercase tracking-[0.16em]" :class="plan.featured ? 'text-slate-500' : 'text-slate-400'">Storage</p>
                    <p class="mt-2 text-sm font-black">{{ plan.storage }}</p>
                  </div>
                  <div class="rounded-2xl border px-4 py-3" :class="plan.featured ? 'border-white/10 bg-white/4' : 'border-slate-200 bg-white'">
                    <p class="text-[11px] font-bold uppercase tracking-[0.16em]" :class="plan.featured ? 'text-slate-500' : 'text-slate-400'">Tenants</p>
                    <p class="mt-2 text-sm font-black">{{ plan.tenants }}</p>
                  </div>
                </div>

                <ul class="mt-6 space-y-3">
                  <li
                    v-for="feature in plan.features"
                    :key="feature"
                    class="flex items-start gap-3 text-sm leading-6"
                    :class="plan.featured ? 'text-slate-200' : 'text-slate-600'"
                  >
                    <span
                      class="mt-1 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full"
                      :class="plan.featured ? 'bg-emerald-400/15 text-emerald-300' : 'bg-emerald-50 text-emerald-700'"
                    >
                      <svg class="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    </span>
                    <span>{{ feature }}</span>
                  </li>
                </ul>

                <button
                  type="button"
                  disabled
                  class="mt-auto inline-flex w-full cursor-not-allowed items-center justify-center rounded-2xl px-5 py-3 text-sm font-black transition-all"
                  :class="plan.featured
                    ? 'bg-white text-slate-900 opacity-70'
                    : 'border border-slate-200 bg-slate-100 text-slate-400'"
                  :title="`Botón de pago para ${plan.name} aún no vinculado`"
                >
                  Ir al pago
                </button>
              </article>
            </div>
          </div>
        </div>
      </section>

      <section id="comparativa" class="mx-auto max-w-7xl px-6 py-8 xl:px-10 xl:py-12">
        <div class="rounded-[32px] border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <div class="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p class="text-xs font-black uppercase tracking-[0.22em] text-slate-400">Comparativa</p>
              <h2 class="pricing-display mt-2 text-3xl font-black tracking-tight text-slate-950">Qué incluye cada plan</h2>
            </div>
            <p class="max-w-xl text-sm leading-6 text-slate-500">
              La estructura comercial ya contempla el caso heredado del Tenant 1: uso por URLs externas y sin consumo de almacenamiento físico.
            </p>
          </div>

          <div class="mt-8 overflow-x-auto">
            <table class="min-w-full border-separate border-spacing-y-3">
              <thead>
                <tr>
                  <th class="px-4 py-3 text-left text-[11px] font-black uppercase tracking-[0.18em] text-slate-400">Característica</th>
                  <th
                    v-for="plan in plans"
                    :key="`${plan.name}-head`"
                    class="px-4 py-3 text-left text-[11px] font-black uppercase tracking-[0.18em] text-slate-400"
                  >
                    {{ plan.name }}
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="row in comparisonRows" :key="row.label">
                  <td class="rounded-l-2xl border border-r-0 border-slate-200 bg-slate-50 px-4 py-4 text-sm font-bold text-slate-700">
                    {{ row.label }}
                  </td>
                  <td
                    v-for="(value, index) in row.values"
                    :key="`${row.label}-${index}`"
                    class="border border-slate-200 bg-white px-4 py-4 text-sm text-slate-600 last:rounded-r-2xl"
                  >
                    {{ value }}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section id="beneficios" class="mx-auto max-w-7xl px-6 py-10 xl:px-10 xl:py-14">
        <div class="grid gap-4 md:grid-cols-3">
          <article
            v-for="benefit in benefits"
            :key="benefit.title"
            class="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm"
          >
            <div class="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl" :style="{ background: benefit.bg }">
              <svg class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path v-for="path in benefit.paths" :key="path" :d="path" />
              </svg>
            </div>
            <h3 class="text-lg font-black tracking-tight text-slate-900">{{ benefit.title }}</h3>
            <p class="mt-3 text-sm leading-6 text-slate-600">{{ benefit.description }}</p>
          </article>
        </div>
      </section>

      <section class="mx-auto max-w-7xl px-6 py-8 xl:px-10 xl:py-12">
        <div class="overflow-hidden rounded-[34px] border border-slate-200 bg-slate-950 px-7 py-10 text-white sm:px-10">
          <div class="grid gap-8 lg:grid-cols-[1fr_0.45fr] lg:items-center">
            <div>
              <p class="text-xs font-black uppercase tracking-[0.22em] text-emerald-300">Pago próximamente</p>
              <h2 class="pricing-display mt-3 text-3xl font-black leading-tight sm:text-4xl">
                El flujo de pago ya está contemplado,
                <span class="text-slate-400">solo falta activar el link final.</span>
              </h2>
              <p class="mt-4 max-w-2xl text-sm leading-7 text-slate-300">
                La página ya muestra la oferta comercial y cada plan tiene su botón visible. Cuando conectemos Mercado Pago,
                solo habrá que enlazar el CTA con el checkout correspondiente.
              </p>
            </div>
            <div class="flex flex-col gap-3">
              <button
                type="button"
                disabled
                class="inline-flex cursor-not-allowed items-center justify-center rounded-2xl bg-white px-5 py-3 text-sm font-black text-slate-900 opacity-70"
              >
                Ir al pago
              </button>
              <RouterLink
                to="/login"
                class="inline-flex items-center justify-center rounded-2xl border border-white/15 px-5 py-3 text-sm font-black text-white transition-colors hover:bg-white/5"
              >
                Entrar al panel
              </RouterLink>
            </div>
          </div>
        </div>
      </section>

      <section id="faq" class="mx-auto max-w-7xl px-6 py-10 xl:px-10 xl:py-14">
        <div class="grid gap-4 md:grid-cols-3">
          <article v-for="item in faq" :key="item.question" class="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
            <p class="text-base font-black tracking-tight text-slate-900">{{ item.question }}</p>
            <p class="mt-3 text-sm leading-6 text-slate-600">{{ item.answer }}</p>
          </article>
        </div>
      </section>
    </main>
  </div>
</template>

<script setup>
import { RouterLink } from 'vue-router';

const plans = [
  {
    name: 'Plan Medio',
    badge: 'Legacy',
    price: '$0',
    storage: '0 GB',
    tenants: '1 tenant',
    featured: false,
    description: 'Pensado para la operación heredada: catálogo por URLs externas, sin almacenamiento físico en la plataforma.',
    features: [
      'Publicación de íconos por URL externa',
      'Panel administrativo multi-tenant',
      'Organización por carpetas y gestión visual',
      'Compatibilidad total con Tenant 1',
    ],
  },
  {
    name: 'Plan Pro',
    badge: 'Recomendado',
    price: '$24.990',
    storage: '20 GB',
    tenants: 'Hasta 5',
    featured: true,
    description: 'Ideal para agencias y equipos comerciales que necesitan catálogo centralizado, almacenamiento y preparación para checkout.',
    features: [
      'Carga y almacenamiento físico de activos',
      'Catálogo centralizado con gestión de estados',
      'Preparado para suscripción con Mercado Pago',
      'Escalamiento para varios equipos o marcas',
    ],
  },
  {
    name: 'Plan Scale',
    badge: 'Expansión',
    price: '$59.990',
    storage: '100 GB',
    tenants: 'Ilimitados',
    featured: false,
    description: 'Diseñado para operación multi-marca o white-label, con mayor espacio y capacidad para crecer sin reestructurar.',
    features: [
      'Mayor volumen de activos y colecciones',
      'Cobertura para múltiples tenants',
      'Base comercial lista para cobro recurrente',
      'Soporte para operación SaaS expandida',
    ],
  },
];

const comparisonRows = [
  { label: 'Publicación por URL externa', values: ['Sí', 'Sí', 'Sí'] },
  { label: 'Almacenamiento físico', values: ['0 GB', '20 GB', '100 GB'] },
  { label: 'Preparado para Mercado Pago', values: ['Base', 'Completo', 'Completo'] },
  { label: 'Escalabilidad multi-tenant', values: ['Inicial', 'Media', 'Alta'] },
  { label: 'Catálogo administrable', values: ['Sí', 'Sí', 'Sí'] },
];

const benefits = [
  {
    title: 'Oferta comercial entendible',
    description: 'La página deja claro qué obtiene cada cliente, cuánto almacenamiento incluye y cómo evoluciona el servicio.',
    bg: 'linear-gradient(135deg, rgba(14,36,88,0.12), rgba(59,130,246,0.12))',
    paths: ['M4 6h16M4 12h16M4 18h10'],
  },
  {
    title: 'Preparada para checkout',
    description: 'Los CTAs de pago ya existen visualmente para que el flujo comercial quede listo antes de conectar el enlace final.',
    bg: 'linear-gradient(135deg, rgba(0,103,79,0.14), rgba(104,228,199,0.16))',
    paths: ['M3 7h18M6 12h12M9 17h6'],
  },
  {
    title: 'Compatibilidad sin ruptura',
    description: 'El caso actual del Tenant 1 se explica dentro de la propuesta comercial, evitando ambigüedad durante la transición.',
    bg: 'linear-gradient(135deg, rgba(245,158,11,0.18), rgba(251,191,36,0.14))',
    paths: ['M12 9v4M12 17h.01M10.29 3.86l-7.53 13A2 2 0 004.5 20h15a2 2 0 001.74-3l-7.53-13a2 2 0 00-3.42 0z'],
  },
];

const faq = [
  {
    question: '¿El botón de pago ya cobra?',
    answer: 'No todavía. Está visible a propósito, pero permanece deshabilitado hasta que se conecte el checkout real.',
  },
  {
    question: '¿Qué pasa con el Tenant 1 actual?',
    answer: 'Se mantiene en Plan Medio, sin almacenamiento físico y operando con publicación de URLs externas.',
  },
  {
    question: '¿La página es editable luego?',
    answer: 'Sí. Los textos, precios y características están definidos como datos estáticos en la vista y se pueden ajustar rápido.',
  },
];
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;700;800&family=Sora:wght@600;700;800&display=swap');

.pricing-root {
  font-family: 'Manrope', sans-serif;
}

.pricing-display,
.pricing-brand {
  font-family: 'Sora', sans-serif;
}

.pricing-gradient {
  background: linear-gradient(135deg, #0e2458 0%, #00674f 52%, #68e4c7 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.pricing-grid {
  background-image: linear-gradient(rgba(148, 163, 184, 0.12) 1px, transparent 1px),
    linear-gradient(90deg, rgba(148, 163, 184, 0.12) 1px, transparent 1px);
  background-size: 42px 42px;
  mask-image: linear-gradient(180deg, rgba(0, 0, 0, 0.8), transparent 92%);
}
</style>
