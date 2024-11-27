<script setup lang="ts">
import useSystemStore from '~/store/modules/system'

const { applicationInfo } = useSystemStore()
const drawer = defineModel<boolean>()
</script>

<template>
  <el-drawer
    v-model="drawer" title="关于我" direction="btt" size="80%" style="width: 80%;" destory-on-close append-to-body
    m-a
  >
    <el-descriptions :column="1" border>
      <el-descriptions-item label="应用">
        <div text-right>
          {{ applicationInfo.applicationName }}
        </div>
      </el-descriptions-item>
      <el-descriptions-item label="版本">
        <div text-right>
          {{ applicationInfo.version }}
        </div>
      </el-descriptions-item>
      <el-descriptions-item label="作者">
        <div text-right>
          {{ applicationInfo.author.name }}
        </div>
      </el-descriptions-item>
      <el-descriptions-item label="邮箱">
        <div text-right>
          {{ applicationInfo.author.email.replace('@', '#') }}
        </div>
      </el-descriptions-item>
      <el-descriptions-item label="主页">
        <div text-right>
          {{ applicationInfo.author.url }}
        </div>
      </el-descriptions-item>
    </el-descriptions>
  </el-drawer>
</template>
