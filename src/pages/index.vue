<script setup lang="ts" generic="T extends any, O extends any">
import scheduleCalendarApi from '~/api/modules/schedule-calendar'

const list = ref<ScheduleCalendar[]>([])
const getScheduleCalendarList = () => {
  scheduleCalendarApi.getScheduleCalendarList().then(res => {
    list.value = res.data
  })
}
onMounted(() => {
  getScheduleCalendarList()
})

</script>

<template>
  <month-calendar :date="new Date()" v-model="list" />
</template>
