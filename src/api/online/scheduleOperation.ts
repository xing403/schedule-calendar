import api from '..'

export const insertOrUpdateScheduleOperation = (data: ScheduleOperationEntity) => api.post('/schedule-operation/insert-or-update', data)

export default {
  insertOrUpdateScheduleOperation,
}
