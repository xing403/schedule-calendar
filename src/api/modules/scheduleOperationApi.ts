import offlineScheduleOperationApi from '~/api/offline/scheduleOperation'
import onlineScheduleCalendarApi from '~/api/online/scheduleOperation'

const model = import.meta.env.VITE_APP_APPLICATION_MODE || 'online'

export default model === 'offline' ? offlineScheduleOperationApi : onlineScheduleCalendarApi
