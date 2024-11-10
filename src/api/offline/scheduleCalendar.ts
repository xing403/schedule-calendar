import dayjs from 'dayjs'
import useSystemStore from '~/store/modules/system'

function insertScheduleCalendar(entity: ScheduleCalendar) {
  const db = useSystemStore().offlineDatabase
  entity.createTime = dayjs().format('YYYY-MM-DD HH:mm:ss')
  entity.createBy = 'offline'
  return db.table('x_schedule_calendar').insert(JSON.parse(JSON.stringify(entity)))
}
function updateScheduleCalendar(entity: ScheduleCalendar) {
  const db = useSystemStore().offlineDatabase
  return db.table('x_schedule_calendar').update(JSON.parse(JSON.stringify(entity)))
}

function getScheduleCalendarDTOList() {
  const db = useSystemStore().offlineDatabase

  return new Promise((resolve, reject) => {
    db.table('x_schedule_calendar').selectAll().then(async (res: any) => {
      for (let i = 0; i < res.length; i++) {
        const item = res[i]
        const operations = await db.table('x_schedule_operation').select({ scheduleId: item.scheduleId })
        item.finishDates = operations.filter((operation: any) => operation.operationStatus === 'finish').map(item => item.operationDate)
        item.cancelDates = operations.filter((operation: any) => operation.operationStatus === 'cancel').map(item => item.operationDate)
        item.deleteDates = operations.filter((operation: any) => operation.operationStatus === 'delete').map(item => item.operationDate)
      }
      resolve({
        code: 200,
        data: res,
        message: 'success',
        error: null,
      })
    })
  })
}
function deleteScheduleCalendar(scheduleId: number) {
  const db = useSystemStore().offlineDatabase
  return db.table('x_schedule_calendar').deleteById(scheduleId)
}

export default {
  insertScheduleCalendar,
  updateScheduleCalendar,
  getScheduleCalendarDTOList,
  deleteScheduleCalendar,
}
