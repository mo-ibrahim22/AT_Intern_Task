import { CommonModule } from '@angular/common';
import { Component, input, inject, signal } from '@angular/core';
import { ButtonComponent } from '../button/button.component';
import { Product } from '../../common/models/product.model';
import { Router } from '@angular/router';
import { CartService } from '../../common/services/cart.service';
import { ConfirmationService } from '../../common/services/confirmation.service';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [CommonModule, ButtonComponent],
  templateUrl: './product-card.component.html',
  styleUrl: './product-card.component.css',
})
export class ProductCardComponent {
  product = input.required<Product>();

  private readonly router = inject(Router);
  private readonly cartService = inject(CartService);
  private readonly confirmation = inject(ConfirmationService);

  isProcessing = signal(false);

  get isInCart(): boolean {
    return this.cartService.isInCart(this.product().id);
  }

  get cartButtonText(): string {
    return this.isInCart ? 'Remove' : 'Add';
  }

  get cartButtonIcon(): string {
    return this.isInCart
      ? 'assets/icons/remove-cart.svg'
      : 'assets/icons/cart.svg';
  }

  get cartButtonClass(): string {
    return this.isInCart ? 'btn-danger' : 'btn-outline';
  }

  toggleCart(event: Event): void {
    event.stopPropagation();

    if (this.isInCart) {
      this.isProcessing.set(true);
      this.cartService.removeItem(this.product().id).subscribe({
        complete: () => this.isProcessing.set(false),
        error: () => this.isProcessing.set(false),
      });
    } else {
      this.isProcessing.set(true);
      this.cartService.addToCart(this.product().id).subscribe({
        complete: () => this.isProcessing.set(false),
        error: () => this.isProcessing.set(false),
      });
    }
  }

  navigateToDetails(): void {
    this.router.navigate(['/product-details', this.product().id]);
  }
}
