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
  image: string | null;
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
