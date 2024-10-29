<script setup lang="ts">
const props = defineProps<{
  day: string
  list: Array<any>
}>()
</script>

<template>
  <div>
    <div>{{ props.day }}</div>
    <el-scrollbar height="100px">
      <el-button v-for="item, index in list" :color="item.color" :key="props.day + index" w-full @click="" plain>{{
        item.title
      }}</el-button>
    </el-scrollbar>
  </div>
</template>
<style lang="postcss" scoped>
.el-button+.el-button {
  margin-left: 0;
  margin-top: 5px;
}
</style>
