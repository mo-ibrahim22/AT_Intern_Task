import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ButtonComponent } from '../../components/button/button.component';
import { Order } from '../../common/models/order.model';

@Component({
  selector: 'app-order-confirmation',
  standalone: true,
  imports: [CommonModule, ButtonComponent],
  templateUrl: './order-confirmation.component.html',
  styleUrl: './order-confirmation.component.css',
})
export class OrderConfirmationComponent implements OnInit {
  private router = inject(Router);

  order = signal<Order | null>(null);

  ngOnInit(): void {
    // Get order data from navigation state
    const navigation = this.router.getCurrentNavigation();
    const orderData = navigation?.extras?.state?.['order'] as Order;

    if (orderData) {
      this.order.set(orderData);
    } else {
      // If no order data, redirect to home
      this.router.navigate(['/home']);
    }
  }

  continueShopping(): void {
    this.router.navigate(['/products']);
  }

  viewOrders(): void {
    this.router.navigate(['/orders']);
  }

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  }
}
