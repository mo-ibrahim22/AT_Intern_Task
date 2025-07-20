import { CommonModule } from '@angular/common';
import { Component, input, inject, signal } from '@angular/core';
import { ButtonComponent } from '../button/button.component';
import { Product } from '../../common/models/product.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-product-card',
  imports: [CommonModule, ButtonComponent],
  templateUrl: './product-card.component.html',
  styleUrl: './product-card.component.css',
})
export class ProductCardComponent {
  product = input.required<Product>();
  private readonly router = inject(Router);

  navigateToDetails(): void {
    this.router.navigate(['/product-details', this.product().id]);
  }
}
