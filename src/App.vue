
<script setup lang="ts">
import zhCn from 'element-plus/es/locale/lang/zh-cn'
</script>
<template>
  <div font-sans text="gray-700 dark:gray-200">
    <el-config-provider :locale="zhCn">
      <RouterView />
    </el-config-provider>
  </div>
</template>
