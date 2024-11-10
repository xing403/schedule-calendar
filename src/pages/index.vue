<script setup lang="ts" generic="T extends any, O extends any">
import scheduleCalendarApi from '~/api/modules/scheduleCalendarApi'
import useUserStore from '~/store/modules/user'
import useSystemStore from '~/store/modules/system'

const date = ref(new Date())
const list = ref<ScheduleCalendarDTO[]>([])
const userStore = useUserStore()
const systemStore = useSystemStore()
const loading = ref(false)
function getScheduleCalendarList() {
  if (loading.value)
    return

  loading.value = true
  list.value = []
  scheduleCalendarApi.getScheduleCalendarDTOList().then((res: any) => {
    list.value = res.data
  }).catch(() => { }).finally(() => {
    loading.value = false
  })
}

const editScheduleCalendarRef = ref()
function handleEditScheduleCalendar(id: number) {
  const schedule = list.value.find((item: ScheduleCalendarDTO) => item.scheduleId === id)
  editScheduleCalendarRef.value.setScheduleCalendar(schedule)
}

watch(() => userStore.userIsLogin || systemStore.applicationMode === 'offline', (val) => {
  if (val)
    getScheduleCalendarList()
}, {
  immediate: true,
  deep: true,
})
</script>

<template>
  <month-calendar
    v-model:date="date" v-model="list" v-loading="loading" @refresh="getScheduleCalendarList()"
    @edit-schedule="handleEditScheduleCalendar"
  >
    <template #header>
      <schedule-calendar-header v-model:date="date" @refresh="getScheduleCalendarList()" />
    </template>
  </month-calendar>

  <edit-schedule-calendar ref="editScheduleCalendarRef" @refresh="getScheduleCalendarList()" />
</template>
