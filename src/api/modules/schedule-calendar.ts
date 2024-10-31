import api from '..'

export const getScheduleCalendarList = () => api.get('/schedule-calendar')
export const getScheduleCalendarDTOList = () => api.get('/schedule-calendar/group')
export const updateScheduleCalendar = (data: ScheduleCalendar) => api.put('/schedule-calendar', data)
export const insertScheduleCalendar = (data: ScheduleCalendar) => api.post('/schedule-calendar', data)
export const deleteScheduleCalendar = (scheduleId: number) => api.delete(`/schedule-calendar/${scheduleId}`)


export default {
  getScheduleCalendarList,
  getScheduleCalendarDTOList,
  updateScheduleCalendar,
  insertScheduleCalendar,
  deleteScheduleCalendar
}
