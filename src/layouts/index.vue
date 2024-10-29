<script setup lang="ts">
import layoutHeader from './layout-header.vue';
import layoutMain from './layout-main.vue';
</script>

<template>
  <el-container>
    <el-header>
      <layoutHeader />
    </el-header>
    <el-main>
      <layoutMain />
    </el-main>
  </el-container>
</template>
