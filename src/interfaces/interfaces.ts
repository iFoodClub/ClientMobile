export enum UserType {
  restaurant = "restaurant",
  company = "company",
  employee = "employee",
}

export interface ISignInForm {
  email: string;
  password: string;
}

export interface IRestaurant {
  name: string;
  cep: string;
  rua: string;
  cidade: string;
  estado: string;
  number: string;
  complemento: string;
}
export interface ICompany {
  name: string;
  cep: string;
  number: string;
  restaurantId?: number;
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
  id: number;
  email: string;
  name: string;
  profileImage: string;
  userType: UserType;
  restaurant: IRestaurant;
}

// Interface principal para a resposta completa da API
export interface ILoginResponse {
  token: string;
  userDetails: IUserDetailsResponse;
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
