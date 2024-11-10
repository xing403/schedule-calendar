// 索引命名 列名 + Index 形式
interface IndexConfig {
  key: string
  field: string
  unique: boolean
}
interface TableConfig {
  keyPath: string
  autoIncrement?: boolean
  index?: Array<IndexConfig>
}
interface LogicDeleteType {
  enable: boolean
  field: string // default 'delFlag'
  deleted: number // 被删除的值 default 1
  undeleted: number // 未被删除的值 default 0
}

interface DBConfig {
  database: string
  databaseVersion: number
  tableNames: Record<string, TableConfig>
  // 逻辑删除标志，未设置或未启用则直接删除数据
  logicDelete?: boolean | LogicDeleteType
}
