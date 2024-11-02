<script setup lang="ts">
import type { Dayjs } from 'dayjs'
import dayjs from 'dayjs'
import isBetween from 'dayjs/plugin/isBetween'
import { random as randomColor } from '@ctrl/tinycolor'
import { ElMessage } from 'element-plus'
import { Check, CloseBold, Delete } from '@element-plus/icons-vue'
import CalendarItem from './CalendarItem.vue'
import { insertOrUpdateScheduleOperation } from '~/api/modules/schedule-operation'

const emit = defineEmits(['refresh'])

const cronResult: {
  [key: string]: Dayjs[]
} = {}

const modelValue = defineModel<ScheduleCalendarDTO[]>()
const date = defineModel<Date>('date')
dayjs.extend(isBetween)
const colors: any = []
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
    modelValue.value?.forEach((item) => {
      let inRange = false
      let isSide = false

      if (item.group.delete.some(item => dayjs(item).isSame(tempDay, 'date')))
        return

      let state = 'waiting'
      if (item.group.finish.some(item => dayjs(item).isSame(tempDay, 'date')))
        state = 'finish'
      else if (item.group.cancel.some(item => dayjs(item).isSame(tempDay, 'date')))
        state = 'cancel'

      if (item.scheduleModel === '0') {
        const start = dayjs(item.scheduleRangeStart)
        const end = dayjs(item.scheduleRangeEnd)

        inRange = tempDay.isBetween(start, end)
        isSide = start.isSame(tempDay, 'date') || end.isSame(tempDay, 'date')
      }
      else if (item.scheduleModel === '1') {
        inRange = dayjs(item.scheduleDate).isSame(tempDayStr)
      }
      else if (item.scheduleModel === '2') {
        const result = cronResult[item.scheduleCron] && cronResult[item.scheduleCron].length > 0
          ? cronResult[item.scheduleCron]
          : getCronDate(item.scheduleCron, startDay, endDay)
        inRange = result.some(item => item.isSame(tempDayStr))
      }
      let color = colors.find((clr: any) => clr.id === item.scheduleId)?.color

      if (!color) {
        color = randomColor({ luminosity: theme, hue: 'blue' }).toHexString()
        colors.push({ id: item.scheduleId, color })
      }

      if (inRange || isSide) {
        temp.push({
          id: item.scheduleId,
          title: item.scheduleTitle,
          state,
          color,
        })
      }
    })
    tempData[tempDayStr] = temp
    return temp
  })
  return tempData
})
const detailDialog = ref(false)
const handling = ref(false)
const current = ref<{
  id: number
  day: string
  status: string
  instance?: ScheduleCalendarDTO
}>({
  status: 'waiting',
  day: dayjs().format('YYYY-MM-DD'),
  id: 0,
  instance: undefined,
})
function onClickScheduleItem(data: any) {
  ({
    day: current.value.day,
    id: current.value.id,
    status: current.value.status,
  } = data)
  current.value.instance = modelValue.value?.find((item: ScheduleCalendarDTO) => item.scheduleId === data.id)
  detailDialog.value = true
}

const detailDrawer = ref(false)
const drawerDay = ref('')
const drawerData = computed(() => list.value[drawerDay.value])
function onClickItem({ day }: { day: string }) {
  drawerDay.value = day
  detailDrawer.value = true
}
function handleItemStatus(status: string) {
  if (handling.value)
    return

  handling.value = true
  insertOrUpdateScheduleOperation({
    scheduleId: current.value.id,
    operationDate: current.value.day,
    operationStatus: status,
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
        <CalendarItem :day="data.day" :list="list[data.day]" @item-click="onClickScheduleItem" @click="onClickItem" />
      </template>
    </el-calendar>

    <el-dialog v-model="detailDialog" title="日程详情" width="450px" destroy-on-close>
      <el-descriptions :column="1" border>
        <el-descriptions-item label="日程标题" label-class-name="w-100px">
          {{ current.instance?.scheduleTitle }}
        </el-descriptions-item>
        <el-descriptions-item label="时间" label-class-name="w-100px">
          {{ current.day }}
        </el-descriptions-item>
        <el-descriptions-item label="当前状态" label-class-name="w-100px">
          <el-tag v-if="current.status === 'waiting'" v-text="'进行中'" />
          <el-tag v-if="current.status === 'cancel'" type="info" v-text="'已取消'" />
          <el-tag v-if="current.status === 'finish'" type="success" v-text="'已完成'" />
          <el-tag v-if="current.status === 'delete'" type="danger" v-text="'已删除'" />
        </el-descriptions-item>
      </el-descriptions>
      <template #footer>
        <el-button-group grid w-full style="grid-template-columns:repeat(3, 1fr)">
          <el-popconfirm title="确定删除日程？这是不可逆的" @confirm="handleItemStatus('delete')">
            <template #reference>
              <el-button
                :loading="handling" :disabled="handling || current.status === 'delete'" type="danger"
                :icon="Delete"
              >
                删除
              </el-button>
            </template>
          </el-popconfirm>
          <el-button
            :loading="handling" :disabled="handling || current.status === 'cancel'" handling type="warning"
            :icon="CloseBold" @click="handleItemStatus('cancel')"
          >
            放弃
          </el-button>
          <el-button
            :loading="handling" :disabled="handling || current.status === 'finish'" type="success" :icon="Check"
            @click="handleItemStatus('finish')"
          >
            完成
          </el-button>
        </el-button-group>
      </template>
    </el-dialog>

    <el-drawer v-model="detailDrawer" :title="drawerDay" :destroy-on-close="true">
      <CalendarItem :day="drawerDay" :list="drawerData" scene="drawer" @item-click="onClickScheduleItem">
        <template #header>
          <div />
        </template>
      </CalendarItem>
    </el-drawer>
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
