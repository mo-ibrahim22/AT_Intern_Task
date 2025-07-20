import { Component, OnInit, inject, signal, effect } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ProductService } from '../../common/services/product.service';
import { Product } from '../../common/models/product.model';
import { ButtonComponent } from '../../components/button/button.component';

@Component({
  selector: 'app-product-details',
  standalone: true,
  imports: [CommonModule, ButtonComponent],
  templateUrl: './product-details.component.html',
  styleUrl: './product-details.component.css',
})
export class ProductDetailsComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly ProductService = inject(ProductService);

  product = signal<Product | null>(null);
  isLoading = signal(true);
  selectedImageIndex = signal(0);
  error = signal<string | null>(null);

  constructor() {}

  ngOnInit(): void {
    const productId = this.route.snapshot.paramMap.get('id');
    if (productId) {
      this.loadProduct(productId);
    } else {
      this.error.set('No product ID provided');
      this.isLoading.set(false);
    }
  }

  private loadProduct(id: string): void {
    this.isLoading.set(true);
    this.error.set(null);

    this.ProductService.getProductById(id).subscribe({
      next: (response) => {
        if (response && response.data) {
          this.product.set(response.data);
          this.selectedImageIndex.set(0); // Reset image selection
        } else {
          this.error.set('Product data not found');
        }
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Error loading product:', err);
        this.error.set('Failed to load product. Please try again.');
        this.isLoading.set(false);
      },
    });
  }

  selectImage(index: number): void {
    const currentProduct = this.product();
    if (currentProduct && index >= 0 && index < currentProduct.images.length) {
      this.selectedImageIndex.set(index);
    }
  }

  get currentImage(): string {
    const currentProduct = this.product();
    if (!currentProduct) return '';

    if (currentProduct.images && currentProduct.images.length > 0) {
      const index = this.selectedImageIndex();
      return currentProduct.images[index] || currentProduct.imageCover;
    }

    return currentProduct.imageCover;
  }

  get hasMultipleImages(): boolean {
    const currentProduct = this.product();
    return currentProduct ? (currentProduct.images?.length || 0) > 1 : false;
  }
}
