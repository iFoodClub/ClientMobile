import { DayOfWeek } from "./interfaces";

export interface IRating {
  name: string;
  profileImage: string;
  rating: number;
  description: string;
}

export interface IDishesResponse {
  id: number;
  restaurantId: number;
  name: string;
  description: string;
  price: number;
  image: string;
  averageRating: number;
  ratingCount: number;
  ratings: IRating[];
}

export interface IRestaurantResponse {
  id: number;
  name: string;
  userId: number;
  cnpj: string;
  cep: string;
  number: string;
  rua: string;
  cidade: string;
  estado: string;
  complemento: string;
  profileImage: string;
  averageRating: number;
  dishCount: number;
  minPrice: number;
}

export interface IDish {
  id: number;
  restaurantId: number;
  name: string;
  description: string;
  price: number;
  image: string;
}

export interface IRestaurantRating {
  id: number;
  restaurantId: number;
  userId: number;
  employeeName: string;
  rating: number;
  description: string;
}

export interface IRestaurantDetailsResponse {
  id: number;
  userId: number;
  name: string;
  cnpj: string;
  cep: string;
  rua: string;
  cidade: string;
  estado: string;
  number: string;
  complemento: string;
  profileImage: string;
  dishes: IDish[];
  restaurantRatings: IRestaurantRating[];
  averageRating: number;
}

export interface IEmployeeSimple {
  id: number;
  userId: number;
  companyId: number;
  email: string;
  name: string;
  cpf: string;
  birthDate: string;
  vacation: boolean;
  profileImage: string;
}

export interface IEmployeePopulate {
  id: number;
  userId: number;
  companyId: number;
  company: {
    id: number;
    selectedRestaurantId: number;
  };
  name: string;
  cpf: string;
  birthDate: string;
  vacation: boolean;
}

export interface IRestaurantOrdersResponse {
  id: number;
  code: string;
  totalPrice: string;
  status: string;
  restaurantId: number;
  company: {
    id: number;
    name: string;
    image: string;
  };
  employeeOrders: IEmployeeOrderRestaurant[];
}

export interface IEmployeeWeeklyOrdersResponse {
  company: {
    id: number;
    name: string;
  };
  dayOfWeek: DayOfWeek;
  orderDate: string;
  orderStatus: OrderStatus;
  restaurant: {
    id: number;
    name: string;
    profileImage: string;
  };
  employees: IEmployeeOrder[];
}

export enum OrderStatus {
  PENDING = "pending",
  CONFIRMED = "confirmed",
  PREPARING = "preparing",
  DELIVERED = "delivered",
  CANCELED = "canceled",
}

export interface IEmployeeOrder {
  id: number;
  name: string;
  profileImage: string;
  order: {
    id: number;
    name: string;
    image: string;
    price: string;
  }[];
}

export interface IEmployeeOrderRestaurant {
  id: number;
  name: string;
  profileImage: string;
  order: {
    id: number;
    name: string;
    image: string;
    price: string;
  };
}

export interface ICreateCompanyOrderResponse {
  message: string;
  ordersCreated: number;
  currentDay: string;
}
