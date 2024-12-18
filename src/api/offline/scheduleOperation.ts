import dayjs from 'dayjs'
import useSystemStore from '~/store/modules/system'

function insertOrUpdateScheduleOperation(entity: ScheduleOperationEntity) {
  const db = useSystemStore().offlineDatabase
  entity.createTime = dayjs().format('YYYY-MM-DD HH:mm:ss')
  entity.createBy = 'offline'
  const wrapper = {
    scheduleId: entity.scheduleId,
    operationDate: entity.operationDate,
  }
  return db.table('x_schedule_operation').insertOrUpdate(JSON.parse(JSON.stringify(entity)), wrapper).then(res => ({
    code: 200,
    data: res,
    message: '操作成功',
    error: null,
  }))
}
export default {
  insertOrUpdateScheduleOperation,
}
