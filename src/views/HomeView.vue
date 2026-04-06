<template>
  <div class="home-root">

    <!-- ══════════════════════ NAVBAR ══════════════════════ -->
    <header class="fixed top-0 inset-x-0 z-[100] transition-all duration-300"
      :class="navScrolled ? 'bg-white/95 backdrop-blur-md border-b border-slate-100 shadow-sm' : ''">
      <div class="max-w-7xl mx-auto px-6 xl:px-10 h-[68px] flex items-center justify-between">
        <a href="#" class="flex items-center gap-2.5 group">
          <div class="w-8 h-8 rounded-xl flex items-center justify-center shadow-md shadow-violet-400/30 flex-shrink-0"
            style="background: linear-gradient(135deg, #0e2458, #219e83, #68e4c7)">
            <svg class="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"
              stroke-linecap="round">
              <path d="M4 6h16M4 12h10M4 18h7" />
            </svg>
          </div>
          <span class="logo-text font-bold text-[1.1rem] tracking-tight text-slate-900">
            aiconic<span class="text-violet-500">.</span>
          </span>
        </a>

        <nav class="hidden md:flex items-center gap-7 text-sm font-medium text-slate-500">
          <a href="#features" class="hover:text-slate-900 transition-colors">Características</a>
          <a href="#stats" class="hover:text-slate-900 transition-colors">Resultados</a>
          <a href="#pricing" class="hover:text-slate-900 transition-colors">Precios</a>
        </nav>

        <div class="flex items-center gap-2">
          <RouterLink to="/login"
            class="hidden sm:inline-flex text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors px-3 py-2">
            Iniciar sesión
          </RouterLink>
          <RouterLink to="/login"
            class="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-slate-900 text-white text-sm font-semibold hover:bg-slate-800 transition-all shadow-sm hover:shadow-md">
            Comenzar gratis
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"
              stroke-linejoin="round" viewBox="0 0 24 24">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </RouterLink>
        </div>
      </div>
    </header>

    <!-- ══════════════════════ HERO ══════════════════════ -->
    <section ref="heroRef" class="hero-section relative lg:min-h-screen lg:flex lg:items-center">

      <!-- Background -->
      <div class="absolute inset-0 overflow-hidden pointer-events-none">
        <div class="absolute inset-0 bg-white"></div>
        <div class="blob-1 absolute -top-40 -right-24 w-[700px] h-[700px] rounded-full"
          style="background: radial-gradient(circle, rgba(59,130,246,0.08) 0%, transparent 68%)"></div>
        <div class="blob-2 absolute -bottom-32 -left-24 w-[600px] h-[600px] rounded-full"
          style="background: radial-gradient(circle, rgba(33,158,131,0.08) 0%, transparent 68%)"></div>
        <div class="blob-3 absolute top-1/2 left-[45%] w-[380px] h-[380px] rounded-full"
          style="background: radial-gradient(circle, rgba(104,228,199,0.05) 0%, transparent 68%)"></div>
        <div class="dot-bg absolute inset-0"></div>
      </div>

      <!-- Content -->
      <div class="relative z-10 max-w-7xl mx-auto px-6 xl:px-10 w-full py-16 lg:pt-24 lg:pb-16">
        <div class="grid grid-cols-1 lg:grid-cols-[1fr_1.15fr] gap-10 xl:gap-20 lg:items-center">

          <!-- ── Left: Copy (always visible) ── -->
          <div class="hero-left">
            <!-- Badge -->
            <div class="inline-flex mb-7">
              <span
                class="flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-wider text-violet-600 uppercase border border-violet-200 bg-violet-50">
                <span class="w-1.5 h-1.5 rounded-full bg-violet-500 animate-pulse flex-shrink-0"></span>
                Motor de imágenes inteligente
              </span>
            </div>

            <!-- Headline -->
            <h1 class="headline font-normal leading-[1.07] tracking-tight text-slate-900 mb-5">
              Tu imágenes<br>de tus clientes,<br>
              <span class="gradient-headline font-black">perfectamente<br>organizada.</span>
            </h1>

            <!-- Subtitle -->
            <p class="text-[1.05rem] text-slate-500 leading-relaxed max-w-[400px] mb-9" style="font-weight: 300;">
              Aiconic analiza, clasifica y hace accesible cada ícono de tu sistema de diseño. Sin caos, sin pérdida de
              tiempo.
            </p>

            <!-- CTAs -->
            <div class="flex flex-wrap gap-3 mb-11">
              <RouterLink to="/login" class="cta-primary group">
                Comenzar gratis
                <svg class="w-4 h-4 group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor"
                  stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </RouterLink>
              <button class="cta-secondary group">
                <svg class="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" stroke-width="1.75"
                  viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round"
                    d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                    fill="currentColor" />
                  <path stroke-linecap="round" stroke-linejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Ver demo
              </button>
            </div>

            <!-- Social proof -->
            <div class="flex items-center gap-3">
              <div class="flex -space-x-1.5">
                <div v-for="(c, i) in ['#60a5fa', '#a78bfa', '#f472b6', '#34d399']" :key="i"
                  class="w-7 h-7 rounded-full border-2 border-white shadow-sm flex-shrink-0" :style="{ background: c }">
                </div>
              </div>
              <p class="text-sm text-slate-500">
                <strong class="font-semibold text-slate-700">+200 equipos</strong> ya usan Aiconic
              </p>
            </div>
          </div>

          <!-- ── Right: Animated visual — DESKTOP ONLY ── -->
          <div ref="heroVisualRef" class="hero-visual relative hidden lg:block">

            <!-- Surrounding card glow -->
            <div class="visual-bg-glow absolute inset-0 rounded-3xl pointer-events-none -z-0"
              style="background: linear-gradient(135deg, rgba(14,36,88,0.04), rgba(33,158,131,0.06), rgba(104,228,199,0.04)); border: 1px solid rgba(148,163,184,0.15);">
            </div>

            <!-- Floating messages -->
            <div ref="msg1Ref" class="float-msg msg-1"
              style="top: 6px; left: 50%; transform: translateX(-50%); opacity: 0;">
              <span class="msg-dot" style="background: #3b82f6"></span>
              <span>Describe tu necesidad.</span>
            </div>
            <div ref="msg2Ref" class="float-msg msg-2"
              style="top: 50%; right: 6px; transform: translateY(-50%); opacity: 0;">
              <span class="msg-dot" style="background: #219e83"></span>
              <span>Aiconic organiza y clasifica.</span>
            </div>
            <div ref="msg3Ref" class="float-msg msg-3"
              style="bottom: 6px; left: 50%; transform: translateX(-50%); opacity: 0;">
              <span class="msg-dot" style="background: #68e4c7"></span>
              <span>Accede a tu librería perfecta.</span>
            </div>

            <!-- Simulated cursor -->
            <div ref="cursorSimRef" class="cursor-sim absolute pointer-events-none z-30"
              style="top: 38%; left: 58%; opacity: 0;">
              <svg width="20" height="22" viewBox="0 0 20 22" fill="none">
                <path d="M3 2L18 11L11 13.5L8.5 20L3 2Z" fill="#1e293b" stroke="white" stroke-width="1.5"
                  stroke-linejoin="round" />
              </svg>
              <div class="cursor-label">Clasificando...</div>
            </div>

            <!-- Icon grid 4×4 -->
            <div ref="cardGridRef" class="grid grid-cols-4 gap-2.5 relative z-10">
              <div v-for="(icon, i) in ICONS" :key="i"
                class="icon-card relative rounded-2xl overflow-hidden border border-slate-100">
                <!-- Skeleton -->
                <div class="skeleton-overlay absolute inset-0 flex items-center justify-center rounded-2xl"
                  :style="{ background: hexToRgba(icon.color, 0.06) }">
                  <div class="skel-blob rounded-xl" :style="{ background: hexToRgba(icon.color, 0.18) }"></div>
                </div>

                <!-- Icon revealed -->
                <div class="icon-content absolute inset-0 flex flex-col items-center justify-center gap-1 p-2 bg-white">
                  <div class="icon-glyph rounded-xl flex items-center justify-center flex-shrink-0"
                    :style="{ background: hexToRgba(icon.color, 0.1) }">
                    <svg class="w-[18px] h-[18px]" viewBox="0 0 24 24" fill="none" stroke-width="1.75"
                      stroke-linecap="round" stroke-linejoin="round" :style="{ stroke: icon.color }">
                      <path v-for="p in icon.paths" :key="p" :d="p" />
                    </svg>
                  </div>
                  <span class="text-[9px] font-medium text-slate-400 leading-tight text-center truncate w-full px-1">
                    {{ icon.name }}
                  </span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>

      <!-- Scroll indicator — dentro del hero, solo desktop -->
      <div
        class="hidden lg:flex absolute bottom-8 left-1/2 -translate-x-1/2 flex-col items-center gap-2 z-10 pointer-events-none">
        <span class="text-[10px] font-semibold tracking-widest uppercase text-slate-300">Scroll</span>
        <div
          class="scroll-track w-[18px] h-7 rounded-full border-2 border-slate-200 flex items-start justify-center pt-1.5">
          <div class="scroll-dot w-1 h-1.5 rounded-full bg-slate-400"></div>
        </div>
      </div>

    </section>

    <!-- ══ MOBILE ONLY: Cards section — GSAP pin igual que desktop ══ -->
    <div class="lg:hidden mobile-cards-section">
      <!-- Mensajes narrativos -->
      <div class="relative h-6 mb-4" style="overflow:visible">
        <p
          class="mobile-msg-1 absolute inset-x-0 text-center text-[10px] font-semibold tracking-widest uppercase text-slate-400">
          <span class="inline-block w-1.5 h-1.5 rounded-full bg-blue-400 mr-1 align-middle"></span>Describe tu
          necesidad.
        </p>
        <p class="mobile-msg-2 absolute inset-x-0 text-center text-[10px] font-semibold tracking-widest uppercase text-slate-400"
          style="opacity:0">
          <span class="inline-block w-1.5 h-1.5 rounded-full bg-violet-400 mr-1 align-middle"></span>Aiconic organiza y
          clasifica.
        </p>
        <p class="mobile-msg-3 absolute inset-x-0 text-center text-[10px] font-semibold tracking-widest uppercase text-slate-400"
          style="opacity:0">
          <span class="inline-block w-1.5 h-1.5 rounded-full bg-violet-400 mr-1 align-middle"></span>Tu librería
          perfecta.
        </p>
      </div>

      <!-- Grid con skeleton + iconos (mismo patrón que desktop) -->
      <div class="grid grid-cols-4 gap-2.5" style="overflow:visible">
        <div v-for="(icon, i) in ICONS" :key="'m' + i"
          class="mobile-icon-card relative rounded-xl border border-slate-100">
          <div class="mobile-skeleton absolute inset-0 rounded-xl overflow-hidden"
            :style="{ background: `linear-gradient(135deg, ${hexToRgba(icon.color, 0.22)}, ${hexToRgba(icon.color, 0.08)})` }">
            <div class="absolute inset-0 animate-pulse rounded-xl" :style="{ background: hexToRgba(icon.color, 0.14) }">
            </div>
          </div>
          <div
            class="mobile-icon-content absolute inset-0 flex flex-col items-center justify-center gap-1 p-1.5 bg-white rounded-xl overflow-hidden"
            style="opacity:0">
            <div class="rounded-lg flex items-center justify-center flex-shrink-0" style="width:30px;height:30px"
              :style="{ background: hexToRgba(icon.color, 0.1) }">
              <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke-width="1.75" stroke-linecap="round"
                stroke-linejoin="round" :style="{ stroke: icon.color }">
                <path v-for="p in icon.paths" :key="p" :d="p" />
              </svg>
            </div>
            <span class="text-[7px] font-medium text-slate-400 leading-tight text-center truncate w-full px-0.5">
              {{ icon.name }}
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- ══════════════════════ FEATURES ══════════════════════ -->
    <section id="features" class="py-24 xl:py-32 bg-slate-50">
      <div class="max-w-7xl mx-auto px-6 xl:px-10">
        <div class="text-center mb-16">
          <p class="text-xs font-bold text-violet-600 tracking-widest uppercase mb-3">Características</p>
          <h2 class="section-title font-bold text-slate-900 leading-tight">
            Todo lo que necesitas<br>para gestionar tus íconos
          </h2>
          <p class="mt-4 text-slate-500 text-lg max-w-xl mx-auto" style="font-weight: 300;">
            Una plataforma completa que transforma el caos visual en una librería perfectamente estructurada.
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div v-for="feat in FEATURES" :key="feat.title" class="feat-card group">
            <div class="feat-icon mb-5" :style="{ background: hexToRgba(feat.color, 0.1) }">
              <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke-width="1.75" stroke-linecap="round"
                stroke-linejoin="round" :style="{ stroke: feat.color }">
                <path v-for="p in feat.paths" :key="p" :d="p" />
              </svg>
            </div>
            <h3 class="feat-heading font-bold text-slate-900 mb-2">{{ feat.title }}</h3>
            <p class="text-slate-500 text-sm leading-relaxed" style="font-weight: 300;">{{ feat.desc }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- ══════════════════════ STATS ══════════════════════ -->
    <section id="stats" class="py-20 bg-white">
      <div class="max-w-7xl mx-auto px-6 xl:px-10">
        <p class="text-center text-xs font-bold text-slate-400 tracking-widest uppercase mb-12">Métricas de confianza
        </p>
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-8 xl:gap-16">
          <div v-for="stat in STATS" :key="stat.label" class="text-center">
            <div class="stat-value font-bold leading-none mb-3"
              :style="{ background: `linear-gradient(135deg, ${stat.c1}, ${stat.c2})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }">
              {{ stat.value }}
            </div>
            <div class="text-slate-400 text-sm font-medium">{{ stat.label }}</div>
            <div class="mt-4 h-0.5 rounded-full mx-auto w-12"
              :style="{ background: `linear-gradient(90deg, ${stat.c1}, ${stat.c2})` }"></div>
          </div>
        </div>
      </div>
    </section>

    <!-- ══════════════════════ CTA ══════════════════════ -->
    <section id="pricing" class="py-20 px-6 xl:px-10">
      <div class="max-w-7xl mx-auto">
        <div class="cta-inner relative overflow-hidden rounded-3xl px-10 py-20 text-center">
          <div class="absolute top-0 right-0 w-96 h-96 rounded-full pointer-events-none"
            style="background: radial-gradient(circle, rgba(99,102,241,0.25), transparent 70%); transform: translate(35%, -35%)">
          </div>
          <div class="absolute bottom-0 left-0 w-96 h-96 rounded-full pointer-events-none"
            style="background: radial-gradient(circle, rgba(33,158,131,0.15), transparent 70%); transform: translate(-35%, 35%)">
          </div>
          <div class="relative z-10">
            <p class="text-violet-400 text-xs font-bold tracking-widest uppercase mb-4">Empieza hoy</p>
            <h2 class="cta-headline font-bold text-white leading-tight mb-5">
              ¿Listo para organizar<br>tu universo de íconos?
            </h2>
            <p class="text-slate-400 text-lg max-w-lg mx-auto mb-10" style="font-weight: 300;">
              Únete a +200 equipos que ya ahorraron horas de trabajo con Aiconic.
            </p>
            <div class="flex flex-wrap justify-center gap-4">
              <RouterLink to="/login"
                class="inline-flex items-center gap-2 px-7 py-3.5 rounded-full text-sm font-bold text-slate-900 bg-white hover:bg-slate-50 transition-colors shadow-xl shadow-black/20">
                Comenzar gratis — sin tarjeta
              </RouterLink>
              <button
                class="inline-flex items-center gap-2 px-7 py-3.5 rounded-full text-sm font-semibold text-slate-400 border border-slate-700 hover:border-slate-500 hover:text-white transition-colors">
                Ver planes y precios
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ══════════════════════ FOOTER ══════════════════════ -->
    <footer class="py-10 border-t border-slate-100 bg-white">
      <div class="max-w-7xl mx-auto px-6 xl:px-10 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div class="flex items-center gap-2">
          <div class="w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0"
            style="background: linear-gradient(135deg, #0e2458, #219e83, #68e4c7)">
            <svg class="w-3 h-3 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"
              stroke-linecap="round">
              <path d="M4 6h16M4 12h10M4 18h7" />
            </svg>
          </div>
          <span class="logo-text font-bold text-sm text-slate-700">aiconic<span class="text-violet-500">.</span></span>
        </div>
        <p class="text-xs text-slate-400">© {{ new Date().getFullYear() }} Aiconic. Todos los derechos reservados.</p>
        <div class="flex items-center gap-5 text-xs text-slate-400">
          <a href="#" class="hover:text-slate-600 transition-colors">Privacidad</a>
          <a href="#" class="hover:text-slate-600 transition-colors">Términos</a>
          <a href="#" class="hover:text-slate-600 transition-colors">Contacto</a>
        </div>
      </div>
    </footer>

  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { RouterLink } from 'vue-router'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

// ── Refs ─────────────────────────────────────────────────────────
const heroRef = ref(null)
const heroVisualRef = ref(null)
const cursorSimRef = ref(null)
const msg1Ref = ref(null)
const msg2Ref = ref(null)
const msg3Ref = ref(null)
const navScrolled = ref(false)


// ── Icon data (16 icons) ─────────────────────────────────────────
const ICONS = [
  { name: 'Buscar', paths: ['M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z'], color: '#3b82f6' },
  { name: 'Carpeta', paths: ['M3 7a2 2 0 012-2h4l2 2h8a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V7z'], color: '#219e83' },
  { name: 'Favorito', paths: ['M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z'], color: '#68e4c7' },
  { name: 'Me gusta', paths: ['M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z'], color: '#ef4444' },
  { name: 'Usuario', paths: ['M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z'], color: '#3b82f6' },
  { name: 'Config.', paths: ['M12 15a3 3 0 100-6 3 3 0 000 6z', 'M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z'], color: '#219e83' },
  { name: 'Alerta', paths: ['M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9'], color: '#f59e0b' },
  { name: 'Gráfico', paths: ['M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z'], color: '#10b981' },
  { name: 'Seguro', paths: ['M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z'], color: '#3b82f6' },
  { name: 'Diseño', paths: ['M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z'], color: '#219e83' },
  { name: 'Etiqueta', paths: ['M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A2 2 0 013 12V7a4 4 0 014-4z'], color: '#68e4c7' },
  { name: 'Nube', paths: ['M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12'], color: '#3b82f6' },
  { name: 'Editar', paths: ['M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z'], color: '#f59e0b' },
  { name: 'Imagen', paths: ['M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z'], color: '#219e83' },
  { name: 'Capas', paths: ['M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5'], color: '#68e4c7' },
  { name: 'Rayo', paths: ['M13 2L3 14h9l-1 8 10-12h-9l1-8z'], color: '#ef4444' },
]

const FEATURES = [
  {
    title: 'Clasificación inteligente',
    desc: 'Nuestro motor analiza automáticamente cada ícono y lo clasifica por categoría, estilo y contexto de uso. Cero trabajo manual.',
    color: '#3b82f6',
    paths: ['M9 3H5a2 2 0 00-2 2v4m6-6h10a2 2 0 012 2v4M9 3v18m0 0h10a2 2 0 002-2V9M9 21H5a2 2 0 01-2-2V9m0 0h18'],
  },
  {
    title: 'Búsqueda semántica',
    desc: 'Encuentra cualquier ícono describiendo lo que necesitas en lenguaje natural. La IA entiende el contexto y el significado.',
    color: '#219e83',
    paths: ['M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z'],
  },
  {
    title: 'Librería colaborativa',
    desc: 'Comparte, organiza y exporta íconos con tu equipo en tiempo real. Control de versiones y permisos incluidos.',
    color: '#68e4c7',
    paths: ['M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z'],
  },
]

const STATS = [
  { value: '99%', label: 'Tiempo de actividad garantizado', c1: '#001d51', c2: '#6366f1' },
  { value: '200+', label: 'Equipos de diseño globales', c1: '#177f6b', c2: '#3ebb9e' },
  { value: '10×', label: 'Más rápido que búsqueda manual', c1: '#219e83', c2: '#68e4c7' },
]

// ── Helpers ───────────────────────────────────────────────────────
const hexToRgba = (hex, alpha) => {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  return `rgba(${r},${g},${b},${alpha})`
}

// ── Lifecycle ─────────────────────────────────────────────────────
const onScroll = () => { navScrolled.value = window.scrollY > 20 }

onMounted(() => {
  window.addEventListener('scroll', onScroll, { passive: true })

  // ── GSAP: solo desktop vía gsap.matchMedia() ─────────────────
  // matchMedia es 100% confiable — no depende de refs ni timing de Vue
  const mm = gsap.matchMedia()

  mm.add('(min-width: 1024px)', () => {
    // Usar querySelector en vez de refs Vue — matchMedia puede disparar fuera del ciclo de Vue
    const heroEl = document.querySelector('.hero-section')
    const cursorEl = document.querySelector('.cursor-sim')
    const msg1El = document.querySelector('.msg-1')
    const msg2El = document.querySelector('.msg-2')
    const msg3El = document.querySelector('.msg-3')

    if (!heroEl || !cursorEl) return

    // Scatter cards con posiciones aleatorias
    const cards = gsap.utils.toArray('.icon-card')
    cards.forEach(card => {
      gsap.set(card, {
        x: gsap.utils.random(-110, 110),
        y: gsap.utils.random(-75, 75),
        rotation: gsap.utils.random(-22, 22),
        scale: gsap.utils.random(0.78, 1.12),
        zIndex: Math.round(gsap.utils.random(1, 16)),
      })
    })

    gsap.set('.icon-content', { opacity: 0, scale: 0.65 })
    gsap.set(cursorEl, { opacity: 0, scale: 0.5 })
    gsap.set([msg1El, msg2El, msg3El].filter(Boolean), { opacity: 0 })

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: heroEl,
        start: 'top top',
        end: '+=270%',
        scrub: 1.8,
        pin: true,
        anticipatePin: 1,
      },
    })

    tl.to(msg1El, { opacity: 1, duration: 0.15, ease: 'power2.out' }, 0)

    tl.to(cursorEl, { opacity: 1, scale: 1, duration: 0.12, ease: 'back.out(2)' }, 0.1)
    tl.to(cursorEl, { x: -90, y: -55, duration: 0.35, ease: 'power2.inOut' }, 0.2)
    tl.to(cursorEl, { x: 70, y: 60, duration: 0.35, ease: 'power2.inOut' }, 0.5)
    tl.to(cursorEl, { x: -50, y: 90, duration: 0.3, ease: 'power2.inOut' }, 0.8)

    tl.to(msg1El, { opacity: 0, duration: 0.1 }, 0.72)
    tl.to(msg2El, { opacity: 1, duration: 0.15 }, 0.78)

    tl.to('.skeleton-overlay', {
      opacity: 0,
      scale: 0.75,
      stagger: { each: 0.028, from: 'random' },
      duration: 0.28,
      ease: 'power2.in',
    }, 0.85)
    tl.to('.icon-content', {
      opacity: 1,
      scale: 1,
      stagger: { each: 0.028, from: 'random' },
      duration: 0.3,
      ease: 'back.out(1.7)',
    }, 0.95)

    tl.to(msg2El, { opacity: 0, duration: 0.1 }, 1.35)
    tl.to(msg3El, { opacity: 1, duration: 0.15 }, 1.42)

    tl.to('.icon-card', {
      x: 0, y: 0, rotation: 0, scale: 1, zIndex: 1,
      stagger: { each: 0.045, from: 'start' },
      duration: 0.55,
      ease: 'power3.out',
    }, 1.5)

    tl.to(cursorEl, { opacity: 0, scale: 0.5, duration: 0.15 }, 1.92)
    tl.to(msg3El, { opacity: 0, duration: 0.15 }, 2.12)

    // cleanup al salir del breakpoint
    return () => { tl.kill() }
  })

  // ── Mobile: GSAP pin igual que desktop — pina la sección de cards ──
  mm.add('(max-width: 1023px)', () => {
    const section = document.querySelector('.mobile-cards-section')
    if (!section) return

    const mobileCards = gsap.utils.toArray('.mobile-icon-card')

    // Estado inicial: tarjetas desordenadas + iconos ocultos
    mobileCards.forEach(card => {
      gsap.set(card, {
        x: gsap.utils.random(-60, 60),
        y: gsap.utils.random(-36, 36),
        rotation: gsap.utils.random(-18, 18),
        scale: gsap.utils.random(0.68, 1.05),
        zIndex: Math.round(gsap.utils.random(1, 16)),
      })
    })
    gsap.set('.mobile-icon-content', { opacity: 0 })

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: 'top 68px',  // pina cuando el top llega al borde del navbar
        end: '+=220%',    // 220% viewport height de recorrido
        scrub: 1.5,
        pin: true,
        anticipatePin: 1,
      },
    })

    // 0–25 %: msg1 → msg2
    tl.to('.mobile-msg-1', { opacity: 0, duration: 0.12 }, 0.22)
    tl.to('.mobile-msg-2', { opacity: 1, duration: 0.12 }, 0.28)

    // 30–55 %: skeletons desaparecen, iconos aparecen
    tl.to('.mobile-skeleton', {
      opacity: 0, scale: 0.80,
      stagger: { each: 0.022, from: 'random' },
      duration: 0.28, ease: 'power2.in',
    }, 0.32)
    tl.to('.mobile-icon-content', {
      opacity: 1,
      stagger: { each: 0.022, from: 'random' },
      duration: 0.30, ease: 'power2.out',
    }, 0.44)

    // 60–68 %: msg2 → msg3
    tl.to('.mobile-msg-2', { opacity: 0, duration: 0.10 }, 0.60)
    tl.to('.mobile-msg-3', { opacity: 1, duration: 0.12 }, 0.66)

    // 68–100 %: tarjetas se ordenan en la grilla perfecta
    tl.to('.mobile-icon-card', {
      x: 0, y: 0, rotation: 0, scale: 1, zIndex: 1,
      stagger: { each: 0.036, from: 'start' },
      duration: 0.52, ease: 'power3.out',
    }, 0.70)

    return () => { tl.kill() }
  })
})

onUnmounted(() => {
  window.removeEventListener('scroll', onScroll)
  ScrollTrigger.getAll().forEach(st => st.kill())
})
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Segoe UI:wght@400;600;700;800;900&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;1,9..40,300&display=swap');

/* ── Root ── */
.home-root {
  font-family: 'DM Sans', -apple-system, BlinkMacSystemFont, sans-serif;
  color: #0f172a;
}

/* ── Typography ── */
.logo-text {
  font-family: 'Segoe UI', sans-serif;
}

.headline {
  font-family: 'Segoe UI', sans-serif;
  font-size: clamp(2.4rem, 5vw, 3.75rem);
}

.section-title {
  font-family: 'Segoe UI', sans-serif;
  font-size: clamp(2rem, 4vw, 3rem);
}

.cta-headline {
  font-family: 'Segoe UI', sans-serif;
  font-size: clamp(2rem, 4vw, 3rem);
}

.stat-value {
  font-family: 'Segoe UI', sans-serif;
  font-size: clamp(3.2rem, 6vw, 4.5rem);
}

.feat-heading {
  font-family: 'Segoe UI', sans-serif;
  font-size: 1.05rem;
}

/* ── Gradient headline ── */
.gradient-headline {
  background: linear-gradient(135deg, #0e2458 0%, #00674F 52%, #adecd7 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

/* ── Dot grid bg ── */
.dot-bg {
  background-image: radial-gradient(circle, #cbd5e1 1px, transparent 1px);
  background-size: 28px 28px;
  opacity: 0.35;
}

/* ── Hero visual container — desktop only ── */
.hero-visual {
  padding: 36px;
}

/* ══ Mobile sticky section ══════════════════════════════════════ */
/* ══ Mobile cards section — GSAP pin maneja el sticky ════════════ */
.mobile-cards-section {
  background: white;
  padding: 20px 20px 24px;
  border-bottom: 1px solid #f1f5f9;
  /* overflow visible para que tarjetas desordenadas sobresalgan */
  overflow: visible;
}

.mobile-icon-card {
  aspect-ratio: 1 / 1;
  min-height: 56px;
  background: white;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.06), 0 0 0 1px rgba(148, 163, 184, 0.12);
  will-change: transform;
}

/* ── Icon cards ── */
.icon-card {
  aspect-ratio: 1 / 1;
  min-height: 72px;
  background: white;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.06), 0 0 0 1px rgba(148, 163, 184, 0.12);
  transition: box-shadow 0.2s;
  will-change: transform;
}

.icon-card:hover {
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.1);
}

.icon-glyph {
  width: 36px;
  height: 36px;
}

/* ── Skeleton animation ── */
.skel-blob {
  width: 30px;
  height: 30px;
  animation: skelPulse 2.2s ease-in-out infinite;
}

@keyframes skelPulse {

  0%,
  100% {
    opacity: 0.35;
    transform: scale(1);
  }

  50% {
    opacity: 0.75;
    transform: scale(1.12);
  }
}

/* ── Floating messages ── */
.float-msg {
  position: absolute;
  display: inline-flex;
  align-items: center;
  gap: 7px;
  padding: 7px 13px;
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 999px;
  font-size: 11.5px;
  font-weight: 600;
  color: #475569;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  white-space: nowrap;
  z-index: 20;
  pointer-events: none;
  letter-spacing: 0.01em;
}

.msg-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  flex-shrink: 0;
  animation: dotPulse 1.5s ease-in-out infinite;
}

@keyframes dotPulse {

  0%,
  100% {
    opacity: 1;
    transform: scale(1);
  }

  50% {
    opacity: 0.5;
    transform: scale(0.7);
  }
}

/* ── Cursor simulation ── */
.cursor-sim {
  position: absolute;
  display: flex;
  align-items: flex-end;
  gap: 5px;
  pointer-events: none;
  transform-origin: top left;
}

.cursor-label {
  font-family: 'DM Sans', sans-serif;
  font-size: 10.5px;
  font-weight: 600;
  color: white;
  background: #1e293b;
  padding: 3px 8px;
  border-radius: 999px;
  margin-bottom: 2px;
  white-space: nowrap;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.25);
}

/* ── CTAs ── */
.cta-primary {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  padding: 14px 24px;
  border-radius: 999px;
  font-size: 0.875rem;
  font-weight: 600;
  color: white;
  text-decoration: none;
  background: linear-gradient(135deg, #0e2458 0%, #219e83 50%, #68e4c7 100%);
  box-shadow: 0 4px 24px rgba(13, 36, 88, 0.35);
  transition: box-shadow 0.2s, transform 0.15s;
}

.cta-primary:hover {
  box-shadow: 0 6px 32px rgba(99, 102, 241, 0.5);
  transform: translateY(-1px);
}

.cta-secondary {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  padding: 14px 20px;
  border-radius: 999px;
  font-size: 0.875rem;
  font-weight: 500;
  color: #475569;
  background: white;
  border: 1px solid #e2e8f0;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.05);
  transition: border-color 0.2s, color 0.2s, transform 0.15s;
  cursor: pointer;
}

.cta-secondary:hover {
  border-color: #cbd5e1;
  color: #1e293b;
  transform: translateY(-1px);
}

/* ── Feature cards ── */
.feat-card {
  background: white;
  border-radius: 20px;
  padding: 28px;
  border: 1px solid #f1f5f9;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.04);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.feat-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 10px 32px rgba(0, 0, 0, 0.09);
}

.feat-icon {
  width: 44px;
  height: 44px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* ── CTA block ── */
.cta-inner {
  background: linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #0d1224 100%);
}

/* ── Scroll indicator ── */
.scroll-dot {
  animation: scrollBounce 1.6s ease-in-out infinite;
}

@keyframes scrollBounce {

  0%,
  100% {
    transform: translateY(0);
    opacity: 1;
  }

  55% {
    transform: translateY(10px);
    opacity: 0.2;
  }
}
</style>
