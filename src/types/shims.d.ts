declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}
interface ScheduleCalendar {
  scheduleId: number | undefined;
  scheduleTitle: string;
  scheduleModel: string;
  scheduleRangeStart: Date;
  scheduleRangeEnd: Date;
  scheduleDate: Date;
  scheduleCron: string;
  createTime: Date;
  createBy: string;
  updateTime: Date;
  updateBy: string;
  delFlag: string;
}
