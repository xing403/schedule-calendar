import parser from 'cron-parser'
import type { Dayjs } from 'dayjs'
import dayjs from 'dayjs'

export function getCronDate(cron: string, start: Dayjs, end: Dayjs) {
  const interval = parser.parseExpression(cron, {
    currentDate: start.toDate(),
    iterator: true,
  })
  const data: Dayjs[] = []
  for (let iterator = interval.next(); ; iterator = interval.next()) {
    const date = dayjs(iterator.value.toString())
    if (date.isAfter(end))
      break

    data.push(date)
  }
  return data
}
