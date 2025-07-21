import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ProductService } from '../../common/services/product.service';
import { Product } from '../../common/models/product.model';
import { ButtonComponent } from '../../components/button/button.component';
import { CartService } from '../../common/services/cart.service';
import { ConfirmationService } from '../../common/services/confirmation.service';

@Component({
  selector: 'app-product-details',
  standalone: true,
  imports: [CommonModule, ButtonComponent],
  templateUrl: './product-details.component.html',
  styleUrl: './product-details.component.css',
})
export class ProductDetailsComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly productService = inject(ProductService);
  private readonly cartService = inject(CartService);
  private readonly confirmation = inject(ConfirmationService);

  product = signal<Product | null>(null);
  isProcessing = signal(false);
  selectedImageIndex = signal(0);

  ngOnInit(): void {
    // Get product data from resolver
    const productData = this.route.snapshot.data['product'] as Product;

    if (productData) {
      this.product.set(productData);
      this.selectedImageIndex.set(0);
    }
    // If no product data, resolver already handled the redirect
  }

  selectImage(index: number): void {
    if (!this.product()) return;
    this.selectedImageIndex.set(index);
  }

  get currentImage(): string {
    const prod = this.product();
    if (!prod) return '';
    return prod.images?.[this.selectedImageIndex()] || prod.imageCover;
  }

  get hasMultipleImages(): boolean {
    return (this.product()?.images?.length || 0) > 1;
  }

  get isInCart(): boolean {
    const id = this.product()?.id;
    return !!id && this.cartService.isInCart(id);
  }

  get cartButtonText(): string {
    return this.isInCart ? 'Remove from Cart' : 'Add to Cart';
  }

  get cartButtonIcon(): string {
    return this.isInCart
      ? 'assets/icons/remove-cart.svg'
      : 'assets/icons/cart.svg';
  }

  get cartButtonClass(): string {
    return this.isInCart ? 'btn-danger' : 'btn-outline';
  }

  getCartItemCount(): number {
    return this.product()
      ? this.cartService.getCartItemCount(this.product()!.id)
      : 0;
  }

  toggleCart(): void {
    const id = this.product()?.id;
    if (!id) return;

    if (this.isInCart) {
      this.isProcessing.set(true);
      this.cartService.removeItem(id).subscribe({
        complete: () => this.isProcessing.set(false),
        error: () => this.isProcessing.set(false),
      });
    } else {
      this.isProcessing.set(true);
      this.cartService.addToCart(id).subscribe({
        complete: () => this.isProcessing.set(false),
        error: () => this.isProcessing.set(false),
      });
    }
  }

  updateCartQuantity(newCount: number): void {
    const id = this.product()?.id;
    if (!id || newCount < 0) return;

    this.cartService.updateItem(id, newCount).subscribe();
  }
}
