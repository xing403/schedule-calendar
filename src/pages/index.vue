<script setup lang="ts" generic="T extends any, O extends any">
import scheduleCalendarApi from '~/api/modules/scheduleCalendarApi'
import useUserStore from '~/store/modules/user'
import useSystemStore from '~/store/modules/system'

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
  <el-affix>
    <el-header class="header">
      <schedule-calendar-header @refresh="getScheduleCalendarList()" />
    </el-header>
  </el-affix>
  <month-calendar
    v-model="list" v-loading="loading" @refresh="getScheduleCalendarList()"
    @edit-schedule="handleEditScheduleCalendar"
  />

  <edit-schedule-calendar ref="editScheduleCalendarRef" @refresh="getScheduleCalendarList()" />
</template>

<style scoped>
@unocss;

.header {
  --un-gradient: #fdfcfb;
  --un-gradient-stops: 4px;
  background-size: 4px 4px;
  @apply bg-gradient-radial;
  backdrop-filter: saturate(70%) blur(4px);
}
</style>
