<script setup lang="ts">
import { CalendarItemProps, ScheduleItem } from './ScheduleItem';
import { SuccessFilled, CircleCloseFilled } from '@element-plus/icons-vue'

const props = defineProps<CalendarItemProps>()
const emit = defineEmits(['itemClick'])
const handleClickItem = (item: ScheduleItem) => {
  emit('itemClick', { day: props.day, id: item.id, status: item.state })
}
const getStateIcon = (state: string) => {
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
      <el-button v-for="item, index in list" :color="item.color" :key="props.day + index" w-full
        @click.stop="handleClickItem(item)" :icon="getStateIcon(item.state)">
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
