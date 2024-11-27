<script setup lang="ts">
import dayjs from 'dayjs'
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
  <div h-full w-full select-none p-10px @click.stop="handleClickItem">
    <slot name="header">
      <div text-5>
        {{ dayjs(props.day).format('MM-DD') }}
      </div>
    </slot>
    <el-scrollbar v-if="props.scene === 'sidebar'">
      <el-empty v-if="!list?.length" />
      <template v-else>
        <TransitionGroup name="fade">
          <el-button
            v-for="item, index in list" :key="props.day + index"
            :color="isDark ? item.darkColor : item.lightColor" :disabled="false" w-full justify-start
            @click.stop="handleClickScheduleItem(item)"
          >
            <template #icon>
              <status-icon :state="item.state" :color="getStateColor(item.state)" />
            </template>
            <span>{{ item.title }}</span>
          </el-button>
        </TransitionGroup>
      </template>
    </el-scrollbar>
    <div v-else grid style="grid-template-columns: repeat(auto-fill, 1.5em);">
      <div
        v-for="item, index in list" :key="props.day + index" flex="~ row" h-5 w-5 items-center justify-center b-rd-3
        :style="{ background: isDark ? item.darkColor : item.lightColor }"
      >
        <status-icon
          :state="item.state"
          :color="getStateColor(item.state)"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
.el-button+.el-button {
  @apply ml-0 mt-5px;
}

.fade-enter-active {
  @apply animate-fade-in-right animate-duration-200;
}

.fade-leave-active {
  @apply animate-fade-out-right animate-duration-200;
}

.fade-enter-from,
.fade-leave-to {
  @apply opacity-0;
}

.fade-leave-active {
  @apply absolute;
}
</style>
