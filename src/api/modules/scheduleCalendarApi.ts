import offlineScheduleCalendarApi from '~/api/offline/scheduleCalendar'
import onlineScheduleCalendarApi from '~/api/online/scheduleCalendar'

const model = import.meta.env.VITE_APP_APPLICATION_MODE || 'online'

export default model === 'offline' ? offlineScheduleCalendarApi : onlineScheduleCalendarApi
