import axios from 'axios'
import { ElMessage } from 'element-plus'
import useUserStore from '~/store/modules/user'

const api = axios.create({
  baseURL: import.meta.env.VITE_APP_BASE_URL,
  timeout: 6000
})

// 请求拦截器
api.interceptors.request.use((config) => {
  const userStore = useUserStore()
  const token = userStore.token
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

api.interceptors.response.use((response) => {
  return new Promise((resolve, reject) => {
    const { data } = response
    if (data.code === 200) {
      resolve(data)
    } else if (data.code === 400) {
      ElMessage.error(data.message ?? data.msg)
      const userStore = useUserStore()
      userStore.reLogin()
      reject(data.message ?? data.msg)
    } else {
      reject(data.message ?? data.msg)
    }
  })
}, (error) => {
  return Promise.reject(error)
})

export default api
