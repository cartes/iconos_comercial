<template>
  <div class="flex flex-col gap-1.5 w-full mb-4">
    <label v-if="label" class="text-sm font-semibold text-slate-700 dark:text-slate-300">
      {{ label }}
    </label>
    <div class="relative flex items-center">
      <slot name="prefix"></slot>
      <input
        :type="inputType"
        :value="modelValue"
        :placeholder="placeholder"
        :required="required"
        :minlength="minlength"
        @input="$emit('update:modelValue', $event.target.value)"
        :class="[
          'w-full px-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all duration-200 disabled:bg-slate-50 disabled:cursor-not-allowed',
          { 'pr-10': isPassword }
        ]"
        v-bind="$attrs"
      />
      <button
        v-if="isPassword"
        type="button"
        class="absolute right-2 p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 dark:hover:text-slate-200 dark:hover:bg-slate-800 rounded transition-colors"
        @click="togglePassword"
        tabindex="-1"
        :title="showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'"
      >
        <svg v-if="showPassword" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="w-5 h-5">
          <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24"></path>
          <line x1="1" y1="1" x2="23" y2="23"></line>
        </svg>
        <svg v-else viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="w-5 h-5">
          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
          <circle cx="12" cy="12" r="3"></circle>
        </svg>
      </button>
    </div>
    <span v-if="error" class="text-xs text-error-500 mt-1">{{ error }}</span>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';

const props = defineProps({
  modelValue: [String, Number],
  label: String,
  type: {
    type: String,
    default: 'text',
  },
  placeholder: String,
  required: Boolean,
  error: String,
  minlength: Number
});

defineEmits(['update:modelValue']);

const showPassword = ref(false);
const isPassword = computed(() => props.type === 'password');

const inputType = computed(() => {
  if (isPassword.value) {
    return showPassword.value ? 'text' : 'password';
  }
  return props.type;
});

const togglePassword = () => {
  showPassword.value = !showPassword.value;
};
</script>

<style scoped>
/* No additional styles needed, using Tailwind utilities */
</style>
