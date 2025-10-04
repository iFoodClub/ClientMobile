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
