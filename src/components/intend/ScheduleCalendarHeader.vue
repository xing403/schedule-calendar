<script setup lang="ts">
import { ChatLineRound, Moon, MoreFilled, Plus, Setting, Sunny, Warning } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import useUserStore from '~/store/modules/user'
import useSystemStore from '~/store/modules/system'

const emit = defineEmits(['refresh'])
const userStore = useUserStore()
const systemStore = useSystemStore()
const loginDialog = ref(false)
const addScheduleCalendarRef = ref()
const username = computed(() => userStore.username)
const settingDialog = ref(false)
const aboutMeDrawer = ref(false)
const applicationName = computed(() => systemStore.applicationName)
function handleCommand(command: string) {
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
    case 'setting':
      settingDialog.value = true
      break
    case 'about-me':
      aboutMeDrawer.value = true
      break
  }
}
let count = 0
let timer: any
function enableDeveloperMode() {
  count++
  clearTimeout(timer)
  if (count >= 10) {
    if (!systemStore.isDeveloperMode) {
      systemStore.isDeveloperMode = true
      localStorage.setItem('is-developer-mode', 'true')
      ElMessage.info('开启开发者模式，重启生效')
    }
  }
  if (count > 20 && count < 30)
    ElMessage.info('不要再点了')
  else if (count > 30)
    ElMessage.info(`再点就爆炸了 * ${count}`)

  timer = setTimeout(() => {
    count = 0
  }, 350)
}
</script>

<template>
  <div flex="~ row" h-full w-full items-center justify-between>
    <div cursor-pointer select-none @click="enableDeveloperMode">
      {{ applicationName }}
    </div>
    <div flex="~ row" h-full items-center justify-end gap-15px>
      <el-dropdown trigger="click" @command="handleCommand">
        <el-button v-if="systemStore.applicationMode === 'offline'" text :icon="MoreFilled" />
        <el-avatar v-else fit="fill">
          {{ username }}
        </el-avatar>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item command="change-theme" :icon="isDark ? Sunny : Moon">
              改变主题
            </el-dropdown-item>
            <el-dropdown-item command="add-schedule-calendar" :icon="Plus">
              新增日程
            </el-dropdown-item>
            <el-dropdown-item command="setting" :icon="Setting">
              更多设置
            </el-dropdown-item>
            <el-dropdown-item command="about-me" :icon="ChatLineRound">
              关于我们
            </el-dropdown-item>
            <el-dropdown-item
              v-if="userStore.userIsLogin && systemStore.applicationMode !== 'offline'" divided
              command="logout" :icon="Warning"
            >
              注销登录
            </el-dropdown-item>
            <el-dropdown-item
              v-else-if="systemStore.applicationMode !== 'offline'" divided command="login"
              :icon="Warning"
            >
              登录
            </el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
    <user-login v-model="loginDialog" />
    <add-schedule-calendar ref="addScheduleCalendarRef" @refresh="() => $emit('refresh')" />
    <more-setting v-model="settingDialog" />
    <about-me v-model="aboutMeDrawer" />
  </div>
</template>
