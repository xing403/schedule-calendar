declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}
interface ScheduleCalendar {
  scheduleId?: number;
  scheduleTitle: string;
  scheduleModel: string;
  scheduleRangeStart?: Date | string;
  scheduleRangeEnd?: Date | string;
  scheduleDate?: Date | string;
  scheduleCron: string;
  createTime?: Date;
  createBy?: string;
  updateTime?: Date;
  updateBy?: string;
  delFlag?: string;
}
