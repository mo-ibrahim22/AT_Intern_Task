import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import {
  FormGroup,
  FormBuilder,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { InputFieldComponent } from '../../components/input-field/input-field.component';
import { ButtonComponent } from '../../components/button/button.component';
import { CartResponse } from '../../common/models/cart.model';
import { OrderService } from '../../common/services/order.service';
import { CartService } from '../../common/services/cart.service';
import { ToasterService } from '../../common/services/toaster.service';
import { CreateOrderRequest } from '../../common/models/order.model';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    InputFieldComponent,
    ButtonComponent,
  ],
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.css',
})
export class CheckoutComponent implements OnInit {
  private router = inject(Router);
  private fb = inject(FormBuilder);
  private orderService = inject(OrderService);
  private cartService = inject(CartService);
  private toaster = inject(ToasterService);

  cart = signal<CartResponse | null>(null);
  checkoutForm!: FormGroup;
  isSubmitting = signal(false);
  formTouched = signal(false);
  errorMessage = signal('');
  isLoadingCart = signal(true);

  ngOnInit(): void {
    this.loadCartAndInitialize();
  }

  private loadCartAndInitialize(): void {
    this.isLoadingCart.set(true);

    this.cartService.getCart().subscribe({
      next: (cartData) => {
        console.log('Checkout component - received cart data:', cartData);

        // Check if cart has items
        if (!cartData || !cartData.data?.products?.length) {
          this.toaster.show(
            'Your cart is empty. Add items before checkout.',
            'warning'
          );
          this.router.navigate(['/products']);
          return;
        }

        this.cart.set(cartData);
        this.initializeForm();
        this.isLoadingCart.set(false);
      },
      error: (error) => {
        console.error('Failed to load cart for checkout:', error);
        this.toaster.show('Failed to load cart. Please try again.', 'error');
        this.router.navigate(['/cart']);
        this.isLoadingCart.set(false);
      },
    });
  }

  private initializeForm(): void {
    this.checkoutForm = this.fb.group({
      details: ['', [Validators.required, Validators.minLength(10)]],
      phone: ['', [Validators.required, Validators.pattern(/^\d{11}$/)]],
      city: ['', [Validators.required, Validators.minLength(2)]],
    });
  }

  onSubmit(): void {
    this.formTouched.set(true);
    this.errorMessage.set('');

    if (this.checkoutForm.valid && this.cart()) {
      this.processOrder();
    } else {
      this.checkoutForm.markAllAsTouched();
      this.toaster.show(
        'Please fill in all required fields correctly',
        'warning'
      );
    }
  }

  private processOrder(): void {
    const currentCart = this.cart();
    console.log('Processing order with cart:', currentCart);

    if (!currentCart?.cartId) {
      this.toaster.show('Cart information is missing', 'error');
      console.error('Cart ID is missing. Cart data:', currentCart);
      return;
    }

    this.isSubmitting.set(true);

    const orderRequest: CreateOrderRequest = {
      shippingAddress: this.checkoutForm.value,
    };

    console.log(
      'Creating order with cartId:',
      currentCart.cartId,
      'and request:',
      orderRequest
    );

    this.orderService.createOrder(currentCart.cartId, orderRequest).subscribe({
      next: (response) => {
        console.log('Order created successfully:', response);
        this.toaster.show('Order placed successfully!', 'success');

        this.cartService.clearCartDirect().subscribe({
          next: () => {
            console.log('Cart cleared, navigating to order confirmation');
            this.orderService.setOrder(response.data); 
            this.router.navigate(['/order-confirmation']);
          },
          error: (clearError) => {
            console.warn('Failed to clear cart, still proceeding:', clearError);
            this.orderService.setOrder(response.data); 
            this.router.navigate(['/order-confirmation']);
          },
        });
      },
      error: (error) => {
        console.error('Order creation failed:', error);
        const message =
          error?.userMessage || 'Failed to place order. Please try again.';
        this.errorMessage.set(message);
        this.toaster.show(message, 'error');
        this.isSubmitting.set(false);
      },
      complete: () => {
        this.isSubmitting.set(false);
      },
    });
  }

  getSubtotal(): number {
    return this.cart()?.data?.totalCartPrice || 0;
  }

  getShipping(): number {
    return this.getSubtotal() > 100 ? 0 : 10;
  }

  getTax(): number {
    return Math.round(this.getSubtotal() * 0.08 * 100) / 100;
  }

  getFinalTotal(): number {
    return this.getSubtotal() + this.getShipping() + this.getTax();
  }

  getItemCount(): number {
    return this.cart()?.numOfCartItems || 0;
  }

  goBackToCart(): void {
    this.router.navigate(['/cart']);
  }
}
