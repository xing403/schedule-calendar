import { RemovableRef } from '@vueuse/core'
import { defineStore } from 'pinia'
import userApi from '~/api/modules/user'

export default defineStore('user', () => {
  const router = useRouter()

  const token = ref<RemovableRef<string>>(useLocalStorage('token', '', { deep: true }))
  const information = ref<any>(null)

  const userIsLogin = computed(() => !!token.value)

  const handleUserLogin = ({ username, password }: { username: string, password: string }) => {
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
    })
  }

  const reLogin = () => {
    token.value = null
    information.value = null
    router.replace({
      name: 'login',
      query: {
        redirect: router.currentRoute.value.fullPath
      }
    })
  }

  const handleUserLogout = () => {
    return userApi.logout().then(() => {
      reLogin()
    }).catch(() => { })
  }

  return {
    token,
    userIsLogin,
    information,
    reLogin,
    handleUserLogin,
    handleUserLogout,
    getUserInformation
  }
})
