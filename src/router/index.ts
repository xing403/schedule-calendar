
import { createRouter, createWebHashHistory } from 'vue-router'
import pkj from '../../package.json'
import useUserStore from '~/store/modules/user'

const routes = [{
  path: '',
  name: 'home',
  component: () => import('~/pages/index.vue'),
}
]


const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes,
})

router.beforeEach(async (to, from, next) => {
  const userStore = useUserStore()
  useTitle(pkj.name ?? '未命名')
  if (userStore.userIsLogin) {
    await userStore.getUserInformation()
  }
  next()
})

export default router
