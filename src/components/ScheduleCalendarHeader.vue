<script setup lang="ts">
import dayjs from 'dayjs';
import useUserStore from '~/store/modules/user'
const date = defineModel<Date>('date')
const userStore = useUserStore()

const loginDialog = ref(!userStore.userIsLogin)
const addScheduleCalendarRef = ref()
const handleCommand = (command: string) => {
  switch (command) {
    case 'logout':
      userStore.handleUserLogout()
      break
    case 'add-schedule-calendar':
      addScheduleCalendarRef.value.open()
      break
  }
}
/**
 * 改变日期
 * @param diff
 */
const handleChangeMonthDate = (diff?: number) => {
  date.value = dayjs(date.value).add(diff || 0, 'month').toDate()
}
const today = () => {
  date.value = dayjs().toDate()
}
</script>

<template>
  <div flex="~ row" w-full h-full justify-between items-center>
    <div></div>
    <div flex="~ row" gap-10px w-full h-full justify-end items-center>

      <el-button-group>
        <el-button size="small" @click="handleChangeMonthDate(-1)">上个月</el-button>
        <el-button size="small" @click="today()">今天</el-button>
        <el-button size="small" @click="handleChangeMonthDate(1)">下个月</el-button>
      </el-button-group>

      <el-dropdown v-if="userStore.userIsLogin" trigger="click" @command="handleCommand">
        <el-avatar fit="fill">{{ userStore.information?.username }}</el-avatar>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item command="add-schedule-calendar">新增日程</el-dropdown-item>
            <el-dropdown-item divided command="logout">注销登录</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
      <el-button v-else type="primary" @click="loginDialog = true">登录</el-button>
    </div>
    <user-login v-model="loginDialog" />
    <add-schedule-calendar ref="addScheduleCalendarRef" />
  </div>
</template>
