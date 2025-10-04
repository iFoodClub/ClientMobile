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
  numberDishes?: number;
  cheapeastDishAt?: number;
}
