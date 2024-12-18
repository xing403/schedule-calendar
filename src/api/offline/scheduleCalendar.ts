import dayjs from 'dayjs'
import useSystemStore from '~/store/modules/system'

function insertScheduleCalendar(entity: ScheduleCalendar) {
  const db = useSystemStore().offlineDatabase
  entity.createTime = dayjs().format('YYYY-MM-DD HH:mm:ss')
  entity.createBy = 'offline'
  return db.table('x_schedule_calendar').insert(JSON.parse(JSON.stringify(entity))).then(res => ({
    code: 200,
    data: res,
    message: '操作成功',
    error: null,
  }))
}
function updateScheduleCalendar(entity: ScheduleCalendar) {
  const db = useSystemStore().offlineDatabase
  entity.updateTime = dayjs().format('YYYY-MM-DD HH:mm:ss')
  entity.createBy = 'offline'
  return db.table('x_schedule_calendar').update(JSON.parse(JSON.stringify(entity))).then(res => ({
    code: 200,
    data: res,
    message: '操作成功',
    error: null,
  }))
}

function getScheduleCalendarDTOList() {
  const db = useSystemStore().offlineDatabase

  return new Promise((resolve, reject) => {
    db.table('x_schedule_calendar').selectAll().then(async (res: any) => {
      for (let i = 0; i < res.length; i++) {
        const item = res[i]
        const operations = await db.table('x_schedule_operation').select({ scheduleId: item.scheduleId })
        operations.forEach((operation) => {
          switch (operation.operationStatus) {
            case 'finish':
              item.finishDates ? item.finishDates.push(operation.operationDate) : item.finishDates = [operation.operationDate]
              break
            case 'cancel':
              item.cancelDates ? item.cancelDates.push(operation.operationDate) : item.cancelDates = [operation.operationDate]
              break
            case 'delete':
              item.deleteDates ? item.deleteDates.push(operation.operationDate) : item.deleteDates = [operation.operationDate]
              break
          }
        })
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
  return db.table('x_schedule_calendar').deleteById(scheduleId).then(res => ({
    code: 200,
    data: res,
    message: '操作成功',
    error: null,
  }))
}

export default {
  insertScheduleCalendar,
  updateScheduleCalendar,
  getScheduleCalendarDTOList,
  deleteScheduleCalendar,
}
