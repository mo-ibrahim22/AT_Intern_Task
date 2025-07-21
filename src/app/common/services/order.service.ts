import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { environment } from '../../../environment/environment';
import { OrderResponse, CreateOrderRequest } from '../models/order.model';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';
import { ToasterService } from './toaster.service';

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  private http = inject(HttpClient);
  private authService = inject(AuthService);
  private router = inject(Router);
  private toaster = inject(ToasterService);

  private apiUrl = environment.apiUrl;

  private requireAuth(): boolean {
    if (!this.authService.isAuthenticated()) {
      this.router.navigate(['/signin']);
      this.toaster.show('Please sign in to place an order', 'warning');
      return false;
    }
    return true;
  }

  private getHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Content-Type': 'application/json',
    });
  }

  createOrder(
    cartId: string,
    orderData: CreateOrderRequest
  ): Observable<OrderResponse> {
    if (!this.requireAuth()) {
      return throwError(() => new Error('Authentication required'));
    }

    return this.http.post<OrderResponse>(
      `${this.apiUrl}/api/v1/orders/${cartId}`,
      orderData,
      {
        headers: this.getHeaders(),
      }
    );
  }

  getUserOrders(): Observable<{ status: string; data: any[] }> {
    if (!this.requireAuth()) {
      return throwError(() => new Error('Authentication required'));
    }

    return this.http.get<{ status: string; data: any[] }>(
      `${this.apiUrl}/api/v1/orders/user/${this.authService.user()?.name}`,
      {
        headers: this.getHeaders(),
      }
    );
  }
}
