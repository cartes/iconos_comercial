<template>
  <div class="super-admin-view">
    <div class="card shadow-sm mb-4">
      <div class="card-header bg-primary text-white">
        <h2 class="h5 mb-0">Registrar Nueva Agencia</h2>
      </div>
      <div class="card-body">
        <form @submit.prevent="registrarEmpresa" class="row g-3">
          <div class="col-md-5">
            <label for="nombreComercial" class="form-label">Nombre Comercial</label>
            <input 
              v-model="nuevaEmpresa.nombre" 
              type="text" 
              id="nombreComercial" 
              class="form-control" 
              placeholder="Ej: Agencia Creativa" 
              required
              :disabled="cargando"
            >
          </div>
          <div class="col-md-5">
            <label for="subdominio" class="form-label">Subdominio</label>
            <div class="input-group">
              <input 
                v-model="nuevaEmpresa.subdominio" 
                type="text" 
                id="subdominio" 
                class="form-control" 
                placeholder="ejemplo" 
                required
                :disabled="cargando"
              >
              <span class="input-group-text">.iconos.com</span>
            </div>
          </div>
          <div class="col-md-2 d-flex align-items-end">
            <button 
              type="submit" 
              class="btn btn-success w-100" 
              :disabled="cargando"
            >
              <span v-if="cargando" class="spinner-border spinner-border-sm me-2"></span>
              Registrar
            </button>
          </div>
        </form>
      </div>
    </div>

    <div class="card shadow-sm">
      <div class="card-header bg-dark text-white d-flex justify-content-between align-items-center">
        <h2 class="h5 mb-0">Listado de Empresas Cliente</h2>
        <button @click="fetchEmpresas" class="btn btn-sm btn-outline-light" :disabled="cargando">
          Actualizar
        </button>
      </div>
      <div class="table-responsive">
        <table class="table table-hover align-middle mb-0">
          <thead class="table-light">
            <tr>
              <th>ID / Subdominio</th>
              <th>Nombre Comercial</th>
              <th>Estado</th>
              <th class="text-end">Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="empresas.length === 0 && !cargando">
              <td colspan="4" class="text-center py-4 text-muted">No hay empresas registradas.</td>
            </tr>
            <tr v-for="empresa in empresas" :key="empresa.id">
              <td>
                <span class="badge bg-secondary font-monospace">{{ empresa.subdominio || empresa.id }}</span>
              </td>
              <td class="fw-bold">{{ empresa.nombre }}</td>
              <td>
                <span :class="['badge', empresa.estado === 'activo' ? 'bg-success' : 'bg-danger']">
                  {{ empresa.estado || 'activo' }}
                </span>
              </td>
              <td class="text-end">
                <button 
                  @click="suspenderEmpresa(empresa.id)" 
                  class="btn btn-sm btn-outline-danger"
                  :disabled="cargando || empresa.estado === 'suspendido'"
                >
                  Suspender
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div v-if="cargando" class="text-center py-3">
        <div class="spinner-border text-primary" role="status">
          <span class="visually-hidden">Cargando...</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import { apiRequest } from '@/api/service';

// Estados reactivos
const empresas = ref([]);
const cargando = ref(false);
const nuevaEmpresa = reactive({
  nombre: '',
  subdominio: ''
});

// Obtener listado de empresas
const fetchEmpresas = async () => {
  cargando.value = true;
  try {
    const res = await apiRequest('super-admin/empresas', { method: 'GET' });
    if (res.success !== false) {
      // Si la API devuelve un array directamente o un objeto con la lista
      empresas.value = res.data || res.empresas || (Array.isArray(res) ? res : []);
    } else {
      alert(`Error: ${res.error || 'No se pudo obtener el listado'}`);
    }
  } catch (err) {
    console.error(err);
    alert('Error crítico de red al obtener empresas');
  } finally {
    cargando.value = false;
  }
};

// Registrar nueva agencia
const registrarEmpresa = async () => {
  cargando.value = true;
  try {
    const res = await apiRequest('super-admin/empresas', {
      method: 'POST',
      data: { ...nuevaEmpresa }
    });

    if (res.success !== false) {
      alert('Agencia registrada exitosamente');
      nuevaEmpresa.nombre = '';
      nuevaEmpresa.subdominio = '';
      await fetchEmpresas();
    } else {
      alert(`Error al registrar: ${res.error || 'Datos inválidos'}`);
    }
  } catch (err) {
    console.error(err);
    alert('Fallo la conexión con el servidor');
  } finally {
    cargando.value = false;
  }
};

// Suspender empresa
const suspenderEmpresa = async (id) => {
  if (!confirm('¿Está seguro de que desea suspender esta agencia?')) return;

  cargando.value = true;
  try {
    const res = await apiRequest(`super-admin/empresas/${id}/suspender`, {
      method: 'POST'
    });

    if (res.success !== false) {
      alert('Agencia suspendida correctamente');
      await fetchEmpresas();
    } else {
      alert(`Error: ${res.error || 'No se pudo suspender la agencia'}`);
    }
  } catch (err) {
    console.error(err);
    alert('Error al procesar la suspensión');
  } finally {
    cargando.value = false;
  }
};

// Carga inicial
onMounted(() => {
  fetchEmpresas();
});
</script>

<style scoped>
.super-admin-view {
  padding: 1.5rem;
  max-width: 1200px;
  margin: 0 auto;
}

.card {
  border: none;
  border-radius: 12px;
  overflow: hidden;
}

.card-header {
  padding: 1rem 1.25rem;
  font-weight: 600;
}

.table thead th {
  font-weight: 600;
  text-transform: uppercase;
  font-size: 0.75rem;
  letter-spacing: 0.05em;
}

.badge {
  padding: 0.5em 0.8em;
  font-weight: 500;
}

.font-monospace {
  font-family: SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
}

/* Transiciones suaves */
.btn, .form-control {
  transition: all 0.2s ease;
}

.btn:disabled {
  cursor: not-allowed;
  opacity: 0.7;
}

.input-group-text {
  background-color: #f8f9fa;
  color: #6c757d;
}
</style>
