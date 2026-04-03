<template>
    <BaseModal :show="show" title="Cambiar Contraseña" @close="$emit('close')">
        <form id="changePasswordForm" @submit.prevent="handleSubmit" class="flex flex-col gap-4">
            <BaseInput label="Contraseña Actual" v-model="form.clave" type="password"
                placeholder="Ingresa tu contraseña actual" required />

            <BaseInput label="Nueva Contraseña" v-model="form.nuevaClave" type="password"
                placeholder="Mínimo 8 caracteres" required />

            <BaseInput label="Confirmar Nueva Contraseña" v-model="form.confirmarClave" type="password"
                placeholder="Repite la nueva contraseña" required />

            <div v-if="error" class="text-red-600 font-medium text-sm bg-red-50 dark:bg-red-900/10 p-3 rounded-lg border border-red-200 dark:border-red-900/20 text-center">
                {{ error }}
            </div>
        </form>
        <template #footer>
            <BaseButton type="button" variant="secondary" @click="$emit('close')">Cancelar</BaseButton>
            <BaseButton form="changePasswordForm" type="submit" :loading="saving">Cambiar Contraseña</BaseButton>
        </template>
    </BaseModal>
</template>

<script setup>
import { reactive, ref, watch } from 'vue';
import { apiRequest } from '@/api/service';
import BaseModal from '@/components/BaseModal.vue';
import BaseInput from '@/components/BaseInput.vue';
import BaseButton from '@/components/BaseButton.vue';

const props = defineProps({
    show: Boolean
});

const emit = defineEmits(['close', 'success']);

const form = reactive({
    clave: '',
    nuevaClave: '',
    confirmarClave: ''
});

const saving = ref(false);
const error = ref('');

// Limpiar formulario cuando se abre/cierra
watch(() => props.show, (newVal) => {
    if (!newVal) {
        form.clave = '';
        form.nuevaClave = '';
        form.confirmarClave = '';
        error.value = '';
    }
});

const handleSubmit = async () => {
    error.value = '';

    if (form.nuevaClave.length < 8) {
        error.value = 'La nueva contraseña debe tener al menos 8 caracteres.';
        return;
    }

    if (form.nuevaClave !== form.confirmarClave) {
        error.value = 'Las contraseñas no coinciden.';
        return;
    }

    saving.value = true;

    // Llamada a la API que existe en Laravel AuthController
    const res = await apiRequest('cambiar-clave', {
        method: 'POST',
        data: {
            clave: form.clave,
            nuevaClave: form.nuevaClave
        }
    });

    saving.value = false;

    if (res.success) {
        emit('success', res.mensaje || 'Contraseña actualizada exitosamente');
        emit('close');
    } else {
        error.value = res.error || 'Ocurrió un error al cambiar la contraseña';
    }
};
</script>

<style scoped>
/* All styles transitioned to Tailwind v4 */
</style>
