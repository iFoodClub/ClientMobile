export interface IEmployeeWithWeeklyOrders {
  id: number;
  orderedAt: string;
  orderStatus: OrderStatus;
  dayOfWeek: string;
  restaurant: IORestaurant;
  employees: IEmployee[];
}

interface IEmployee {
  id: number;
  name: string;
  profileImage: string;
  order: IODish | null;
}

interface IORestaurant {
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

export enum OrderStatus {
  created = "created",
  ordered = "ordered",
  inProgress = "inProgress",
  delivered = "delivered",
  canceled = "canceled",
}
