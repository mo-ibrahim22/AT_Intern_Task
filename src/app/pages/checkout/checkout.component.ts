import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
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
  private route = inject(ActivatedRoute);
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

  ngOnInit(): void {
    // Get cart data from resolver
    const cartData = this.route.snapshot.data['cart'] as CartResponse | null;

    if (cartData) {
      this.cart.set(cartData);
      this.initializeForm();
    }
    // If no cart data, resolver already handled the redirect
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
    console.log('Processing order with cart:', this.cart());
    if (!this.cart()?.cartId) {
      this.toaster.show('Cart information is missing', 'error');
      return;
    }

    this.isSubmitting.set(true);

    const orderRequest: CreateOrderRequest = {
      shippingAddress: this.checkoutForm.value,
    };

    this.orderService.createOrder(this.cart()!.cartId, orderRequest).subscribe({
      next: (response) => {
        console.log('Order created successfully:', response);
        this.toaster.show('Order placed successfully!', 'success');

        // Clear the cart after successful order
        this.cartService.clearCartDirect();

        // Navigate to order confirmation or orders page
        this.router.navigate(['/order-confirmation'], {
          state: { order: response.data },
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
