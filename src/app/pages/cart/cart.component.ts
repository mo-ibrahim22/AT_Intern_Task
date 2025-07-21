import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartService } from '../../common/services/cart.service';
import { RouterModule } from '@angular/router';
import { ButtonComponent } from '../../components/button/button.component';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, RouterModule, ButtonComponent],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css',
})
export class CartComponent implements OnInit {
  private readonly cartService = inject(CartService);

  cartItems = this.cartService.cart;
  isLoading = this.cartService.isLoading;
  isEmpty = this.cartService.isEmpty;
  hasItems = this.cartService.hasItems;
  cartCount = this.cartService.cartCount;

  // Price calculations
  subtotal = computed(() => this.cartService.getSubtotal());
  shipping = computed(() => this.cartService.getShipping());
  tax = computed(() => this.cartService.getTax());
  finalTotal = computed(() => this.cartService.getFinalTotal());

  // UI state
  isCheckingOut = signal(false);

  ngOnInit(): void {
    this.cartService.getCart().subscribe();
  }

  updateQuantity(productId: string, newCount: number): void {
    if (newCount <= 0) {
      this.removeItem(productId);
    } else {
      this.cartService.updateItem(productId, newCount).subscribe();
    }
  }

  removeItem(productId: string): void {
    this.cartService.removeItemWithConfirmation(productId).subscribe();
  }

  clearCart(): void {
    this.cartService.clearCartWithConfirmation().subscribe();
  }

  isProcessingItem(productId: string): boolean {
    return this.cartService.isProcessingItem(productId);
  }

  getItemTotal(productId: string): number {
    return this.cartService.getItemTotal(productId);
  }

  proceedToCheckout(): void {
    this.isCheckingOut.set(true);

    // Simulate checkout process
    setTimeout(() => {
      this.isCheckingOut.set(false);
      // Here you would typically navigate to checkout or payment page
      console.log('Proceeding to checkout with total:', this.finalTotal());
    }, 2000);
  }

  continueShopping(): void {
    // Navigate to products page
  }
}
