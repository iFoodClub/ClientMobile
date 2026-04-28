import { useState } from "react";
import { DayOfWeek } from "../interfaces/interfaces";

type Props = {};

const useWeeklyOrder = (props: Props) => {
  const [dayOrder, setDayOrder] = useState(0);

  function getOrderOfDay(day: DayOfWeek) {
    try {
    } catch (error) {}
  }

  return { dayOrder };
};
