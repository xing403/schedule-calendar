import { defineStore } from 'pinia'

// 用户 schedule calendar 配置
export default defineStore('scheduleConfig', () => {
  const colors: any = useLocalStorage('schedule-color', [], { deep: true })
  const colorsCache = ref(colors.value)
  const colorTheme = useLocalStorage<number | string | 'red' | 'orange' | 'yellow' | 'green' | 'blue' | 'purple' | 'pink' | 'monochrome'>('schedule-theme', 'blue', { deep: true })
  const toggleColor = (newColor: any) => colors.value.push(newColor)
  const clearColors = () => colors.value = []

  return {
    colors,
    colorsCache,
    toggleColor,
    clearColors,
    colorTheme,
  }
})
