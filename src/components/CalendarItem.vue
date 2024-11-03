<script setup lang="ts">
import { CircleCloseFilled, Loading, SuccessFilled } from '@element-plus/icons-vue'
import type { CalendarItemProps, ScheduleItem } from './ScheduleItem'

const props = defineProps<CalendarItemProps>()
const emit = defineEmits(['itemClick', 'click'])
function handleClickScheduleItem(item: ScheduleItem) {
  emit('itemClick', { day: props.day, id: item.id, status: item.state })
}
function handleClickItem() {
  emit('click', { day: props.day })
}
function getStateColor(state: string) {
  switch (state) {
    case 'finish':
      return 'var(--el-color-success)'
    case 'cancel':
      return 'var(--el-color-danger)'
    case 'waiting':
      return 'var(--el-color-info)'
    default:
      return undefined
  }
}
</script>

<template>
  <div select-none @click.stop="handleClickItem">
    <slot name="header">
      <div text-5 text="hover:trueGray">
        {{ props.day }}
      </div>
    </slot>
    <el-scrollbar :height="props.scene === 'drawer' ? '' : '100px'">
      <el-button
        v-for="item, index in list" :key="props.day + index" :color="isDark ? item.darkColor : item.lightColor"
        :disabled="false" w-full justify-start @click.stop="handleClickScheduleItem(item)"
      >
        <template #icon>
          <el-icon :class="{ 'is-loading': item.state === 'waiting' }" :color="getStateColor(item.state)">
            <SuccessFilled v-if="item.state === 'finish'" />
            <CircleCloseFilled v-if="item.state === 'cancel'" />
            <Loading v-if="item.state === 'waiting'" />
          </el-icon>
        </template>
        <span text="light:black dark:white">{{ item.title }}</span>
      </el-button>
    </el-scrollbar>
  </div>
</template>

<style lang="postcss" scoped>
.el-button+.el-button {
  margin-left: 0;
  margin-top: 5px;
}
</style>
