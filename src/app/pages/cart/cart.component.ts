import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartService } from '../../common/services/cart.service';
import { RouterModule } from '@angular/router';
import { ButtonComponent } from '../../components/button/button.component';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, RouterModule, ButtonComponent],
  templateUrl: './cart.component.html',
})
export class CartComponent implements OnInit {
  private readonly cartService = inject(CartService);

  cartItems = this.cartService.cart;
  isLoading = this.cartService.isLoading;
  total = this.cartService.totalPrice;
  isEmpty = signal(false);

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
    this.cartService.removeItem(productId); // confirm included
  }

  clearCart(): void {
    this.cartService.clearCart(); // confirm included
  }

  goToCheckout(): void {
    // Placeholder: navigate to checkout or show modal
    console.log('Go to checkout!');
  }
}
