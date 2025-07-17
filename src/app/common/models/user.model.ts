export interface User {
  name: string;
  email: string;
  role: string;
}

export interface AuthResponse {
  message: string;
  user: User;
  token: string;
}

export interface SignupRequest {
  name: string;
  email: string;
  password: string;
  rePassword: string;
  phone: string;
}

export interface SigninRequest {
  email: string;
  password: string;
}
