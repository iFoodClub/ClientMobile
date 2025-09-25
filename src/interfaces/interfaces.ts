export enum UserType {
  restaurant = "restaurant",
  company = "company",
}

export interface ISignInForm {
  email: string;
  password: string;
}

export interface ICreateAccountForm {
  userType: "company" | "restaurant" | null;
  email: string;
  password: string;
  confirmPassword: string;
}
