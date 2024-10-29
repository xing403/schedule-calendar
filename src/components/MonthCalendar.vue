<script setup lang="ts">
import CalendarItem from './CalendarItem.vue'
import dayjs from 'dayjs'
import isBetween from 'dayjs/plugin/isBetween'

const modelValue = defineModel<any[]>()

const props = defineProps<{
  date?: Date
}>()

dayjs.extend(isBetween)

const list = computed(() => {
  // 当前月第一天所在周的第一天
  const startDay = dayjs(props.date).startOf('month').startOf('week')
  // 当前月最后一天所在周的最后一天
  const endDay = dayjs(props.date).endOf('month').endOf('week')
  const tempData: any = {}
  const diff = endDay.diff(startDay, 'day')
  Array.from({ length: diff + 1 }, (_, index) => {
    const temp: any = []
    const tempDay = startDay.add(index, 'day')
    const tempDayStr = tempDay.format('YYYY-MM-DD')
    console.log(tempDayStr)
    modelValue.value?.forEach(item => {
      let inRange = false, isSide = false

      if (/~/.test(item.range)) {
        const [start, end] = item.range.split('~')

        inRange = tempDay.isBetween(start, end)
        isSide = dayjs(start).isSame(tempDayStr) || dayjs(end).isSame(tempDayStr)
      } else {
        inRange = item.range.includes(tempDayStr)
      }
      if (inRange || isSide) {
        temp.push({
          title: item.title,
          color: item.color,
        })
      }
    })
    tempData[tempDayStr] = temp
  })
  return tempData
});
</script>

<template>
  <div class="calendar">
    <el-calendar>
      <template #date-cell="{ data }">
        <calendar-item :day="data.day" :list="list[data.day]" />
      </template>
    </el-calendar>
  </div>
</template>
<style lang="postcss" scoped>
.calendar {
  width: 100%;
  height: 100%;

  .el-calendar {
    --el-calendar-cell-width: auto;

    .is-selected {
      background: transparent;
    }
  }


}
</style>
