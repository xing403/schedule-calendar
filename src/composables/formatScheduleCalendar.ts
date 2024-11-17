import type { ConfigType, Dayjs } from 'dayjs'
import { random as randomColor } from '@ctrl/tinycolor'
import parser from 'cron-parser'
import dayjs from 'dayjs'
import useScheduleConfigStore from '~/store/modules/schedule-config'

export function getMonthStartAndEnd(date: ConfigType) {
  // 当前月第一天所在周的第一天
  const start = dayjs(date).startOf('month').startOf('week')
  // 当前月最后一天所在周的最后一天
  const end = dayjs(date).endOf('month').endOf('week')
  return [start, end]
}

/**
 * 初始化 每月的数组
 * @param date
 * @returns
 */
export function initMonthData(date: ConfigType) {
  const [start, end] = getMonthStartAndEnd(date)

  const diff = end.diff(start, 'day')
  const data: {
    [key: string]: any[]
  } = {}

  for (let i = 0; i <= diff; i++) {
    const day = start.add(i, 'day')
    data[day.format('YYYY-MM-DD')] = []
  }
  return data
}

/**
 *
 * @param date
 * @param rangeStart
 * @param rangeEnd
 */
export function getScheduleCalendarRangeDate(date: ConfigType, rangeStart: ConfigType, rangeEnd: ConfigType) {
  const [start, end] = getMonthStartAndEnd(date)

  const minDay = start.isBefore(rangeStart, 'date') ? rangeStart : start
  const maxDay = end.isAfter(rangeEnd, 'date') ? rangeEnd : end
  return getCronDate(dayjs(date).format('0 0 0 * * *'), dayjs(minDay).add(-1, 'day'), dayjs(maxDay))
}

/**
 * 根据 cron 表达式 和 时间范围 获取时间列表
 * @param cron
 * @param start
 * @param end
 * @returns
 */
export function getCronDate(cron: string, start: Dayjs, end: Dayjs) {
  const interval = parser.parseExpression(cron, {
    currentDate: start.toDate(),
    iterator: true,
  })
  const data: string[] = []
  let iterator = interval.next()
  try {
    while (true) {
      const date = dayjs(iterator.value.toString())
      if (date.isAfter(end))
        break
      iterator = interval.next()
      data.push(date.format('YYYY-MM-DD'))
    }
  }
  catch (e) {
  }
  return data
}

export function getScheduleCalendarRangeDateByScheduleModel(item: ScheduleCalendarDTO, date: ConfigType) {
  let range: string[] = []
  if (item.scheduleModel === '0') {
    range = getScheduleCalendarRangeDate(date, item.scheduleRangeStart, item.scheduleRangeEnd)
  }
  else if (item.scheduleModel === '1') {
    range = [dayjs(item.scheduleDate).format('YYYY-MM-DD')]
  }
  else if (item.scheduleModel === '2') {
    let [start, end] = getMonthStartAndEnd(date)
    if (item.scheduleRangeStart)
      start = start.isBefore(item.scheduleRangeStart, 'date') ? dayjs(item.scheduleRangeStart) : start

    if (item.scheduleRangeEnd)
      end = end.isAfter(item.scheduleRangeEnd, 'date') ? dayjs(item.scheduleRangeEnd) : end
    range = getCronDate(`0 0 0 ${item.scheduleCron}`, start, end)
  }
  return range.filter(r => !item.deleteDates?.includes(r))
}

export function scheduleCalendarEveryDay(date: ConfigType, list: ScheduleCalendarDTO[]) {
  const tempData = initMonthData(dayjs(date))
  const scheduleConfigStore = useScheduleConfigStore()
  list.forEach((item) => {
    const range = getScheduleCalendarRangeDateByScheduleModel(item, date)
    let { darkColor, lightColor } = scheduleConfigStore.colorsCache.find((clr: any) => clr.id === item.scheduleId) || {}
    if (!(darkColor && lightColor)) {
      darkColor = randomColor({ luminosity: 'dark', hue: scheduleConfigStore.getRandomColorTheme() }).toHexString()
      lightColor = randomColor({ luminosity: 'light', hue: scheduleConfigStore.getRandomColorTheme() }).toHexString()
      scheduleConfigStore.colors.push({ id: item.scheduleId, darkColor, lightColor })
      scheduleConfigStore.colorsCache.push({ id: item.scheduleId, darkColor, lightColor })
    }
    range
      .forEach((_, i) => {
        let state = 'waiting'
        if (item.finishDates?.includes(range[i]))
          state = 'finish'
        else if (item.cancelDates?.includes(range[i]))
          state = 'cancel'

        tempData[range[i]] && tempData[range[i]].push({
          id: item.scheduleId,
          title: item.scheduleTitle,
          state,
          darkColor,
          lightColor,
        })
      })
  })

  return tempData
}
