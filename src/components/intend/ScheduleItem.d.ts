export interface ScheduleItem {
  id: number,
  title: string,
  state: string,
  darkColor: string,
  lightColor: string
}
export interface CalendarItemProps {
  day: string
  list: Array<ScheduleItem>
  scene?: string
}
