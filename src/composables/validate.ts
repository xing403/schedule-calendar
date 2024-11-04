import cronParser from 'cron-parser'

// eslint-disable-next-line @typescript-eslint/ban-types
export function validateCorn(corn: string, callback: Function) {
  try {
    cronParser.parseExpression(corn)
    callback()
  }
  catch (e) {
    callback('无效的Cron表达式格式，请检查')
  }
}
