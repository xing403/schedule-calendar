<script setup lang="ts">
import { ArrowRight } from '@element-plus/icons-vue'
import useScheduleConfigStore from '~/store/modules/schedule-config'
import useSystemStore from '~/store/modules/system'

const dialog = defineModel<boolean>()
const scheduleConfigStore = useScheduleConfigStore()
const systemStore = useSystemStore()
const isDeveloperMode = ref(useLocalStorage('is-developer-mode', false, { deep: true }))
const defaultColorTheme = [{
  value: 'red',
  label: 'Red',
}, {
  value: 'orange',
  label: 'Orange',
}, {
  value: 'yellow',
  label: 'Yellow',
}, {
  value: 'green',
  label: 'Green',
}, {
  value: 'blue',
  label: 'Blue',
}, {
  value: 'purple',
  label: 'Purple',
}, {
  value: 'pink',
  label: 'Pink',
}]
watch(() => systemStore.isDeveloperMode, (val) => {
  isDeveloperMode.value = val
})
</script>

<template>
  <el-drawer v-model="dialog" title="设置" direction="btt" size="80%" destory-on-close style="width: 80%;" m-a>
    <el-scrollbar height="100%">
      <div class="list-group" my-1>
        <div class="list-group-item" b-b="1px light:#F2F4F7 dark:#2A2A2A" @click="scheduleConfigStore.clearColors">
          <div class="list-item-title" p-l-1>
            清除颜色缓存
          </div>
          <div class="list-item-action">
            <el-icon cursor-pointer>
              <ArrowRight />
            </el-icon>
          </div>
        </div>
        <div class="list-group-item" b-b="1px light:#F2F4F7 dark:#2A2A2A">
          <div class="list-item-title" p-l-1>
            <el-popover placement="right-start" :width="200" trigger="click">
              <ul>
                <li>颜色更新后将会再下次打开应用时生效</li>
                <li>默认仅对之后创建的日程生效，若需对之前的日程生效请执行清除颜色缓存并重启应用</li>
              </ul>
              <template #reference>
                <el-badge type="info">
                  <el-button text>
                    随机任务项颜色
                  </el-button>
                </el-badge>
              </template>
            </el-popover>
          </div>
          <div class="list-item-action">
            <el-select
              v-model="scheduleConfigStore.colorTheme" placeholder="请选择颜色" multiple allow-create
              default-first-option w-240px
            >
              <el-option
                v-for="color in defaultColorTheme" :key="color.value" :label="color.label"
                :value="color.value"
              >
                <div class="flex items-center">
                  <el-tag :color="color.value" style="margin-right: 8px" size="small" />
                  <span :style="{ color: color.value }">{{ color.label }}</span>
                </div>
              </el-option>
              <template #tag>
                <el-tag v-for="color in scheduleConfigStore.colorTheme" :key="color" :color="color" />
              </template>
            </el-select>
          </div>
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
    </el-scrollbar>
  </el-drawer>
</template>

<style scoped>
.list-group-item {
  @apply items-center justify-between px-1 py-2 flex;
}
</style>
