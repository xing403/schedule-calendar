<script setup lang="ts">
import dayjs from 'dayjs';
import { Plus, Sunny, Moon, Warning } from '@element-plus/icons-vue'
import useUserStore from '~/store/modules/user'
const date = defineModel<Date>('date')
const userStore = useUserStore()

const loginDialog = ref(false)
const addScheduleCalendarRef = ref()

const handleCommand = (command: string) => {
  switch (command) {
    case 'logout':
      userStore.handleUserLogout()
      break
    case 'add-schedule-calendar':
      addScheduleCalendarRef.value.open()
      break
    case 'change-theme':
      toggleDark()
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
            <el-dropdown-item command="change-theme" :icon="isDark ? Sunny : Moon">改变主题</el-dropdown-item>
            <el-dropdown-item command="add-schedule-calendar" :icon="Plus">新增日程</el-dropdown-item>
            <el-dropdown-item divided command="logout" :icon="Warning">注销登录</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
      <el-button v-else size="small" @click="loginDialog = true">登录</el-button>
    </div>
    <user-login v-model="loginDialog" />
    <add-schedule-calendar ref="addScheduleCalendarRef" />
  </div>
</template>
