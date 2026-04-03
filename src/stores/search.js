import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useSearchStore = defineStore('search', () => {
  const query = ref('');
  const clear = () => { query.value = ''; };
  return { query, clear };
});
