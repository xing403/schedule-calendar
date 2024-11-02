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
function getStateIcon(state: string) {
  switch (state) {
    case 'finish':
      return h(SuccessFilled, { style: { color: 'var(--el-color-success)' } })
    case 'cancel':
      return h(CircleCloseFilled, { style: { color: 'var(--el-color-danger)' } })
    case 'waiting':
      return h(Loading, { style: { color: 'var(--el-color-primary)' } })
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
        v-for="item, index in list" :key="props.day + index" :color="item.color" w-full justify-start
        :icon="getStateIcon(item.state)" @click.stop="handleClickScheduleItem(item)"
      >
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
