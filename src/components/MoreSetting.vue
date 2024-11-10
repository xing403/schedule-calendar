<script setup lang="ts">
import useScheduleConfigStore from '~/store/modules/schedule-config'

const dialog = defineModel<boolean>()
const scheduleConfigStore = useScheduleConfigStore()
</script>

<template>
  <el-dialog v-model="dialog" title="设置" direction="btt" size="80%">
    <div class="list-group" my-1 p-2>
      <div
        class="list-group-item" flex="~ row" items-center justify-between px-1 py-2
        b-b="2px light:#F2F4F7 dark:#2A2A2A" @click="scheduleConfigStore.clearColors"
      >
        <div class="list-item-title" p-l-1>
          清除颜色缓存
        </div>
        <div class="list-item-action" />
      </div>
    </div>
  </el-dialog>
</template>
