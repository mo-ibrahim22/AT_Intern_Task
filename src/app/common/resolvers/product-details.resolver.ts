import { inject } from '@angular/core';
import { ResolveFn, Router, ActivatedRouteSnapshot } from '@angular/router';
import { ProductService } from '../services/product.service';
import { ToasterService } from '../services/toaster.service';
import { catchError, of, map } from 'rxjs';
import { Product } from '../models/product.model';

export const productDetailsResolver: ResolveFn<Product | null> = (
  route: ActivatedRouteSnapshot
) => {
  const productService = inject(ProductService);
  const router = inject(Router);
  const toaster = inject(ToasterService);

  const productId = route.paramMap.get('id');

  // Check if product ID is provided
  if (!productId) {
    toaster.show('No product ID provided', 'error');
    router.navigate(['/products']);
    return of(null);
  }

  // Fetch product data
  return productService.getProductById(productId).pipe(
    map((response) => {
      if (!response?.data) {
        toaster.show('Product not found', 'error');
        router.navigate(['/products']);
        return null;
      }
      return response.data;
    }),
    catchError((error) => {
      console.error('Failed to load product:', error);
      toaster.show('Failed to load product. Please try again.', 'error');
      router.navigate(['/products']);
      return of(null);
    })
  );
};
