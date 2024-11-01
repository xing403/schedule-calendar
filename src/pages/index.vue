<script setup lang="ts" generic="T extends any, O extends any">
import scheduleCalendarApi from '~/api/modules/schedule-calendar'
import useUserStore from '~/store/modules/user'
const date = ref(new Date())
const list = ref<ScheduleCalendarDTO[]>([])
const userStore = useUserStore()
const loading = ref(false)
const getScheduleCalendarList = () => {
  if (loading.value) {
    return
  }
  loading.value = true
  scheduleCalendarApi.getScheduleCalendarDTOList().then(res => {
    list.value = res.data
  }).catch(() => {
    list.value = []
  }).finally(() => {
    loading.value = false
  })
}

watch(() => userStore.userIsLogin, (val) => {
  val ? getScheduleCalendarList() : list.value = []
}, {
  immediate: true
})

</script>

<template>
  <month-calendar v-loading="loading" v-model:date="date" v-model="list" @refresh="getScheduleCalendarList()">
    <template #header>
      <schedule-calendar-header v-model:date="date" />
    </template>
  </month-calendar>
</template>
