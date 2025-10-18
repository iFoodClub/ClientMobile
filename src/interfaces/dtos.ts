import { UserType } from "./interfaces";

export interface IUpdateCompanyDTO {
  name?: string;
  cnpj?: string;
  cep?: string;
  number?: string;
  restaurantId?: number;
  profileImage?: string;
}

export interface IUpdateRestaurantDTO {
  userId: number;
  name: string;
  cnpj: string;
  cep: string;
  number: string;
  profileImage: string;
}

export interface IEmployeeDTO {
  email: string;
  password: string;
  password2: string;
  userType: UserType.employee;
  profileImage: string;
  cpf: string;
  employee: {
    name: string;
    birthDate: string;
  };
  company: {
    id: number;
  };
}
