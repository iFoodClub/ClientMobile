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
