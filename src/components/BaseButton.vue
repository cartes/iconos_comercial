<template>
  <button
    v-bind="$attrs"
    :class="[
      'relative inline-flex items-center justify-center px-6 py-3 font-semibold rounded-lg transition-all duration-200 gap-2 overflow-hidden',
      variantClasses[variant],
      { 'opacity-60 cursor-not-allowed transform-none': disabled || loading }
    ]"
    :disabled="disabled || loading"
  >
    <span v-if="loading" :class="['w-5 h-5 border-2 rounded-full animate-spin', spinnerClasses[variant]]"></span>
    <span :class="{ 'opacity-0': loading }">
        <slot></slot>
    </span>
  </button>
</template>

<script>
export default {
  inheritAttrs: false
}
</script>

<script setup>
defineProps({
  variant: {
    type: String,
    default: 'primary',
  },
  loading: Boolean,
  disabled: Boolean,
});


const variantClasses = {
  primary: 'bg-grad-primary text-white shadow-md hover:-translate-y-0.5 hover:shadow-xl hover:brightness-110 disabled:hover:translate-y-0',
  secondary: 'bg-slate-100 text-slate-900 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700'
};

const spinnerClasses = {
  primary: 'border-white/30 border-t-white',
  secondary: 'border-slate-900/10 border-t-primary-600 dark:border-white/10 dark:border-t-white'
};
</script>

<style scoped>
/* No additional styles needed, all handled by Tailwind utilities */
</style>
