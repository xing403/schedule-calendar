import { createRouter, createWebHashHistory } from 'vue-router'
import useUserStore from '~/store/modules/user'
import useSystemStore from '~/store/modules/system'

const routes = [{
  path: '',
  name: 'home',
  component: () => import('~/pages/index.vue'),
}]

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes,
})

router.beforeEach(async (to, from, next) => {
  useTitle(import.meta.env.VITE_APP_APPLICATION_NAME ?? '未命名')
  const userStore = useUserStore()
  const systemStore = useSystemStore()
  if (import.meta.env.MODE !== 'offline' && userStore.userIsLogin)
    await userStore.getUserInformation()

  else
    await systemStore.init()

  next()
})

export default router
