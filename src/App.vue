<script setup lang="ts">
import zhCn from 'element-plus/es/locale/lang/zh-cn'

import VConsole from 'vconsole'

if (import.meta.env.DEV) {
  // eslint-disable-next-line no-new
  new VConsole({ theme: isDark.value ? 'dark' : 'light' })
}
</script>

<template>
  <div font-sans text="gray-700 dark:gray-200">
    <el-config-provider :locale="zhCn">
      <RouterView />
    </el-config-provider>
  </div>
</template>
