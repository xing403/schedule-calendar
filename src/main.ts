import { createApp } from 'vue'
import VConsole from 'vconsole';
import router from './router'
import App from './App.vue'
import theme from './theme'

import '@unocss/reset/tailwind.css'
import 'uno.css'
import store from './store'
import './assets/styles/main.css'
// or init with options

new VConsole({ theme: 'dark' });
const app = createApp(App)

theme(app)
app.use(store)
app.use(router)
app.mount('#app')
