/// <reference types="vitest" />

import path from 'node:path'
import { defineConfig, loadEnv } from 'vite'
import useVitePlugins from './vite/plugins'

export default ({ mode, command }: any) => {
  const env = loadEnv(mode, process.cwd())
  return defineConfig({
    resolve: {
      alias: {
        '~/': `${path.resolve(__dirname, 'src')}/`,
      },
    },
    plugins: useVitePlugins(),
    server: {
      proxy: {
        '/api': {
          target: env.VITE_APP_PROXY_URL,
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, '')
        }
      }
    },
    test: {
      environment: 'jsdom',
    },
  })

}
