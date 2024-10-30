<script setup lang="ts" generic="T extends any, O extends any">
import scheduleCalendarApi from '~/api/modules/schedule-calendar'
import useUserStore from '~/store/modules/user'
const date = ref(new Date())
const list = ref<ScheduleCalendar[]>([])
const userStore = useUserStore()
const getScheduleCalendarList = () => {
  scheduleCalendarApi.getScheduleCalendarList().then(res => {
    list.value = res.data
  })
}
watchEffect(() => {
  if (userStore.userIsLogin) {
    getScheduleCalendarList()
  } else {
    list.value = []
  }
})

</script>

<template>
  <month-calendar v-model:date="date" v-model="list">
    <template #header>
      <schedule-calendar-header v-model:date="date" />
    </template>
  </month-calendar>
</template>
