import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ButtonComponent } from '../../components/button/button.component';
import { Order } from '../../common/models/order.model';
import { OrderService } from '../../common/services/order.service';

@Component({
  selector: 'app-order-confirmation',
  standalone: true,
  imports: [CommonModule, ButtonComponent],
  templateUrl: './order-confirmation.component.html',
  styleUrl: './order-confirmation.component.css',
})
export class OrderConfirmationComponent implements OnInit {
  private router = inject(Router);
  private orderService = inject(OrderService);

  order = signal<Order | null>(null);

  ngOnInit(): void {
    const orderData = this.orderService.getOrder();

    if (orderData) {
      this.order.set(orderData);
      this.orderService.setOrder(null); // Clear stored order
    } else {
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

  getSubtotal(): number {
    const order = this.order();
    if (!order?.cartItems) return 0;

    return order.cartItems.reduce((total, item) => {
      return total + item.price * item.count;
    }, 0);
  }

  getOrderStatus(): string {
    const order = this.order();
    if (!order) return 'Unknown';

    if (order.isDelivered) return 'Delivered';
    if (order.isPaid) return 'Paid & Processing';
    return 'Pending Payment';
  }
}
