<script setup lang="ts">
import dayjs from 'dayjs'
import isBetween from 'dayjs/plugin/isBetween'
import { ElMessage } from 'element-plus'
import { Check, CloseBold, Delete, Edit } from '@element-plus/icons-vue'
import CalendarItem from './CalendarItem.vue'
import scheduleOperationApi from '~/api/modules/scheduleOperationApi'
import scheduleCalendarApi from '~/api/modules/scheduleCalendarApi'

const emit = defineEmits(['refresh', 'editSchedule'])

const modelValue = defineModel<ScheduleCalendarDTO[]>({
  default: () => [],
})
const date = defineModel<Date>('date')
dayjs.extend(isBetween)

const list = ref<any>({})
watchArray(() => [date.value, modelValue.value], () => {
  list.value = scheduleCalendarEveryDay(date.value, modelValue.value)
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
const drawerData = computed(() => list.value?.[drawerDay.value])
function onClickItem({ day }: { day: string }) {
  drawerDay.value = day
  detailDrawer.value = true
}
function handleItemStatus(status: string) {
  if (handling.value)
    return

  handling.value = true
  if (status === 'delete-all') {
    scheduleCalendarApi.deleteScheduleCalendar(current.value.id).then(() => {
      ElMessage.success('删除成功')
      emit('refresh')
    }).finally(() => {
      handling.value = false
      detailDialog.value = false
    })
  }
  else {
    scheduleOperationApi.insertOrUpdateScheduleOperation({
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
}

function handleEditSchedule(id?: number) {
  detailDialog.value = false
  detailDrawer.value = false
  emit('editSchedule', id)
}
</script>

<template>
  <div class="calendar">
    <el-calendar v-model="date">
      <template #header>
        <slot name="header" />
      </template>
      <template #date-cell="{ data }">
        <CalendarItem
          :day="data.day" :list="list?.[data.day] || []" @item-click="onClickScheduleItem"
          @click="onClickItem"
        />
      </template>
    </el-calendar>

    <el-dialog v-model="detailDialog" width="450px" destroy-on-close>
      <template #header>
        <div flex="~ row" items-center gap-2>
          <span class="text-lg">日程详情</span>
          <el-button :loading="handling" link :icon="Edit" @click="handleEditSchedule(current.instance?.scheduleId)" />
          <el-popconfirm
            width="220" title="确定删除全部日程吗? 这是不可逆的，请谨慎操作, 之前完成或被取消任务项不可再被修改"
            @confirm="handleItemStatus('delete-all')"
          >
            <template #reference>
              <el-button :loading="handling" link :disabled="handling" type="danger" :icon="Delete" />
            </template>
          </el-popconfirm>
        </div>
      </template>
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
        <el-button-group grid w-full style="grid-template-columns:repeat(auto-fit, minmax(25%, 1fr))">
          <el-popconfirm
            width="220" title="确定删除这个日程? 这是不可逆的，请谨慎操作, 完成或被取消任务项不可再被修改"
            @confirm="handleItemStatus('delete')"
          >
            <template #reference>
              <el-button :loading="handling" :disabled="handling" type="danger" :icon="Delete">
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

.el-button+.el-button {
  margin-left: 0;
}
</style>
