<script setup lang="ts">
import { CircleCloseFilled, SuccessFilled } from '@element-plus/icons-vue'
import type { CalendarItemProps, ScheduleItem } from './ScheduleItem'

const props = defineProps<CalendarItemProps>()
const emit = defineEmits(['itemClick'])
function handleClickItem(item: ScheduleItem) {
  emit('itemClick', { day: props.day, id: item.id, status: item.state })
}
function getStateIcon(state: string) {
  switch (state) {
    case 'finish':
      return h(SuccessFilled, { style: { color: 'var(--el-color-success)' } })
    case 'cancel':
      return h(CircleCloseFilled, { style: { color: 'var(--el-color-danger)' } })
    default:
      return undefined
  }
}
</script>

<template>
  <div>
    <div>{{ props.day }}</div>
    <el-scrollbar height="100px">
      <el-button
        v-for="item, index in list" :key="props.day + index" :color="item.color" w-full
        :icon="getStateIcon(item.state)" @click.stop="handleClickItem(item)"
      >
        {{ item.title }}
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
