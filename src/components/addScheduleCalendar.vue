<script setup lang="ts">
import { ElMessage } from 'element-plus';
import { insertScheduleCalendar } from '~/api/modules/schedule-calendar';
const dialog = ref(false)

const loading = ref(false)
const formRef = ref()
const scheduleRange = ref([])
const form = ref<ScheduleCalendar>({
  scheduleTitle: '',
  scheduleModel: '0',
  scheduleRangeStart: undefined,
  scheduleRangeEnd: undefined,
  scheduleDate: undefined,
  scheduleCron: '',
})

const rules = {
  scheduleTitle: [{ required: true, message: '请输入日程标题', trigger: 'blur' }],
  scheduleModel: [{ required: true, message: '请选择日程类型', trigger: 'blur' }],
}
const scheduleModelGroup = [{
  key: '0',
  label: '日期范围',
}, {
  key: '1',
  label: '指定日期',
}, {
  key: '2',
  label: 'cron 表达式',
}]

const handleSubmit = () => {
  formRef.value.validate((valid: boolean) => {
    if (valid) {
      insertScheduleCalendar(form.value).then(() => {
        ElMessage.success('创建成功')
        dialog.value = false
      })
    }
  })
}
watch(scheduleRange, (val) => {
  form.value.scheduleRangeStart = val[0]
  form.value.scheduleRangeEnd = val[1]
})

const open = () => {
  dialog.value = true
}

defineExpose({
  open
})


</script>

<template>
  <el-dialog title="新增日程" v-model="dialog" width="400">
    <el-form :model="form" ref="formRef" :rules="rules" label-position="top">
      <el-form-item label="日程标题" prop="scheduleTitle">
        <el-input v-model="form.scheduleTitle" placeholder="请输入日程标题" />
      </el-form-item>
      <el-form-item label="日程类型" prop="scheduleModel">
        <el-radio-group v-model="form.scheduleModel">
          <el-radio v-for="item in scheduleModelGroup" :key="item.key" :value="item.key" :label="item.label" />
        </el-radio-group>
      </el-form-item>
      <el-form-item v-if="form.scheduleModel === '0'" label="日期范围">
        <el-date-picker v-model="scheduleRange" type="daterange" start-placeholder="开始日期" end-placeholder="结束日期" />
      </el-form-item>
      <el-form-item v-if="form.scheduleModel === '1'" label="日期" prop="scheduleDate">
        <el-date-picker v-model="form.scheduleDate" type="date" placeholder="选择日期时间" />
      </el-form-item>
      <el-form-item v-if="form.scheduleModel === '2'" label="表达式" prop="scheduleCron">
        <el-input v-model="form.scheduleCron" placeholder="请输入 cron 表达式" />
      </el-form-item>

      <el-form-item>
        <el-button v-loading="loading" :disable="loading" type="primary" @click="handleSubmit">立即创建</el-button>
      </el-form-item>
    </el-form>

  </el-dialog>
</template>
