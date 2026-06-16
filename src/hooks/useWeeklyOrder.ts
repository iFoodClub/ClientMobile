import { useState } from "react";

export const useWeeklyOrder = () => {
  const [dayOrder] = useState(0);

  return { dayOrder };
};
