<script setup lang="ts">
import { ElMessage, dayjs } from 'element-plus'
import scheduleCalendarApi from '~/api/modules/scheduleCalendarApi'

const emit = defineEmits(['refresh'])
const dialog = ref(false)
const loading = ref(false)
const formRef = ref()
const scheduleRange = ref<Date[]>([])
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
  scheduleRangeStart: [{ required: true, message: '请选择日程起止日期', trigger: 'blur' }],
  scheduleDate: [{ required: true, message: '请选择日程日期', trigger: 'blur' }],
  scheduleCron: [
    { required: true, message: '请输入 cron 表达式', trigger: 'blur' },
    { validator: (_rule: any, value: string, callback: any) => validateCorn(value, callback), trigger: 'blur' },
  ],
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

function handleSubmit() {
  formRef.value.validate((valid: boolean) => {
    if (valid) {
      scheduleCalendarApi.insertScheduleCalendar(form.value).then(() => {
        ElMessage.success('创建成功')
        formRef.value.resetFields()
        emit('refresh')
        dialog.value = false
      })
    }
  })
}
watch(scheduleRange, (val) => {
  form.value.scheduleRangeStart = val[0]
  form.value.scheduleRangeEnd = val[1]
})

function changeScheduleModel() {
  scheduleRange.value = [dayjs().toDate(), dayjs().toDate()]
  formRef.value?.resetFields(['scheduleRangeStart', 'scheduleRangeEnd', 'scheduleDate', 'scheduleCron'])
}

function open() {
  dialog.value = true
}

defineExpose({
  open,
})
</script>

<template>
  <el-dialog v-model="dialog" title="新增日程" width="400" destroy-on-close append-to-body>
    <el-form ref="formRef" :model="form" :rules="rules" label-position="top">
      <el-form-item label="日程标题" prop="scheduleTitle">
        <el-input v-model="form.scheduleTitle" placeholder="请输入日程标题" />
      </el-form-item>
      <el-form-item label="日程类型" prop="scheduleModel" @change="changeScheduleModel">
        <el-radio-group v-model="form.scheduleModel">
          <el-radio v-for="item in scheduleModelGroup" :key="item.key" :value="item.key" :label="item.label" />
        </el-radio-group>
      </el-form-item>
      <el-form-item v-if="form.scheduleModel === '0'" label="日期范围" prop="scheduleRangeStart">
        <el-date-picker
          v-model="scheduleRange" :editable="false" type="daterange" start-placeholder="开始日期"
          end-placeholder="结束日期" format="YYYY-MM-DD" value-format="YYYY-MM-DD"
        />
      </el-form-item>
      <el-form-item v-if="form.scheduleModel === '1'" label="日期" prop="scheduleDate">
        <el-date-picker
          v-model="form.scheduleDate" :editable="false" type="date" placeholder="选择日期时间"
          format="YYYY-MM-DD" value-format="YYYY-MM-DD"
        />
      </el-form-item>
      <el-form-item v-if="form.scheduleModel === '2'" label="日期范围">
        <el-date-picker
          v-model="scheduleRange" :editable="false" type="daterange" start-placeholder="开始日期"
          end-placeholder="结束日期" format="YYYY-MM-DD" value-format="YYYY-MM-DD"
        />
      </el-form-item>
      <el-form-item v-if="form.scheduleModel === '2'" label="表达式" prop="scheduleCron">
        <el-input v-model="form.scheduleCron" placeholder="请输入 cron 表达式, 例如 * * *">
          <template #prepend>
            0 0 0
          </template>
        </el-input>
        <el-alert>只需要输入 日月周的格式即可，周可省略</el-alert>
      </el-form-item>

      <el-form-item>
        <el-button v-loading="loading" :disable="loading" type="primary" w-full @click="handleSubmit">
          立即创建
        </el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>
