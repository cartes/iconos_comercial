import { ref } from 'vue';

/**
 * Composable para manejo estandarizado de errores de API.
 * Captura y expone mensajes de error legibles y errores de validación por campo.
 */
export function useApiError() {
  const error = ref(null);            // Mensaje general de error
  const validationErrors = ref({});  // Errores de validación por campo (422)

  /**
   * Procesa la respuesta de apiRequest y popula los refs de error.
   * @param {Object} res - Respuesta de apiRequest
   * @returns {boolean} true si hubo error, false si fue exitoso
   */
  function handleError(res) {
    clearError();

    if (!res || res.success === false) {
      // Errores de validación Laravel (422)
      if (res?.errors && typeof res.errors === 'object') {
        validationErrors.value = res.errors;
        // Tomar el primer mensaje de validación como error principal
        const firstField = Object.values(res.errors)[0];
        error.value = Array.isArray(firstField) ? firstField[0] : firstField;
      } else {
        error.value = res?.error || res?.message || 'Ocurrió un error inesperado.';
      }
      return true; // hubo error
    }

    return false; // sin error
  }

  function clearError() {
    error.value = null;
    validationErrors.value = {};
  }

  /**
   * Obtiene el mensaje de error para un campo específico (errores 422).
   * @param {string} field - Nombre del campo
   * @returns {string|null}
   */
  function fieldError(field) {
    const err = validationErrors.value[field];
    if (!err) return null;
    return Array.isArray(err) ? err[0] : err;
  }

  return { error, validationErrors, handleError, clearError, fieldError };
}
