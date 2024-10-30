import parser from 'cron-parser'
import dayjs, { Dayjs } from 'dayjs'
export const getCronDate = (cron: string, start: Dayjs, end: Dayjs) => {
  const interval = parser.parseExpression(cron, {
    currentDate: start.toDate(),
    iterator: true
  })
  const data: Dayjs[] = []
  for (let iterator = interval.next(); ; iterator = interval.next()) {
    const date = dayjs(iterator.value.toString())
    if (date.isAfter(end)) {
      break
    }
    data.push(date)
  }
  return data
}
