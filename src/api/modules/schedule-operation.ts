import api from '..'

export const insertOrUpdateScheduleOperation = (data: ScheduleOperationEntity) => api.post('/schedule-operation', data)

export default {
  insertOrUpdateScheduleOperation,
}
