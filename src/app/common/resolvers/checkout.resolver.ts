import { inject } from '@angular/core';
import { ResolveFn, Router } from '@angular/router';
import { CartService } from '../services/cart.service';
import { AuthService } from '../services/auth.service';
import { ToasterService } from '../services/toaster.service';
import { catchError, of, map, switchMap } from 'rxjs';
import { CartResponse } from '../models/cart.model';

export const checkoutResolver: ResolveFn<CartResponse | null> = () => {
  const cartService = inject(CartService);
  const authService = inject(AuthService);
  const router = inject(Router);
  const toaster = inject(ToasterService);

  // Check if user is authenticated
  if (!authService.isAuthenticated()) {
    toaster.show('Please sign in to access checkout', 'warning');
    router.navigate(['/signin']);
    return of(null);
  }

  // Check if cart is already loaded
  const currentCart = cartService.cart();
  if (currentCart && currentCart.data?.products?.length) {
    return of(currentCart);
  }

  // Fetch fresh cart data
  return cartService.getCart().pipe(
    map((cart) => {
      // Validate cart has items
      if (!cart || !cart.data?.products?.length) {
        toaster.show(
          'Your cart is empty. Add items before checkout.',
          'warning'
        );
        router.navigate(['/products']);
        return null;
      }

      // Validate cart has required data
      if (!cart.cartId) {
        toaster.show('Cart information is incomplete', 'error');
        router.navigate(['/cart']);
        return null;
      }

      return cart;
    }),
    catchError((error) => {
      console.error('Failed to load cart for checkout:', error);
      toaster.show('Failed to load cart. Please try again.', 'error');
      router.navigate(['/cart']);
      return of(null);
    })
  );
};
