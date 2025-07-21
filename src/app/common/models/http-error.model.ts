export interface HttpErrorResponse {
  error: {
    message?: string;
    errors?: { [key: string]: string[] };
  };
  status: number;
  statusText: string;
  userMessage?: string;
}

export interface ApiErrorResponse {
  message: string;
  errors?: { [key: string]: string[] };
  statusCode?: number;
}
