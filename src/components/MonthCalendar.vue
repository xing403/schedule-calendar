<script setup lang="ts">
import CalendarItem from './CalendarItem.vue'
import dayjs, { Dayjs } from 'dayjs'
import isBetween from 'dayjs/plugin/isBetween'
import { random as randomColor } from '@ctrl/tinycolor';

const cronResult: {
  [key: string]: Dayjs[]
} = {}

const modelValue = defineModel<ScheduleCalendar[]>()

const date = ref(dayjs())

dayjs.extend(isBetween)

const list = computed(() => {
  // 当前月第一天所在周的第一天
  const startDay = dayjs(date.value).startOf('month').startOf('week')
  // 当前月最后一天所在周的最后一天
  const endDay = dayjs(date.value).endOf('month').endOf('week')
  const tempData: any = {}
  const diff = endDay.diff(startDay, 'day')
  Array.from({ length: diff + 1 }, (_, index) => {
    const temp: any = []
    const tempDay = startDay.add(index, 'day')
    const tempDayStr = tempDay.format('YYYY-MM-DD')
    modelValue.value?.forEach(item => {
      let inRange = false, isSide = false
      if (item.scheduleModel === '0') {
        const start = dayjs(item.scheduleRangeStart)
        const end = dayjs(item.scheduleRangeEnd)

        inRange = tempDay.isBetween(start, end)
        isSide = start.isSame(tempDayStr) || end.isSame(tempDayStr)
      } else if (item.scheduleModel === '1') {
        inRange = dayjs(item.scheduleDate).isSame(tempDayStr)
      } else if (item.scheduleModel === '2') {
        const result = cronResult[item.scheduleCron] && cronResult[item.scheduleCron].length > 0
          ? cronResult[item.scheduleCron]
          : getCronDate(item.scheduleCron, startDay, endDay)
        inRange = result.some(item => item.isSame(tempDayStr))
      }
      if (inRange || isSide) {
        temp.push({
          title: item.scheduleTitle,
          color: randomColor({
            seed: item.scheduleId,
            luminosity: 'light',
            hue: 'blue',
          }).toHexString(),
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
    <el-calendar v-model="date">
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
