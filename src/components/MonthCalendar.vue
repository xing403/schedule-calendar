<script setup lang="ts">
import CalendarItem from './CalendarItem.vue'
import dayjs, { Dayjs } from 'dayjs'
import isBetween from 'dayjs/plugin/isBetween'
import { random as randomColor } from '@ctrl/tinycolor';
import { insertOrUpdateScheduleOperation } from '~/api/modules/schedule-operation'
import { ElMessage } from 'element-plus';

const cronResult: {
  [key: string]: Dayjs[]
} = {}

const modelValue = defineModel<ScheduleCalendarDTO[]>()
const date = defineModel<Date>('date')
const emit = defineEmits(['refresh'])

dayjs.extend(isBetween)

const list = computed(() => {
  // 当前月第一天所在周的第一天
  const startDay = dayjs(date.value).startOf('month').startOf('week')
  // 当前月最后一天所在周的最后一天
  const endDay = dayjs(date.value).endOf('month').endOf('week')

  const tempData: any = {}
  const diff = endDay.diff(startDay, 'day')

  const theme = isDark.value ? 'dark' : 'light'

  Array.from({ length: diff + 1 }, (_, index) => {
    const temp: any = []
    const tempDay = startDay.add(index, 'day')
    const tempDayStr = tempDay.format('YYYY-MM-DD')
    modelValue.value?.forEach(item => {
      let inRange = false, isSide = false

      if (item.operation.delete.some(item => dayjs(item).isSame(tempDay, 'date'))) {
        return
      }

      let state = 'waiting';
      if (item.operation.finish.some(item => dayjs(item).isSame(tempDay, 'date'))) {
        state = 'finish'
      } else if (item.operation.cancel.some(item => dayjs(item).isSame(tempDay, 'date'))) {
        state = 'cancel'
      }

      if (item.scheduleModel === '0') {
        const start = dayjs(item.scheduleRangeStart)
        const end = dayjs(item.scheduleRangeEnd)

        inRange = tempDay.isBetween(start, end)
        isSide = start.isSame(tempDay, 'date') || end.isSame(tempDay, 'date')
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
          id: item.scheduleId,
          title: item.scheduleTitle,
          state,
          color: randomColor({
            seed: item.scheduleId,
            luminosity: theme,
            hue: 'blue',
          }).toHexString(),
        })
      }
    })
    tempData[tempDayStr] = temp
  })
  return tempData
});
const detailDialog = ref(false)
const handling = ref(false)
const current = ref<{
  id: number,
  day: string,
  status: string,
  instance?: ScheduleCalendarDTO
}>({
  status: 'waiting',
  day: dayjs().format('YYYY-MM-DD'),
  id: 0,
  instance: undefined
})
const onItemClick = (data: any) => {
  ({
    day: current.value.day,
    id: current.value.id,
    status: current.value.status
  } = data)
  current.value.instance = modelValue.value?.find((item: ScheduleCalendarDTO) => item.scheduleId === data.id)
  detailDialog.value = true
}

const handleItemStatus = (status: string) => {
  if (handling.value) {
    return
  }
  handling.value = true
  insertOrUpdateScheduleOperation({
    scheduleId: current.value.id,
    operationDate: current.value.day,
    operationStatus: status
  } as ScheduleOperationEntity).then((res: any) => {
    ElMessage.success(res.message)
    emit('refresh')
  }).finally(() => {
    handling.value = false
    detailDialog.value = false
  })

}
</script>

<template>
  <div class="calendar">
    <el-calendar v-model="date">
      <template #header>
        <slot name="header" />
      </template>
      <template #date-cell="{ data }">
        <calendar-item :day="data.day" :list="list[data.day]" @item-click="onItemClick" />
      </template>
    </el-calendar>

    <el-dialog title="日程详情" v-model="detailDialog" width="450px" destroy-on-close>
      <el-descriptions :column="1" border>
        <el-descriptions-item label="日程标题" label-class-name="w-100px">
          {{ current.instance?.scheduleTitle }}
        </el-descriptions-item>
        <el-descriptions-item label="时间" label-class-name="w-100px">
          {{ current.day }}
        </el-descriptions-item>
        <el-descriptions-item label="当前状态" label-class-name="w-100px">
          {{ current.status }}
        </el-descriptions-item>
      </el-descriptions>
      <template #footer>
        <el-button-group w-full grid style="grid-template-columns:repeat(3, 1fr)">
          <el-popconfirm title="确定删除日程？这是不可逆的" @confirm="handleItemStatus('delete')">
            <template #reference>
              <el-button :loading="handling" :disabled="handling || current.status === 'delete'"
                type="danger">删除</el-button>
            </template>
          </el-popconfirm>
          <el-button :loading="handling" :disabled="handling || current.status === 'cancel'" handling type="warning"
            @click="handleItemStatus('cancel')">放弃</el-button>
          <el-button :loading="handling" :disabled="handling || current.status === 'finish'" type="success"
            @click="handleItemStatus('finish')">完成</el-button>
        </el-button-group>
      </template>
    </el-dialog>

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

  .el-button-group:after,
  .el-button-group:before {
    content: none;
  }
}
</style>
