import { defineStore } from 'pinia'
import IndexedDB from '~/utils/modules/db/IndexDB'

export default defineStore('system', () => {
  const applicationMode = computed(() => import.meta.env.VITE_APP_APPLICATION_MODE || 'online')
  const applicationName = computed(() => import.meta.env.VITE_APP_APPLICATION_NAME || '')
  const offlineDatabase = ref(new IndexedDB())
  const isDeveloperMode = ref(useLocalStorage('is-developer-mode', false).value)

  const init = async () => {
    if (applicationMode.value === 'offline')
      await offlineDatabase.value.init()
  }

  return {
    isDeveloperMode,
    applicationMode,
    applicationName,
    offlineDatabase,
    init,
  }
})
