import { DayOfWeek } from "./interfaces";

export interface IAutomaticDayOrder {
  company: {
    id: number;
    name: string;
  };
  currentDay: DayOfWeek;
  employees: {};
}

interface IAOEmployeeOrder {
  id: number;
  dayOfWeek: DayOfWeek;
  restaurant: IAORestaurant;
  name: string;
}

interface IAORestaurant {
  id: number;
  name: string;
  profileImage: string;
}

interface IAOWeeklyOrder {
  id: number;
  employee: IAOEmployee;
  order: IAOOrder;
}

interface IAOEmployee {
  id: number;
  name: string;
  profileImage: string;
}

interface IAOOrder {
  id: number;
  name: string;
  price: string;
  image: string;
}
