import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { ProductCardComponent } from '../../components/product-card/product-card.component';
import { ProductService } from '../../common/services/product.service';
import { Product, ProductsResponse } from '../../common/models/product.model';

@Component({
  selector: 'app-product',
  imports: [CommonModule, ProductCardComponent],
  templateUrl: './product.component.html',
  styleUrl: './product.component.css',
})
export class ProductComponent implements OnInit {
  private productService = inject(ProductService);

  products = signal<Product[]>([]);

  constructor() {}

  ngOnInit(): void {
    this.getProducts();
  }

  private getProducts(): void {
    this.productService.getProducts().subscribe({
      next: (response: ProductsResponse) => {
        this.products.set(response.data);
      },
      error: (error) => {
        console.error('Error fetching products:', error);
        // Error interceptor will handle the error display
      },
    });
  }
}
