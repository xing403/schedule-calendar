const config: DBConfig = {
  database: 'schedule-calendar',
  databaseVersion: 1,
  logicDelete: {
    enable: true,
    field: 'delFlag',
    deleted: 1,
    undeleted: 0,
  },
  tableNames: {
    x_schedule_calendar: {
      keyPath: 'scheduleId',
      autoIncrement: true,
      index: [{
        key: 'delFlagIndex',
        field: 'delFlag',
        unique: false,
      }],
    },
    x_schedule_operation: {
      keyPath: 'operationId',
      autoIncrement: true,
      index: [{
        key: 'scheduleIdIndex',
        field: 'scheduleId',
        unique: false,
      }, {
        key: 'delFlagIndex',
        field: 'delFlag',
        unique: false,
      }],
    },
  },
}

export default config
