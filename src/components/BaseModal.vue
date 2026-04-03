<template>
    <Teleport to="body">
        <Transition
            enter-active-class="transition-opacity duration-300"
            enter-from-class="opacity-0"
            enter-to-class="opacity-100"
            leave-active-class="transition-opacity duration-300"
            leave-from-class="opacity-100"
            leave-to-class="opacity-0"
        >
            <div v-if="show" class="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-6 z-[1000]" @click.self="$emit('close')">
                <Transition
                    enter-active-class="transition-transform duration-300 cubic-bezier(0.16, 1, 0.3, 1)"
                    enter-from-class="translate-y-5"
                    enter-to-class="translate-y-0"
                    leave-active-class="transition-transform duration-300 cubic-bezier(0.16, 1, 0.3, 1)"
                    leave-from-class="translate-y-0"
                    leave-to-class="translate-y-5"
                >
                    <div v-if="show" class="bg-white dark:bg-slate-900 w-full max-w-lg rounded-2xl shadow-2xl flex flex-col max-h-[90vh]">
                        <header class="px-6 py-5 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center">
                            <h3 class="text-lg font-bold text-slate-900 dark:text-white">{{ title }}</h3>
                            <button @click="$emit('close')" class="p-2 text-slate-500 hover:text-slate-900 hover:bg-slate-100 dark:hover:text-white dark:hover:bg-slate-800 rounded-lg transition-all">
                                <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <path d="M18 6L6 18M6 6l12 12" />
                                </svg>
                            </button>
                        </header>

                        <div class="p-6 overflow-y-auto">
                            <slot></slot>
                        </div>

                        <footer class="px-6 py-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/20 flex justify-end gap-3 rounded-b-2xl" v-if="$slots.footer">
                            <slot name="footer"></slot>
                        </footer>
                    </div>
                </Transition>
            </div>
        </Transition>
    </Teleport>
</template>

<script setup>
import { onMounted, onUnmounted } from 'vue';

const props = defineProps({
    show: Boolean,
    title: String,
});
const emit = defineEmits(['close']);

const handleKeydown = (e) => {
    if (e.key === 'Escape' && props.show) {
        emit('close');
    }
};

onMounted(() => {
    window.addEventListener('keydown', handleKeydown);
});

onUnmounted(() => {
    window.removeEventListener('keydown', handleKeydown);
});
</script>

<style scoped>
/* All styles handled by Tailwind v4 utilities */
</style>
