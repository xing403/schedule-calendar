<script setup lang="ts" generic="T extends any, O extends any">

import { random as randomColor } from '@ctrl/tinycolor';
const list = ref([{
  title: 'test1',
  range: '2024-10-10~2024-11-01',
  color: randomColor({
    luminosity: 'light',
    hue: 'blue',
  }).toHexString()
}, {
  title: 'test2',
  range: '2024-10-10~2024-11-01',
  color: randomColor({
    luminosity: 'light',
    hue: 'blue',
  }).toHexString()
}, {
  title: 'test3',
  range: '2024-10-10~2024-11-01',
  color: randomColor({
    luminosity: 'light',
    hue: 'blue',
  }).toHexString()
}])
</script>

<template>
  <month-calendar v-model="list" />
</template>
