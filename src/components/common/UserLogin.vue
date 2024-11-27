<script setup lang="ts">
import { ElMessage } from 'element-plus'
import useUserStore from '~/store/modules/user'

const userStore = useUserStore()

const loginDialog = defineModel()
const router = useRouter()

const loginForm = ref({
  username: '',
  password: '',
})
const loginFormRules = {
  username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
}
const loginFormRef = ref()
function handleLoginUser() {
  loginFormRef.value.validate(async (valid: boolean) => {
    if (valid) {
      userStore.handleUserLogin(loginForm.value).then(() => {
        ElMessage.success('登录成功')
        loginFormRef.value.resetFields()
        loginDialog.value = false
        router.replace({})
      }).catch((error) => {
        ElMessage.error(error)
        userStore.token = ''
      })
    }
  })
}
</script>

<template>
  <el-dialog v-model="loginDialog" title="登录" width="300px" destroy-on-close append-to-body>
    <div class="login-content" flex="~ col" items-center justify-center>
      <el-form
        ref="loginFormRef" :model="loginForm" :rules="loginFormRules" label-position="top" w-full
        :inline="false"
      >
        <el-form-item prop="username">
          <el-input v-model="loginForm.username" placeholder="请输入用户名" />
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            v-model="loginForm.password" type="password" placeholder="请输入密码" show-password
            @keydown.enter="handleLoginUser"
          />
        </el-form-item>
      </el-form>
    </div>
    <template #footer>
      <el-button type="primary" w-full @click="handleLoginUser">
        登录
      </el-button>
    </template>
  </el-dialog>
</template>
