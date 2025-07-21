import { Product } from './product.model';

export interface CartProduct {
  count: number;
  _id: string;
  product: Product;
  price: number;
}

export interface CartData {
  _id: string;
  cartOwner: string;
  products: CartProduct[];
  createdAt: string;
  updatedAt: string;
  __v: number;
  totalCartPrice: number;
}

export interface CartResponse {
  status: string;
  numOfCartItems: number;
  cartId: string;
  data: CartData;
}

export interface AddToCartRequest {
  productId: string;
}

export interface UpdateCartRequest {
  count: string;
}

export interface ClearCartResponse {
  message: string;
}
