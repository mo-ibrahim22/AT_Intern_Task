import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environment/environment';
import { Product, ProductsResponse } from '../models/product.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getProducts(): Observable<ProductsResponse> {
    return this.http.get<ProductsResponse>(`${this.apiUrl}/api/v1/products`);
  }

  getProductById(id: string): Observable<{ data: Product }> {
    return this.http.get<{ data: Product }>(
      `${this.apiUrl}/api/v1/products/${id}`
    );
  }
}
