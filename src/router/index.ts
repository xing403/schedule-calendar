import layout from '~/layouts/index.vue'
import { createRouter, createWebHashHistory } from 'vue-router'
import pkj from '../../package.json'

const routes = [
  {
    path: '',
    component: layout,
    children: [
      {
        path: '',
        name: 'home',
        component: () => import('~/pages/index.vue'),
      },
    ],
  },
]


const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes,
})

router.beforeEach((to, from, next) => {
  useTitle(pkj.name ?? '未命名')
  next()
})

export default router
