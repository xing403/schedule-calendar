import type { RemovableRef } from '@vueuse/core'
import { ElMessage } from 'element-plus'
import { defineStore } from 'pinia'
import userApi from '~/api/modules/user'

export default defineStore('user', () => {
  const router = useRouter()

  const token = ref<RemovableRef<string>>(useLocalStorage('token', '', { deep: true }))
  const information = ref<any>(null)
  const username = computed(() => information.value?.username || '')

  const userIsLogin = computed(() => !!information.value)

  const handleUserLogin = ({ username, password }: { username: string; password: string }) => {
    const form = new FormData()
    form.append('username', username)
    form.append('password', password)
    return userApi.login(form).then(({ data }: { data: string }) => {
      token.value = data
    })
  }

  const getUserInformation = () => {
    return userApi.getUserInfo().then(({ data }: { data: any }) => {
      information.value = data
    }).catch((err) => { ElMessage.warning(err.message) })
  }

  const reLogin = () => {
    token.value = null
    information.value = null
    router.replace({
      name: 'login',
      query: {
        redirect: router.currentRoute.value.fullPath,
      },
    })
  }

  const handleUserLogout = () => {
    return userApi.logout().then(() => {
      ElMessage.success('退出成功')
      reLogin()
    }).catch(() => { })
  }

  return {
    token,
    username,
    userIsLogin,
    information,
    reLogin,
    handleUserLogin,
    handleUserLogout,
    getUserInformation,
  }
})
