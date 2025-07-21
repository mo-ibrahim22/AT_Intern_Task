import { Injectable, inject, signal, computed } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {
  Observable,
  tap,
  catchError,
  throwError,
  EMPTY,
  switchMap,
} from 'rxjs';
import { environment } from '../../../environment/environment';
import {
  CartResponse,
  AddToCartRequest,
  UpdateCartRequest,
  ClearCartResponse,
} from '../models/cart.model';

import { AuthService } from './auth.service';
import { Router } from '@angular/router';
import { ToasterService } from './toaster.service';

@Injectable({ providedIn: 'root' })
export class CartService {
  private http = inject(HttpClient);
  private authService = inject(AuthService);
  private router = inject(Router);
  private toaster = inject(ToasterService);

  private apiUrl = environment.apiUrl;

  private cartSignal = signal<CartResponse | null>(null);
  private loadingSignal = signal<boolean>(false);
  private errorSignal = signal<string | null>(null);

  readonly cart = this.cartSignal.asReadonly();
  readonly isLoading = this.loadingSignal.asReadonly();
  readonly error = this.errorSignal.asReadonly();
  readonly cartCount = computed(() => this.cartSignal()?.numOfCartItems ?? 0);
  readonly totalPrice = computed(
    () => this.cartSignal()?.data?.totalCartPrice ?? 0
  );

  private requireAuth(): boolean {
    if (!this.authService.isAuthenticated()) {
      this.router.navigate(['/signin']);
      this.toaster.show('Authentication Required', 'error');
      return false;
    }
    return true;
  }

  private getHeaders(): HttpHeaders {
    const token = this.authService.currentToken;
    return new HttpHeaders({
      token: `${token}`,
      'Content-Type': 'application/json',
    });
  }

  private handleError(operation: string) {
    return (error: any) => {
      console.error(`${operation} failed:`, error);
      this.loadingSignal.set(false);

      const message =
        error?.error?.message ||
        error?.message ||
        'An error occurred. Please try again.';

      this.errorSignal.set(message);
      this.toaster.show(message, 'error');

      setTimeout(() => this.errorSignal.set(null), 5000);

      return throwError(() => error);
    };
  }

  getCart(): Observable<CartResponse> {
    if (!this.requireAuth()) return EMPTY;

    this.loadingSignal.set(true);
    this.errorSignal.set(null);

    return this.http
      .get<CartResponse>(`${this.apiUrl}/api/v1/cart`, {
        headers: this.getHeaders(),
      })
      .pipe(
        tap((cart) => {
          this.cartSignal.set(cart);
          this.loadingSignal.set(false);
        }),
        catchError(this.handleError('Get cart'))
      );
  }

  addToCart(productId: string): Observable<CartResponse> {
    if (!this.requireAuth()) return EMPTY;

    this.loadingSignal.set(true);
    this.errorSignal.set(null);

    const body: AddToCartRequest = { productId };

    return this.http
      .post<CartResponse>(`${this.apiUrl}/api/v1/cart`, body, {
        headers: this.getHeaders(),
      })
      .pipe(
        switchMap(() =>
          this.http.get<CartResponse>(`${this.apiUrl}/api/v1/cart`, {
            headers: this.getHeaders(),
          })
        ),
        tap((cart) => {
          this.cartSignal.set(cart);
          this.loadingSignal.set(false);
          this.toaster.show('Added to Cart', 'success');
        }),
        catchError(this.handleError('Add to cart'))
      );
  }

  updateItem(productId: string, count: number): Observable<CartResponse> {
    if (!this.requireAuth()) return EMPTY;

    if (count <= 0) {
      return this.removeItem(productId);
    }

    this.loadingSignal.set(true);
    this.errorSignal.set(null);

    const body: UpdateCartRequest = { count: count.toString() };

    return this.http
      .put<CartResponse>(`${this.apiUrl}/api/v1/cart/${productId}`, body, {
        headers: this.getHeaders(),
      })
      .pipe(
        tap((cart) => {
          this.cartSignal.set(cart);
          this.loadingSignal.set(false);
          this.toaster.show('Cart Updated', 'success');
        }),
        catchError(this.handleError('Update cart item'))
      );
  }

  removeItem(productId: string): Observable<CartResponse> {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);

    return this.http
      .delete<CartResponse>(`${this.apiUrl}/api/v1/cart/${productId}`, {
        headers: this.getHeaders(),
      })
      .pipe(
        tap((cart) => {
          this.cartSignal.set(cart);
          this.loadingSignal.set(false);
          this.toaster.show('Removed from Cart', 'success');
        }),
        catchError(this.handleError('Remove cart item'))
      );
  }

  clearCart(): Observable<ClearCartResponse> {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);

    return this.http
      .delete<ClearCartResponse>(`${this.apiUrl}/api/v1/cart`, {
        headers: this.getHeaders(),
      })
      .pipe(
        tap(() => {
          this.cartSignal.set(null);
          this.loadingSignal.set(false);
          this.toaster.show('Cart Cleared', 'success');
        }),
        catchError(this.handleError('Clear cart'))
      );
  }

  isInCart(productId: string): boolean {
    if (!this.authService.isAuthenticated()) return false;

    return (
      this.cartSignal()?.data?.products?.some(
        (item) =>
          item.product.id === productId || item.product._id === productId
      ) ?? false
    );
  }

  getCartItemCount(productId: string): number {
    if (!this.authService.isAuthenticated()) return 0;

    const item = this.cartSignal()?.data?.products?.find(
      (item) => item.product.id === productId || item.product._id === productId
    );

    return item?.count ?? 0;
  }

  initializeCart(): void {
    if (this.authService.isAuthenticated()) {
      this.getCart().subscribe({
        error: (err) => console.warn('Could not initialize cart:', err),
      });
    } else {
      this.cartSignal.set(null);
    }
  }

  clearError(): void {
    this.errorSignal.set(null);
  }
}
