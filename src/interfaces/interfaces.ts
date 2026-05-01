import { IEmployeePopulate } from "./apiResponses";

export enum UserType {
  restaurant = "restaurant",
  company = "company",
  employee = "employee",
}

export enum formMode {
  create = "create",
  update = "update",
}

export interface ISignInForm {
  email: string;
  password: string;
}

export interface IRestaurant {
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
  image: string;
  openingTime?: string;
  closingTime?: string;
}
export interface ICompany {
  id: number;
  userId: number;
  name: string;
  cnpj: string;
  cep: string;
  number: string;
  restaurantId: number;
}

export interface IBusiness {
  name: string;
  userType: UserType;
  email: string;
  password: string;
  profileImage: string;
  confirmPassword: string;
  cnpj: string;
  restaurant?: IRestaurant;
  company?: ICompany;
}

export interface ICepResponse {
  cep: string;
  logradouro: string;
  complemento: string;
  unidade: string;
  bairro: string;
  localidade: string;
  uf: string;
  estado: string;
  regiao: string;
  ibge: string;
  gia: string;
  ddd: string;
  siafi: string;
}

export interface IUserDetailsResponse {
  token: string;
  id: number;
  email: string;
  name: string;
  profileImage: string;
  userType: UserType;
  restaurant?: IRestaurant;
  company?: ICompany;
  employee?: IEmployeePopulate;
}

export interface ILoginResponse {
  token: string;
  userDetails: IUserDetailsResponse;
}

export interface ICreateDishDTO {
  name: string;
  description: string;
  price: number;
  image: string;
  restaurantId: number;
}

export enum DayOfWeek {
  Sunday = "Sunday",
  Monday = "Monday",
  Tuesday = "Tuesday",
  Wednesday = "Wednesday",
  Thursday = "Thursday",
  Friday = "Friday",
  Saturday = "Saturday",
}

export const dayNamesPT: Record<DayOfWeek, string> = {
  [DayOfWeek.Monday]: "Segunda-feira",
  [DayOfWeek.Tuesday]: "Terça-feira",
  [DayOfWeek.Wednesday]: "Quarta-feira",
  [DayOfWeek.Thursday]: "Quinta-feira",
  [DayOfWeek.Friday]: "Sexta-feira",
  [DayOfWeek.Sunday]: "Domingo",
  [DayOfWeek.Saturday]: "Sábado",
};
