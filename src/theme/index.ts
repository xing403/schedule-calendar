import ElementPlus from 'element-plus'

import 'element-plus/dist/index.css'
import 'element-plus/theme-chalk/dark/css-vars.css'
import 'element-plus/theme-chalk/display.css'
import Zh_CN from 'element-plus/es/locale/lang/zh-cn'
import type { App } from 'vue'

export default function theme(app: App) {
  app.use(ElementPlus, {
    locale: Zh_CN
  })
}
