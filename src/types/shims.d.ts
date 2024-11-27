declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}
interface ScheduleCalendar extends Record<string, any> {
  scheduleId?: number;
  scheduleTitle: string;
  scheduleModel: string;
  scheduleRangeStart?: Date | string;
  scheduleRangeEnd?: Date | string;
  scheduleDate?: Date | string;
  scheduleCron: string;
  createTime?: Date | string;
  createBy?: string;
  updateTime?: Date | string;
  updateBy?: string;
  delFlag?: string | number;
}

interface ScheduleOperationEntity {
  operationId?: number;
  scheduleId?: number;
  operationDate?: string;
  operationStatus?: string;
  createTime?: Date | string;
  createBy?: string;
  updateTime?: Date | string;
  updateBy?: string;
  delFlag?: string | number;
}


interface ScheduleCalendarDTO extends ScheduleCalendar {
  finishDates: string[];
  cancelDates: string[];
  deleteDates: string[];
}
