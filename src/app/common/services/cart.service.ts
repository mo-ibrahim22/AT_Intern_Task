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
import { ConfirmationService } from './confirmation.service';

@Injectable({ providedIn: 'root' })
export class CartService {
  private http = inject(HttpClient);
  private authService = inject(AuthService);
  private router = inject(Router);
  private toaster = inject(ToasterService);
  private confirmation = inject(ConfirmationService);

  private apiUrl = environment.apiUrl;

  private cartSignal = signal<CartResponse | null>(null);
  private loadingSignal = signal<boolean>(false);
  private errorSignal = signal<string | null>(null);
  private processingItemSignal = signal<string | null>(null);

  readonly cart = this.cartSignal.asReadonly();
  readonly isLoading = this.loadingSignal.asReadonly();
  readonly error = this.errorSignal.asReadonly();
  readonly processingItem = this.processingItemSignal.asReadonly();
  readonly cartCount = computed(() => this.cartSignal()?.numOfCartItems ?? 0);
  readonly totalPrice = computed(
    () => this.cartSignal()?.data?.totalCartPrice ?? 0
  );
  readonly isEmpty = computed(() => this.cartCount() === 0);
  readonly hasItems = computed(() => this.cartCount() > 0);

  private requireAuth(): boolean {
    if (!this.authService.isAuthenticated()) {
      this.router.navigate(['/signin']);
      this.toaster.show('Please sign in to access your cart', 'warning');
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
      this.processingItemSignal.set(null);

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

    this.processingItemSignal.set(productId);
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
          this.processingItemSignal.set(null);
          this.toaster.show('Item added to cart successfully!', 'success');
        }),
        catchError(this.handleError('Add to cart'))
      );
  }

  updateItem(productId: string, count: number): Observable<CartResponse> {
    if (!this.requireAuth()) return EMPTY;

    if (count <= 0) {
      return this.removeItemWithConfirmation(productId);
    }

    this.processingItemSignal.set(productId);
    this.errorSignal.set(null);

    const body: UpdateCartRequest = { count: count.toString() };

    return this.http
      .put<CartResponse>(`${this.apiUrl}/api/v1/cart/${productId}`, body, {
        headers: this.getHeaders(),
      })
      .pipe(
        tap((cart) => {
          this.cartSignal.set(cart);
          this.processingItemSignal.set(null);
          this.toaster.show('Cart updated successfully!', 'success');
        }),
        catchError(this.handleError('Update cart item'))
      );
  }

  private removeItemDirect(productId: string): Observable<CartResponse> {
    this.processingItemSignal.set(productId);
    this.errorSignal.set(null);

    return this.http
      .delete<CartResponse>(`${this.apiUrl}/api/v1/cart/${productId}`, {
        headers: this.getHeaders(),
      })
      .pipe(
        tap((cart) => {
          this.cartSignal.set(cart);
          this.processingItemSignal.set(null);
          this.toaster.show('Item removed from cart', 'success');
        }),
        catchError(this.handleError('Remove cart item'))
      );
  }

  removeItemWithConfirmation(productId: string): Observable<CartResponse> {
    if (!this.requireAuth()) return EMPTY;

    const product = this.getProductFromCart(productId);
    const productName = product?.product?.title || 'this item';

    return new Observable<CartResponse>((observer) => {
      this.confirmation.confirm(
        {
          title: 'Remove Item from Cart',
          message: `Are you sure you want to remove "${productName}" from your cart?`,
          confirmText: 'Yes, Remove',
          cancelText: 'Keep in Cart',
        },
        (confirmed: boolean) => {
          if (confirmed) {
            this.removeItemDirect(productId).subscribe({
              next: (result) => observer.next(result),
              error: (error) => observer.error(error),
              complete: () => observer.complete(),
            });
          } else {
            this.processingItemSignal.set(null);
            observer.complete();
          }
        }
      );
    });
  }

  clearCartWithConfirmation(): Observable<ClearCartResponse> {
    if (!this.requireAuth()) return EMPTY;

    const itemCount = this.cartCount();
    const totalPrice = this.totalPrice();

    return new Observable<ClearCartResponse>((observer) => {
      this.confirmation.confirm(
        {
          title: 'Clear Entire Cart',
          message: `Are you sure you want to remove all ${itemCount} items from your cart? This will clear $${totalPrice} worth of items and cannot be undone.`,
          confirmText: 'Yes, Clear Cart',
          cancelText: 'Keep Items',
        },
        (confirmed: boolean) => {
          if (confirmed) {
            this.clearCartDirect().subscribe({
              next: (result) => observer.next(result),
              error: (error) => observer.error(error),
              complete: () => observer.complete(),
            });
          } else {
            observer.complete();
          }
        }
      );
    });
  }

  private clearCartDirect(): Observable<ClearCartResponse> {
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
          this.toaster.show('Cart cleared successfully!', 'success');
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

  getProductFromCart(productId: string) {
    return this.cartSignal()?.data?.products?.find(
      (item) => item.product.id === productId || item.product._id === productId
    );
  }

  isProcessingItem(productId: string): boolean {
    return this.processingItemSignal() === productId;
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

  // Utility methods for cart calculations
  getSubtotal(): number {
    return this.totalPrice();
  }

  getShipping(): number {
    return this.hasItems() ? (this.totalPrice() > 100 ? 0 : 10) : 0;
  }

  getTax(): number {
    return Math.round(this.getSubtotal() * 0.08 * 100) / 100; // 8% tax
  }

  getFinalTotal(): number {
    return this.getSubtotal() + this.getShipping() + this.getTax();
  }

  getItemTotal(productId: string): number {
    const item = this.getProductFromCart(productId);
    return item ? item.price * item.count : 0;
  }
}
