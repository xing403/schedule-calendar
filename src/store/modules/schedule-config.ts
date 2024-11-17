import { ElMessageBox, ElNotification } from 'element-plus'
import { defineStore } from 'pinia'

type ThemeColor = number | string | 'red' | 'orange' | 'yellow' | 'green' | 'blue' | 'purple' | 'pink'
// 用户 schedule calendar 配置
export default defineStore('scheduleConfig', () => {
  const colors: any = useLocalStorage('schedule-color', [], { deep: true })
  const colorsCache = ref(colors.value)

  const colorTheme = useLocalStorage<Array<ThemeColor>>('schedule-themes', [], { deep: true })
  const colorThemeCache = ref(colorTheme.value)
  const toggleColor = (newColor: any) => colors.value.push(newColor)
  const getRandomColorTheme = () => {
    return colorThemeCache.value[Math.floor(Math.random() * colorThemeCache.value.length)]
  }
  const clearColors = async () => {
    await ElMessageBox.prompt('确认删除缓存的颜色?', '警告', {
      confirmButtonText: '确认',
      cancelButtonText: '取消',
      inputPlaceholder: '请输入 `确认删除`',
      inputValidator: (value: string) => value === '确认删除',
      inputErrorMessage: '请输入 `确认删除`',
    })
    colors.value = []
    ElNotification({
      title: '颜色缓存被清空',
      message: '下次进入应用时生效',
    })
  }

  return {
    colors,
    colorsCache,
    toggleColor,
    clearColors,
    colorTheme,
    colorThemeCache,
    getRandomColorTheme,
  }
})
