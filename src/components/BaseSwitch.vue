<template>
    <label class="relative inline-block w-11 h-6 flex-shrink-0 cursor-pointer transition-opacity duration-200" :class="{ 'opacity-60 cursor-not-allowed': disabled }">
        <input
            type="checkbox"
            class="sr-only peer"
            :checked="modelValue"
            :disabled="disabled"
            @change="$emit('update:modelValue', $event.target.checked)"
        />
        <div class="w-11 h-6 bg-slate-200 dark:bg-slate-700 rounded-full peer peer-checked:bg-primary-600 after:content-[''] after:absolute after:top-[3px] after:left-[3px] after:bg-white after:rounded-full after:h-[18px] after:w-[18px] after:transition-all after:duration-300 after:shadow-sm peer-checked:after:translate-x-[20px]"></div>
    </label>
</template>

<script setup>
defineProps({
    modelValue: {
        type: Boolean,
        default: false
    },
    disabled: {
        type: Boolean,
        default: false
    }
});

defineEmits(['update:modelValue']);
</script>

<style scoped>
/* All styles handled by Tailwind v4 utilities */
</style>
