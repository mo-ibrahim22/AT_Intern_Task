import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, Observable, tap, throwError } from 'rxjs';
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

  createOrder(
    cartId: string,
    orderData: CreateOrderRequest
  ): Observable<OrderResponse> {
    if (!this.requireAuth()) {
      return throwError(() => new Error('Authentication required'));
    }

    return this.http
      .post<OrderResponse>(`${this.apiUrl}/api/v1/orders/${cartId}`, orderData)
      .pipe(
        tap((response) => {
          this.toaster.show('Order created successfully!', 'success');
        }),
        catchError((error) => {
          console.error('Order creation error:', error);
          return throwError(() => error);
        })
      );
  }
}
