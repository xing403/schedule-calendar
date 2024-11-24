// vite plugins
import type { PluginOption } from 'vite'
import Vue from '@vitejs/plugin-vue'
import createComponents from './components'
import createAutoImport from './auto-import'
import createPages from './pages'
import createUnocss from './unocss'
import createVueDevTools from './dev-tools'

export default function useVitePlugins() {
  const plugins: (PluginOption | PluginOption[])[] = [Vue()]
  plugins.push(createComponents())
  plugins.push(createPages())
  plugins.push(createAutoImport())
  plugins.push(createUnocss())
  plugins.push(createVueDevTools())

  return plugins
}
