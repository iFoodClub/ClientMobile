import { DayOfWeek } from "./interfaces";

export interface IAutomaticDayOrder {
  company: {
    id: number;
    name: string;
  };
  currentDay: DayOfWeek;
  employees: Record<string, any>;
}
