import { createApp } from 'vue'
import VConsole from 'vconsole'
import ElementPlus from 'element-plus'
import router from './router'
import App from './App.vue'

import '@unocss/reset/tailwind.css'
import 'element-plus/dist/index.css'
import 'element-plus/theme-chalk/dark/css-vars.css'
import 'element-plus/theme-chalk/display.css'

import 'uno.css'
import store from './store'
import './assets/styles/main.css'

new VConsole({ theme: 'dark' })
const app = createApp(App)

app.use(ElementPlus)
app.use(store)
app.use(router)
app.mount('#app')
