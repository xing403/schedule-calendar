<script setup lang="ts">
import { CircleCloseFilled, Loading, SuccessFilled } from '@element-plus/icons-vue'

defineProps<{
  state: string
  color?: string
}>()
</script>

<template>
  <el-icon :class="{ 'is-loading': state === 'waiting' }" :color="color">
    <SuccessFilled v-if="state === 'finish'" />
    <CircleCloseFilled v-if="state === 'cancel'" />
    <Loading v-if="state === 'waiting'" />
  </el-icon>
</template>
