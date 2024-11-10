<script setup lang="ts">
import useScheduleConfigStore from '~/store/modules/schedule-config'
import useSystemStore from '~/store/modules/system'

const dialog = defineModel<boolean>()
const scheduleConfigStore = useScheduleConfigStore()
const systemStore = useSystemStore()
const isDeveloperMode = ref(useLocalStorage('is-developer-mode', false, { deep: true }))
watch(() => systemStore.isDeveloperMode, (val) => {
  isDeveloperMode.value = val
})
</script>

<template>
  <el-dialog v-model="dialog" title="设置" direction="btt" size="80%" destory-on-close>
    <div class="list-group" my-1 p-2>
      <div class="list-group-item" b-b="1px light:#F2F4F7 dark:#2A2A2A" @click="scheduleConfigStore.clearColors">
        <div class="list-item-title" p-l-1>
          清除颜色缓存
        </div>
        <div class="list-item-action" />
      </div>
      <div v-if="systemStore.isDeveloperMode" class="list-group-item" b-b="1px light:#F2F4F7 dark:#2A2A2A">
        <div class="list-item-title" p-l-1>
          开发者模式
        </div>
        <div class="list-item-action">
          <el-switch v-model="isDeveloperMode" />
        </div>
      </div>
    </div>
  </el-dialog>
</template>

<style lang="postcss" scoped>
.list-group-item {
  @apply items-center justify-between px-1 py-2 flex;
}
</style>
