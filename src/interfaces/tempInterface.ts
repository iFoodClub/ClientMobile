export interface IEmployeeWithWeeklyOrders {
  id: number;
  dayOfWeek: string;
  restaurant: IORestaurant;
  weeklyOrders: IWeeklyOrder[];
}

interface IORestaurant {
  id: number;
  name: string;
  profileImage: string;
}

export interface IWeeklyOrder {
  id: number;
  employee: IOEmployee;
  order: IODish;
}

interface IOEmployee {
  id: number;
  name: string;
  profileImage: string;
}

interface IODish {
  id: number;
  name: string;
  price: number;
  image: string;
}
