export interface ScheduleItem {
  id: number,
  title: string,
  state: string,
  color: string
}
export interface CalendarItemProps {
  day: string
  list: Array<ScheduleItem>
}
