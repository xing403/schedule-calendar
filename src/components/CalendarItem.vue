<script setup lang="ts">
import { CircleCloseFilled, Loading, SuccessFilled } from '@element-plus/icons-vue'
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
              <el-icon :class="{ 'is-loading': item.state === 'waiting' }" :color="getStateColor(item.state)">
                <SuccessFilled v-if="item.state === 'finish'" />
                <CircleCloseFilled v-if="item.state === 'cancel'" />
                <Loading v-if="item.state === 'waiting'" />
              </el-icon>
            </template>
            <span>{{ item.title }}</span>
          </el-button>
        </TransitionGroup>
      </template>
    </el-scrollbar>
    <div v-else grid style="grid-template-columns: repeat(auto-fill, 1em);">
      <div
        v-for="item, index in list" :key="props.day + index" h-3 w-3 b-rd-3 px-1
        :style="{ background: isDark ? item.darkColor : item.lightColor }"
      />
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
